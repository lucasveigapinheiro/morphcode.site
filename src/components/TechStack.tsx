"use client";

import { motion } from "motion/react";
import {
  SiReact,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiGit,
  SiGithub,
  SiSqlite,
} from "react-icons/si";
import Reveal from "./Reveal";

const stack = [
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "HTML5", Icon: SiHtml5, color: "#E34F26" },
  { name: "CSS3", Icon: SiCss, color: "#1572B6" },
  { name: "Git", Icon: SiGit, color: "#F05032" },
  { name: "GitHub", Icon: SiGithub, color: "#ffffff" },
  { name: "SQLite", Icon: SiSqlite, color: "#003B57" },
];

export default function TechStack() {
  return (
    <section className="section-border py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-xs tracking-[0.25em] text-gold uppercase mb-4 text-center">
            Tecnologias
          </p>
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl text-center max-w-xl mx-auto">
            Ferramentas que usamos para construir seu projeto
          </h2>
        </Reveal>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-12 gap-y-10">
          {stack.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.06} className="flex flex-col items-center gap-3">
              <motion.div
                whileHover={{ y: -8, scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="h-16 w-16 rounded-2xl border border-border bg-surface flex items-center justify-center"
              >
                <t.Icon size={28} color={t.color} />
              </motion.div>
              <span className="text-xs text-muted">{t.name}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
