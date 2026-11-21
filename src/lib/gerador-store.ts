// Armazenamento dos pedidos do gerador. Usa o Redis da Upstash por REST (plano grátis serve).
// Variáveis: KV_REST_API_URL e KV_REST_API_TOKEN (criadas pela integração da Upstash na Vercel) ou UPSTASH_REDIS_REST_*.
// Sem elas, em desenvolvimento, cai numa memória local; em produção, devolve erro claro.
import type { Pedido } from "./gerador";

const URL_REST = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const memoria = new Map<string, string>();
const filaMemoria = new Set<string>();

export const storeConfigurado = Boolean(URL_REST && TOKEN) || process.env.NODE_ENV !== "production" || process.env.GERADOR_MEMORIA === "1";

async function cmd(...args: (string | number)[]): Promise<unknown> {
  if (!URL_REST || !TOKEN) throw new Error("Armazenamento não configurado");
  const r = await fetch(URL_REST, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`Redis ${r.status}`);
  return ((await r.json()) as { result: unknown }).result;
}

const TTL_PEDIDO = 60 * 60 * 24 * 30;
const TTL_ARQUIVO = 60 * 60 * 24 * 7;

async function set(chave: string, valor: string, ttl: number) {
  if (!URL_REST) return void memoria.set(chave, valor);
  await cmd("SET", chave, valor, "EX", ttl);
}
async function get(chave: string): Promise<string | null> {
  if (!URL_REST) return memoria.get(chave) ?? null;
  return (await cmd("GET", chave)) as string | null;
}

// Vagas: conjunto ordenado "gerador:ocupacao". Cada pedido ocupa uma vaga.
//  - quem abriu o pagamento reserva a vaga até a hora em que o link expira (nota = hora de expiração);
//  - pedido pago ou em geração ocupa a vaga sem prazo (nota PERMANENTE) até ficar pronto ou falhar.
// O pagamento só abre se couber no limite, então tudo que for pago cabe na fila.
const CHAVE_OCUP = "gerador:ocupacao";
const PERMANENTE = 9_000_000_000_000_000;
const RESERVA_MS = 35 * 60 * 1000; // um pouco mais que os 30 min de validade do link
const memOcup = new Map<string, number>();

export const limiteFila = () => Math.max(1, Number(process.env.GERADOR_LIMITE_FILA) || 6);

const LUA_RESERVAR = `
redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', ARGV[1])
local atual = redis.call('ZSCORE', KEYS[1], ARGV[3])
if atual then
  if tonumber(atual) < tonumber(ARGV[2]) then redis.call('ZADD', KEYS[1], ARGV[2], ARGV[3]) end
  return 1
end
if redis.call('ZCARD', KEYS[1]) >= tonumber(ARGV[4]) then return 0 end
redis.call('ZADD', KEYS[1], ARGV[2], ARGV[3])
return 1`;

/** Reserva uma vaga para o pedido. Falso se a fila está cheia. */
export async function reservarVaga(id: string): Promise<boolean> {
  const agora = Date.now();
  const ate = agora + RESERVA_MS;
  const limite = limiteFila();
  if (URL_REST) return (await cmd("EVAL", LUA_RESERVAR, 1, CHAVE_OCUP, agora, ate, id, limite)) === 1;
  for (const [k, v] of memOcup) if (v <= agora) memOcup.delete(k);
  const atual = memOcup.get(id);
  if (atual === undefined && memOcup.size >= limite) return false;
  if (atual === undefined || atual < ate) memOcup.set(id, ate);
  return true;
}

export async function liberarVaga(id: string) {
  if (URL_REST) await cmd("ZREM", CHAVE_OCUP, id);
  else memOcup.delete(id);
}

async function ocuparVaga(id: string) {
  if (URL_REST) await cmd("ZADD", CHAVE_OCUP, PERMANENTE, id);
  else memOcup.set(id, PERMANENTE);
}

