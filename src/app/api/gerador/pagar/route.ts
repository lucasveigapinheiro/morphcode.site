import { criarCheckout, mpConfigurado, urlBase } from "@/lib/mercadopago";
import { liberarVaga, lerPedido, reservarVaga, roboOnline, tempoMedioMin } from "@/lib/gerador-store";
import { MSG_FORA_DO_AR, msgFilaCheia } from "@/lib/gerador";

const ORIGENS = ["morphcode.com.br", "localhost"];

// Gera o link de pagamento do Mercado Pago para um pedido que ainda aguarda pagamento.
export async function POST(request: Request) {
  const origem = request.headers.get("origin") ?? "";
  if (!ORIGENS.some((o) => origem.includes(o))) return Response.json({ erro: "Origem não permitida." }, { status: 403 });
  if (!mpConfigurado()) return Response.json({ erro: "Pagamento indisponível no momento." }, { status: 503 });
  if (!(await roboOnline())) return Response.json({ erro: MSG_FORA_DO_AR }, { status: 503 });

  const corpo = (await request.json().catch(() => ({}))) as { id?: unknown };
  const pedido = typeof corpo.id === "string" ? await lerPedido(corpo.id) : null;
  if (!pedido) return Response.json({ erro: "Pedido não encontrado." }, { status: 404 });
  if (pedido.status !== "aguardando_pagamento") return Response.json({ erro: "Este pedido já foi pago." }, { status: 409 });

  // Só abre o pagamento se houver vaga: pagou, dá para gerar. A vaga fica reservada enquanto o link vale.
  if (!(await reservarVaga(pedido.id))) return Response.json({ erro: msgFilaCheia(await tempoMedioMin()) }, { status: 503 });

  try {
    return Response.json({ url: await criarCheckout(pedido, urlBase(request)) });
  } catch (e) {
    await liberarVaga(pedido.id);
    console.error("[gerador] falha ao criar checkout", e);
    return Response.json({ erro: "Não foi possível abrir o pagamento. Tente de novo." }, { status: 502 });
  }
}
