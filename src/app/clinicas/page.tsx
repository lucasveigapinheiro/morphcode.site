import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  LuArrowRight,
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
import FaixaOferta, { VagasSemana } from "@/components/clinica/FaixaOferta";
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

const dores = [
  {
    hoje: "Ficha de papel que some e paciente que não assinou nada.",
    morph: "Ficha assinada no celular, com data, hora e código de verificação, direto no prontuário.",
  },
  {
    hoje: "Ampola vencida descoberta na hora do atendimento.",
    morph: "Estoque por lote e validade: a baixa sai do lote que vence primeiro e o vencido fica bloqueado.",
  },
  {
    hoje: "Fim do mês sem saber quanto realmente caiu, com maquininha e parcelas no meio.",
    morph: "Financeiro com as taxas no cálculo e o cartão parcelado aparecendo parcela a parcela.",
  },
];

const passos = [
  { titulo: "Você chama no WhatsApp", texto: "Uma conversa rápida para entender a sua clínica. Sem formulário e sem ligação de vendedor." },
  { titulo: "Vemos o sistema ao vivo", texto: "Mostramos em 20 minutos, com uma ficha de teste chegando no seu WhatsApp." },
  { titulo: "Colocamos a sua clínica nele", texto: "Passamos a sua ficha de papel, a sua marca e as suas cores para o sistema. Depois é só atender." },
];

const extras = [
  { icon: LuBellRing, titulo: "Agenda com lembrete", texto: "Um toque abre o WhatsApp com a mensagem pronta." },
  { icon: LuHandshake, titulo: "Convênios", texto: "Percentual por convênio, aplicado na receita." },
  { icon: LuChartPie, titulo: "Relatório de pacientes", texto: "Retorno, procedimentos mais procurados e fichas." },
  { icon: LuSmartphone, titulo: "Aplicativo instalável", texto: "Ícone com a marca da clínica, sem loja de apps." },
  { icon: LuShieldCheck, titulo: "Acesso protegido", texto: "Verificação em duas etapas e histórico de acessos." },
  { icon: LuCloudDownload, titulo: "Backup em 1 clique", texto: "Cópia completa dos dados, guardada onde você quiser." },
];

const cartoes = [
  { id: "prontuario", eyebrow: "Prontuário", titulo: "Alergia sempre à vista.", texto: "Alergia e medicamento de uso contínuo aparecem em destaque já na lista de pacientes, antes de abrir a ficha.", itens: ["Histórico, fotos e ficha assinada de cada paciente", "Paciente arquivada, nunca apagada", "Convênios com desconto aplicado no financeiro"], tela: telas.pacientesNovo, fundo: "bg-[#fbeee8]" },
  { id: "estoque", eyebrow: "Estoque", titulo: "Veja o que vence antes de perder a ampola.", texto: "Toxinas, preenchedores e bioestimuladores por lote e validade. O atendimento dá baixa no lote que vence primeiro.", itens: ["Lote vencido bloqueado, com descarte e motivo", "Mínimo, ideal e sugestão de compra", "Valor em estoque pelo custo de cada lote"], tela: telas.estoque, fundo: "bg-porcelana" },
  { id: "financeiro", eyebrow: "Financeiro", titulo: "Quanto realmente cai na conta.", texto: "As taxas da maquininha entram no cálculo e o cartão parcelado aparece parcela a parcela, no mês em que cai.", itens: ["Sinal no agendamento e recebimentos em atraso", "Lançamentos nunca apagados: estorno com motivo", "Resultado do mês antes de impostos e retirada"], tela: telas.financeiro, fundo: "bg-[#f4efe6]" },
];

function Eyebrow({ children, claro = false }: { children: React.ReactNode; claro?: boolean }) {
  return <p className={`mb-3 text-sm font-bold ${claro ? "text-argila" : "text-eucalipto"}`}>{children}</p>;
}

function Img({ tela, className = "", prioridade = false, sizes = "(min-width: 1024px) 560px, 100vw" }: { tela: Tela; className?: string; prioridade?: boolean; sizes?: string }) {
  return <Image src={tela.src} alt={tela.alt} width={tela.width} height={tela.height} priority={prioridade} sizes={sizes} className={className} />;
}

