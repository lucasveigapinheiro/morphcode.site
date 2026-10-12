import Image from "next/image";
import { whatsappLink, budgetMessage } from "@/lib/whatsapp";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";

export default function Contact() {
  return (
    <section id="contato" className="py-24 relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[640px] rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }}
      />
      <div className="hud-frame glass-strong relative mx-auto w-[calc(100%-4rem)] max-w-3xl rounded-3xl px-5 py-12 text-center md:w-full md:px-6 md:py-20">
        <Reveal>
          <p className="text-[13px] font-medium tracking-[0.02em] text-gold mb-4">Contato</p>
          <h2 className="font-[var(--font-display)] text-3xl md:text-5xl leading-tight">
            Quer o seu site no ar em <span className="gold-gradient-text">7 dias?</span>
          </h2>
          <p className="mt-5 text-muted max-w-md mx-auto">
            Conte pelo WhatsApp o que o seu negócio faz. Você recebe o valor e o prazo, sem compromisso.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Magnetic strength={0.2}>
            <a
              href={whatsappLink(budgetMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-8 py-3.5 text-sm font-medium text-background transition-[background-color,box-shadow] hover:bg-gold-light hover:shadow-[0_0_32px_rgba(212,169,74,0.45)]"
            >
              Pedir orçamento no WhatsApp
            </a>
          </Magnetic>
          <Magnetic strength={0.2}>
            <a
              href="mailto:morphcode.dev@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-8 py-3.5 text-sm font-medium hover:border-gold transition-colors"
            >
              morphcode.dev@gmail.com
            </a>
          </Magnetic>
        </Reveal>
      </div>

      <footer className="mt-24 border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.jpeg" alt="Morph Code" width={28} height={28} className="rounded-full" />
            <span className="font-[var(--font-display)] text-sm tracking-wide">
              MORPH <span className="text-gold">CODE</span>
            </span>
          </div>
          <p className="text-xs text-muted text-center">
            Código que vira resultado. © {new Date().getFullYear()} Morph Code. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-5 text-xs text-muted">
            <a href={whatsappLink(budgetMessage)} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
              WhatsApp
            </a>
            <a href="mailto:morphcode.dev@gmail.com" className="hover:text-gold">
              E-mail
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}
