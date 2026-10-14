"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LuCheck, LuSendHorizontal } from "react-icons/lu";
import { whatsappLink, generalMessage } from "@/lib/whatsapp";
import { jsonLd } from "@/lib/site";
import Reveal from "./Reveal";

const faqs = [
  {
    q: "Quanto custa um site?",
    a: "O valor depende do que você precisa, como número de páginas, textos e fotos. Você conta o seu projeto pelo WhatsApp e recebe o valor e o prazo antes de fechar, sem compromisso.",
  },
  {
    q: "Serve para o meu tipo de negócio?",
    a: "Já colocamos no ar sites para estética automotiva, oficina mecânica, suplementos e clínica de estética. Se o seu cliente procura o serviço no Google e prefere falar pelo WhatsApp, o site é para você.",
  },
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

// Todas as respostas para o Google, mesmo as que a pessoa ainda não abriu na conversa.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

type Mensagem = { id: string; de: "voce" | "morph"; texto: string; pergunta?: number };

// A conversa já começa com a pergunta mais comum respondida, para a seção nunca abrir vazia.
const INICIO: Mensagem[] = [
  { id: "oi", de: "morph", texto: "Oi! Escolha uma pergunta e a resposta aparece aqui, como numa conversa." },
  { id: "q0", de: "voce", texto: faqs[0].q },
  { id: "a0", de: "morph", texto: faqs[0].a, pergunta: 0 },
];

/** Pergunta pronta, como as respostas rápidas do WhatsApp. */
function Pergunta({ i, respondida, onPerguntar, compacta = false }: { i: number; respondida: boolean; onPerguntar: (i: number) => void; compacta?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => onPerguntar(i)}
      className={
        compacta
          ? `shrink-0 snap-start rounded-full border px-4 py-2 text-left text-[13px] transition-colors ${
              respondida ? "border-white/10 text-muted" : "border-gold/40 bg-gold/10 text-foreground hover:bg-gold/20"
            }`
          : `group flex w-full items-center gap-3 border-b border-white/10 py-3.5 text-left text-[15px] transition-colors hover:text-gold ${
              respondida ? "text-muted" : "text-foreground"
            }`
      }
    >
      {!compacta && (
        <span
          aria-hidden
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[10px] transition-colors ${
            respondida ? "border-gold/50 bg-gold/15 text-gold" : "border-white/15 font-mono text-muted group-hover:border-gold/60"
          }`}
        >
          {respondida ? <LuCheck className="h-3 w-3" /> : String(i + 1).padStart(2, "0")}
        </span>
      )}
      <span className="min-w-0">{faqs[i].q}</span>
      {respondida && <span className="sr-only">(já respondida, mostra de novo a resposta)</span>}
    </button>
  );
}

export default function Faq() {
  const [mensagens, setMensagens] = useState<Mensagem[]>(INICIO);
  const [digitando, setDigitando] = useState(false);
  const conversa = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduzir = useReducedMotion();

  const respondidas = new Set(mensagens.filter((m) => m.pergunta !== undefined).map((m) => m.pergunta));

  // Rola só a caixa da conversa (nunca a página) até a última mensagem.
  useEffect(() => {
    const el = conversa.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduzir ? "auto" : "smooth" });
  }, [mensagens, digitando, reduzir]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const perguntar = (i: number) => {
    if (digitando) return;
    // Pergunta já respondida: em vez de repetir, leva até a resposta e a destaca.
    if (respondidas.has(i)) {
      const el = conversa.current?.querySelector<HTMLElement>(`[data-resposta="${i}"]`);
      if (el && conversa.current) {
        conversa.current.scrollTo({ top: el.offsetTop - 16, behavior: reduzir ? "auto" : "smooth" });
        el.animate?.([{ boxShadow: "0 0 0 2px rgba(212,169,74,0.7)" }, { boxShadow: "0 0 0 2px rgba(212,169,74,0)" }], { duration: 1400 });
      }
      return;
    }
    const n = Date.now();
    setMensagens((m) => [...m, { id: `q${i}-${n}`, de: "voce", texto: faqs[i].q }]);
    setDigitando(true);
    // Um respiro curto de "digitando", proporcional ao tamanho da resposta.
    const espera = reduzir ? 0 : Math.min(1300, 450 + faqs[i].a.length * 4);
    timer.current = setTimeout(() => {
      setDigitando(false);
      setMensagens((m) => [...m, { id: `a${i}-${n}`, de: "morph", texto: faqs[i].a, pergunta: i }]);
    }, espera);
  };

  return (
    <section id="duvidas" className="section-border py-24 md:py-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema)} />

      <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div className="min-w-0">
          <Reveal>
            <p className="mb-3 text-[13px] font-medium tracking-[0.02em] text-gold">Dúvidas frequentes</p>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl">Pergunte antes de fechar</h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
              As perguntas que mais chegam no WhatsApp, respondidas aqui. Toque em uma e veja a resposta na conversa.
            </p>
          </Reveal>

          <div className="mt-8 hidden border-t border-white/10 lg:block">
            {faqs.map((_, i) => (
              <Pergunta key={i} i={i} respondida={respondidas.has(i)} onPerguntar={perguntar} />
            ))}
          </div>
        </div>

        {/* A conversa. min-w-0: sem isso a fileira de perguntas do celular alarga a coluna da grade. */}
        <Reveal delay={0.1} className="min-w-0">
          <div className="glass-strong flex h-[520px] flex-col overflow-hidden rounded-3xl lg:h-[600px]">
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <Image src="/logo.jpeg" alt="" width={36} height={36} className="rounded-full" />
              <div className="min-w-0">
                <p className="text-sm font-medium">Morph Code</p>
                <p className="text-xs text-muted">{digitando ? "digitando…" : "Dúvidas frequentes"}</p>
              </div>
            </div>

            <div
              ref={conversa}
              role="log"
              aria-live="polite"
              aria-label="Conversa com as respostas"
              className="relative flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-5 [scrollbar-color:rgba(255,255,255,0.15)_transparent] [scrollbar-width:thin] sm:px-5"
            >
              <AnimatePresence initial={false}>
                {mensagens.map((m) => (
                  <motion.p
                    key={m.id}
                    data-resposta={m.pergunta}
                    initial={reduzir ? false : { opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.de === "voce"
                        ? "self-end rounded-tr-md border border-gold/30 bg-gold/15 text-foreground"
                        : "self-start rounded-tl-md border border-white/10 bg-white/[0.05] text-foreground/90"
                    }`}
                  >
                    <span className="sr-only">{m.de === "voce" ? "Você: " : "Morph Code: "}</span>
                    {m.texto}
                  </motion.p>
                ))}
                {digitando && (
                  <motion.p
                    key="digitando"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="self-start rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-muted motion-safe:animate-pulse"
                  >
                    digitando…
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* No celular as perguntas viram respostas rápidas dentro da conversa */}
            <div className="flex snap-x gap-2 overflow-x-auto border-t border-white/10 px-4 py-3 [scrollbar-width:none] lg:hidden">
              {faqs.map((_, i) => (
                <Pergunta key={i} i={i} respondida={respondidas.has(i)} onPerguntar={perguntar} compacta />
              ))}
            </div>

            {/* Parece o campo de mensagem, e leva para o WhatsApp de verdade */}
            <div className="border-t border-white/10 p-3">
              <a
                href={whatsappLink(generalMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-full border border-white/15 bg-black/30 py-2 pl-5 pr-2 text-sm text-muted transition-colors hover:border-gold/60 hover:text-foreground"
              >
                <span className="min-w-0 flex-1 truncate">Outra dúvida? Pergunte no WhatsApp</span>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-background transition-transform group-hover:scale-105">
                  <LuSendHorizontal className="h-4 w-4" aria-hidden />
                </span>
                <span className="sr-only">(abre o WhatsApp)</span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
