import { roboOnline } from "@/lib/gerador-store";

// A tela consulta aqui para avisar quando o robô está fora do ar, antes de o cliente pagar.
export async function GET() {
  return Response.json({ online: await roboOnline() }, { headers: { "Cache-Control": "no-store" } });
}
