"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

/**
 * Conta cada clique em um link de WhatsApp como conversão, com a origem do clique: o
 * `data-origem` mais próximo ou, na falta dele, o id da seção onde o botão está.
 */
export default function ConversionTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href*="api.whatsapp.com"]');
      if (!link) return;
      const origem =
        link.closest<HTMLElement>("[data-origem]")?.dataset.origem ||
        link.closest("section")?.id ||
        (link.closest("header") ? "cabecalho" : "outro");
      track("whatsapp_click", { origem, pagina: window.location.pathname });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
