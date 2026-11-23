// Compra pela API de Conversões do Meta, enviada pelo servidor quando o Mercado Pago confirma o pagamento.
// Usa o mesmo event_id do Purchase do navegador ("compra-<id do pedido>"): o Meta junta os dois em um só.
// Só liga quando NEXT_PUBLIC_META_PIXEL_ID e META_CAPI_TOKEN existem; META_CAPI_TEST_CODE manda para "Testar eventos".
import { createHash } from "node:crypto";
import { PRECO_REAIS, TOTAL_LEADS, type Pedido } from "./gerador";
import { PRODUCTION_URL } from "./site";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TOKEN = process.env.META_CAPI_TOKEN;
const TEST_CODE = process.env.META_CAPI_TEST_CODE;

/** O Meta pede e-mail, telefone e nome normalizados e em SHA-256. */
const hash = (valor: string) => createHash("sha256").update(valor.trim().toLowerCase()).digest("hex");

export const idCompraMeta = (pedidoId: string) => `compra-${pedidoId}`;

export async function enviarCompraMeta(pedido: Pedido): Promise<void> {
  if (!PIXEL_ID || !TOKEN) return;
  const primeiroNome = pedido.nome.split(/\s+/)[0] ?? "";
  const evento = {
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_id: idCompraMeta(pedido.id),
    action_source: "website",
    event_source_url: pedido.meta?.url ?? `${PRODUCTION_URL}/gerador`,
    user_data: {
      em: [hash(pedido.email)],
      ph: [hash(pedido.whatsapp.replace(/\D/g, ""))],
      ...(primeiroNome ? { fn: [hash(primeiroNome)] } : {}),
      country: [hash("br")],
      client_ip_address: pedido.meta?.ip,
      client_user_agent: pedido.meta?.ua,
      fbp: pedido.meta?.fbp,
      fbc: pedido.meta?.fbc,
    },
    custom_data: {
      value: PRECO_REAIS,
      currency: "BRL",
      content_name: `Planilha com ${TOTAL_LEADS} leads`,
      content_ids: ["morph-leads"],
      content_type: "product",
      num_items: 1,
    },
  };
  try {
    const r = await fetch(`https://graph.facebook.com/v22.0/${PIXEL_ID}/events`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ data: [evento], access_token: TOKEN, ...(TEST_CODE ? { test_event_code: TEST_CODE } : {}) }),
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) console.error("[gerador] CAPI Purchase recusado", r.status, await r.text().catch(() => ""));
  } catch (e) {
    // A medição nunca pode atrapalhar a liberação do pedido.
    console.error("[gerador] CAPI Purchase falhou", e);
  }
}
