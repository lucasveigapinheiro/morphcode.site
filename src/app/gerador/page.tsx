import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import { FaWhatsapp } from "react-icons/fa6";
import MorphLogo from "@/components/MorphLogo";
import Gerador from "@/components/gerador/Gerador";
import { whatsappLink } from "@/lib/whatsapp";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-display", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--f-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Morph Leads: gerador de planilha de leads",
  description: "Escolha o nicho e a região e receba uma planilha com 50 negócios, com WhatsApp, nota e funil de vendas. Para quem vende sites, só negócios sem site.",
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
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2" aria-label="Voltar para o site da Morph Code">
            <MorphLogo glow={false} claro className="h-14 w-14 shrink-0" label="Morph Code" />
            <span className="flex min-w-0 items-baseline whitespace-nowrap text-lg font-extrabold tracking-tight sm:text-xl">
              morph<span className="text-[var(--verde)]">leads</span>
              <span className="ml-2 hidden font-[family-name:var(--f-mono)] text-[11px] font-medium uppercase tracking-wider text-[var(--suave)] sm:inline">por Morph Code</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/" className="hidden rounded-md px-3 py-2.5 text-[var(--suave)] sm:inline-flex transition-colors hover:text-[var(--tinta)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azul)]">
              Site da Morph Code
            </Link>
            <a
              href={whatsappLink(ajuda)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[var(--linha)] bg-white px-3 py-2 transition-colors hover:border-[var(--tinta)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azul)]"
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
          <Link href="/" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-[var(--tinta)]">
            Conheça a Morph Code
          </Link>
        </div>
      </footer>
    </div>
  );
}
