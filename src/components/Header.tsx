"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { whatsappLink, budgetMessage } from "@/lib/whatsapp";
import Magnetic from "./Magnetic";

const links = [
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#projetos", label: "Projetos" },
  { href: "#duvidas", label: "Dúvidas" },
  { href: "#contato", label: "Contato" },
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
        scrolled ? "bg-background/90 backdrop-blur border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 h-18 py-3 flex items-center justify-between">
        <a href="#topo" className="flex items-center gap-2.5">
          <Image
            src="/logo.jpeg"
            alt="Morph Code"
            width={36}
            height={36}
            className="rounded-full"
            priority
          />
          <span className="font-[var(--font-display)] text-lg tracking-wide">
            MORPH<span className="text-gold">.CODE</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative hover:text-foreground transition-colors group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <Magnetic strength={0.2} className="hidden md:block">
          <a
            href={whatsappLink(budgetMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-background hover:bg-gold-light transition-colors"
          >
            Pedir orçamento
          </a>
        </Magnetic>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-foreground p-2"
          aria-label="Abrir menu"
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
        <div className="md:hidden border-t border-border bg-background px-6 py-4 flex flex-col gap-4">
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
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-background"
          >
            Pedir orçamento
          </a>
        </div>
      )}
    </header>
  );
}
