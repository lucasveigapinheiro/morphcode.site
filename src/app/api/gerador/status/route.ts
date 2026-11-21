import { limiteFila, ocupacao, roboOnline, tempoMedioMin } from "@/lib/gerador-store";

// A tela consulta aqui antes do pagamento: robô no ar, vaga livre, tamanho da fila e minutos por pedido.
export async function GET() {
  const [online, oc, minPorPedido] = await Promise.all([roboOnline(), ocupacao(), tempoMedioMin()]);
  return Response.json(
    { online, aceita: online && oc.total < limiteFila(), fila: oc.fila, minPorPedido },
    { headers: { "Cache-Control": "no-store" } },
  );
}
