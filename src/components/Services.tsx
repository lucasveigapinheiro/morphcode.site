"use client";

import { motion } from "motion/react";
import { LuLayoutDashboard, LuMonitor, LuPenTool, LuServer } from "react-icons/lu";
import Reveal from "./Reveal";

const services = [
  { icon: LuMonitor, title: "Sites profissionais", text: "Landing pages e sites institucionais, rápidos e feitos para o celular." },
  { icon: LuLayoutDashboard, title: "Sistemas sob medida", text: "Painéis e plataformas para organizar a operação do seu negócio." },
  { icon: LuPenTool, title: "Design e SEO", text: "Layout exclusivo da sua marca, estruturado para aparecer no Google." },
  { icon: LuServer, title: "Domínio e suporte", text: "Hospedagem, publicação e ajustes depois da entrega." },
];

export default function Services() {
  return (
    <section id="servicos" className="section-border py-20 bg-surface/30">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-[13px] font-medium tracking-[0.02em] text-gold mb-3">O que fazemos</p>
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl max-w-xl">Do design ao site no ar</h2>
        </Reveal>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1} className="h-full">
              <motion.div
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass-card group h-full p-5"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/25 bg-gold/10 transition-colors group-hover:bg-gold/20"><s.icon className="h-5 w-5 text-gold" aria-hidden /></span>
                <h3 className="mt-4 font-medium">{s.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{s.text}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
