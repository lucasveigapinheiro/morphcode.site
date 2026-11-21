import type { Metadata } from "next";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { LuCheck, LuMapPin, LuSmartphone, LuSearch, LuMessageCircle, LuLayoutTemplate } from "react-icons/lu";

// Página de anúncio: um objetivo só, que é a conversa no WhatsApp. Sem menu, fora do Google.
export const metadata: Metadata = {
  title: "Site para o seu negócio por R$ 250 | Morph Code",
  description: "Site com botão direto pro seu WhatsApp, localização e a cara do seu negócio. R$ 250 para criar e R$ 35 por mês de hospedagem e manutenção.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/oferta" },
};

const NUMERO = "5511912150103";
const mensagem = "Olá! Vi o anúncio do site por R$ 250 e quero ver uma prévia do meu.";
const whatsapp = `https://api.whatsapp.com/send?phone=${NUMERO}&text=${encodeURIComponent(mensagem)}`;

const inclui = [
  { icone: LuMessageCircle, titulo: "Botão direto pro seu WhatsApp", texto: "O cliente toca e a conversa abre com a mensagem pronta." },
  { icone: LuMapPin, titulo: "Localização e horário", texto: "Endereço, rota no mapa e horário de atendimento no lugar certo." },
  { icone: LuSmartphone, titulo: "Feito para o celular", texto: "A maioria dos seus clientes vai abrir pelo celular, então ele nasce por lá." },
  { icone: LuSearch, titulo: "Pronto para o Google", texto: "Título, descrição e estrutura que o Google lê para mostrar o seu negócio." },
  { icone: LuLayoutTemplate, titulo: "A cara do seu negócio", texto: "Seus serviços, suas fotos e suas cores. Nada de modelo genérico." },
];

const projetos = [
  { nome: "2B Estética Automotiva", imagem: "/projects/2b-estetica.jpg", w: 1500, h: 1000 },
  { nome: "GMG Equilíbrio", imagem: "/projects/gmg-site.jpg", w: 1600, h: 789 },
  { nome: "Mecânica Rossi", imagem: "/projects/mecanica-rossi.jpg", w: 1568, h: 741 },
];

const duvidas = [
  { p: "E se eu não gostar?", r: "Você vê uma prévia do seu site antes de pagar. Só segue se gostar do que viu." },
  { p: "Em quanto tempo fica no ar?", r: "Em cerca de 7 dias depois que você me manda as informações do negócio." },
  { p: "O que o R$ 35 por mês cobre?", r: "Hospedagem do site no ar e manutenção. Sem fidelidade: se quiser sair, é só avisar." },
  { p: "Como funciona o pagamento?", r: "Os R$ 250 de criação podem ser pagos em duas vezes. A mensalidade de R$ 35 começa depois." },
  { p: "Preciso ter textos e fotos prontos?", r: "Não. Você me manda o que tiver pelo WhatsApp, como serviços, fotos e endereço, e eu monto." },
];

function Cta({ origem, className = "" }: { origem: string; className?: string }) {
  return (
    <a
      href={whatsapp}
      data-origem={origem}
      className={`inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-gold px-6 py-3.5 text-[15px] font-semibold text-background transition-colors hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${className}`}
    >
      <FaWhatsapp className="h-5 w-5" aria-hidden />
      Quero ver a prévia do meu site
    </a>
  );
}

