import { lerArquivo, lerPedido } from "@/lib/gerador-store";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const p = await lerPedido(id);
  if (!p || p.status !== "pronto") return new Response("Planilha ainda não está pronta.", { status: 404 });
  const b64 = await lerArquivo(id);
  if (!b64) return new Response("Arquivo expirado. Fale com a Morph Code para gerar de novo.", { status: 410 });
  const nome = `Leads ${p.nicho} - ${p.regiao}`.replace(/[^\p{L}\p{N} _-]/gu, "").slice(0, 80) + ".xlsx";
  return new Response(Buffer.from(b64, "base64"), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="leads.xlsx"; filename*=UTF-8''${encodeURIComponent(nome)}`,
      "Cache-Control": "private, no-store",
    },
  });
}