function BotaoWhats({ texto, mensagem, variante = "verde" }: { texto: React.ReactNode; mensagem: string; variante?: "verde" | "claro" | "argila" }) {
  const cor = {
    verde: "bg-eucalipto text-white shadow-lg shadow-eucalipto/30 hover:brightness-110",
    claro: "bg-white text-eucalipto hover:bg-nevoa",
    argila: "bg-argila text-eucalipto-escuro shadow-lg shadow-black/25 hover:brightness-105",
  }[variante];
  return (
    <a
      href={whatsappLink(mensagem, "clinica")}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 sm:whitespace-nowrap py-4 text-[15px] font-bold transition-[transform,filter,background-color] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-argila ${cor}`}
    >
      <FaWhatsapp className="h-[18px] w-[18px]" aria-hidden /> {texto}
    </a>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <LuCheck className="mt-1 h-4 w-4 shrink-0 text-eucalipto" aria-hidden /> {children}
    </li>
  );
}

const navLink = "transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-argila";

export default function ClinicasPage() {
  return (
    <div className={`${fontesClinica} font-manrope relative z-0 overflow-x-clip bg-white pb-36 text-grafite antialiased md:pb-12`}>
      <a href="#conteudo" className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-eucalipto focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:text-white">
        Ir para o conteúdo
      </a>

      {/* Faixa da oferta: cronômetro real até o fim das vagas da semana e depois até 23/12 */}
      <FaixaOferta />

      {/* Cabeçalho */}
      <header className="sticky top-0 z-30 bg-eucalipto-escuro/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Voltar para o site da Morph Code">
            <Image src="/logo.jpeg" alt="" width={30} height={30} className="rounded-full" />
            <span className="font-fraunces text-base text-white">{PRODUTO}</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-white/65 lg:flex">
            <a href="#sistema" className={navLink}>O sistema</a>
            <a href="#como-funciona" className={navLink}>Como começar</a>
            <a href="#demo" className={navLink}>Demonstração</a>
            <a href="#planos" className={navLink}>Planos</a>
            <a href="#duvidas" className={navLink}>Dúvidas</a>
          </nav>
          <a
            href={whatsappLink(clinicaMessage, "clinica")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-eucalipto-escuro hover:bg-nevoa"
          >
            <FaWhatsapp className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Falar no WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>
      </header>

      <main id="conteudo">
        {/* Abertura */}
        <section className="relative overflow-hidden bg-eucalipto-escuro text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-32 h-[560px] w-[560px] rounded-full opacity-35 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--argila) 0%, transparent 70%)" }}
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-28 pt-12 md:pt-20 lg:grid-cols-[1fr_1fr]">
            <Reveal>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-nevoa">
                <span className="h-2 w-2 rounded-full bg-[#4ade80]" aria-hidden /> Já em uso por profissionais da área
              </p>
              <h1 className="text-balance text-[2.3rem] font-extrabold leading-[1.08] tracking-tight md:text-5xl lg:text-[3.5rem]">
                Chega de <em className="font-fraunces font-normal text-argila">ficha perdida</em>, horário esquecido e produto vencido.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
                Ficha assinada no celular da paciente, agenda com lembrete, estoque por lote e validade e financeiro num só sistema, com a marca da sua clínica.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <BotaoWhats
                  variante="argila"
                  texto={<TextoOferta durante="Quero a oferta de fim de ano" depois="Quero uma demonstração" />}
                  mensagem={ofertaMessage}
                />
                <a
                  href={DEMO.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-4 text-[15px] font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-argila"
                >
                  Testar a demonstração <LuArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
              <VagasSemana className="mt-5 inline-flex rounded-full bg-argila px-4 py-1.5 text-sm font-bold text-eucalipto-escuro" />
              <p className="mt-5 text-sm text-white/65">
                A partir de <strong className="text-white">R$ 149/mês</strong> · sem fidelidade no plano mensal · demonstração aberta, sem cadastro
              </p>
            </Reveal>

            <Reveal delay={0.15} className="relative mx-auto w-full max-w-[600px]">
              <Img tela={telas.painel} prioridade className="h-auto w-full rounded-[1.75rem] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/15" />
            </Reveal>
          </div>
        </section>

        {/* O problema e a saída */}
        <section id="rotina" className="relative -mt-12 scroll-mt-24 px-4 md:px-6">
          <div className="mx-auto max-w-6xl rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_-30px_rgba(29,60,54,0.35)] ring-1 ring-grafite/5 md:p-12">
            <Reveal className="max-w-2xl">
              <Eyebrow>A rotina da clínica hoje</Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold leading-[1.12] tracking-tight md:text-[2.5rem]">Três problemas que o Morph Clínica resolve no dia a dia.</h2>
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {dores.map((d, i) => (
                <Reveal key={d.hoje} delay={i * 0.07}>
                  <div className="flex h-full flex-col overflow-hidden rounded-3xl ring-1 ring-grafite/10">
                    <div className="bg-[#fbeee8] p-6">
                      <p className="text-xs font-bold uppercase tracking-wide text-[#a4543a]">Hoje</p>
                      <p className="mt-2 text-[17px] font-semibold leading-snug">{d.hoje}</p>
                    </div>
                    <div className="flex-1 bg-nevoa/60 p-6">
                      <p className="text-xs font-bold uppercase tracking-wide text-eucalipto">Com o Morph Clínica</p>
                      <p className="mt-2 text-[15px] leading-relaxed text-grafite/80">{d.morph}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <BotaoWhats texto={<TextoOferta durante="Quero a oferta de fim de ano" depois="Quero ver funcionando" />} mensagem={ofertaMessage} />
              <p className="text-sm text-grafite/60">Resposta direto no WhatsApp, sem formulário.</p>
            </div>
          </div>
        </section>

        {/* O sistema, em quatro cartões */}
        <section id="sistema" className="scroll-mt-20 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="max-w-2xl">
              <Eyebrow>O sistema</Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold leading-[1.12] tracking-tight md:text-[2.75rem]">Da ficha da paciente ao caixa do mês, tudo no mesmo lugar.</h2>
            </Reveal>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <Reveal>
                <article className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-nevoa">
                  <div className="p-8 pb-0 md:p-10 md:pb-0">
                    <p className="text-sm font-bold text-eucalipto">Anamnese digital</p>
                    <h3 className="mt-2 text-balance text-2xl font-extrabold leading-tight tracking-tight md:text-[1.9rem]">A paciente assina antes de chegar.</h3>
                    <p className="mt-3 leading-relaxed text-grafite/75">
                      Você envia um link pelo WhatsApp. Ela responde as perguntas da sua clínica e assina com o dedo, sem baixar nada. A ficha vai direto para o prontuário.
                    </p>
                    <ul className="mt-5 space-y-2 text-[15px] text-grafite/80">
                      <Check>Termo de consentimento e aviso de privacidade inclusos</Check>
                      <Check>Autorização de uso de imagem, com registro de revogação</Check>
                      <Check>Você edita as perguntas da ficha, sem programador</Check>
                    </ul>
                  </div>
                  <div className="mt-8 flex flex-1 items-end justify-center gap-4 px-8">
                    <div className="h-[300px] w-[44%] max-w-[210px] overflow-hidden">
                      <Img tela={telas.saudeCelular} sizes="210px" className="h-auto w-full rounded-t-[1.6rem] border-[6px] border-b-0 border-grafite shadow-2xl shadow-eucalipto/30" />
                    </div>
                    <div className="h-[300px] w-[44%] max-w-[210px] overflow-hidden pt-10">
                      <Img tela={telas.assinatura} sizes="210px" className="h-auto w-full rounded-t-[1.6rem] border-[6px] border-b-0 border-grafite shadow-2xl shadow-eucalipto/30" />
                    </div>
                  </div>
                </article>
              </Reveal>

              {cartoes.map((c, i) => (
                <Reveal key={c.id} delay={(i + 1) * 0.06}>
                  <article id={c.id} className={`flex h-full scroll-mt-24 flex-col overflow-hidden rounded-[2rem] ${c.fundo}`}>
                    <div className="p-8 pb-0 md:p-10 md:pb-0">
                      <p className="text-sm font-bold text-eucalipto">{c.eyebrow}</p>
                      <h3 className="mt-2 text-balance text-2xl font-extrabold leading-tight tracking-tight md:text-[1.9rem]">{c.titulo}</h3>
                      <p className="mt-3 leading-relaxed text-grafite/75">{c.texto}</p>
                      <ul className="mt-5 space-y-2 text-[15px] text-grafite/80">
                        {c.itens.map((t) => (
                          <Check key={t}>{t}</Check>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-8 flex-1 px-6 pb-6 md:px-8 md:pb-8">
                      <Img tela={c.tela} sizes="(min-width: 1024px) 520px, 100vw" className="h-auto w-full rounded-2xl shadow-[0_24px_50px_-24px_rgba(29,60,54,0.45)] ring-1 ring-grafite/5" />
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-16">
              <p className="text-lg font-bold">E ainda vem junto:</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {extras.map(({ icon: Icone, titulo: t, texto }) => (
                  <div key={t} className="flex items-start gap-4 rounded-2xl bg-porcelana p-5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-eucalipto shadow-sm">
                      <Icone className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-bold">{t}</h3>
                      <p className="mt-0.5 text-sm text-grafite/65">{texto}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-grafite/50">Os textos jurídicos podem ser ajustados pela clínica e devem ser revisados pela sua assessoria jurídica.</p>
            </Reveal>
          </div>
        </section>

        {/* Como começar */}
        <section id="como-funciona" className="scroll-mt-20 bg-eucalipto-escuro py-24 text-white">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="max-w-2xl">
              <Eyebrow claro>Como começar</Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold leading-[1.12] tracking-tight md:text-[2.75rem]">Do primeiro contato à clínica usando, em três passos.</h2>
            </Reveal>
            <ol className="mt-12 grid gap-5 md:grid-cols-3">
              {passos.map((p, i) => (
                <li key={p.titulo}>
                  <Reveal delay={i * 0.08} className="h-full">
                  <div className="h-full rounded-3xl bg-white/[0.07] p-7 ring-1 ring-white/10">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-argila text-lg font-extrabold text-eucalipto-escuro">{i + 1}</span>
                    <h3 className="mt-5 text-xl font-bold">{p.titulo}</h3>
                    <p className="mt-2 leading-relaxed text-white/75">{p.texto}</p>
                  </div>
                  </Reveal>
                </li>
              ))}
            </ol>
            <Reveal className="mt-10">
              <BotaoWhats variante="argila" texto={<TextoOferta durante="Começar pelo WhatsApp: oferta de fim de ano" depois="Começar pelo WhatsApp" />} mensagem={ofertaMessage} />
            </Reveal>
          </div>
        </section>

        {/* Demonstração */}
        <section id="demo" className="scroll-mt-20 py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
            <Reveal>
              <Eyebrow>Demonstração aberta</Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold leading-[1.12] tracking-tight md:text-[2.75rem]">Teste como se fosse a sua clínica, agora.</h2>
              <p className="mt-5 text-lg leading-relaxed text-grafite/70">
                Uma clínica de exemplo com prontuários, estoque, financeiro e agenda preenchidos. Dê baixa em um lote, cadastre uma paciente e envie uma ficha para o seu celular.
              </p>
              <p className="mt-4 text-sm text-grafite/55">Clínica e pacientes fictícios. As fichas de teste são apagadas em 24 horas.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-[1.75rem] bg-porcelana p-9 ring-1 ring-grafite/5">
                <p className="text-sm font-bold text-eucalipto">Acesso livre e imediato</p>
                <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 rounded-2xl bg-white p-5 text-[15px] ring-1 ring-grafite/5">
                  <dt className="text-grafite/55">Usuário</dt>
                  <dd className="font-mono font-semibold text-grafite">{DEMO.usuario}</dd>
                  <dt className="text-grafite/55">Senha</dt>
                  <dd className="font-mono font-semibold text-grafite">{DEMO.senha}</dd>
                </dl>
                <a
                  href={DEMO.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-eucalipto px-7 py-4 text-[15px] font-bold text-white shadow-lg shadow-eucalipto/30 transition hover:brightness-110"
                >
                  Abrir o sistema de demonstração <LuArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Planos */}
        <section id="planos" className="scroll-mt-20 bg-porcelana py-24">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal className="text-center">
              <Eyebrow>Planos e investimento</Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold leading-[1.12] tracking-tight md:text-[2.75rem]">Escolha como começar.</h2>
              <p className="mx-auto mt-4 max-w-xl text-grafite/65">
                Prontuário, estoque e financeiro inclusos nos dois planos, sem limite de pacientes e com banco de dados próprio e isolado.
              </p>
              <VagasSemana className="mx-auto mt-6 inline-block rounded-full bg-eucalipto-escuro px-5 py-2 text-sm font-bold text-white" />
              <SeOferta>
                <p className="mx-auto mt-4 inline-block rounded-full bg-argila/15 px-5 py-2 text-sm font-bold text-[#a4543a]">
                  Fim de ano, até 23 de dezembro: 50% na implantação do plano mensal e licença vitalícia por R$ 2.000.
                </p>
              </SeOferta>
            </Reveal>
            <div className="mt-14 grid gap-6 md:grid-cols-2 [&>*]:min-w-0">
              {planos.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.1}>
                  <div
                    className={`relative flex h-full flex-col rounded-[1.75rem] p-9 ${
                      p.destaque ? "bg-eucalipto-escuro text-white shadow-2xl shadow-eucalipto/40" : "bg-white shadow-[0_8px_30px_-12px_rgba(29,60,54,0.2)] ring-1 ring-grafite/5"
                    }`}
                  >
                    {p.destaque && (
                      <span className="absolute -top-3 right-8 rounded-full bg-argila px-3 py-1 text-xs font-bold uppercase tracking-wider text-eucalipto-escuro">Menor custo no longo prazo</span>
                    )}
                    <p className={`text-sm font-bold ${p.destaque ? "text-argila" : "text-eucalipto"}`}>{p.nome}</p>
                    <p className="mt-4 text-5xl font-extrabold tracking-tight">{p.id === "mensal" ? p.preco : <PrecoLicenca />}</p>
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
                      <BotaoWhats texto={p.cta} mensagem={p.id === "mensal" ? ofertaMessage : ofertaLicencaMessage} variante={p.destaque ? "argila" : "verde"} />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-grafite/60">
              Não sabe qual escolher? Conte o tamanho da sua clínica no WhatsApp e indicamos o plano.{" "}
              <a href={whatsappLink(clinicaMessage, "clinica")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-eucalipto underline underline-offset-4">
                Falar agora <LuArrowRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            </p>
          </div>
        </section>

        {/* Dúvidas */}
        <section id="duvidas" className="scroll-mt-20 py-24">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal className="text-center">
              <Eyebrow>Tire suas dúvidas</Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">Perguntas frequentes</h2>
            </Reveal>
            <div className="mt-10 divide-y divide-grafite/[0.08] border-y border-grafite/[0.08]">
              {faqClinica.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-grafite [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <LuPlus className="h-5 w-5 shrink-0 text-eucalipto transition-transform group-open:rotate-45" aria-hidden />
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-grafite/70">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Chamada final */}
        <section className="px-4 pb-16 md:px-6">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-eucalipto-escuro px-8 py-16 text-center text-white md:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full opacity-40 blur-3xl"
              style={{ background: "radial-gradient(circle, var(--argila) 0%, transparent 70%)" }}
            />
            <div className="relative">
              <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-argila p-1 shadow-lg shadow-black/25">
                <Image src="/logo.jpeg" alt="Morph Code" width={80} height={80} className="h-full w-full rounded-full object-cover" />
              </div>
              <h2 className="mt-6 text-balance text-3xl font-extrabold leading-[1.12] tracking-tight md:text-5xl">Comece 2027 com a clínica organizada.</h2>
              <p className="mx-auto mt-4 max-w-lg text-nevoa/90">
                <TextoOferta
                  durante="Já testado, aprovado e em uso atualmente por profissionais da área. Feche até 23 de dezembro: metade da implantação no mensal ou licença por R$ 2.000. Mostramos o sistema ao vivo em 20 minutos, com uma ficha de teste no seu WhatsApp."
                  depois="Já testado, aprovado e em uso atualmente por profissionais da área. Mostramos o sistema ao vivo em 20 minutos, com uma ficha de teste no seu WhatsApp."
                />
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <BotaoWhats variante="argila" texto={<TextoOferta durante="Quero a oferta de fim de ano" depois="Agendar demonstração" />} mensagem={ofertaMessage} />
                <a
                  href={DEMO.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-4 text-[15px] font-bold text-white transition-colors hover:bg-white/10"
                >
                  Explorar a demonstração <LuArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-grafite/50">
            {PRODUTO} é um produto <Link href="/" className="underline hover:text-eucalipto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-eucalipto">Morph Code</Link> · Lucas Veiga Pinheiro · (11) 91215-0103 ·{" "}
            <a href="mailto:morphcode.dev@gmail.com" className="underline hover:text-eucalipto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-eucalipto">morphcode.dev@gmail.com</a> · @morphcode.dev
          </p>
        </section>
      </main>

      {/* Botão fixo de WhatsApp, só no celular */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
        <a
          href={whatsappLink(ofertaMessage, "clinica")}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto flex w-full items-center justify-center gap-2.5 rounded-full bg-[#1fa855] px-6 py-4 text-base font-bold text-white shadow-[0_14px_34px_-8px_rgba(18,90,50,0.6)] ring-1 ring-white/30 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalipto"
        >
          <FaWhatsapp className="h-5 w-5" aria-hidden />
          Falar no WhatsApp
        </a>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(dadosEstruturados)} />
    </div>
  );
}
