"use client";

import { motion } from "motion/react";
import { whatsappLink, budgetMessage } from "@/lib/whatsapp";
import Magnetic from "./Magnetic";
import HeroScene from "./HeroScene";
import CursorLens from "./CursorLens";
import { LuArrowDown } from "react-icons/lu";

const lineA = "Seu site profissional".split(" ");
const lineB = "no ar em cerca de".split(" ");
const lineC = "7 dias.".split(" ");

function Words({ words, start, className = "" }: { words: string[]; start: number; className?: string }) {
  return (
    <span className="block">
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: start + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          className={`inline-block mr-[0.25em] ${className}`}
        >
          {w}
        </motion.span>
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

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:min-h-[calc(100svh-10rem)] lg:grid-cols-[1fr_1fr]">
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

          <h1 className="font-[var(--font-display)] text-[2.4rem] leading-[1.06] sm:text-5xl lg:text-[3.1rem] xl:text-[3.4rem]">
            <Words words={lineA} start={0.2} className="font-light text-foreground/65" />
            <Words words={lineB} start={0.5} className="font-semibold text-foreground" />
            <Words words={lineC} start={0.8} className="font-semibold gold-gradient-text" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-7 max-w-lg font-mono text-[13px] leading-relaxed text-muted sm:text-sm"
          >
            Site para o seu negócio aparecer no Google e receber pedidos de orçamento pelo
            WhatsApp. Você fala direto com quem faz o site, do briefing à entrega.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.15 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Magnetic strength={0.2}>
              <a
                href={whatsappLink(budgetMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shine inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3.5 text-sm font-medium text-background transition-[background-color,box-shadow] hover:bg-gold-light hover:shadow-[0_0_32px_rgba(212,169,74,0.45)]"
              >
                Pedir orçamento no WhatsApp
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a
                href="#projetos"
                className="glass inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-gold/60"
              >
                Ver projetos reais
              </a>
            </Magnetic>
          </motion.div>
        </div>

        <HeroScene />
      </div>

      <a
        href="#produto"
        aria-label="Rolar para o próximo bloco"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-[11px] text-muted transition-colors hover:text-gold lg:flex"
      >
        <LuArrowDown className="h-3.5 w-3.5 animate-bounce" aria-hidden /> role
      </a>
    </section>
  );
}
