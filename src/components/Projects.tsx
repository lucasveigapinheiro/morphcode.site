"use client";

import Image from "next/image";
import { motion } from "motion/react";
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
    title: "Sistema de Ordens de Serviço",
    category: "Sistema sob medida",
    description:
      "Uma oficina mecânica que ainda controlava tudo no papel e em planilhas soltas. Desenvolvemos um sistema completo de ordens de serviço para organizar entrada de veículos, orçamentos, status de reparo e histórico de clientes em um único lugar — reduzindo retrabalho e dando mais controle ao dono do negócio.",
    href: "https://lucasveigapinheiro.github.io/sistemaos/",
    image: "/projects/sistema-os.jpg",
    techs: ["HTML5", "CSS3", "JavaScript"],
  },
  {
    title: "Site para Oficina Mecânica",
    category: "Site institucional",
    description:
      "Criamos uma vitrine digital para os serviços da oficina, com identidade visual própria e apresentação clara do que é oferecido. O destaque fica para a integração rápida com o botão de WhatsApp, que leva o visitante direto para um orçamento — sem formulários, sem fricção.",
    href: "https://lucasveigapinheiro.github.io/MecanicaRossi/",
    image: "/projects/mecanica-rossi.jpg",
    techs: ["HTML5", "CSS3", "JavaScript"],
  },
  {
    title: "Sistema para Clínica Estética",
    category: "Sistema sob medida",
    description:
      "Painel de gestão para uma clínica estética, com visão geral do dia, cadastro e histórico de pacientes, agenda de consultas e configurações — tudo em uma interface elegante, pensada para o dia a dia da doutora e da recepção.",
    href: "https://labessie-clinica.vercel.app/",
    image: "/projects/labessie.jpg",
    techs: ["HTML5", "CSS3", "JavaScript"],
  },
  {
    title: "Orçamento Pessoal",
    category: "Aplicativo web",
    description:
      "Uma planilha de gastos transformada em aplicativo web, com login e cadastro de usuário para manter os dados de cada pessoa separados. Depois de entrar, o usuário acompanha renda prevista e realizada, total de receitas, despesas e saldo final mês a mês — tudo salvo automaticamente.",
    href: "https://lucasveigapinheiro.github.io/planilha-de-gastos",
    image: "/projects/orcamento-pessoal-v2.jpg",
    techs: ["HTML5", "Tailwind CSS", "JavaScript"],
  },
];

function ProjectImage({ title, image, delay = 0 }: { title: string; image: string; delay?: number }) {
  return (
    <motion.div
      drag
      dragConstraints={{ top: -40, bottom: 40, left: -40, right: 40 }}
      dragElastic={0.5}
      dragTransition={{ bounceStiffness: 250, bounceDamping: 15 }}
      whileDrag={{ scale: 1.04, rotate: 0, cursor: "grabbing" }}
      initial={{ opacity: 0, scale: 0.94, rotate: 2 }}
      whileInView={{ opacity: 1, scale: 1, rotate: [2, -1, 2], y: [0, -12, 0] }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        opacity: { duration: 0.8, delay },
        scale: { duration: 0.8, delay },
        rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: delay + 0.8 },
        y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: delay + 0.8 },
      }}
      className="relative aspect-video w-full cursor-grab active:cursor-grabbing select-none"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-surface-2 shadow-2xl shadow-black/40">
        <Image
          src={image}
          alt={title}
          fill
          draggable={false}
          className="object-cover object-top pointer-events-none"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projetos" className="section-border py-24 bg-surface/40">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-xs tracking-[0.25em] text-gold uppercase mb-4">Projetos</p>
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl max-w-xl">
            Alguns trabalhos que já colocamos no ar
          </h2>
        </Reveal>

        <div className="mt-16 flex flex-col gap-20">
          {projects.map((p, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={p.title}
                className={`flex flex-col gap-8 md:gap-12 items-center ${
                  reversed ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                <Reveal className="w-full md:w-1/2" delay={0.05}>
                  <ProjectImage title={p.title} image={p.image} delay={i * 0.3} />
                </Reveal>

                <Reveal className="w-full md:w-1/2" delay={0.15}>
                  <p className="text-xs text-gold uppercase tracking-wide">{p.category}</p>
                  <h3 className="mt-2 font-[var(--font-display)] text-2xl md:text-3xl">
                    {p.title}
                  </h3>
                  <p className="mt-5 text-muted leading-relaxed">{p.description}</p>

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    {p.techs.map((tech) => {
                      const entry = TECH_ICONS[tech];
                      if (!entry) return null;
                      const { Icon, color } = entry;
                      return (
                        <span
                          key={tech}
                          title={tech}
                          className="flex items-center gap-2 text-xs text-muted"
                        >
                          <Icon size={18} color={color} />
                          {tech}
                        </span>
                      );
                    })}
                  </div>

                  <Magnetic strength={0.2} className="inline-block mt-8">
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-medium text-background hover:bg-gold-light transition-colors"
                    >
                      Ver Projeto Completo
                    </a>
                  </Magnetic>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
