"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LuCheck } from "react-icons/lu";
import { SiHtml5, SiCss, SiJavascript, SiTailwindcss } from "react-icons/si";
import type { IconType } from "react-icons";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";

const TECH_ICONS: Record<string, { Icon: IconType; color: string }> = {
  HTML5: { Icon: SiHtml5, color: "#E34F26" },
  CSS3: { Icon: SiCss, color: "#1572B6" },
  JavaScript: { Icon: SiJavascript, color: "#F7DF1E" },
  "Tailwind CSS": { Icon: SiTailwindcss, color: "#38BDF8" },
};

gsap.registerPlugin(useGSAP, ScrollTrigger);
// No celular a barra de endereço do navegador some e volta ao rolar; sem isso a seção fixa "treme".
ScrollTrigger.config({ ignoreMobileResize: true });

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
      "Site para uma estética automotiva da Zona Norte de São Paulo que atende de carros populares a Porsche e Ferrari. Mostramos os serviços, os carros que já passaram pelo box, as avaliações do Google e as dúvidas frequentes, com orçamento direto pelo WhatsApp. Fizemos também o domínio próprio, o SEO local e a indexação no Google, para o negócio aparecer para quem busca na região.",
    href: "https://2bestéticaautomotiva.com.br/",
    image: "/projects/2b-estetica.jpg",
    techs: ["HTML5", "CSS3", "JavaScript"],
  },
  {
    title: "GMG Equilíbrio",
    category: "Landing page",
    description:
      "Landing page de vendas para suplemento em cápsulas, com identidade visual sofisticada, seções de ativos, benefícios, depoimentos e oferta, construída pra converter visitantes em compradores.",
    href: "https://gmg-site-beta.vercel.app/",
    image: "/projects/gmg-site.jpg",
    techs: ["HTML5", "Tailwind CSS", "JavaScript"],
  },
  {
    title: "Sistema de Ordens de Serviço",
    category: "Sistema sob medida",
    description:
      "Uma oficina mecânica que ainda controlava tudo no papel e em planilhas soltas. Desenvolvemos um sistema completo de ordens de serviço para organizar entrada de veículos, orçamentos, status de reparo e histórico de clientes em um único lugar, reduzindo retrabalho e dando mais controle ao dono do negócio.",
    href: "https://lucasveigapinheiro.github.io/sistemaos/",
    image: "/projects/sistema-os.jpg",
    techs: ["HTML5", "CSS3", "JavaScript"],
  },
  {
    title: "Site para Oficina Mecânica",
    category: "Site institucional",
    description:
      "Criamos uma vitrine digital para os serviços da oficina, com identidade visual própria e apresentação clara do que é oferecido. O destaque fica para a integração rápida com o botão de WhatsApp, que leva o visitante direto para um orçamento, sem formulários, sem fricção.",
    href: "https://lucasveigapinheiro.github.io/MecanicaRossi/",
    image: "/projects/mecanica-rossi.jpg",
    techs: ["HTML5", "CSS3", "JavaScript"],
  },
  {
    title: "Sistema para Clínica Estética",
    category: "Sistema sob medida",
    description:
      "Painel de gestão para uma clínica estética, com visão geral do dia, cadastro e histórico de pacientes, agenda de consultas e configurações, tudo em uma interface elegante, pensada para o dia a dia da doutora e da recepção.",
    href: "https://paty-clinica.vercel.app/pages/dashboard.html",
    image: "/projects/labessie.jpg",
    techs: ["HTML5", "CSS3", "JavaScript"],
  },
  {
    title: "Orçamento Pessoal",
    category: "Aplicativo web",
    description:
      "Uma planilha de gastos transformada em aplicativo web, com login e cadastro de usuário para manter os dados de cada pessoa separados. Depois de entrar, o usuário acompanha renda prevista e realizada, total de receitas, despesas e saldo final mês a mês, tudo salvo automaticamente.",
    href: "https://lucasveigapinheiro.github.io/planilha-de-gastos",
    image: "/projects/orcamento-pessoal-v2.jpg",
    techs: ["HTML5", "Tailwind CSS", "JavaScript"],
  },
];


