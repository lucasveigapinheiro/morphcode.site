import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import { FaWhatsapp } from "react-icons/fa6";
import Gerador from "@/components/gerador/Gerador";
import { whatsappLink } from "@/lib/whatsapp";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-display", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--f-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Morph Leads: gerador de planilha de leads",
  description: "Escolha o nicho e a região e receba uma planilha com 50 negócios sem site, com WhatsApp, nota e funil de vendas.",
  alternates: { canonical: "/gerador" },
};

const ajuda = "Olá! Vim pelo Morph Leads e tenho uma dúvida.";

// Página à parte, como a do Morph Clínica, com identidade própria: papel quadriculado, tinta e verde de planilha.
export default function Page() {
  return (
    <div
      className={`${display.variable} ${mono.variable} min-h-screen font-[family-name:var(--f-display)]`}
      style={
        {
          "--papel": "#F3F4EF",
          "--tinta": "#111412",
          "--suave": "#585F57",
          "--linha": "#D3D6CC",
          "--cab": "#E9EBE2",
          "--verde": "#107C41",
          "--verde-esc": "#0B5A2F",
          "--lime": "#D8F24A",
          "--azul": "#1A6BFF",
          "--pin": "#F04A2E",
          "--erro": "#B93218",
          background: "var(--papel)",
          color: "var(--tinta)",
          colorScheme: "light",
        } as React.CSSProperties
      }
    >
      <style>{`html{background:#F3F4EF;color-scheme:light}`}</style>
      <a
        href="#pedido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--tinta)] focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Ir para o pedido
      </a>
      <header className="border-b border-[var(--linha)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Voltar para o site da Morph Code">
            <svg width="22" height="26" viewBox="0 0 22 26" aria-hidden>
              <path d="M11 1C5.5 1 1.5 5 1.5 10.2 1.5 16.6 11 25 11 25s9.5-8.4 9.5-14.8C20.5 5 16.5 1 11 1Z" fill="var(--pin)" />
              <circle cx="11" cy="10" r="3.6" fill="#fff" />
            </svg>
            <span className="text-xl font-extrabold tracking-tight">
              morph<span className="text-[var(--verde)]">leads</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/" className="rounded-md px-3 py-2 text-[var(--suave)] transition-colors hover:text-[var(--tinta)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azul)]">
              Site da Morph Code
            </Link>
            <a
              href={whatsappLink(ajuda)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-[var(--linha)] bg-white px-3 py-2 transition-colors hover:border-[var(--tinta)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azul)]"
            >
              <FaWhatsapp className="h-4 w-4 text-[var(--verde)]" aria-hidden />
              Dúvidas
            </a>
          </nav>
        </div>
      </header>

      <main id="conteudo">
        <Gerador />
      </main>

      <footer className="border-t border-[var(--linha)]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-8 text-xs text-[var(--suave)] sm:flex-row sm:items-center sm:px-6">
          <p>© {new Date().getFullYear()} Morph Code. Dados de perfis públicos do Google Maps; confirme antes de abordar.</p>
          <Link href="/" className="underline underline-offset-4 hover:text-[var(--tinta)]">
            Conheça a Morph Code
          </Link>
        </div>
      </footer>
    </div>
  );
}
