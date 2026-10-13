"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whatsappLink, budgetMessage } from "@/lib/whatsapp";
import Magnetic from "./Magnetic";
import { SiHtml5, SiCss, SiJavascript, SiTailwindcss } from "react-icons/si";
import type { IconType } from "react-icons";
import Reveal from "./Reveal";
import CursorLens from "./CursorLens";
import GlassLogo from "./GlassLogo";

const TECH_ICONS: Record<string, { Icon: IconType; color: string }> = {
  HTML5: { Icon: SiHtml5, color: "#E34F26" },
  CSS3: { Icon: SiCss, color: "#1572B6" },
  JavaScript: { Icon: SiJavascript, color: "#F7DF1E" },
  "Tailwind CSS": { Icon: SiTailwindcss, color: "#38BDF8" },
};

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type Project = {
  title: string;
  category: string;
  description: string;
  href: string;
  image: string;
  techs: string[];
};

export const projects: Project[] = [
  {
    title: "2B Estética Automotiva",
    category: "Site institucional",
    description:
      "Estética automotiva da Zona Norte de São Paulo. Orçamento direto pelo WhatsApp, domínio próprio e SEO local para aparecer para quem busca na região.",
    href: "https://2bestéticaautomotiva.com.br/",
    image: "/projects/2b-estetica.jpg",
    techs: ["HTML5", "CSS3", "JavaScript"],
  },
  {
    title: "GMG Equilíbrio",
    category: "Landing page",
    description: "Landing page de vendas para suplemento em cápsulas, com ativos, benefícios, depoimentos e oferta.",
    href: "https://gmg-site-beta.vercel.app/",
    image: "/projects/gmg-site.jpg",
    techs: ["HTML5", "Tailwind CSS", "JavaScript"],
  },
  {
    title: "Mecânica Rossi",
    category: "Site institucional",
    description: "Vitrine digital da oficina, com identidade visual própria e um botão de WhatsApp que leva direto ao orçamento.",
    href: "https://lucasveigapinheiro.github.io/MecanicaRossi/",
    image: "/projects/mecanica-rossi.jpg",
    techs: ["HTML5", "CSS3", "JavaScript"],
  },
  {
    title: "Sistema de Ordens de Serviço",
    category: "Sistema sob medida",
    description:
      "Uma oficina que controlava tudo no papel. Agora entrada de veículos, orçamentos, status de reparo e histórico de clientes ficam em um só lugar.",
    href: "https://lucasveigapinheiro.github.io/sistemaos/",
    image: "/projects/sistema-os.jpg",
    techs: ["HTML5", "CSS3", "JavaScript"],
  },
  {
    title: "Sistema para Clínica Estética",
    category: "Sistema sob medida",
    description: "Painel de gestão com agenda de consultas, cadastro e histórico de pacientes, pensado para a doutora e a recepção.",
    href: "https://paty-clinica.vercel.app/pages/dashboard.html",
    image: "/projects/labessie.jpg",
    techs: ["HTML5", "CSS3", "JavaScript"],
  },
  {
    title: "Orçamento Pessoal",
    category: "Aplicativo web",
    description: "Uma planilha de gastos que virou aplicativo web, com login, receitas, despesas e saldo mês a mês salvos automaticamente.",
    href: "https://lucasveigapinheiro.github.io/planilha-de-gastos",
    image: "/projects/orcamento-pessoal-v2.jpg",
    techs: ["HTML5", "Tailwind CSS", "JavaScript"],
  },
];

function Techs({ techs }: { techs: string[] }) {
  return (
    <ul className="flex items-center gap-2.5" aria-label="Tecnologias">
      {techs.map((tech) => {
        const entry = TECH_ICONS[tech];
        if (!entry) return null;
        const { Icon, color } = entry;
        return (
          <li key={tech} title={tech}>
            <Icon size={15} color={color} aria-hidden />
            <span className="sr-only">{tech}</span>
          </li>
        );
      })}
    </ul>
  );
}

