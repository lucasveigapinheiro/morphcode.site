"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { slides } from "@/lib/clinica";

type Props = {
  /** "escuro" para o site da Morph Code, "claro" para a página do produto. */
  tema?: "escuro" | "claro";
  autoplay?: boolean;
  miniaturas?: boolean;
};

export default function SlideCarousel({ tema = "claro", autoplay = false, miniaturas = true }: Props) {
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const reduzir = useReducedMotion();

  const ir = useCallback((delta: number) => {
    setAtual((i) => (i + delta + slides.length) % slides.length);
  }, []);

  // Carrega o próximo slide antes de ele aparecer, para a troca não piscar.
  useEffect(() => {
    const proximo = new window.Image();
    proximo.src = slides[(atual + 1) % slides.length].src;
  }, [atual]);

  useEffect(() => {
    if (!autoplay || pausado || reduzir) return;
    const t = setInterval(() => ir(1), 4200);
    return () => clearInterval(t);
  }, [autoplay, pausado, reduzir, ir]);

  const escuro = tema === "escuro";
  const botao = escuro
    ? "border-border bg-background/70 text-foreground hover:border-gold hover:text-gold"
    : "border-grafite/15 bg-white/90 text-grafite hover:border-eucalipto hover:text-eucalipto";

  return (
    <div
      className="w-full min-w-0"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") ir(1);
        if (e.key === "ArrowLeft") ir(-1);
      }}
      role="region"
      aria-roledescription="carrossel"
      aria-label="Slides da apresentação"
    >
      <div
        className={`relative aspect-video overflow-hidden rounded-2xl border shadow-2xl ${
          escuro ? "border-border shadow-black/50" : "border-grafite/10 shadow-eucalipto/20"
        }`}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={atual}
            className="absolute inset-0"
            initial={reduzir ? false : { opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduzir ? undefined : { opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={slides[atual].src}
              alt={slides[atual].alt}
              fill
              unoptimized
              className="object-cover"
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => ir(-1)}
            className={`grid h-10 w-10 place-items-center rounded-full border backdrop-blur transition-colors ${botao}`}
            aria-label="Slide anterior"
          >
            <LuChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <span
            className={`rounded-full px-3 py-1 text-xs tabular-nums backdrop-blur ${
              escuro ? "bg-background/70 text-muted" : "bg-white/90 text-grafite/70"
            }`}
            aria-live="polite"
          >
            {atual + 1} / {slides.length}
          </span>
          <button
            type="button"
            onClick={() => ir(1)}
            className={`grid h-10 w-10 place-items-center rounded-full border backdrop-blur transition-colors ${botao}`}
            aria-label="Próximo slide"
          >
            <LuChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      {miniaturas && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setAtual(i)}
              aria-label={`Ir para o slide ${i + 1}`}
              aria-current={i === atual}
              className={`relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                i === atual
                  ? escuro
                    ? "border-gold"
                    : "border-eucalipto"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={s.src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