/** total = vagas usadas (reservas + pagos); fila = só pedidos pagos esperando ou sendo gerados. */
export async function ocupacao(): Promise<{ total: number; fila: number }> {
  const agora = Date.now();
  if (!URL_REST) {
    const v = [...memOcup.values()];
    return { total: v.filter((n) => n > agora).length, fila: v.filter((n) => n >= PERMANENTE).length };
  }
  const [total, fila] = (await Promise.all([
    cmd("ZCOUNT", CHAVE_OCUP, agora, "+inf"),
    cmd("ZCOUNT", CHAVE_OCUP, 1_000_000_000_000_000, "+inf"),
  ])) as number[];
  return { total, fila };
}

// Tempo médio por pedido, em minutos, aprendido com os pedidos que o robô entrega (média móvel).
// Antes do primeiro pedido vale 5 min: hipótese, ainda não medida.
const CHAVE_TEMPO = "gerador:tempo";
export async function tempoMedioMin(): Promise<number> {
  const n = Number(await get(CHAVE_TEMPO));
  return n > 0 ? n : 5;
}
export async function registrarTempo(segundos: number) {
  if (!(segundos > 0)) return;
  const min = Math.min(30, Math.max(0.5, segundos / 60));
  const antes = Number(await get(CHAVE_TEMPO));
  await set(CHAVE_TEMPO, (antes > 0 ? antes * 0.7 + min * 0.3 : min).toFixed(2), 60 * 60 * 24 * 90);
}

export async function salvarPedido(p: Pedido) {
  await set(`gerador:pedido:${p.id}`, JSON.stringify(p), TTL_PEDIDO);
  if (p.status === "pago" || p.status === "gerando") await ocuparVaga(p.id);
  else if (p.status === "pronto" || p.status === "falhou") await liberarVaga(p.id);
  if (p.status === "pago") {
    if (!URL_REST) filaMemoria.add(p.id);
    else await cmd("SADD", "gerador:fila", p.id);
  } else if (!URL_REST) filaMemoria.delete(p.id);
  else await cmd("SREM", "gerador:fila", p.id);
}

export async function lerPedido(id: string): Promise<Pedido | null> {
  if (!/^[a-f0-9-]{36}$/.test(id)) return null;
  const v = await get(`gerador:pedido:${id}`);
  return v ? (JSON.parse(v) as Pedido) : null;
}

export async function filaPagos(): Promise<Pedido[]> {
  const ids = URL_REST ? ((await cmd("SMEMBERS", "gerador:fila")) as string[]) : [...filaMemoria];
  const out: Pedido[] = [];
  for (const id of ids) {
    const p = await lerPedido(id);
    if (p && p.status === "pago") out.push(p);
  }
  return out;
}

export async function salvarArquivo(id: string, base64: string) {
  await set(`gerador:arquivo:${id}`, base64, TTL_ARQUIVO);
}
export async function lerArquivo(id: string): Promise<string | null> {
  return get(`gerador:arquivo:${id}`);
}

// Pulso do robô: cada consulta dele à fila grava a hora aqui. Sem pulso recente, o site não vende.
const CHAVE_PULSO = "gerador:pulso";
const PULSO_VALIDO_MS = 2 * 60 * 1000;

export async function baterPulso() {
  await set(CHAVE_PULSO, String(Date.now()), 600);
}

/** O robô consultou a fila nos últimos 2 minutos? Em desenvolvimento (ou com GERADOR_SEM_PULSO=1) sempre vale. */
export async function roboOnline(): Promise<boolean> {
  if (process.env.NODE_ENV !== "production" || process.env.GERADOR_SEM_PULSO === "1") return true;
  const v = await get(CHAVE_PULSO);
  return v !== null && Date.now() - Number(v) < PULSO_VALIDO_MS;
}

/** Contador por chave com expiração, para limitar pedidos por IP. */
export async function contar(chave: string, janelaSegundos: number): Promise<number> {
  if (!URL_REST) {
    const n = Number(memoria.get(chave) ?? 0) + 1;
    memoria.set(chave, String(n));
    return n;
  }
  const n = (await cmd("INCR", chave)) as number;
  if (n === 1) await cmd("EXPIRE", chave, janelaSegundos);
  return n;
}
