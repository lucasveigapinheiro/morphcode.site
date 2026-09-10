"use client";

import { motion } from "motion/react";
import {
  LuGauge,
  LuLayoutDashboard,
  LuMonitor,
  LuPenTool,
  LuRefreshCw,
  LuServer,
} from "react-icons/lu";
import Reveal from "./Reveal";

const services = [
  {
    icon: LuMonitor,
    title: "Sites profissionais",
    text: "Landing pages e sites institucionais rápidos, responsivos e otimizados para converter visitantes em clientes.",
    big: true,
  },
  {
    icon: LuLayoutDashboard,
    title: "Sistemas sob medida",
    text: "Plataformas e painéis personalizados para organizar processos e apoiar a operação do seu negócio.",
    big: false,
  },
  {
    icon: LuPenTool,
    title: "Design de interface",
    text: "Layouts exclusivos e alinhados à sua marca, pensados para uma navegação clara e agradável.",
    big: false,
  },
  {
    icon: LuGauge,
    title: "SEO e performance",
    text: "Sites leves e bem estruturados para carregar rápido e aparecer melhor no Google.",
    big: false,
  },
  {
    icon: LuServer,
    title: "Hospedagem e domínio",
    text: "Configuramos domínio, hospedagem e publicação para o seu projeto ir ao ar sem dor de cabeça.",
    big: false,
  },
  {
    icon: LuRefreshCw,
    title: "Manutenção e evolução",
    text: "Ajustes, melhorias e novas funcionalidades para o seu projeto continuar crescendo com você.",
    big: true,
  },
];

export default function Services() {
  return (
    <section id="servicos" className="section-border py-24 bg-surface/40">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-xs tracking-[0.25em] text-gold uppercase mb-4">O que fazemos</p>
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl max-w-xl">
            Serviços pensados para o crescimento do seu negócio
          </h2>
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1} className={s.big ? "lg:col-span-2" : "lg:col-span-1"}>
              <motion.div
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-full rounded-2xl border border-border bg-surface p-6 hover:border-gold/50 active:border-gold/50 transition-colors"
              >
                <s.icon className="h-6 w-6 text-gold" aria-hidden />
                <h3 className="mt-5 font-medium">{s.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{s.text}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
