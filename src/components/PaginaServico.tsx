import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LuArrowUpRight, LuCheck, LuChevronDown, LuClock } from "react-icons/lu";
import Header from "./Header";
import Reveal from "./Reveal";
import Contact from "./Contact";
import WhatsAppFloat from "./WhatsAppFloat";
import { projects } from "@/lib/projetos";
import { servicos, type Servico } from "@/lib/servicos";
import { whatsappLink } from "@/lib/whatsapp";
import { jsonLd, siteUrl } from "@/lib/site";

export function metadataServico(s: Servico): Metadata {
  const url = `/${s.slug}`;
  return {
    title: s.titulo,
    description: s.descricao,
    alternates: { canonical: url },
    openGraph: { title: s.titulo, description: s.descricao, url, siteName: "Morph Code", locale: "pt_BR", type: "website" },
    twitter: { card: "summary_large_image", title: s.titulo, description: s.descricao },
  };
}

export default function PaginaServico({ s }: { s: Servico }) {
  const exemplos = projects.filter((p) => s.categoriasProjeto.includes(p.category));
  const outros = servicos.filter((o) => o.slug !== s.slug);

  const dados = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: s.nome,
        description: s.descricao,
        url: `${siteUrl}/${s.slug}`,
        provider: { "@id": `${siteUrl}/#empresa` },
        areaServed: { "@type": "Country", name: "Brasil" },
        inLanguage: "pt-BR",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: siteUrl },
          { "@type": "ListItem", position: 2, name: s.nome, item: `${siteUrl}/${s.slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: s.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      <Header />
      <main id="conteudo" className="pb-20 md:pb-0">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(dados)} />

        <section className="relative isolate overflow-hidden pt-32 pb-20 md:pt-40">
          <div aria-hidden className="hud-grid absolute inset-0 -z-10" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-background to-transparent" />

          <div className="mx-auto max-w-6xl px-6">
            <nav aria-label="Você está em" className="font-mono text-[11px] uppercase tracking-wider text-muted">
              <Link href="/" className="hover:text-gold">
                Início
              </Link>
              <span aria-hidden className="mx-2 text-muted/50">
                /
              </span>
              <span aria-current="page" className="text-foreground/85">
                {s.nome}
              </span>
            </nav>

            <h1 className="mt-6 max-w-3xl font-[var(--font-display)] text-[2.2rem] font-semibold leading-[1.06] sm:text-5xl">{s.h1}</h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">{s.intro}</p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <a
                href={whatsappLink(s.mensagem)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shine inline-flex items-center justify-center rounded-lg bg-gold px-6 py-3.5 text-sm font-semibold text-background transition-[background-color,box-shadow] hover:bg-gold-light hover:shadow-[0_0_32px_rgba(212,169,74,0.45)]"
              >
                Pedir orçamento no WhatsApp
              </a>
              <p className="flex items-center gap-2 text-[13px] text-muted">
                <LuClock className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                Prazo: {s.prazo.toLowerCase()}. Valor e prazo antes de fechar.
              </p>
            </div>

            <p className="mt-12 max-w-xl border-t border-white/10 pt-5 text-sm text-foreground/85">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted/80">Para quem é · </span>
              {s.paraQuem}
            </p>
          </div>
        </section>

        <section className="section-border bg-surface/30 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <p className="mb-3 text-[13px] font-medium tracking-[0.02em] text-gold">O que vem incluso</p>
              <h2 className="max-w-2xl font-[var(--font-display)] text-3xl md:text-4xl">{s.nome} com tudo o que precisa para trazer cliente</h2>
            </Reveal>

            <ul className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {s.incluso.map((item, i) => (
                <li key={item.titulo}>
                  <Reveal delay={i * 0.06} className="flex h-full gap-4 border-t border-white/10 pt-6">
                    <LuCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                    <div>
                      <h3 className="font-medium">{item.titulo}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.texto}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {exemplos.length > 0 && (
          <section className="section-border py-24">
            <div className="mx-auto max-w-6xl px-6">
              <Reveal>
                <p className="mb-3 text-[13px] font-medium tracking-[0.02em] text-gold">No ar</p>
                <h2 className="max-w-2xl font-[var(--font-display)] text-3xl md:text-4xl">Abra e teste como se fosse um cliente</h2>
              </Reveal>

              <ul className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {exemplos.map((p) => (
                  <li key={p.title}>
                    <article className="glass-card flex h-full flex-col p-4">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-surface-2">
                        <Image
                          src={p.image}
                          alt={`Tela de ${p.title}`}
                          fill
                          quality={90}
                          sizes="(max-width: 767px) 92vw, (max-width: 1023px) 46vw, 340px"
                          className="object-cover object-top"
                        />
                      </div>
                      <h3 className="mt-5 font-[var(--font-display)] text-lg leading-snug">{p.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex items-center gap-1.5 self-start pt-6 text-sm text-foreground underline decoration-gold/50 underline-offset-4 hover:text-gold"
                      >
                        Abrir
                        <LuArrowUpRight className="h-4 w-4" aria-hidden />
                        <span className="sr-only">{p.title} (abre em nova aba)</span>
                      </a>
                    </article>
                  </li>
                ))}
              </ul>

              {s.slug === "sistemas-web" && (
                <p className="mt-10 text-sm text-muted">
                  Tem clínica de estética?{" "}
                  <Link href="/clinicas" className="text-foreground underline decoration-gold/50 underline-offset-4 hover:text-gold">
                    Conheça o Morph Clínica, o sistema pronto para clínicas.
                  </Link>
                </p>
              )}
            </div>
          </section>
        )}

        <section className="section-border py-24">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="mb-3 text-[13px] font-medium tracking-[0.02em] text-gold">Dúvidas frequentes</p>
              <h2 className="font-[var(--font-display)] text-3xl md:text-4xl">Antes de pedir o orçamento</h2>
            </div>
            <div className="border-t border-white/10">
              {s.faq.map((f) => (
                <details key={f.q} className="group border-b border-white/10">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[15px] transition-colors hover:text-gold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <LuChevronDown className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden />
                  </summary>
                  <p className="pb-5 text-sm leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <nav aria-label="Outros serviços" className="section-border py-14">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 sm:flex-row sm:items-center sm:gap-8">
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted/80">Outros serviços</p>
            <ul className="flex flex-wrap gap-x-8 gap-y-2">
              {outros.map((o) => (
                <li key={o.slug}>
                  <Link href={`/${o.slug}`} className="text-foreground underline decoration-gold/50 underline-offset-4 hover:text-gold">
                    {o.nome}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/clinicas" className="text-foreground underline decoration-gold/50 underline-offset-4 hover:text-gold">
                  Sistema para clínicas de estética
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <Contact />
      </main>
      <WhatsAppFloat />
    </>
  );
}
