"use client";

import { motion } from "motion/react";
import Reveal from "./Reveal";

const testimonials = [
  {
    name: "Renata Alves",
    role: "Loja de moda online",
    text: "O novo site aumentou nossas vendas online e ficou muito mais fácil os clientes encontrarem o que precisam.",
    rotate: -2,
  },
  {
    name: "Marcos Teixeira",
    role: "Clínica odontológica",
    text: "Processo de agendamento automatizado economizou horas da nossa recepção toda semana.",
    rotate: 1.5,
  },
  {
    name: "Juliana Prado",
    role: "Consultoria financeira",
    text: "Site profissional passou muito mais credibilidade para os clientes novos.",
    rotate: -1,
  },
];

export default function Testimonials() {
  return (
    <section className="section-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-xs tracking-[0.25em] text-gold uppercase mb-4">Depoimentos</p>
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl max-w-xl">
              O que dizem sobre a Morph Code
            </h2>
            <p className="text-xs text-muted">*Depoimentos ilustrativos</p>
          </div>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 0, y: -4 }}
                whileTap={{ rotate: 0, scale: 0.97 }}
                style={{ rotate: t.rotate }}
                transition={{ type: "spring", stiffness: 250, damping: 18 }}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <p className="text-gold text-sm mb-4">★★★★★</p>
                <p className="text-sm text-muted leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-surface-2 border border-border flex items-center justify-center text-xs text-gold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
