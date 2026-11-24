import { lerPedido } from "@/lib/gerador-store";
import { mpConfigurado } from "@/lib/mercadopago";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const p = await lerPedido(id);
  if (!p) return Response.json({ erro: "Pedido não encontrado." }, { status: 404 });
  // Só o necessário para a tela: nada de contato de volta.
  return Response.json({
    id: p.id,
    status: p.status,
    nicho: p.nicho,
    regiao: p.regiao,
    leads: p.leads,
    erro: p.erro,
    comMensagem: Boolean(p.mensagem),
    pagamentoAtivo: mpConfigurado(),
  });
}