export default function Oferta() {
  return (
    <>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <span className="font-[var(--font-display)] text-lg font-semibold tracking-tight">
          Morph <span className="text-gold">Code</span>
        </span>
        <a href={whatsapp} data-origem="cabecalho" className="hidden rounded-lg border border-gold/50 px-4 py-2 text-sm text-gold transition-colors hover:bg-gold/10 sm:inline-block">
          Chamar no WhatsApp
        </a>
      </header>

      <main id="conteudo" className="flex-1 pb-28 md:pb-0">
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-16 pt-6 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-14 md:pt-12">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-gold">Para quem vende pelo WhatsApp</p>
            <h1 className="font-[var(--font-display)] text-[2.6rem] font-semibold leading-[1.02] sm:text-6xl">
              Site para o seu negócio por <span className="text-gold">R$&nbsp;250</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Com botão direto pro seu WhatsApp, localização e a cara do seu negócio. Mais R$&nbsp;35 por mês de hospedagem e manutenção, sem fidelidade.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Cta origem="hero" />
              <p className="text-sm text-muted">Você vê a prévia antes de pagar.</p>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {["No ar em cerca de 7 dias", "Criação em até 2 vezes", "Sem fidelidade"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <LuCheck className="h-4 w-4 text-gold" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_30px_80px_-30px_rgba(212,169,74,0.35)]">
              <div className="flex items-center gap-1.5 border-b border-border px-4 py-3" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              </div>
              <Image
                src="/projects/2b-estetica.jpg"
                alt="Site da 2B Estética Automotiva, feito pela Morph Code"
                width={1500}
                height={1000}
                priority
                sizes="(max-width: 767px) 92vw, 520px"
                className="h-auto w-full"
              />
            </div>
            <p className="mt-3 text-center text-xs text-muted">Site da 2B Estética Automotiva, feito pela Morph Code</p>
          </div>
        </section>

        <section className="border-y border-border bg-surface/60">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl">Quem pesquisa seu serviço e não acha site chama outro.</h2>
              <p className="mt-4 text-muted">O seu cliente procura no Google, quer ver o trabalho e o endereço, e decide em poucos segundos. Com site, ele chega até você pelo WhatsApp.</p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {inclui.map(({ icone: Icone, titulo, texto }) => (
                <li key={titulo} className="rounded-2xl border border-border bg-background p-5">
                  <Icone className="mb-3 h-5 w-5 text-gold" aria-hidden />
                  <h3 className="font-medium">{titulo}</h3>
                  <p className="mt-1.5 text-sm text-muted">{texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 py-16">
          <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl">Sites que já estão no ar</h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {projetos.map((p) => (
              <li key={p.nome}>
                <div className="overflow-hidden rounded-xl border border-border bg-surface">
                  <Image src={p.imagem} alt={`Site de ${p.nome}`} width={p.w} height={p.h} loading="lazy" sizes="(max-width: 767px) 92vw, 360px" className="h-auto w-full" />
                </div>
                <p className="mt-3 text-sm text-muted">{p.nome}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-y border-border bg-surface/60">
          <div className="mx-auto w-full max-w-3xl px-5 py-16 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold">O preço, sem letra miúda</p>
            <p className="mt-5 font-[var(--font-display)] text-6xl font-semibold sm:text-7xl">
              R$&nbsp;250
            </p>
            <p className="mt-2 text-muted">para criar o site, em até 2 vezes</p>
            <p className="mt-6 text-2xl font-medium">
              + R$&nbsp;35 <span className="text-base font-normal text-muted">por mês de hospedagem e manutenção</span>
            </p>
            <div className="mt-8">
              <Cta origem="preco" />
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-3xl px-5 py-16">
          <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl">Dúvidas antes de chamar</h2>
          <div className="mt-8">
            {duvidas.map((d) => (
              <details key={d.p} className="group border-b border-border py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium transition-colors hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
                  {d.p}
                  <span aria-hidden className="font-mono text-xl text-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-2xl text-muted">{d.r}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 pb-20">
          <div className="rounded-3xl border border-gold/30 bg-gradient-to-b from-gold/10 to-transparent px-6 py-14 text-center">
            <h2 className="mx-auto max-w-2xl font-[var(--font-display)] text-3xl sm:text-5xl">Seu site pode estar no ar em cerca de 7 dias.</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">Mande uma mensagem com o nome do seu negócio. Eu respondo com a prévia.</p>
            <div className="mt-8">
              <Cta origem="final" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-5 pb-28 pt-8 text-center text-sm text-muted md:pb-8">
        Morph Code, criação de sites em São Bernardo do Campo, SP
      </footer>

      {/* Barra fixa no celular: o botão continua à mão em qualquer ponto da página */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
        <Cta origem="barra-fixa" className="w-full" />
      </div>
    </>
  );
}
