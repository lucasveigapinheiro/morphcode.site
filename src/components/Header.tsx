"use client";

import Link from "next/link";
import MorphLogo from "./MorphLogo";
import { useEffect, useState } from "react";
import { whatsappLink, budgetMessage } from "@/lib/whatsapp";
import Magnetic from "./Magnetic";

const links = [
  { href: "/#produto", label: "Morph Clínica" },
  { href: "/#projetos", label: "Sites no ar" },
  { href: "/#servicos", label: "O que você recebe" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#duvidas", label: "Dúvidas" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-background/95 border-b border-white/10 md:bg-background/60 md:backdrop-blur-xl md:backdrop-saturate-150" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 h-18 py-3 flex items-center justify-between">
        <Link href="/#topo" className="flex items-center gap-2.5">
          <MorphLogo glow={false} className="h-10 w-10 shrink-0" label="Morph Code" />
          <span className="font-[var(--font-display)] text-lg tracking-wide">
            MORPH <span className="text-gold">CODE</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative py-1 hover:text-foreground transition-colors group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-[width] duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <Magnetic strength={0.2} className="hidden md:block">
          <a
            href={whatsappLink(budgetMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-medium text-background hover:bg-gold-light transition-colors"
          >
            Pedir orçamento
          </a>
        </Magnetic>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-foreground p-2"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="menu-mobile"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div id="menu-mobile" className="md:hidden border-t border-border bg-background px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-muted hover:text-foreground text-sm"
            >
              {l.label}
            </a>
          ))}
          <a
            href={whatsappLink(budgetMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-medium text-background"
          >
            Pedir orçamento
          </a>
        </div>
      )}
    </header>
  );
}
