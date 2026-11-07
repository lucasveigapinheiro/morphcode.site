const CHAVE = "morph_ref";

/** Deixa só letras minúsculas, números e hífen: o valor vai parar na mensagem do WhatsApp. */
function limpar(valor: string) {
  return valor.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40);
}

/** Guarda o criativo do anúncio (`utm_content`) assim que a pessoa chega, para usar quando ela chamar no WhatsApp. */
export function guardarOrigemDoAnuncio() {
  try {
    const valor = new URLSearchParams(window.location.search).get("utm_content");
    if (valor) sessionStorage.setItem(CHAVE, limpar(valor));
  } catch {
    // Navegador sem sessionStorage: a medição só perde o rótulo do criativo.
  }
}

export function origemDoAnuncio(): string | null {
  try {
    return sessionStorage.getItem(CHAVE) || null;
  } catch {
    return null;
  }
}

/** Acrescenta "(ref: criativo)" ao fim da mensagem pronta, para saber de qual anúncio veio cada conversa. */
export function comOrigem(href: string): string {
  const ref = origemDoAnuncio();
  if (!ref) return href;
  return href.replace(/text=[^&]*/, (trecho) => trecho + encodeURIComponent(` (ref: ${ref})`));
}

function cookie(nome: string): string | undefined {
  const par = document.cookie.split("; ").find((c) => c.startsWith(`${nome}=`));
  return par ? decodeURIComponent(par.slice(nome.length + 1)) : undefined;
}

/**
 * Manda o mesmo Contact ao servidor (API de Conversões), com o mesmo `event_id` do pixel: o Meta
 * junta os dois em um só e ainda recebe quando o navegador bloqueia o pixel.
 */
export function enviarContatoAoServidor(eventId: string, params: Record<string, string>) {
  try {
    void fetch("/api/meta-capi", {
      method: "POST",
      keepalive: true,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event_name: "Contact",
        event_id: eventId,
        event_source_url: window.location.href,
        fbp: cookie("_fbp"),
        fbc: cookie("_fbc"),
        custom_data: params,
      }),
    }).catch(() => {});
  } catch {
    // A medição nunca pode atrapalhar o clique.
  }
}
