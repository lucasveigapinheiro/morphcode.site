// API de Conversões do Meta: repete no servidor o Contact que o pixel manda no navegador.
// Só liga quando META_CAPI_TOKEN existe; sem ele a rota responde 204 e não faz nada.
// META_CAPI_TEST_CODE (opcional) manda os eventos para a aba "Testar eventos" do Events Manager.

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TOKEN = process.env.META_CAPI_TOKEN;
const TEST_CODE = process.env.META_CAPI_TEST_CODE;
const ORIGENS = ["morphcode.com.br", "localhost"];

function texto(valor: unknown, max = 200) {
  return typeof valor === "string" && valor ? valor.slice(0, max) : undefined;
}

export async function POST(request: Request) {
  if (!PIXEL_ID || !TOKEN) return new Response(null, { status: 204 });

  const origem = request.headers.get("origin") ?? "";
  if (!ORIGENS.some((o) => origem.includes(o))) return new Response(null, { status: 403 });

  let corpo: Record<string, unknown>;
  try {
    corpo = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  // Só o evento de contato é aceito; o resto da URL vem sempre do servidor.
  const eventId = texto(corpo.event_id, 64);
  if (corpo.event_name !== "Contact" || !eventId) return new Response(null, { status: 400 });

  const custom: Record<string, string> = {};
  const bruto = corpo.custom_data;
  if (bruto && typeof bruto === "object") {
    for (const [k, v] of Object.entries(bruto as Record<string, unknown>).slice(0, 10)) {
      const t = texto(v, 100);
      if (t) custom[k.slice(0, 40)] = t;
    }
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const evento = {
    event_name: "Contact",
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    action_source: "website",
    event_source_url: texto(corpo.event_source_url, 500),
    user_data: {
      client_ip_address: ip,
      client_user_agent: request.headers.get("user-agent") ?? undefined,
      fbp: texto(corpo.fbp, 100),
      fbc: texto(corpo.fbc, 200),
    },
    custom_data: custom,
  };

  const resposta = await fetch(`https://graph.facebook.com/v22.0/${PIXEL_ID}/events`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ data: [evento], access_token: TOKEN, ...(TEST_CODE ? { test_event_code: TEST_CODE } : {}) }),
  }).catch(() => null);

  return new Response(null, { status: resposta?.ok ? 204 : 502 });
}
