"use client";

import Link from "next/link";
import { LuArrowRight, LuCheck, LuDownload } from "react-icons/lu";
import Reveal from "../Reveal";
import Magnetic from "../Magnetic";
import SlideCarousel from "./SlideCarousel";
import { APRESENTACAO_PDF, PRODUTO } from "@/lib/clinica";

const pontos = [
  "Ficha de anamnese assinada no celular da paciente",
  "Alertas de alergia e contraindicação no prontuário",
  "Agenda com lembretes pelo WhatsApp",
  "Com a marca, as cores e os serviços da clínica",
];

export default function ProdutoDestaque() {
  return (
    <section id="produto" className="section-border relative overflow-hidden py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--eucalipto) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-[360px] w-[360px] rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--argila) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Reveal>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold">
            Produto principal
          </p>
          <h2 className="font-[var(--font-display)] text-3xl leading-tight md:text-5xl">
            <span className="gold-gradient-text">{PRODUTO}</span>: o sistema que tira a ficha de anamnese do papel.
          </h2>
          <p className="mt-5 max-w-lg text-muted">
            Feito para clínicas de estética: a paciente preenche e assina pelo celular, e a doutora vê os riscos
            antes do procedimento. Prontuário, agenda e LGPD em um só lugar.
          </p>

          <ul className="mt-7 space-y-3">
            {pontos.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-foreground/90">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-eucalipto text-white">
                  <LuCheck className="h-3 w-3" aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <p className="mt-7 text-sm text-muted">
            A partir de <span className="font-[var(--font-display)] text-2xl text-foreground">R$ 89</span>/mês
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Magnetic strength={0.25}>
              <Link
                href="/clinicas"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-gold-light"
              >
                Conhecer o sistema <LuArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Link
                href="/clinicas#planos"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-gold"
              >
                Ver planos
              </Link>
            </Magnetic>
          </div>
          <a
            href={APRESENTACAO_PDF}
            download
            className="mt-5 inline-flex items-center gap-2 text-xs text-muted transition-colors hover:text-gold"
          >
            <LuDownload className="h-3.5 w-3.5" aria-hidden /> Baixar a apresentação em PDF
          </a>
        </Reveal>

        <Reveal delay={0.15}>
          <SlideCarousel tema="escuro" autoplay miniaturas={false} />
          <p className="mt-3 text-center text-[11px] text-muted/70">Slides da apresentação comercial · passe o mouse para pausar</p>
        </Reveal>
      </div>
    </section>
  );
}
