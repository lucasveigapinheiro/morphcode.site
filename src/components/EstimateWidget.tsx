"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const data = {
  site: {
    label: "Site",
    time: "~7 dias",
    desc: "Landing pages e sites institucionais, prontos e no ar rápido.",
  },
  sistema: {
    label: "Sistema",
    time: "2 a 3 semanas",
    desc: "Plataformas e sistemas sob medida, com mais estrutura e integrações.",
  },
} as const;

type Kind = keyof typeof data;

export default function EstimateWidget() {
  const [active, setActive] = useState<Kind>("site");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.05 }}
      className="mt-16 max-w-lg border-t border-border pt-8"
    >
      <p className="text-xs text-muted mb-4">Qual o prazo do meu projeto?</p>

      <div className="relative inline-flex rounded-full border border-border bg-surface p-1">
        {(Object.keys(data) as Kind[]).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className="relative px-5 py-2 text-sm font-medium"
          >
            {active === key && (
              <motion.span
                layoutId="estimate-pill"
                className="absolute inset-0 rounded-full bg-gold"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className={`relative z-10 ${active === key ? "text-background" : "text-muted"}`}>
              {data[key].label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5"
        >
          <p className="font-[var(--font-display)] text-3xl text-gold">{data[active].time}</p>
          <p className="mt-1 text-sm text-muted max-w-sm">{data[active].desc}</p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
