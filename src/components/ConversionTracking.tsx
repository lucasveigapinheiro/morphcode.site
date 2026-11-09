"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";
import { trackMetaContact, trackMetaViewContent } from "@/components/MetaPixel";
import { comOrigem, enviarContatoAoServidor, guardarOrigemDoAnuncio, origemDoAnuncio } from "@/lib/atribuicao";

/** Celular ou tablet: tela de toque, sem mouse. */
function ehCelular() {
  return window.matchMedia("(pointer: coarse)").matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

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
      const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="/whatsapp"], a[href*="api.whatsapp.com"], a[href*="wa.me/"]');
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

      // Leva o criativo do anúncio no fim da mensagem: "(ref: criativo)".
      const destino = comOrigem(link.href);
      // No celular, abre o WhatsApp na mesma aba: nova aba dentro do navegador do Instagram e do
      // Facebook costuma parar numa tela intermediária em vez de abrir o aplicativo.
      if (ehCelular()) {
        e.preventDefault();
        // Sem atraso: o iPhone só passa o link para o app se a troca vier direto do toque.
        window.location.assign(destino);
      } else if (destino !== link.href) {
        link.href = destino;
      }
    };
    guardarOrigemDoAnuncio();
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
