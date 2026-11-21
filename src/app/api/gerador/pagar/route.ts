import { criarCheckout, mpConfigurado, urlBase } from "@/lib/mercadopago";
import { lerPedido } from "@/lib/gerador-store";

const ORIGENS = ["morphcode.com.br", "localhost"];

// Gera o link de pagamento do Mercado Pago para um pedido que ainda aguarda pagamento.
export async function POST(request: Request) {
  const origem = request.headers.get("origin") ?? "";
  if (!ORIGENS.some((o) => origem.includes(o))) return Response.json({ erro: "Origem não permitida." }, { status: 403 });
  if (!mpConfigurado()) return Response.json({ erro: "Pagamento indisponível no momento." }, { status: 503 });

  const corpo = (await request.json().catch(() => ({}))) as { id?: unknown };
  const pedido = typeof corpo.id === "string" ? await lerPedido(corpo.id) : null;
  if (!pedido) return Response.json({ erro: "Pedido não encontrado." }, { status: 404 });
  if (pedido.status !== "aguardando_pagamento") return Response.json({ erro: "Este pedido já foi pago." }, { status: 409 });

  try {
    return Response.json({ url: await criarCheckout(pedido, urlBase(request)) });
  } catch (e) {
    console.error("[gerador] falha ao criar checkout", e);
    return Response.json({ erro: "Não foi possível abrir o pagamento. Tente de novo." }, { status: 502 });
  }
}
