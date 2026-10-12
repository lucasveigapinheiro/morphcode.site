"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import EstimateWidget from "./EstimateWidget";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
  { title: "Você conta o projeto", text: "Chama no WhatsApp e explica o que o seu negócio faz e o que você quer no site." },
  { title: "Você recebe valor e prazo", text: "Proposta com o preço e a data de entrega, sem compromisso e antes de fechar." },
  { title: "O site é desenhado e programado", text: "Design sob medida e código próprio, sem template pronto. Você fala direto com quem faz." },
  { title: "O site vai ao ar", text: "Configuramos domínio, hospedagem e publicação. Depois da entrega, ajustes e suporte." },
];

export default function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".pr-step", {
          opacity: 0,
          y: 40,
          stagger: 0.18,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".pr-list", start: "top 78%", once: true },
        });
        // A linha dourada se desenha conforme a página rola.
        gsap.fromTo(
          ".pr-line",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top",
            scrollTrigger: { trigger: ".pr-list", start: "top 70%", end: "bottom 60%", scrub: 0.6 },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="como-funciona" className="section-border relative py-28">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-4 text-[13px] font-medium tracking-[0.02em] text-gold">Como funciona</p>
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl max-w-md">
            Da primeira mensagem ao site no ar
          </h2>
          <p className="mt-5 max-w-sm text-muted">
            Um processo curto e sem burocracia. Você acompanha cada etapa e sabe o que vem a seguir.
          </p>
          <EstimateWidget />
        </div>

        <ol className="pr-list relative space-y-5 pl-8 sm:pl-10">
          <span aria-hidden className="absolute bottom-3 left-[11px] top-3 w-px bg-white/10 sm:left-[15px]" />
          <span aria-hidden className="pr-line absolute bottom-3 left-[11px] top-3 w-px bg-gradient-to-b from-gold-light to-gold shadow-[0_0_10px_rgba(212,169,74,0.7)] sm:left-[15px]" />
          {steps.map((s, i) => (
            <li key={s.title} className="pr-step relative">
              <span className="absolute -left-8 top-6 grid h-6 w-6 place-items-center rounded-full border border-gold/60 bg-background font-mono text-[10px] text-gold sm:-left-10 sm:h-8 sm:w-8 sm:text-xs">
                {i + 1}
              </span>
              <div className="glass-card p-6">
                <h3 className="font-[var(--font-display)] text-lg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
