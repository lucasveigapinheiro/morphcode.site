// Integração com o Mercado Pago (Checkout Pro) por REST, sem SDK.
// Variáveis: MP_ACCESS_TOKEN (obrigatória) e MP_WEBHOOK_SECRET (opcional; valida a assinatura das notificações).
import { createHmac, timingSafeEqual } from "node:crypto";
import { PRECO_REAIS, TOTAL_LEADS, type Pedido } from "./gerador";
import { PRODUCTION_URL } from "./site";

const API = "https://api.mercadopago.com";

export const mpConfigurado = () => Boolean(process.env.MP_ACCESS_TOKEN);

async function mp<T>(caminho: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`${API}${caminho}`, {
    ...init,
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`, "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`Mercado Pago ${r.status}`);
  return (await r.json()) as T;
}

/** Cria a preferência de pagamento e devolve o link do checkout. O id do pedido vai em external_reference. */
export async function criarCheckout(pedido: Pedido, baseUrl: string): Promise<string> {
  const local = /localhost|127\.0\.0\.1/.test(baseUrl);
  const volta = `${baseUrl}/gerador`;
  const pref = await mp<{ init_point: string; sandbox_init_point: string }>("/checkout/preferences", {
    method: "POST",
    headers: { "X-Idempotency-Key": `pref-${pedido.id}` },
    body: JSON.stringify({
      items: [
        {
          id: "morph-leads",
          title: `Planilha com ${TOTAL_LEADS} leads: ${pedido.nicho}`.slice(0, 120),
          description: `${pedido.nicho} em ${pedido.regiao}`.slice(0, 250),
          quantity: 1,
          currency_id: "BRL",
          unit_price: PRECO_REAIS,
        },
      ],
      payer: { name: pedido.nome, email: pedido.email },
      external_reference: pedido.id,
      statement_descriptor: "MORPHCODE",
      back_urls: { success: volta, pending: volta, failure: volta },
      // Mercado Pago exige URLs públicas em https para voltar sozinho e para notificar.
      ...(local ? {} : { auto_return: "approved", notification_url: `${baseUrl}/api/gerador/mp-webhook` }),
    }),
  });
  const usarSandbox = process.env.MP_ACCESS_TOKEN?.startsWith("TEST-");
  return usarSandbox ? pref.sandbox_init_point : pref.init_point;
}

export type PagamentoMP = { id: number; status: string; external_reference: string | null; transaction_amount: number; currency_id: string };

export const buscarPagamento = (id: string) => mp<PagamentoMP>(`/v1/payments/${encodeURIComponent(id)}`);

/** Valida o cabeçalho x-signature. Sem MP_WEBHOOK_SECRET aceita, pois o pagamento é conferido na API do MP de qualquer forma. */
export function assinaturaValida(request: Request, dataId: string): boolean {
  const segredo = process.env.MP_WEBHOOK_SECRET;
  if (!segredo) return true;
  const partes = Object.fromEntries(
    (request.headers.get("x-signature") ?? "").split(",").map((p) => p.trim().split("=") as [string, string]),
  );
  if (!partes.ts || !partes.v1) return false;
  const id = /^[a-z0-9]+$/i.test(dataId) ? dataId.toLowerCase() : dataId;
  const manifesto = `id:${id};request-id:${request.headers.get("x-request-id") ?? ""};ts:${partes.ts};`;
  const esperado = Buffer.from(createHmac("sha256", segredo).update(manifesto).digest("hex"));
  const recebido = Buffer.from(partes.v1);
  return esperado.length === recebido.length && timingSafeEqual(esperado, recebido);
}

/** Endereço público do site: o de produção, ou a origem da requisição em desenvolvimento. */
export function urlBase(request: Request): string {
  if (process.env.NODE_ENV === "production") return PRODUCTION_URL;
  return request.headers.get("origin") ?? "http://localhost:3000";
}
