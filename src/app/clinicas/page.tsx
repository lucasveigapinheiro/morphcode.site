import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  LuArrowUpRight,
  LuBellRing,
  LuCheck,
  LuCloudDownload,
  LuHandshake,
  LuChartPie,
  LuPlus,
  LuShieldCheck,
  LuSmartphone,
} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import Reveal from "@/components/Reveal";
import { PrecoImplantacao, PrecoLicenca, SeOferta, TextoOferta } from "@/components/clinica/Oferta";
import { fontesClinica } from "@/lib/fontes-clinica";
import { DEMO, PRODUTO, faqClinica, planos, telas, type Tela } from "@/lib/clinica";
import { clinicaMessage, ofertaLicencaMessage, ofertaMessage, whatsappLink } from "@/lib/whatsapp";
import { jsonLd, siteUrl } from "@/lib/site";

const titulo = `${PRODUTO} | Sistema para Clínicas de Estética`;
const descricao =
  "Ficha de anamnese assinada no celular da paciente, prontuário, agenda, estoque por lote e validade e financeiro com taxas de maquininha, tudo com a marca da sua clínica.";

export const metadata: Metadata = {
  title: titulo,
  description: descricao,
  alternates: { canonical: "/clinicas" },
  openGraph: { title: titulo, description: descricao, url: "/clinicas", siteName: "Morph Code", locale: "pt_BR", type: "website" },
  twitter: { card: "summary_large_image", title: titulo, description: descricao },
};

