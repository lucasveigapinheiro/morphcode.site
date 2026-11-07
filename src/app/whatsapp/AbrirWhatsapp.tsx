"use client";

import { useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { comOrigem } from "@/lib/atribuicao";

/**
 * Abre a conversa logo depois que a página carrega, dando tempo para as tags de conversão.
 * Se a pessoa veio de um anúncio, a mensagem leva o criativo no fim: "(ref: criativo)".
 */
export default function AbrirWhatsapp({ href }: { href: string }) {
  useEffect(() => {
    const destino = comOrigem(href);
    document.getElementById("abrir-conversa")?.setAttribute("href", destino);
    const t = setTimeout(() => window.location.replace(destino), 700);
    return () => clearTimeout(t);
  }, [href]);

  return (
    <main id="conteudo" className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <FaWhatsapp className="h-12 w-12 text-[#25d366]" aria-hidden />
      <h1 className="font-[var(--font-display)] text-2xl">Abrindo o WhatsApp…</h1>
      <p className="max-w-sm text-sm text-muted">Sua mensagem já vai pronta. Se a conversa não abrir sozinha, toque no botão.</p>
      <a id="abrir-conversa" href={href} className="rounded-lg bg-gold px-6 py-3 text-sm font-medium text-background">
        Abrir conversa
      </a>
    </main>
  );
}
