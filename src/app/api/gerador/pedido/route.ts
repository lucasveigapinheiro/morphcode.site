import { randomUUID } from "node:crypto";
import { validarEntrada, type Pedido } from "@/lib/gerador";
import { contar, salvarPedido, storeConfigurado } from "@/lib/gerador-store";

const ORIGENS = ["morphcode.com.br", "localhost"];

export async function POST(request: Request) {
  const origem = request.headers.get("origin") ?? "";
  if (!ORIGENS.some((o) => origem.includes(o))) return Response.json({ erro: "Origem não permitida." }, { status: 403 });
  if (!storeConfigurado) return Response.json({ erro: "Serviço indisponível no momento." }, { status: 503 });

  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return Response.json({ erro: "Pedido inválido." }, { status: 400 });
  }
  const v = validarEntrada(corpo);
  if (!v.ok) return Response.json({ erro: v.erro }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "?";
  if ((await contar(`gerador:limite:${ip}`, 3600)) > 8) {
    return Response.json({ erro: "Muitos pedidos seguidos. Tente de novo em uma hora." }, { status: 429 });
  }

  const pedido: Pedido = { id: randomUUID(), ...v.dados, status: "aguardando_pagamento", criadoEm: new Date().toISOString() };
  await salvarPedido(pedido);
  return Response.json({ id: pedido.id, status: pedido.status, pagamentoAtivo: Boolean(process.env.MP_ACCESS_TOKEN) });
}
