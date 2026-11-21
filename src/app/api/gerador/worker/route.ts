// Rota do robô (roda no PC ou servidor da Morph Code). Autenticada por WORKER_TOKEN.
//   GET  -> pedidos pagos aguardando geração
//   POST -> { acao: "gerando" | "entrega" | "falha" | "pago", id, ... }
// "pago" existe só para testar o fluxo antes do Mercado Pago e fica desligada se MP_ACCESS_TOKEN existir.
import { timingSafeEqual } from "node:crypto";
import { alertar } from "@/lib/alerta";
import { baterPulso, filaPagos, lerPedido, liberarVaga, registrarTempo, salvarArquivo, salvarPedido } from "@/lib/gerador-store";

function autorizado(request: Request) {
  const esperado = process.env.WORKER_TOKEN;
  if (!esperado || esperado.length < 24) return false;
  const recebido = (request.headers.get("authorization") ?? "").replace(/^Bearer /, "");
  const a = Buffer.from(recebido);
  const b = Buffer.from(esperado);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  if (!autorizado(request)) return new Response(null, { status: 401 });
  await baterPulso(); // a consulta da fila é o sinal de que o robô está vivo
  // ?pulso=1: só o sinal de vida, sem ler a fila. O robô manda de uma linha à parte enquanto está ocupado coletando.
  if (new URL(request.url).searchParams.has("pulso")) return Response.json({ ok: true });
  return Response.json({ pedidos: await filaPagos() });
}

export async function POST(request: Request) {
  if (!autorizado(request)) return new Response(null, { status: 401 });
  let c: Record<string, unknown>;
  try {
    c = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  const p = typeof c.id === "string" ? await lerPedido(c.id) : null;
  if (!p) return Response.json({ erro: "Pedido não encontrado." }, { status: 404 });

  if (c.acao === "pago" && !process.env.MP_ACCESS_TOKEN) {
    if (p.status === "aguardando_pagamento") await salvarPedido({ ...p, status: "pago" });
  } else if (c.acao === "gerando") {
    await salvarPedido({ ...p, status: "gerando" });
  } else if (c.acao === "entrega") {
    const b64 = typeof c.arquivo === "string" ? c.arquivo : "";
    if (!b64 || b64.length > 900_000) return Response.json({ erro: "Arquivo inválido." }, { status: 400 });
    await salvarArquivo(p.id, b64);
    await salvarPedido({ ...p, status: "pronto", leads: Number(c.leads) || undefined, erro: undefined });
    await registrarTempo(Number(c.segundos)); // alimenta a previsão de espera mostrada ao cliente
  } else if (c.acao === "liberar" && p.status === "aguardando_pagamento") {
    await liberarVaga(p.id); // solta a reserva de um pedido que não vai pagar (ex.: teste)
  } else if (c.acao === "falha") {
    await salvarPedido({ ...p, status: "falhou", erro: String(c.erro ?? "Falha ao gerar").slice(0, 200) });
    await alertar(`Morph Leads: pedido FALHOU (${p.nicho} em ${p.regiao}). Cliente já pagou: resolva ou reembolse no Mercado Pago.`);
  } else {
    return Response.json({ erro: "Ação desconhecida." }, { status: 400 });
  }
  return Response.json({ ok: true });
}
