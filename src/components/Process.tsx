"use client";

import { useEffect, useRef, useState } from "react";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import Reveal from "./Reveal";

const steps = [
  { title: "Você conta o projeto", text: "Chama no WhatsApp e explica o que o seu negócio faz e o que quer no site." },
  { title: "Você recebe valor e prazo", text: "Proposta com preço e data de entrega, sem compromisso e antes de fechar." },
  { title: "Design e código sob medida", text: "Sem template pronto. Você fala direto com quem faz o site." },
  { title: "O site vai ao ar", text: "Domínio, hospedagem e publicação. Depois, ajustes e suporte." },
];

export default function Process() {
  const track = useRef<HTMLUListElement>(null);
  const [progresso, setProgresso] = useState(0);
  const [inicio, setInicio] = useState(true);
  const [fim, setFim] = useState(false);

  // Progresso da rolagem lateral e estado das setas.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const atualizar = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgresso(max > 0 ? el.scrollLeft / max : 1);
      setInicio(el.scrollLeft <= 4);
      setFim(max <= 4 || el.scrollLeft >= max - 4);
    };
    atualizar();
    el.addEventListener("scroll", atualizar, { passive: true });
    window.addEventListener("resize", atualizar);

    // Arrastar com o mouse (no toque o navegador já faz isso).
    let down = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.classList.add("is-dragging");
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      el.scrollLeft = startLeft - (e.clientX - startX);
    };
    const onUp = () => {
      down = false;
      el.classList.remove("is-dragging");
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("scroll", atualizar);
      window.removeEventListener("resize", atualizar);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const mover = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const passo = card ? card.getBoundingClientRect().width + 16 : 320;
    el.scrollBy({ left: dir * passo, behavior: "smooth" });
  };

  return (
    <section id="como-funciona" className="section-border relative py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-[13px] font-medium tracking-[0.02em] text-gold">Como funciona</p>
            <h2 className="max-w-md font-[var(--font-display)] text-3xl md:text-4xl">Da primeira mensagem ao site no ar</h2>
          </div>
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              onClick={() => mover(-1)}
              disabled={inicio}
              aria-label="Etapa anterior"
              className="glass grid h-11 w-11 place-items-center rounded-full text-foreground transition-colors hover:border-gold/60 disabled:opacity-30"
            >
              <LuArrowLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => mover(1)}
              disabled={fim}
              aria-label="Próxima etapa"
              className="glass grid h-11 w-11 place-items-center rounded-full text-foreground transition-colors hover:border-gold/60 disabled:opacity-30"
            >
              <LuArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </Reveal>
      </div>

      {/* Rolagem lateral: o primeiro cartão alinha com o título e o último pode sair pela borda */}
      <ul
        ref={track}
        tabIndex={0}
        aria-label="Etapas do processo, role para o lado"
        className="no-scrollbar pr-track mt-10 flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-2"
      >
        {steps.map((s, i) => (
          <li key={s.title} className="w-[78%] shrink-0 snap-start sm:w-[340px]">
            <div className="glass-card h-full p-6">
              <span className="font-mono text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-[var(--font-display)] text-lg">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-6 max-w-6xl px-6">
        <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full origin-left rounded-full bg-gradient-to-r from-gold to-gold-light"
            style={{ transform: `scaleX(${Math.max(0.12, progresso)})`, transition: "transform 0.2s" }}
          />
        </div>
      </div>
    </section>
  );
}