function ProjectCard({ p, i }: { p: Project; i: number }) {
  return (
    <li className="pj-item relative pt-3">
      <span className="nm-tab absolute left-4 top-0 z-10 inline-flex items-center gap-2 rounded-md px-2 py-1 font-mono text-[10px] text-muted">
        / {String(i + 1).padStart(2, "0")}
        <span aria-hidden className="h-1 w-1 rounded-full bg-gold" />
      </span>
      <article className="nm-card group h-full">
        <span aria-hidden className="nm-raised" />
        <span aria-hidden className="nm-pressed" />
        <div className="relative flex h-full flex-col p-4">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-surface-2">
            <div className="pj-shot absolute inset-0">
              <Image
                src={p.image}
                alt={p.title}
                fill
                quality={90}
                sizes="(max-width: 767px) 92vw, (max-width: 1023px) 46vw, 340px"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>
          </div>
          <h3 className="mt-5 font-[var(--font-display)] text-lg leading-snug">
            {p.title} <span className="font-light text-muted">— {p.category.toLowerCase()}</span>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>
          <div className="mt-auto flex items-center justify-between gap-3 pt-6">
            <a
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 px-4 py-2 text-xs text-foreground transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
            >
              {p.category.startsWith("Site") || p.category === "Landing page" ? "Abrir o site" : "Abrir o sistema"}
              <span className="sr-only">: {p.title} (abre em nova aba)</span>
            </a>
            <Techs techs={p.techs} />
          </div>
        </div>
      </article>
    </li>
  );
}

export default function Projects() {
  const root = useRef<HTMLElement>(null);

  // Rolar para revelar: cada cartão sobe "afundado" no painel e se ergue. A captura fica sempre
  // nítida e colorida: ela é a prova, então não pode aparecer borrada para quem rola rápido.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          tres: "(min-width: 1024px)",
          duas: "(min-width: 768px)",
        },
        (ctx) => {
          const { motion, tres, duas } = ctx.conditions as Record<string, boolean>;
          if (!motion) return;
          const colunas = tres ? 3 : duas ? 2 : 1;

          gsap.utils.toArray<HTMLElement>(".pj-item").forEach((item, i) => {
            const q = gsap.utils.selector(item);
            // Colunas da direita começam mais baixas: a fileira entra em cascata.
            const desce = 60 + (i % colunas) * 45;
            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: item, start: "top 96%", end: "top 50%", scrub: 0.6 },
            });
            tl.fromTo(item, { y: desce, opacity: 0.4 }, { y: 0, opacity: 1 }, 0)
              .fromTo(q(".nm-pressed"), { opacity: 1 }, { opacity: 0 }, 0.25)
              .fromTo(q(".nm-raised"), { opacity: 0 }, { opacity: 1 }, 0.25)
              .fromTo(q(".pj-shot"), { scale: 1.06 }, { scale: 1 }, 0);
          });
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} id="projetos" className="section-border relative overflow-hidden py-24 md:py-32">
      <CursorLens grid={0.12} />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="nm-panel relative rounded-[2rem] px-4 pb-8 pt-12 sm:px-8 md:rounded-[2.5rem] md:px-12 md:pb-14 md:pt-16">
          <GlassLogo className="pointer-events-none absolute hidden lg:-top-24 lg:right-10 lg:block lg:h-72 lg:w-72" />

          <Reveal>
            <div className="max-w-2xl">
              <p className="text-[13px] font-medium tracking-[0.02em] text-gold">Sites no ar</p>
              <h2 className="mt-4 font-[var(--font-display)] text-[2.1rem] font-light leading-[1.05] sm:text-5xl lg:text-[3.4rem]">
                Não acredite na gente. Abra os sites e teste.
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted">
                Todos estão no ar. Clique em qualquer um e navegue como se fosse um cliente, de preferência pelo celular.
              </p>
            </div>
          </Reveal>

          {/* Linha com um degrau, apontando para o objeto */}
          <div aria-hidden className="mt-10 flex items-start md:mt-12">
            <div className="h-px flex-1 bg-gradient-to-r from-white/5 to-white/15" />
            <svg width="26" height="10" viewBox="0 0 26 10" className="shrink-0">
              <path d="M0 0.5 C8 0.5 10 9.5 18 9.5 H26" fill="none" stroke="rgba(255,255,255,0.15)" />
            </svg>
            <div className="mt-[9px] h-px w-1/3 bg-gradient-to-r from-white/15 to-transparent" />
          </div>

          <ul className="mt-10 grid gap-x-6 gap-y-10 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <ProjectCard key={p.title} p={p} i={i} />
            ))}
          </ul>

          {/* Pedido de orçamento logo depois da prova */}
          <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-white/10 pt-8 md:flex-row md:items-center">
            <div>
              <p className="font-[var(--font-display)] text-xl md:text-2xl">Quer um site assim para o seu negócio?</p>
              <p className="mt-1 text-sm text-muted">Conte o que você faz e receba valor e prazo, sem compromisso.</p>
            </div>
            <Magnetic strength={0.2}>
              <a
                href={whatsappLink(budgetMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shine inline-flex items-center justify-center rounded-lg bg-gold px-6 py-3.5 text-sm font-semibold text-background transition-[background-color,box-shadow] hover:bg-gold-light hover:shadow-[0_0_28px_rgba(212,169,74,0.4)]"
              >
                Pedir orçamento no WhatsApp
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