// O produto com planos e preços, e as perguntas frequentes, para o Google e assistentes de IA.
const dadosEstruturados = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: PRODUTO,
      description: descricao,
      url: `${siteUrl}/clinicas`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, Android, iOS, Windows, macOS",
      inLanguage: "pt-BR",
      provider: { "@id": `${siteUrl}/#empresa` },
      offers: [
        { "@type": "Offer", name: "Plano mensal", price: "149", priceCurrency: "BRL", description: "R$ 149/mês + implantação de R$ 497 (R$ 248,50 para quem fechar até 23/12/2026)" },
        { "@type": "Offer", name: "Licença vitalícia", price: "2700", priceCurrency: "BRL", description: "R$ 2.000 para quem fechar até 23/12/2026; depois R$ 97/mês de hospedagem" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqClinica.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

// Os quatro pilares do dia a dia da clínica, na ordem em que a paciente e a doutora os encontram.
const pilares: { id: string; eyebrow: string; titulo: string; texto: string; itens: string[]; tela: Tela }[] = [
  {
    id: "prontuario",
    eyebrow: "Prontuário",
    titulo: "Alergia sempre à vista.",
    texto: "Cada paciente tem ficha assinada, histórico de atendimentos, fotos e autorização de uso de imagem. Os alertas de saúde aparecem já na lista.",
    itens: ["Alerta de alergia e medicamento contínuo em destaque", "Paciente arquivada, nunca apagada", "Convênios com desconto aplicado no financeiro"],
    tela: telas.pacientesNovo,
  },
  {
    id: "estoque",
    eyebrow: "Estoque",
    titulo: "Nenhuma ampola vence no armário.",
    texto: "Toxinas, preenchedores e bioestimuladores controlados por lote e validade. O atendimento dá baixa no lote que vence primeiro.",
    itens: ["Lote vencido bloqueado, com descarte e motivo", "Mínimo, ideal e sugestão de compra", "Valor em estoque pelo custo de cada lote"],
    tela: telas.estoque,
  },
  {
    id: "financeiro",
    eyebrow: "Financeiro",
    titulo: "Quanto realmente cai na conta.",
    texto: "As taxas da maquininha entram no cálculo e o cartão parcelado aparece parcela a parcela, no mês em que cai.",
    itens: ["Sinal no agendamento e recebimentos em atraso", "Lançamentos nunca apagados: estorno com motivo", "Resultado do mês antes de impostos e retirada"],
    tela: telas.financeiro,
  },
];

const extras = [
  { icon: LuBellRing, titulo: "Agenda com lembrete", texto: "Um toque abre o WhatsApp com a mensagem pronta." },
  { icon: LuHandshake, titulo: "Convênios", texto: "Percentual por convênio, aplicado na receita." },
  { icon: LuChartPie, titulo: "Relatório de pacientes", texto: "Retorno, procedimentos mais procurados e fichas." },
  { icon: LuSmartphone, titulo: "Aplicativo instalável", texto: "Ícone com a marca da clínica, sem loja de apps." },
  { icon: LuShieldCheck, titulo: "Acesso protegido", texto: "Verificação em duas etapas e histórico de acessos." },
  { icon: LuCloudDownload, titulo: "Backup em 1 clique", texto: "Cópia completa dos dados, guardada onde você quiser." },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-argila">{children}</p>;
}

function Moldura({ tela, className = "", prioridade = false }: { tela: Tela; className?: string; prioridade?: boolean }) {
  return (
    <Image
      src={tela.src}
      alt={tela.alt}
      width={tela.width}
      height={tela.height}
      priority={prioridade}
      sizes="(min-width: 1024px) 640px, 100vw"
      className={`h-auto w-full rounded-2xl shadow-2xl shadow-eucalipto/25 ring-1 ring-grafite/10 ${className}`}
    />
  );
}

function BotaoWhats({ texto, mensagem, claro = false }: { texto: React.ReactNode; mensagem: string; claro?: boolean }) {
  return (
    <a
      href={whatsappLink(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalipto ${
        claro ? "bg-white text-eucalipto hover:bg-nevoa" : "bg-eucalipto text-white shadow-lg shadow-eucalipto/30 hover:brightness-110"
      }`}
    >
      <FaWhatsapp className="h-4 w-4" aria-hidden /> {texto}
    </a>
  );
}

export default function ClinicasPage() {
  return (
    <div className={`${fontesClinica} font-manrope relative z-0 bg-porcelana text-grafite antialiased`}>
      <a href="#conteudo" className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-eucalipto focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:text-white">
        Ir para o conteúdo
      </a>

      {/* Faixa da oferta de fim de ano (some sozinha depois de 23/12) */}
      <SeOferta>
        <div className="bg-eucalipto-escuro px-4 py-2.5 text-center text-[13px] font-semibold text-white">
          Fim de ano: <span className="text-argila">50% na implantação</span> ou <span className="text-argila">licença por R$ 2.000</span>, para quem fechar até 23 de dezembro.
        </div>
      </SeOferta>

      {/* Cabeçalho */}
      <header className="sticky top-0 z-30 border-b border-grafite/10 bg-porcelana/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Voltar para o site da Morph Code">
            <Image src="/logo.jpeg" alt="" width={30} height={30} className="rounded-full" />
            <span className="text-sm text-grafite/60">
              Morph Code <span className="text-grafite/30">/</span> <span className="font-fraunces text-base text-grafite">{PRODUTO}</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-grafite/65 lg:flex">
            <a href="#sistema" className="transition-colors hover:text-eucalipto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-eucalipto">O sistema</a>
            <a href="#demo" className="transition-colors hover:text-eucalipto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-eucalipto">Demonstração</a>
            <a href="#planos" className="transition-colors hover:text-eucalipto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-eucalipto">Planos</a>
            <a href="#duvidas" className="transition-colors hover:text-eucalipto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-eucalipto">Dúvidas</a>
          </nav>
          <a
            href={whatsappLink(clinicaMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-eucalipto px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            <FaWhatsapp className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Falar no WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>
      </header>

      <main id="conteudo">
        {/* Abertura */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 -top-40 h-[640px] w-[640px] rounded-full opacity-70 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--nevoa) 0%, transparent 70%)" }}
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-14 md:pt-20 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal>
              <h1 className="text-balance font-fraunces text-[2.5rem] leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
                Sua clínica com cara de <em className="text-eucalipto">profissional</em> em 2027.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-grafite/75">
                Ficha de anamnese assinada no celular da paciente, prontuário, agenda, estoque e financeiro em um só lugar, com a marca da sua clínica.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <BotaoWhats
                  texto={<TextoOferta durante="Quero a oferta de fim de ano" depois="Quero uma demonstração" />}
                  mensagem={ofertaMessage}
                />
                <a
                  href={DEMO.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-grafite/20 px-7 py-3.5 text-sm font-semibold text-grafite transition-colors hover:border-eucalipto hover:text-eucalipto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-eucalipto"
                >
                  Explorar o sistema <LuArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-grafite/65">
                {["Sem fidelidade no plano mensal", "Suporte e backup inclusos", "A partir de R$ 149/mês"].map((t) => (
                  <li key={t} className="inline-flex items-center gap-1.5">
                    <LuCheck className="h-4 w-4 text-eucalipto" aria-hidden /> {t}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.15} className="relative mx-auto w-full max-w-[520px]">
              <Moldura tela={telas.painel} prioridade className="rotate-[1.5deg]" />
              <div className="absolute -bottom-10 -left-4 w-[42%] md:-left-10">
                <Image
                  src={telas.fichaCelular.src}
                  alt={telas.fichaCelular.alt}
                  width={telas.fichaCelular.width}
                  height={telas.fichaCelular.height}
                  sizes="220px"
                  className="h-auto w-full -rotate-[4deg] rounded-[1.6rem] border-[6px] border-grafite shadow-2xl shadow-grafite/40"
                />
              </div>
              <div className="absolute -right-2 -top-6 rounded-2xl border border-[#ebc1bd] bg-white px-4 py-3 shadow-xl md:-right-8">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9c2a22]">Alerta clínico</p>
                <p className="font-fraunces text-base text-grafite">Alergia: dipirona</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* A ficha, o gesto que a paciente nota primeiro */}
        <section id="sistema" className="scroll-mt-20 border-t border-grafite/10 bg-white py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal className="order-last flex justify-center gap-5 lg:order-first">
              <div className="w-[44%] max-w-[240px]">
                <Image src={telas.saudeCelular.src} alt={telas.saudeCelular.alt} width={telas.saudeCelular.width} height={telas.saudeCelular.height} sizes="240px" className="h-auto w-full rounded-[1.6rem] border-[6px] border-grafite shadow-2xl shadow-eucalipto/25" />
              </div>
              <div className="mt-12 w-[44%] max-w-[240px]">
                <Image src={telas.assinatura.src} alt={telas.assinatura.alt} width={telas.assinatura.width} height={telas.assinatura.height} sizes="240px" className="h-auto w-full rounded-[1.6rem] border-[6px] border-grafite shadow-2xl shadow-eucalipto/25" />
              </div>
            </Reveal>
            <Reveal>
              <Eyebrow>Anamnese digital</Eyebrow>
              <h2 className="text-balance font-fraunces text-4xl leading-tight md:text-5xl">A paciente assina antes de chegar.</h2>
              <p className="mt-5 text-lg leading-relaxed text-grafite/70">
                Você envia um link pelo WhatsApp. Ela responde as perguntas da sua clínica e assina com o dedo, sem baixar nada. A ficha vai direto para o prontuário, com data, hora e código de verificação.
              </p>
              <ul className="mt-6 space-y-2.5 text-[15px] text-grafite/75">
                {["Termo de consentimento e aviso de privacidade inclusos", "Autorização de uso de imagem, com registro de revogação", "Você edita as perguntas da ficha, sem programador"].map((t) => (
                  <li key={t} className="flex gap-3">
                    <LuCheck className="mt-1 h-4 w-4 shrink-0 text-eucalipto" aria-hidden /> {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* Prontuário, estoque e financeiro */}
        {pilares.map((p, i) => (
          <section key={p.id} id={p.id} className={`scroll-mt-20 border-t border-grafite/10 py-24 ${i % 2 === 1 ? "bg-white" : ""}`}>
            <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
              <Reveal className={i % 2 === 0 ? "" : "lg:order-last"}>
                <Eyebrow>{p.eyebrow}</Eyebrow>
                <h2 className="text-balance font-fraunces text-4xl leading-tight md:text-5xl">{p.titulo}</h2>
                <p className="mt-5 text-lg leading-relaxed text-grafite/70">{p.texto}</p>
                <ul className="mt-6 space-y-2.5 text-[15px] text-grafite/75">
                  {p.itens.map((t) => (
                    <li key={t} className="flex gap-3">
                      <LuCheck className="mt-1 h-4 w-4 shrink-0 text-eucalipto" aria-hidden /> {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.1}>
                <Moldura tela={p.tela} />
              </Reveal>
            </div>
          </section>
        ))}

        {/* Tudo o que vem junto */}
        <section className="border-t border-grafite/10 bg-white py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="max-w-2xl">
              <Eyebrow>Com a marca da sua clínica</Eyebrow>
              <h2 className="text-balance font-fraunces text-4xl leading-tight md:text-5xl">O resto da rotina também fica no lugar.</h2>
              <p className="mt-5 text-lg text-grafite/70">
                Logo, cores, letras, procedimentos e perguntas da ficha ficam do jeito da sua clínica, e você mesma ajusta nas configurações.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {extras.map(({ icon: Icone, titulo: t, texto }, i) => (
                <Reveal key={t} delay={i * 0.04}>
                  <div className="h-full rounded-3xl border border-grafite/10 bg-porcelana p-6">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-eucalipto text-white">
                      <Icone className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="mt-5 text-lg font-bold">{t}</h3>
                    <p className="mt-1.5 text-sm text-grafite/65">{texto}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-6 text-xs text-grafite/50">Os textos jurídicos podem ser ajustados pela clínica e devem ser revisados pela sua assessoria jurídica.</p>
          </div>
        </section>

        {/* Demonstração */}
        <section id="demo" className="scroll-mt-20 border-t border-grafite/10 py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
            <Reveal>
              <Eyebrow>Demonstração aberta</Eyebrow>
              <h2 className="text-balance font-fraunces text-4xl leading-tight md:text-5xl">Teste como se fosse a sua clínica.</h2>
              <p className="mt-5 text-grafite/70">
                Uma clínica de exemplo com prontuários, estoque, financeiro e agenda preenchidos. Dê baixa em um lote, cadastre uma paciente e envie uma ficha para o seu celular.
              </p>
              <p className="mt-4 text-sm text-grafite/55">Clínica e pacientes fictícios. As fichas de teste são apagadas em 24 horas.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-[2rem] border border-grafite/10 bg-white p-9 shadow-lg shadow-eucalipto/10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-argila">Acesso livre e imediato</p>
                <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-[15px]">
                  <dt className="text-grafite/55">Usuário</dt>
                  <dd className="font-mono font-semibold text-grafite">{DEMO.usuario}</dd>
                  <dt className="text-grafite/55">Senha</dt>
                  <dd className="font-mono font-semibold text-grafite">{DEMO.senha}</dd>
                </dl>
                <a
                  href={DEMO.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-eucalipto px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-eucalipto/30 transition hover:brightness-110"
                >
                  Abrir o sistema de demonstração <LuArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Planos */}
        <section id="planos" className="scroll-mt-20 border-t border-grafite/10 bg-white py-24">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal className="text-center">
              <Eyebrow>Planos e investimento</Eyebrow>
              <h2 className="text-balance font-fraunces text-4xl leading-tight md:text-5xl">Escolha como começar.</h2>
              <p className="mx-auto mt-4 max-w-xl text-grafite/65">
                Prontuário, estoque e financeiro inclusos nos dois planos, sem limite de pacientes e com banco de dados próprio e isolado.
              </p>
              <SeOferta>
                <p className="mx-auto mt-6 inline-block rounded-full bg-argila/15 px-5 py-2 text-sm font-semibold text-eucalipto">
                  Fim de ano, até 23 de dezembro: 50% na implantação do plano mensal e licença vitalícia por R$ 2.000.
                </p>
              </SeOferta>
            </Reveal>
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {planos.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.1}>
                  <div
                    className={`relative flex h-full flex-col rounded-[2rem] p-9 ${
                      p.destaque ? "bg-eucalipto text-white shadow-2xl shadow-eucalipto/40" : "border border-grafite/10 bg-porcelana shadow-lg shadow-eucalipto/10"
                    }`}
                  >
                    {p.destaque && (
                      <span className="absolute -top-3 right-8 rounded-full bg-argila px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">Menor custo no longo prazo</span>
                    )}
                    <p className={`text-xs font-bold uppercase tracking-[0.2em] ${p.destaque ? "text-nevoa" : "text-argila"}`}>{p.nome}</p>
                    <p className="mt-4 font-fraunces text-5xl">{p.id === "mensal" ? p.preco : <PrecoLicenca />}</p>
                    <p className={`mt-2 text-sm ${p.destaque ? "text-nevoa/85" : "text-grafite/60"}`}>
                      {p.id === "mensal" ? <PrecoImplantacao claro={p.destaque} /> : p.detalhe}
                    </p>
                    <ul className="mt-8 flex-1 space-y-3">
                      {p.itens.map((item) => (
                        <li key={item} className="flex items-center gap-3 text-[15px]">
                          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${p.destaque ? "bg-white/15" : "bg-eucalipto/10"}`}>
                            <LuCheck className={`h-3 w-3 ${p.destaque ? "text-white" : "text-eucalipto"}`} aria-hidden />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-9">
                      <BotaoWhats texto={p.cta} mensagem={p.id === "mensal" ? ofertaMessage : ofertaLicencaMessage} claro={p.destaque} />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Dúvidas */}
        <section id="duvidas" className="scroll-mt-20 border-t border-grafite/10 py-24">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal className="text-center">
              <Eyebrow>Tire suas dúvidas</Eyebrow>
              <h2 className="text-balance font-fraunces text-4xl leading-tight">Perguntas frequentes</h2>
            </Reveal>
            <div className="mt-10 divide-y divide-grafite/10 border-y border-grafite/10">
              {faqClinica.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-grafite [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <LuPlus className="h-5 w-5 shrink-0 text-argila transition-transform group-open:rotate-45" aria-hidden />
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-grafite/70">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Chamada final */}
        <section className="px-4 pb-16 md:px-6">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-eucalipto px-8 py-16 text-center text-white md:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full opacity-40 blur-3xl"
              style={{ background: "radial-gradient(circle, var(--argila) 0%, transparent 70%)" }}
            />
            <div className="relative">
              <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-argila p-1 shadow-lg shadow-black/25">
                <Image src="/logo.jpeg" alt="Morph Code" width={80} height={80} className="h-full w-full rounded-full object-cover" />
              </div>
              <h2 className="mt-6 font-fraunces text-4xl leading-tight md:text-5xl">Comece 2027 com a clínica organizada.</h2>
              <p className="mx-auto mt-4 max-w-lg text-nevoa/90">
                <TextoOferta
                  durante="Feche até 23 de dezembro: metade da implantação no mensal ou licença por R$ 2.000. Mostramos o sistema ao vivo em 20 minutos, com uma ficha de teste no seu WhatsApp."
                  depois="Mostramos o sistema ao vivo em 20 minutos, com uma ficha de teste no seu WhatsApp."
                />
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <BotaoWhats texto={<TextoOferta durante="Quero a oferta de fim de ano" depois="Agendar demonstração" />} mensagem={ofertaMessage} claro />
                <a
                  href={DEMO.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Explorar a demonstração <LuArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-grafite/50">
            {PRODUTO} é um produto <Link href="/" className="underline hover:text-eucalipto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-eucalipto">Morph Code</Link> · Lucas Veiga Pinheiro · (11) 93095-7162 ·{" "}
            <a href="mailto:morphcode.dev@gmail.com" className="underline hover:text-eucalipto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-eucalipto">morphcode.dev@gmail.com</a> · @morphcode.dev
          </p>
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(dadosEstruturados)} />
    </div>
  );
}
