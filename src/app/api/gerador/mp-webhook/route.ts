// Notificações do Mercado Pago. Nunca confia no corpo: busca o pagamento na API do MP e só então libera o pedido.
import { PRECO_REAIS } from "@/lib/gerador";
import { lerPedido, salvarPedido } from "@/lib/gerador-store";
import { assinaturaValida, buscarPagamento, mpConfigurado } from "@/lib/mercadopago";

async function tratar(request: Request) {
  if (!mpConfigurado()) return new Response(null, { status: 503 });
  const url = new URL(request.url);
  const corpo = (await request.json().catch(() => ({}))) as { type?: string; data?: { id?: string | number } };

  const tipo = url.searchParams.get("type") ?? url.searchParams.get("topic") ?? corpo.type;
  const id = String(url.searchParams.get("data.id") ?? url.searchParams.get("id") ?? corpo.data?.id ?? "");
  if (tipo !== "payment" || !/^\d+$/.test(id)) return new Response(null, { status: 200 }); // outros eventos: ignora
  if (!assinaturaValida(request, id)) return new Response(null, { status: 401 });

  let pag;
  try {
    pag = await buscarPagamento(id);
  } catch (e) {
    if ((e as { status?: number }).status === 404) return new Response(null, { status: 200 }); // pagamento desconhecido (ex.: simulação)
    console.error("[gerador] webhook: falha ao buscar pagamento", id, e);
    return new Response(null, { status: 502 }); // o MP tenta de novo
  }

  const pedido = pag.external_reference ? await lerPedido(pag.external_reference) : null;
  if (!pedido) return new Response(null, { status: 200 });

  const valorOk = pag.currency_id === "BRL" && Math.abs(pag.transaction_amount - PRECO_REAIS) < 0.005;
  if (pag.status === "approved" && valorOk && pedido.status === "aguardando_pagamento") {
    await salvarPedido({ ...pedido, status: "pago" });
  } else if (pag.status === "approved" && !valorOk) {
    console.error("[gerador] pagamento aprovado com valor divergente", id, pag.transaction_amount);
  }
  return new Response(null, { status: 200 });
}

export const POST = tratar;
export const GET = tratar;
