"use client";

import { motion } from "motion/react";
import { whatsappLink, budgetMessage } from "@/lib/whatsapp";
import Magnetic from "./Magnetic";
import HeroScene from "./HeroScene";
import CursorLens from "./CursorLens";
import { LuArrowDown, LuCheck } from "react-icons/lu";

const lineA = "Seu negócio no Google.".split(" ");
const lineB = "Os clientes no seu WhatsApp.".split(" ");
const lineC = "Site no ar em cerca de 7 dias.".split(" ");

// Clientes com site no ar, na mesma ordem da seção de projetos.
const clientes = ["2B Estética Automotiva", "GMG Equilíbrio", "Mecânica Rossi"];

// Cada palavra é separada por um espaço real, para o título copiar e ser lido certo.
// O título já nasce visível (só desliza um pouco): esconder com opacidade atrasaria o
// carregamento percebido e a métrica de LCP do Google.
function Words({ words, start, className = "" }: { words: string[]; start: number; className?: string }) {
  return (
    <span className="block">
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <motion.span
            initial={{ y: 14 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: start + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className={`inline-block ${className}`}
          >
            {w}
          </motion.span>{" "}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section id="topo" className="relative isolate overflow-hidden pt-28 pb-20 md:pt-32 lg:min-h-[100svh] lg:pb-12">
      {/* Fundo: grade em perspectiva, brilho dourado e a lente que segue o mouse */}
      <div aria-hidden className="hud-grid absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-[-10%] -z-10 h-[620px] w-[620px] rounded-full opacity-25 blur-3xl animate-float-slow"
        style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 68%)" }}
      />
      <CursorLens className="-z-10" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:min-h-[calc(100svh-10rem)] lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.a
            href="#produto"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass group mb-8 inline-flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-xs text-foreground hover:border-[#5fa091]! hover:bg-[#2f5a52]/85! hover:text-white hover:shadow-[0_0_28px_rgba(95,160,145,0.45)]!"
          >
            <span className="rounded-full bg-[#3f8577] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white transition-colors duration-300 group-hover:bg-[#5fa091]">Novo</span>
            Morph Clínica: sistema para clínicas de estética, a partir de R$ 149/mês
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </motion.a>

          <h1 className="font-[var(--font-display)] text-[2.2rem] leading-[1.06] sm:text-5xl lg:text-[2.8rem] xl:text-[3.1rem]">
            <Words words={lineA} start={0} className="font-light text-foreground/70" />
            <Words words={lineB} start={0.15} className="font-semibold text-foreground" />
            <Words words={lineC} start={0.3} className="font-semibold gold-gradient-text" />
          </h1>

          <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-muted sm:text-base">
            Para oficinas, estéticas, clínicas e lojas que querem aparecer no Google e receber cliente sem formulário e sem
            intermediário. Você fala direto com quem faz o site.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Magnetic strength={0.2}>
              <a
                href={whatsappLink(budgetMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shine inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3.5 text-sm font-semibold text-background transition-[background-color,box-shadow] hover:bg-gold-light hover:shadow-[0_0_32px_rgba(212,169,74,0.45)] sm:w-auto"
              >
                Pedir orçamento no WhatsApp
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a
                href="#projetos"
                className="glass inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-gold/60 sm:w-auto"
              >
                Ver sites no ar
              </a>
            </Magnetic>
          </div>
          <p className="mt-4 flex items-center gap-2 text-[13px] text-muted">
            <LuCheck className="h-4 w-4 shrink-0 text-gold" aria-hidden />
            Você recebe valor e prazo antes de fechar. Sem compromisso.
          </p>

          <div className="mt-10 border-t border-white/10 pt-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted/80">Sites no ar de clientes</p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-foreground/85">
              {clientes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <HeroScene />
      </div>

      <a
        href="#projetos"
        aria-label="Rolar para os projetos"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-[11px] text-muted transition-colors hover:text-gold lg:flex"
      >
        <LuArrowDown className="h-3.5 w-3.5 motion-safe:animate-bounce" aria-hidden /> role
      </a>
    </section>
  );
}
