"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";
import { trackMetaContact, trackMetaViewContent } from "@/components/MetaPixel";
import { comOrigem, enviarContatoAoServidor, guardarOrigemDoAnuncio, origemDoAnuncio } from "@/lib/atribuicao";

/** Celular ou tablet: tela de toque, sem mouse. */
function ehCelular() {
  return window.matchMedia("(pointer: coarse)").matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

const CHAVE_CONTATO = "morph_contact_fired";

function contatoJaEnviado() {
  try {
    return sessionStorage.getItem(CHAVE_CONTATO) === "1";
  } catch {
    return false;
  }
}

function marcarContatoEnviado() {
  try {
    sessionStorage.setItem(CHAVE_CONTATO, "1");
  } catch {
    // Navegador sem sessionStorage (aba anônima restrita): segue sem deduplicar.
  }
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
      track("whatsapp_click", params);

      // Contact só uma vez por sessão: quem toca 3 vezes no botão continua sendo 1 contato para o Meta.
      if (!contatoJaEnviado()) {
        const eventId = crypto.randomUUID();
        trackMetaContact(params, eventId);
        enviarContatoAoServidor(eventId, params);
        marcarContatoEnviado();
      }

      // Leva o criativo do anúncio no fim da mensagem: "(ref: criativo)". Só uma vez por link,
      // senão cada novo clique repete o "(ref: ...)".
      if (!link.dataset.refAplicado) {
        link.href = comOrigem(link.href);
        link.dataset.refAplicado = "1";
      }
      // No celular, abre o WhatsApp na mesma aba: nova aba dentro do navegador do Instagram e do
      // Facebook costuma parar numa tela intermediária em vez de abrir o aplicativo. O próprio <a>
      // segue o link como gesto direto do toque, sem preventDefault, para o deep link não quebrar.
      if (ehCelular()) link.removeAttribute("target");
    };
    guardarOrigemDoAnuncio();
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
