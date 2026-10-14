"use client";

import { LuGlobe, LuMessageCircle, LuPenTool, LuSearch, LuSmartphone, LuWrench } from "react-icons/lu";
import Link from "next/link";
import Reveal from "./Reveal";

// O que vem no site, escrito pelo lado de quem compra: o que cada item faz pelo negócio.
const itens = [
  { icon: LuMessageCircle, title: "WhatsApp em todas as páginas", text: "O cliente aperta um botão e já cai na sua conversa, sem formulário." },
  { icon: LuSearch, title: "Estrutura para o Google", text: "Páginas organizadas para aparecer para quem busca o seu serviço." },
  { icon: LuSmartphone, title: "Rápido no celular", text: "Feito primeiro para a tela onde o seu cliente está." },
  { icon: LuPenTool, title: "Design da sua marca", text: "Sem template pronto. Cores, fotos e textos do seu negócio." },
  { icon: LuGlobe, title: "Domínio e publicação", text: "Cuidamos do endereço, da hospedagem e de colocar o site no ar." },
  { icon: LuWrench, title: "Suporte depois da entrega", text: "O site no ar não é o fim: você segue falando com quem fez para ajustes." },
];

export default function Services() {
  return (
    <section id="servicos" className="section-border bg-surface/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="mb-3 text-[13px] font-medium tracking-[0.02em] text-gold">O que você recebe</p>
          <h2 className="max-w-2xl font-[var(--font-display)] text-3xl md:text-4xl">Tudo o que o site precisa para trazer cliente, já incluso</h2>
        </Reveal>

        <ul className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {itens.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 0.06} className="flex h-full gap-4 border-t border-white/10 pt-6">
                <s.icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <div>
                  <h3 className="font-medium">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-sm text-muted">
          Veja em detalhe:{" "}
          <Link href="/criacao-de-sites" className="text-foreground underline decoration-gold/50 underline-offset-4 transition-colors hover:text-gold">
            criação de sites
          </Link>
          ,{" "}
          <Link href="/landing-page" className="text-foreground underline decoration-gold/50 underline-offset-4 transition-colors hover:text-gold">
            landing page
          </Link>{" "}
          e{" "}
          <Link href="/sistemas-web" className="text-foreground underline decoration-gold/50 underline-offset-4 transition-colors hover:text-gold">
            sistemas web sob medida
          </Link>
          , como agenda, ordens de serviço e painel de gestão.
        </p>
      </div>
    </section>
  );
}
