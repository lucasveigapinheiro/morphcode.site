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

export async function salvarPedido(p: Pedido) {
  await set(`gerador:pedido:${p.id}`, JSON.stringify(p), TTL_PEDIDO);
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
