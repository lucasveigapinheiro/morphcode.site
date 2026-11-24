import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import { FaWhatsapp } from "react-icons/fa6";
import MorphLogo from "@/components/MorphLogo";
import Gerador from "@/components/gerador/Gerador";
import { whatsappLink } from "@/lib/whatsapp";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--f-display",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--f-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Morph Leads — 50 clientes locais no seu WhatsApp em minutos",
  description:
    "Escolha o nicho e a cidade e baixe uma planilha pronta com 50 negócios reais do Google Maps, WhatsApp, nota, prioridade e funil. Pagamento único, sem mensalidade.",
  alternates: { canonical: "/gerador" },
};

const ajuda = "Olá! Vim pelo Morph Leads e tenho uma dúvida.";

export default function Page() {
  return (
    <div
      className={`${display.variable} ${mono.variable} morph-leads-page min-h-screen font-sans antialiased`}
      style={
        {
          "--w-primary": "#9FE870",
          "--w-primary-hover": "#B6F18E",
          "--w-primary-pale": "#E2F6D5",
          "--w-ink": "#0E0F0C",
          "--w-ink-deep": "#163300",
          "--w-body": "#454745",
          "--w-mute": "#636661",
          "--w-canvas": "#FFFFFF",
          "--w-canvas-soft": "#E8EBE6",
          "--w-border": "#D1D6CE",
          "--w-positive": "#2EAD4B",
          "--w-positive-deep": "#054D28",
          "--w-warning": "#FFF2B2",
          "--w-warning-content": "#4A3B1C",
          "--w-negative": "#C42B30",
          "--w-negative-bg": "#FDECEC",
          background: "var(--w-canvas)",
          color: "var(--w-ink)",
          colorScheme: "light",
        } as React.CSSProperties
      }
    >
      <style>{`
        html { background: #E8EBE6; color-scheme: light; }
        .morph-leads-page ::selection { background: #9FE870; color: #0E0F0C; }
        .morph-leads-page :focus-visible { outline: 2px solid #163300; outline-offset: 2px; }
      `}</style>

      <a
        href="#pedido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--w-ink)] focus:px-4 focus:py-2 text-sm font-semibold text-white"
      >
        Ir para o pedido
      </a>

      <header className="sticky top-0 z-40 border-b border-[var(--w-ink)]/10 bg-[var(--w-canvas)]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 rounded-lg focus-visible:outline-2"
            aria-label="Voltar para o site da Morph Code"
          >
            <MorphLogo glow={false} claro className="h-12 w-12 shrink-0" label="Morph Code" />
            <span className="flex min-w-0 items-baseline whitespace-nowrap font-[family-name:var(--f-display)] text-xl font-extrabold tracking-tight text-[var(--w-ink)]">
              morph<span className="text-[var(--w-positive-deep)]">leads</span>
            </span>
          </Link>

          <nav aria-label="Navegação principal" className="flex items-center gap-2 text-sm font-semibold">
            <a
              href="#exemplo"
              className="hidden rounded-full px-3.5 py-2 text-[var(--w-body)] transition-colors hover:bg-[var(--w-canvas-soft)] hover:text-[var(--w-ink)] md:inline-flex"
            >
              Ver exemplo
            </a>
            <a
              href="#perguntas"
              className="hidden rounded-full px-3.5 py-2 text-[var(--w-body)] transition-colors hover:bg-[var(--w-canvas-soft)] hover:text-[var(--w-ink)] md:inline-flex"
            >
              Dúvidas
            </a>
            <a
              href={whatsappLink(ajuda)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--w-ink)]/20 bg-[var(--w-canvas)] px-4 py-2 text-[var(--w-ink)] transition-colors hover:border-[var(--w-ink)] hover:bg-[var(--w-canvas-soft)]"
            >
              <FaWhatsapp className="h-4 w-4 text-[var(--w-positive-deep)]" aria-hidden />
              <span>Falar no WhatsApp</span>
            </a>
          </nav>
        </div>
      </header>

      <main id="conteudo">
        <Gerador />
      </main>

      <footer className="bg-[var(--w-ink)] text-[var(--w-canvas-soft)]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-12 text-sm sm:flex-row sm:items-center sm:px-6">
          <div className="space-y-1">
            <p className="font-[family-name:var(--f-display)] text-base font-extrabold text-white">
              morph<span className="text-[var(--w-primary)]">leads</span>
            </p>
            <p className="max-w-xl text-xs leading-relaxed text-[var(--w-canvas-soft)]/75">
              © {new Date().getFullYear()} Morph Code. Dados coletados de perfis públicos do Google Maps na hora do pedido; confirme antes de abordar.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-xs font-medium">
            <a
              href={whatsappLink(ajuda)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-[var(--w-primary)] underline underline-offset-4 hover:text-white"
            >
              Suporte no WhatsApp
            </a>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center text-[var(--w-canvas-soft)]/80 underline underline-offset-4 hover:text-white"
            >
              Conheça a Morph Code
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