// Etapas do processo de cada projeto. Todo o texto vem da descrição real do projeto.
const ETAPAS = ["Briefing", "Estrutura", "Design", "No ar"] as const;

const etapasPorProjeto: Record<string, string[]> = {
  "2B Estética Automotiva": [
    "Estética automotiva da Zona Norte de São Paulo, que atende de carros populares a Porsche e Ferrari.",
    "Serviços, carros que já passaram pelo box, avaliações do Google e dúvidas frequentes.",
    "Orçamento direto pelo WhatsApp, em cada parte da página.",
    "Domínio próprio, SEO local e indexação no Google para aparecer para quem busca na região.",
  ],
  "Sistema de Ordens de Serviço": [
    "Uma oficina mecânica que controlava tudo no papel e em planilhas soltas.",
    "Entrada de veículos, orçamentos, status de reparo e histórico de clientes.",
    "Tudo reunido em um único lugar.",
    "Menos retrabalho e mais controle para o dono do negócio.",
  ],
  "Site para Oficina Mecânica": [
    "Uma vitrine digital para os serviços da oficina.",
    "Apresentação clara do que a oficina oferece.",
    "Identidade visual própria para a marca da oficina.",
    "Botão de WhatsApp que leva o visitante direto ao orçamento, sem formulários.",
  ],
  "Sistema para Clínica Estética": [
    "Painel de gestão para uma clínica estética.",
    "Visão geral do dia, cadastro e histórico de pacientes, agenda de consultas e configurações.",
    "Interface elegante, pensada para o dia a dia.",
    "Feito para a doutora e para a recepção.",
  ],
  "Orçamento Pessoal": [
    "Uma planilha de gastos que virou aplicativo web.",
    "Login e cadastro de usuário, para manter os dados de cada pessoa separados.",
    "Renda prevista e realizada, total de receitas, despesas e saldo final, mês a mês.",
    "Tudo salvo automaticamente.",
  ],
  "GMG Equilíbrio": [
    "Landing page de vendas para suplemento em cápsulas.",
    "Seções de ativos, benefícios, depoimentos e oferta.",
    "Identidade visual sofisticada.",
    "Construída para converter visitantes em compradores.",
  ],
};

// O scrollytelling conta a história dos três primeiros; o resumo mostra todos.
const HISTORIA = projects.slice(0, 3);

// Scrollytelling em qualquer tela; com "reduzir movimento" ativo, cai na lista simples.
const QUERY_PINADO = "(prefers-reduced-motion: no-preference)";

function assinar(avisar: () => void) {
  const mq = window.matchMedia(QUERY_PINADO);
  mq.addEventListener("change", avisar);
  return () => mq.removeEventListener("change", avisar);
}
const lerPinado = () => window.matchMedia(QUERY_PINADO).matches;

