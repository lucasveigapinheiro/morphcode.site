import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import { FaWhatsapp } from "react-icons/fa6";
import MorphLogo from "@/components/MorphLogo";
import Gerador from "@/components/gerador/Gerador";
import { PRECO_TEXTO, PROMO_BLACK_FRIDAY } from "@/lib/gerador";
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

        /* Hover brilhante nos botões primários e escuros */
        .ml-btn-glow::before,
        .ml-btn-glow-dark::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .ml-btn-glow::before {
          background: radial-gradient(160px circle at var(--bx, 50%) var(--by, 50%), rgba(255, 255, 255, 0.72), transparent 65%);
        }
        .ml-btn-glow-dark::before {
          background: radial-gradient(160px circle at var(--bx, 50%) var(--by, 50%), rgba(159, 232, 112, 0.35), transparent 65%);
        }
        .ml-btn-glow:hover::before,
        .ml-btn-glow-dark:hover::before {
          opacity: 1;
        }
        .ml-btn-glow::after,
        .ml-btn-glow-dark::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          transform: translateX(-125%) skewX(-20deg);
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
          transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ml-btn-glow:hover::after,
        .ml-btn-glow-dark:hover::after {
          transform: translateX(125%) skewX(-20deg);
        }

        /* Faixas passando (Marquee infinito em transform para 60fps) */
        @keyframes ml-marquee-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes ml-marquee-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .ml-marquee-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: ml-marquee-left 30s linear infinite;
        }
        .ml-marquee-track-rev {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: ml-marquee-right 34s linear infinite;
        }
        .ml-marquee-wrap:hover .ml-marquee-track,
        .ml-marquee-wrap:hover .ml-marquee-track-rev {
          animation-play-state: paused;
        }

        /* Pulso suave do indicador ao vivo */
        @keyframes ml-ping-soft {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.7); opacity: 0; }
        }
        .ml-ping {
          animation: ml-ping-soft 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        /* Respeito total a prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .ml-marquee-track,
          .ml-marquee-track-rev,
          .ml-ping {
            animation: none !important;
          }
          .ml-btn-glow::after,
          .ml-btn-glow-dark::after {
            transition: none !important;
          }
        }
      `}</style>

      <a
        href="#pedido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--w-ink)] focus:px-4 focus:py-2 text-sm font-semibold text-white"
      >
        Ir para o pedido
      </a>

      {PROMO_BLACK_FRIDAY.ativa && (
        <div
          role="region"
          aria-label="Promoção Black Friday"
          className="border-b border-[var(--w-primary)]/25 bg-[var(--w-ink)] text-white"
        >
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-4 py-2.5 text-center text-xs sm:px-6 sm:text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--w-primary)] px-2.5 py-0.5 font-[family-name:var(--f-mono)] text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--w-ink)]">
              {PROMO_BLACK_FRIDAY.rotulo} · {PROMO_BLACK_FRIDAY.descontoPercentual}% OFF
            </span>
            <p className="font-medium text-white/90">
              Planilha com 50 leads de{" "}
              <span className="tabular-nums text-white/55 line-through">R$&nbsp;{PROMO_BLACK_FRIDAY.precoOriginalTexto}</span>{" "}
              por{" "}
              <strong className="font-[family-name:var(--f-display)] text-sm font-extrabold tabular-nums text-[var(--w-primary)] sm:text-base">
                R$&nbsp;{PRECO_TEXTO}
              </strong>
            </p>
            <a
              href="#pedido"
              className="hidden font-semibold text-[var(--w-primary)] underline decoration-[var(--w-primary)]/60 underline-offset-4 transition-colors hover:text-white sm:inline-flex"
            >
              Aproveitar agora →
            </a>
          </div>
        </div>
      )}

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
              <span className="hidden sm:inline">Falar no WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
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
