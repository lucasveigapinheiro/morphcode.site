"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";
import { trackMetaContact, trackMetaViewContent } from "@/components/MetaPixel";
import { enviarContatoAoServidor, guardarOrigemDoAnuncio, origemDoAnuncio } from "@/lib/atribuicao";

/**
 * Conta cada clique em um link de WhatsApp como conversão, com a origem do clique: o
 * `data-origem` mais próximo ou, na falta dele, o id da seção onde o botão está.
 */
export default function ConversionTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // A demonstração fica em outro endereço: o clique é o único sinal de que a pessoa a abriu.
      const demo = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href*="morph-clinica-demo"]');
      if (demo) {
        const origem = demo.closest<HTMLElement>("[data-origem]")?.dataset.origem || demo.closest("section")?.id || "cabecalho";
        track("demo_click", { origem, pagina: window.location.pathname });
        trackMetaViewContent({ content_name: "demonstracao", origem, pagina: window.location.pathname });
        return;
      }
      const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="/whatsapp"], a[href*="api.whatsapp.com"]');
      if (!link) return;
      const origem =
        link.closest<HTMLElement>("[data-origem]")?.dataset.origem ||
        link.closest("section")?.id ||
        (link.closest("header") ? "cabecalho" : "outro");
      const ref = origemDoAnuncio();
      const params: Record<string, string> = { origem, pagina: window.location.pathname, ...(ref ? { utm_content: ref } : {}) };
      const eventId = crypto.randomUUID();
      track("whatsapp_click", params);
      trackMetaContact(params, eventId);
      enviarContatoAoServidor(eventId, params);
    };
    guardarOrigemDoAnuncio();
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