function ProjectImage({ title, image }: { title: string; image: string }) {
  return (
    <div className="hud-frame group relative aspect-video w-full">
      <div className="glass relative h-full w-full overflow-hidden rounded-xl p-1.5">
        <div className="relative h-full w-full overflow-hidden rounded-lg bg-surface-2">
          <Image
            src={image}
            alt={title}
            fill
            draggable={false}
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            quality={90}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
}

function VerProjeto({ href }: { href: string }) {
  return (
    <Magnetic strength={0.2} className="inline-block">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-shine inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-7 py-3 text-sm font-medium text-background transition-[background-color,box-shadow] hover:bg-gold-light hover:shadow-[0_0_28px_rgba(212,169,74,0.4)]"
      >
        Ver projeto completo
      </a>
    </Magnetic>
  );
}

function Techs({ techs }: { techs: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {techs.map((tech) => {
        const entry = TECH_ICONS[tech];
        if (!entry) return null;
        const { Icon, color } = entry;
        return (
          <span key={tech} title={tech} className="flex items-center gap-2 text-xs text-muted">
            <Icon size={18} color={color} />
            {tech}
          </span>
        );
      })}
    </div>
  );
}

/* ---------- Mobile, tablet e "reduzir movimento": lista simples ---------- */
function ProjetosLista() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <p className="mb-4 text-[13px] font-medium tracking-[0.02em] text-gold">Projetos</p>
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl max-w-xl">Alguns trabalhos que já colocamos no ar</h2>
      </Reveal>
      <div className="mt-16 flex flex-col gap-20">
        {projects.map((p, i) => (
          <div key={p.title} className={`flex flex-col items-center gap-8 md:gap-12 ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"}`}>
            <Reveal className="w-full md:w-1/2" delay={0.05}>
              <ProjectImage title={p.title} image={p.image} />
            </Reveal>
            <Reveal className="w-full md:w-1/2" delay={0.15}>
              <p className="text-xs uppercase tracking-wide text-gold">{p.category}</p>
              <h3 className="mt-2 font-[var(--font-display)] text-2xl md:text-3xl">{p.title}</h3>
              <p className="mt-5 leading-relaxed text-muted">{p.description}</p>
              <div className="mt-6">
                <Techs techs={p.techs} />
              </div>
              <div className="mt-8">
                <VerProjeto href={p.href} />
              </div>
            </Reveal>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Desktop: scrollytelling. A seção fica fixa e a rolagem conta a história de cada projeto ---------- */
function ProjetosPinados() {
  const total = HISTORIA.length;

  return (
    <div className="pj-stage relative h-[100svh] w-full overflow-hidden">
      {/* Parallax de fundo: o logo grande sobe e gira devagar enquanto você rola */}
      <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="pj-logo-far absolute h-[78vmin] w-[78vmin] rounded-full opacity-[0.1] mix-blend-screen">
          <Image src="/logo.jpeg" alt="" fill sizes="80vmin" className="object-contain" draggable={false} />
        </div>
        <div className="pj-logo-near absolute -right-[8vmin] bottom-[-14vmin] h-[46vmin] w-[46vmin] rounded-full opacity-[0.16] mix-blend-screen">
          <Image src="/logo.jpeg" alt="" fill sizes="50vmin" className="object-contain" draggable={false} />
        </div>
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 55% at 50% 50%, transparent 40%, var(--background) 100%)" }}
        />
      </div>

      {/* Cabeçalho da seção e contador */}
      <div className="absolute inset-x-0 top-20 z-20 md:top-24">
        <div className="mx-auto flex max-w-6xl items-end justify-between px-4 md:px-6">
          <div className="hidden md:block">
            <p className="text-[13px] font-medium tracking-[0.02em] text-gold">Projetos</p>
            <h2 className="mt-1 font-[var(--font-display)] text-lg md:text-2xl xl:text-3xl">Veja como três projetos foram construídos</h2>
          </div>
          <p className="ml-auto font-mono text-sm text-muted">
            <span className="pj-count text-2xl text-foreground">01</span> / {String(total).padStart(2, "0")}
          </p>
        </div>
      </div>

      {HISTORIA.map((p, i) => (
        <article
          key={p.title}
          className="pj-panel absolute inset-0 flex items-center justify-center px-3 pb-28 pt-28 md:px-6 md:pb-20 md:pt-44"
          aria-label={`Projeto ${i + 1} de ${total}: ${p.title}`}
        >
          <div className="pj-card glass-strong grid w-full max-w-6xl grid-cols-1 items-center gap-4 rounded-3xl p-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10 lg:p-8 xl:p-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-gold">{p.category}</p>
              <h3 className="mt-1 font-[var(--font-display)] text-xl lg:mt-2 lg:text-3xl xl:text-4xl">{p.title}</h3>

              <ol className="mt-3 space-y-2 lg:mt-6 lg:space-y-3">
                {ETAPAS.map((nome, k) => (
                  <li key={nome} className="pj-step flex gap-4 opacity-35">
                    <span className="pj-dot mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/20 font-mono text-[10px] text-muted transition-colors duration-300">
                      <span className="pj-num">{k + 1}</span>
                      <LuCheck className="pj-check hidden h-3 w-3" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{nome}</p>
                      <div className="pj-txt">
                        <p className="overflow-hidden pt-0.5 text-sm leading-relaxed text-foreground/90">{etapasPorProjeto[p.title][k]}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-white/10 lg:mt-6">
                <div
                  className="pj-bar h-full origin-left rounded-full bg-gradient-to-r from-gold to-gold-light shadow-[0_0_12px_rgba(212,169,74,0.7)]"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-5 lg:mt-6">
                <VerProjeto href={p.href} />
                <div className="hidden lg:block">
                  <Techs techs={p.techs} />
                </div>
              </div>
            </div>

            {/* O site se constrói: esqueleto, linha de varredura e a captura real */}
            <div className="pj-frame hud-frame relative order-first aspect-[16/10] w-full lg:order-none lg:aspect-video">
              <div className="glass relative h-full w-full overflow-hidden rounded-xl p-1.5">
                <div className="relative h-full w-full overflow-hidden rounded-lg bg-surface-2">
                  <div className="pj-shot absolute inset-0 will-change-[clip-path,filter,transform]">
                    <Image src={p.image} alt={p.title} fill priority={i === 0} draggable={false} className="object-cover object-top" quality={90} sizes="(max-width: 1023px) 100vw, 55vw" />
                  </div>
                  <div aria-hidden className="pj-skeleton pointer-events-none absolute inset-0 p-[4%]">
                    <div className="pj-sk flex items-center justify-between">
                      <div className="h-3 w-[16%] rounded-full bg-white/15" />
                      <div className="flex w-[38%] justify-between">
                        <div className="h-2 w-[22%] rounded-full bg-white/10" />
                        <div className="h-2 w-[22%] rounded-full bg-white/10" />
                        <div className="h-2 w-[22%] rounded-full bg-white/10" />
                      </div>
                    </div>
                    <div className="mt-[7%] grid grid-cols-[1.1fr_0.9fr] gap-[5%]">
                      <div>
                        <div className="pj-sk h-5 w-[92%] rounded-md bg-white/20" />
                        <div className="pj-sk mt-3 h-5 w-[70%] rounded-md bg-white/20" />
                        <div className="pj-sk mt-6 h-2 w-[88%] rounded-full bg-white/10" />
                        <div className="pj-sk mt-2 h-2 w-[76%] rounded-full bg-white/10" />
                        <div className="pj-sk mt-7 h-8 w-[34%] rounded-lg bg-gold/40" />
                      </div>
                      <div className="pj-sk aspect-[4/3] rounded-xl bg-white/10" />
                    </div>
                    <div className="mt-[6%] grid grid-cols-3 gap-[3%]">
                      <div className="pj-sk h-14 rounded-lg bg-white/10" />
                      <div className="pj-sk h-14 rounded-lg bg-white/10" />
                      <div className="pj-sk h-14 rounded-lg bg-white/10" />
                    </div>
                  </div>
                  <div
                    aria-hidden
                    className="pj-scan pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-0"
                    style={{ background: "linear-gradient(90deg, transparent, #e8c876 20%, #fff 50%, #e8c876 80%, transparent)", boxShadow: "0 0 18px 4px rgba(232,200,118,0.65), 0 -26px 60px 10px rgba(212,169,74,0.18)" }}
                  />
                  <span className="pj-live absolute bottom-3 right-3 inline-flex lg:bottom-auto lg:right-4 lg:top-4 items-center gap-1.5 rounded-full border border-[#25d366]/40 bg-black/50 px-3 py-1 font-mono text-[10px] text-[#7dffa8] opacity-0 backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#25d366] shadow-[0_0_8px_#25d366]" /> no ar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}

      {/* Trilho inferior: um segmento por projeto */}
      <div className="absolute inset-x-0 bottom-4 z-20 md:bottom-8">
        <div className="mx-auto flex max-w-6xl gap-2 px-4 md:px-6">
          {HISTORIA.map((p, i) => (
            <div key={p.title} className="flex-1">
              <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
                <div className="pj-seg h-full origin-left bg-gold" style={{ transform: "scaleX(0)" }} />
              </div>
              <p className="pj-seg-label mt-2 hidden truncate font-mono text-[10px] text-muted/60 xl:block">
                {String(i + 1).padStart(2, "0")} {p.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Resumo: aparece depois que a história foi vista, para voltar sem rolar tudo de novo ---------- */
function ProjetosResumo({ onRever }: { onRever: () => void }) {
  return (
    <div className="pj-fade relative flex min-h-[100svh] items-center justify-center overflow-hidden px-3 pb-16 pt-24 md:px-6 md:pt-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="absolute h-[78vmin] w-[78vmin] rounded-full opacity-[0.08] mix-blend-screen">
          <Image src="/logo.jpeg" alt="" fill sizes="80vmin" className="object-contain" draggable={false} />
        </div>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 55% at 50% 50%, transparent 40%, var(--background) 100%)" }} />
      </div>

      <div className="pj-card glass-strong relative w-full max-w-6xl rounded-3xl p-4 lg:p-8 xl:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium tracking-[0.02em] text-gold">Projetos</p>
            <h2 className="mt-1 font-[var(--font-display)] text-2xl xl:text-3xl">Todos os projetos no ar</h2>
          </div>
          <button
            type="button"
            onClick={onRever}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-foreground transition-colors hover:border-gold/60 hover:text-gold"
          >
            Rever como foram construídos
          </button>
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-3 lg:mt-8 lg:grid-cols-3 lg:gap-5">
          {projects.map((p) => (
            <li key={p.title}>
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="glass-card group block p-3">
                <div className="relative aspect-video overflow-hidden rounded-lg bg-surface-2">
                  <Image src={p.image} alt={p.title} fill sizes="(max-width: 1023px) 50vw, 33vw" quality={90} draggable={false} className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                </div>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-wide text-gold">{p.category}</p>
                <p className="mt-1 font-[var(--font-display)] text-base">{p.title}</p>
                <p className="mt-1 text-xs text-muted transition-colors group-hover:text-gold">Ver projeto completo →</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const pinado = useSyncExternalStore(assinar, lerPinado, () => false);
  const [concluido, setConcluido] = useState(false);
  // Altura da seção antes de virar resumo (px); serve para recuar a rolagem na troca.
  const alturaAntes = useRef(0);

  useGSAP(
    () => {
      if (!pinado) return;
      if (concluido) {
        // Recalcula os outros gatilhos e SÓ DEPOIS recua a rolagem: o refresh restauraria a posição
        // antiga e jogaria o leitor para o fim da página.
        ScrollTrigger.refresh();
        if (alturaAntes.current && root.current) {
          const encolheu = alturaAntes.current - root.current.offsetHeight;
          alturaAntes.current = 0;
          if (encolheu > 0) window.scrollTo(0, Math.max(0, window.scrollY - encolheu));
          ScrollTrigger.update();
        }
        return;
      }
      const stage = root.current?.querySelector<HTMLElement>(".pj-stage");
      if (!stage) return;

      const panels = gsap.utils.toArray<HTMLElement>(".pj-panel", stage);
      const count = panels.length;
      const countEl = stage.querySelector<HTMLElement>(".pj-count");
      const segs = stage.querySelectorAll(".pj-seg");
      const labels = stage.querySelectorAll(".pj-seg-label");

      gsap.set(panels, { autoAlpha: 0 });
      gsap.set(panels[0], { autoAlpha: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 1.25 * count)}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        // Cada etapa acende em 0%, 25%, 50% e 75% do projeto, calculado a partir da posição na
        // linha do tempo: funciona igual rolando para baixo ou para cima.
        onUpdate: () => {
          const t = tl.time();
          if (countEl) countEl.textContent = String(Math.min(count, Math.floor(t + 0.05) + 1)).padStart(2, "0");
          panels.forEach((panel, i) => {
            const p = Math.min(1, Math.max(0, (t - (i + 0.1)) / 0.7));
            const items = panel.querySelectorAll<HTMLElement>(".pj-step");
            const ativa = p <= 0 ? -1 : Math.min(items.length - 1, Math.floor(p * items.length));
            items.forEach((el, k) => {
              el.classList.toggle("is-on", k === ativa && p < 1);
              el.classList.toggle("is-done", k < ativa || (p >= 1 && k <= ativa));
            });
          });
        },
      });

      // Parallax: o logo grande e o pequeno andam em velocidades diferentes do conteúdo.
      tl.fromTo(".pj-logo-far", { yPercent: 18, rotation: -10, scale: 0.92 }, { yPercent: -18, rotation: 10, scale: 1.08, duration: count }, 0)
        .fromTo(".pj-logo-near", { yPercent: 40, rotation: 20 }, { yPercent: -40, rotation: -20, duration: count }, 0);

      panels.forEach((panel, i) => {
        const q = gsap.utils.selector(panel);
        const shot = q(".pj-shot")[0] as HTMLElement;
        const frame = shot.parentElement as HTMLElement;
        const b = i + 0.1;
        const d = 0.7;

        // Entrada (o primeiro painel já começa visível)
        if (i > 0) {
          tl.fromTo(panel, { autoAlpha: 0, yPercent: 5 }, { autoAlpha: 1, yPercent: 0, duration: 0.1, ease: "power2.out" }, i);
        }

        // Construção do site, presa à rolagem: esqueleto, linha de varredura e revelação da captura.
        tl.fromTo(q(".pj-sk"), { opacity: 0, scaleX: 0.2, transformOrigin: "0% 50%" }, { opacity: 1, scaleX: 1, duration: d * 0.3, stagger: 0.015 }, b)
          .fromTo(q(".pj-scan"), { opacity: 1, y: 0 }, { opacity: 1, y: () => frame.clientHeight, duration: d * 0.55 }, b + d * 0.3)
          .fromTo(
            shot,
            { clipPath: "inset(0 0 100% 0)", filter: "blur(12px) grayscale(1) brightness(0.75)", scale: 1.07, transformOrigin: "50% 0%" },
            { clipPath: "inset(0 0 0% 0)", filter: "blur(0px) grayscale(0) brightness(1)", scale: 1, duration: d * 0.6 },
            b + d * 0.3
          )
          .fromTo(q(".pj-skeleton"), { opacity: 1 }, { opacity: 0, duration: d * 0.4 }, b + d * 0.45)
          .to(q(".pj-scan"), { opacity: 0, duration: d * 0.05 }, b + d * 0.86)
          .fromTo(q(".pj-live"), { opacity: 0 }, { opacity: 1, duration: d * 0.1 }, b + d * 0.9)
          .fromTo(q(".pj-bar"), { scaleX: 0 }, { scaleX: 1, duration: d }, b)
          .fromTo(segs[i], { scaleX: 0 }, { scaleX: 1, duration: d + 0.1 }, b);
        if (labels[i]) tl.to(labels[i], { color: "#e8c876", duration: 0.05 }, b);

        // Saída (o último painel fica até o fim)
        if (i < count - 1) {
          tl.to(panel, { autoAlpha: 0, yPercent: -5, duration: 0.1, ease: "power2.in" }, i + 0.92);
        }
      });

      tl.to({}, { duration: 0.12 }); // respiro no fim

      // Depois que a seção inteira saiu da tela, ela vira o resumo de uma tela só. Quem voltar
      // rolando para cima passa por ele direto, sem refazer o scrollytelling.
      const st = tl.scrollTrigger;
      ScrollTrigger.create({
        trigger: root.current,
        // Dispara logo depois que a rolagem fixa termina, para a volta ser curta.
        start: "bottom 75%",
        onEnter: () => {
          // Desfaz o "pin" do GSAP ANTES do React trocar o conteúdo (senão o React não acha o nó).
          alturaAntes.current = root.current?.offsetHeight ?? 0;
          st?.kill(true);
          tl.kill();
          setConcluido(true);
        },
      });
    },
    { scope: root, dependencies: [pinado, concluido], revertOnUpdate: true }
  );

  return (
    <section ref={root} id="projetos" className="section-border relative bg-surface/30">
      {pinado ? concluido ? <ProjetosResumo onRever={() => setConcluido(false)} /> : <ProjetosPinados /> : <ProjetosLista />}
    </section>
  );
}
