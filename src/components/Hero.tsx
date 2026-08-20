"use client";

import { motion } from "motion/react";
import { whatsappLink, budgetMessage } from "@/lib/whatsapp";
import Magnetic from "./Magnetic";
import EstimateWidget from "./EstimateWidget";

const words = "Transformamos ideias em soluções digitais que geram resultado real.".split(" ");

export default function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden pt-36 pb-28 md:pt-44 md:pb-36">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-8%] h-[480px] w-[480px] rounded-full opacity-25 blur-3xl animate-float-slow"
        style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[280px] left-[-6%] h-[320px] w-[320px] rounded-full opacity-10 blur-3xl animate-float-slower"
        style={{ background: "radial-gradient(circle, var(--gold-light) 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-6xl px-6 relative grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: -8, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 mb-7 -ml-1"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            <span className="text-xs text-gold">Disponível para novos projetos</span>
          </motion.div>

          <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-6xl leading-[1.08] max-w-3xl">
            {words.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
                className={`inline-block mr-[0.28em] ${
                  ["soluções", "digitais"].includes(w) ? "gold-gradient-text" : ""
                }`}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="mt-6 max-w-xl text-muted text-base md:text-lg"
          >
            A Morph Code desenvolve sites, sistemas e automações pensados para o seu negócio
            crescer com mais estrutura, velocidade e segurança.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Magnetic strength={0.25}>
              <a
                href={whatsappLink(budgetMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-background hover:bg-gold-light transition-colors"
              >
                Solicitar orçamento no WhatsApp
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a
                href="#projetos"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-medium text-foreground hover:border-gold transition-colors"
              >
                Ver projetos
              </a>
            </Magnetic>
          </motion.div>

          <EstimateWidget />
        </div>

        <div className="relative mt-6 max-w-xs mx-auto sm:max-w-sm lg:mt-0 lg:max-w-none lg:mx-0">
          <motion.div
            drag
            dragConstraints={{ top: -60, bottom: 60, left: -60, right: 60 }}
            dragElastic={0.5}
            dragTransition={{ bounceStiffness: 250, bounceDamping: 15 }}
            whileDrag={{ scale: 1.04, rotate: 0, cursor: "grabbing" }}
            initial={{ opacity: 0, scale: 0.92, rotate: 4 }}
            animate={{ opacity: 1, scale: 1, rotate: [3, 1, 3], y: [0, -14, 0] }}
            transition={{
              opacity: { duration: 0.8, delay: 0.4 },
              scale: { duration: 0.8, delay: 0.4 },
              rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
            }}
            className="relative cursor-grab active:cursor-grabbing"
          >
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-2xl shadow-black/40 select-none">
              <div className="flex items-center gap-1.5 mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <pre className="text-[11px] leading-relaxed text-muted overflow-hidden">
                <code>
<span className="text-gold">const</span> projeto = {"{"}
  {"\n"}  cliente: <span className="text-gold-light">&quot;seu-negocio&quot;</span>,
  {"\n"}  stack: [<span className="text-gold-light">&quot;next&quot;</span>, <span className="text-gold-light">&quot;design&quot;</span>],
  {"\n"}  resultado: <span className="text-gold-light">&quot;mais clientes&quot;</span>,
  {"\n"}{"}"};{"\n\n"}
<span className="text-gold">function</span> deploy() {"{"}
  {"\n"}  <span className="text-gold">return</span> <span className="text-gold-light">&quot;✔ no ar&quot;</span>;
  {"\n"}{"}"}
                </code>
              </pre>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10, rotate: 8 }}
              animate={{ opacity: 1, y: 0, rotate: -6 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="absolute -bottom-6 -left-8 rounded-xl border border-gold/30 bg-background px-4 py-3 shadow-xl pointer-events-none select-none"
            >
              <p className="text-xs text-muted">Uptime</p>
              <p className="font-[var(--font-display)] text-lg text-gold">99.9%</p>
            </motion.div>
          </motion.div>
          <p className="mt-4 text-center text-[11px] text-muted/70">arraste o card ✦</p>
        </div>
      </div>
    </section>
  );
}
