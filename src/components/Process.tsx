import { whatsappLink, budgetMessage } from "@/lib/whatsapp";
import Reveal from "./Reveal";

const steps = [
  { title: "Você conta o projeto", text: "Chama no WhatsApp e explica o que o seu negócio faz e o que quer no site." },
  { title: "Você recebe valor e prazo", text: "Proposta com preço e data de entrega, sem compromisso e antes de fechar." },
  { title: "Design e código sob medida", text: "Sem template pronto. Você acompanha e fala direto com quem faz o site." },
  { title: "O site vai ao ar", text: "Domínio, hospedagem e publicação. Depois, ajustes e suporte." },
];

export default function Process() {
  return (
    <section id="como-funciona" className="section-border relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="mb-3 text-[13px] font-medium tracking-[0.02em] text-gold">Como funciona</p>
          <h2 className="max-w-xl font-[var(--font-display)] text-3xl md:text-4xl">Da primeira mensagem ao site no ar, em cerca de 7 dias</h2>
        </Reveal>

        {/* As quatro etapas sempre visíveis: no computador lado a lado, no celular uma embaixo da outra */}
        <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 0.08} className="glass-card h-full p-6">
                <span className="font-mono text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-[var(--font-display)] text-lg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <a
            href={whatsappLink(budgetMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-gold px-6 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-gold-light"
          >
            Começar pelo passo 1 no WhatsApp
          </a>
          <p className="text-[13px] text-muted">O orçamento não custa nada.</p>
        </div>
      </div>
    </section>
  );
}
