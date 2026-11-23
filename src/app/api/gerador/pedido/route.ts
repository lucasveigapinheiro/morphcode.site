import { randomUUID } from "node:crypto";
import { MSG_FORA_DO_AR, msgFilaCheia, validarEntrada, type Pedido } from "@/lib/gerador";
import { contar, limiteFila, ocupacao, roboOnline, salvarPedido, storeConfigurado, tempoMedioMin } from "@/lib/gerador-store";

const ORIGENS = ["morphcode.com.br", "localhost"];

function cookie(cabecalho: string, nome: string): string | undefined {
  const par = cabecalho.split(/;\s*/).find((c) => c.startsWith(`${nome}=`));
  const valor = par ? decodeURIComponent(par.slice(nome.length + 1)) : "";
  return valor ? valor.slice(0, 200) : undefined;
}

/** Guarda os cookies do pixel, IP e navegador: o webhook do pagamento não tem o navegador do cliente. */
function sinaisMeta(request: Request, ip: string): Pedido["meta"] {
  const cookies = request.headers.get("cookie") ?? "";
  return {
    fbp: cookie(cookies, "_fbp"),
    fbc: cookie(cookies, "_fbc"),
    ip: ip === "?" ? undefined : ip,
    ua: request.headers.get("user-agent")?.slice(0, 300) ?? undefined,
    url: request.headers.get("referer")?.slice(0, 500) ?? undefined,
  };
}

export async function POST(request: Request) {
  const origem = request.headers.get("origin") ?? "";
  if (!ORIGENS.some((o) => origem.includes(o))) return Response.json({ erro: "Origem não permitida." }, { status: 403 });
  if (!storeConfigurado) return Response.json({ erro: "Serviço indisponível no momento." }, { status: 503 });
  if (!(await roboOnline())) return Response.json({ erro: MSG_FORA_DO_AR }, { status: 503 });
  // Aviso antecipado, antes de a pessoa preencher tudo: a vaga mesmo só é reservada ao abrir o pagamento.
  if ((await ocupacao()).total >= limiteFila()) return Response.json({ erro: msgFilaCheia(await tempoMedioMin()) }, { status: 503 });

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

  const pedido: Pedido = {
    id: randomUUID(),
    ...v.dados,
    status: "aguardando_pagamento",
    criadoEm: new Date().toISOString(),
    meta: sinaisMeta(request, ip),
  };
  await salvarPedido(pedido);
  return Response.json({ id: pedido.id, status: pedido.status, pagamentoAtivo: Boolean(process.env.MP_ACCESS_TOKEN) });
}
