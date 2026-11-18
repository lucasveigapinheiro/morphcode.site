import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import Gerador from "@/components/gerador/Gerador";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Gerador de planilha de leads | Morph Code",
  description: "Escolha o nicho e a região e receba uma planilha com 50 negócios sem site, com WhatsApp, nota e funil de vendas.",
  alternates: { canonical: "/gerador" },
};

const ajuda = "Olá! Vim pelo Gerador de leads e tenho uma dúvida.";

// Página à parte, como a do Morph Clínica: cabeçalho e rodapé próprios, sem o menu do site principal.
export default function Page() {
  return (
    <>
      <header className="sticky top-0 z-40 h-16 border-b border-white/10 bg-background/95">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Voltar para o site da Morph Code">
            <Image src="/logo.jpeg" alt="" width={30} height={30} className="rounded-full ring-1 ring-gold/50" />
            <span className="font-[var(--font-display)] text-base tracking-wide">
              MORPH <span className="text-gold">LEADS</span>
            </span>
          </Link>
          <a
            href={whatsappLink(ajuda)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 px-4 text-sm text-muted transition-colors hover:border-gold hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
          >
            <FaWhatsapp className="h-4 w-4" aria-hidden />
            Falar com a gente
          </a>
        </div>
      </header>

      <main id="conteudo" className="py-12 md:py-20">
        <Gerador />
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Morph Code. Dados de perfis públicos do Google Maps; confirme antes de abordar.</p>
          <Link href="/" className="hover:text-gold">
            Conheça a Morph Code
          </Link>
        </div>
      </footer>
    </>
  );
}
