"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const faqs = [
  {
    q: "Quanto tempo leva para desenvolver um site?",
    a: "Em média, 7 dias para um site institucional ou landing page. Sistemas mais complexos, com integrações e funcionalidades personalizadas, levam de 2 a 3 semanas. O prazo exato é sempre alinhado no início do projeto.",
  },
  {
    q: "Como funciona o orçamento?",
    a: "Você entra em contato pelo WhatsApp contando um pouco sobre o seu projeto e enviamos uma proposta personalizada, sem compromisso.",
  },
  {
    q: "O site fica hospedado onde?",
    a: "Utilizamos serviços de hospedagem modernos e confiáveis. Cuidamos de toda a configuração para que você não precise se preocupar com a parte técnica.",
  },
  {
    q: "Vocês oferecem suporte depois da entrega?",
    a: "Sim. Após a entrega, oferecemos períodos de suporte e planos de manutenção contínua para ajustes e evoluções do projeto.",
  },
  {
    q: "É possível pedir alterações no meio do projeto?",
    a: "Sim, dentro do escopo combinado. Ajustes maiores ou fora do escopo inicial são orçados separadamente.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="duvidas" className="section-border py-24">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-xs tracking-[0.25em] text-gold uppercase mb-4 text-center">Dúvidas frequentes</p>
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl text-center">
          Perguntas que recebemos com frequência
        </h2>

        <div className="mt-12 divide-y divide-border border-t border-b border-border">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal as="div" delay={i * 0.05} key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-medium text-sm md:text-base">{item.q}</span>
                  <span
                    className={`shrink-0 text-gold transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-200 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
                  }`}
                  style={{ display: "grid" }}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm text-muted leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
