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
import FaixaOferta, {
  CronometroPlanosClinica,
  FlutuantesClinica,
  PainelVagasClinica,
  SeloAoVivoClinica,
} from "@/components/clinica/FaixaOferta";
import TestePaciente from "@/components/clinica/TestePaciente";
import MockupEstoque from "@/components/clinica/MockupEstoque";
import MockupFinanceiro from "@/components/clinica/MockupFinanceiro";
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
        { "@type": "Offer", name: "Plano mensal", price: "149", priceCurrency: "BRL", description: "R$ 149/mês + implantação de R$ 497 (R$ 248,50 para quem fechar nas 5 vagas da semana ou até 23/12/2026)" },
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
    hoje: "Ficha de papel que some na gaveta e paciente que não assinou nada.",
    morph: "Ficha assinada no celular antes da paciente chegar, com data, hora e código de verificação direto no prontuário.",
  },
  {
    hoje: "Ampola cara (R$ 800 a R$ 1.150) vencida descoberta na hora do atendimento.",
    morph: "Estoque por lote e validade (FEFO): a baixa sai do lote que vence primeiro e o vencido fica bloqueado.",
  },
  {
    hoje: "Fim do mês sem saber quanto realmente caiu, com maquininha e parcelas no meio.",
    morph: "Financeiro com as taxas no cálculo e o cartão parcelado aparecendo parcela a parcela, no mês em que cai.",
  },
];

const passos = [
  { titulo: "Você chama no WhatsApp", texto: "Uma conversa rápida para entender a sua clínica e reservar 1 das 5 vagas com 50% na implantação. Sem formulário e sem robô." },
  { titulo: "Vemos o sistema ao vivo", texto: "Mostramos em 20 minutos, com uma ficha de teste chegando no seu WhatsApp para você assinar no celular." },
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
  {
    id: "prontuario",
    eyebrow: "Prontuário",
    titulo: "Alergia sempre à vista.",
    texto: "Alergia e medicamento de uso contínuo aparecem em destaque já na lista de pacientes, antes de abrir a ficha.",
    itens: ["Histórico, fotos e ficha assinada de cada paciente", "Paciente arquivada, nunca apagada", "Convênios com desconto aplicado no financeiro"],
    tela: telas.pacientesNovo,
    fundo: "bg-[#fdf3ee] ring-1 ring-[#e8cfc2]",
  },
  {
    id: "estoque",
    eyebrow: "Estoque",
    titulo: "Veja o que vence antes de perder a ampola.",
    texto: "Toxinas, preenchedores e bioestimuladores por lote e validade. O atendimento dá baixa no lote que vence primeiro.",
    itens: ["Lote vencido bloqueado, com descarte e motivo", "Mínimo, ideal e sugestão de compra", "Valor em estoque pelo custo de cada lote"],
    tela: telas.estoque,
    fundo: "bg-[#eff6f3] ring-1 ring-[#cde0d9]",
  },
  {
    id: "financeiro",
    eyebrow: "Financeiro",
    titulo: "Quanto realmente cai na conta.",
    texto: "As taxas da maquininha entram no cálculo e o cartão parcelado aparece parcela a parcela, no mês em que cai.",
    itens: ["Sinal no agendamento e recebimentos em atraso", "Lançamentos nunca apagados: estorno com motivo", "Resultado do mês antes de impostos e retirada"],
    tela: telas.financeiro,
    fundo: "bg-[#fbf6e9] ring-1 ring-[#ead8ac]",
  },
];

const entregaveisInclusos = [
  {
    titulo: "Prontuário + Ficha de Anamnese Assinada no Celular",
    tag: "Incluso nos 2 planos",
    detalhe: "Link enviado pelo WhatsApp, assinatura com o dedo na tela e alertas clínicos de alergia no topo do prontuário.",
  },
  {
    titulo: "Agenda com Lembrete no WhatsApp + Estoque FEFO por Lote",
    tag: "Incluso nos 2 planos",
    detalhe: "Confirmação de consulta em 1 toque e baixa prioritária no lote que vence primeiro para evitar perda de insumos.",
  },
  {
    titulo: "Financeiro com Taxas de Maquininha e Parcelado",
    tag: "Incluso nos 2 planos",
    detalhe: "Cálculo automático do valor líquido no PIX, débito e crédito parcelado mês a mês, com sinal vinculado à agenda.",
  },
  {
    titulo: "Implantação Completa com a Marca e a Ficha da Sua Clínica",
    tag: "50% OFF (de R$ 497 por R$ 248,50)",
    detalhe: "Passamos as perguntas da sua ficha de papel para o sistema e configuramos o aplicativo com as suas cores e logotipo.",
  },
  {
    titulo: "Hospedagem, Banco de Dados Isolado, Backup e Suporte",
    tag: "Incluso",
    detalhe: "Sem limite de pacientes cadastradas, cópia completa dos dados em 1 clique e suporte direto pelo WhatsApp.",
  },
];

function Eyebrow({ children, claro = false }: { children: React.ReactNode; claro?: boolean }) {
  return (
    <p className={`mb-3 text-xs font-extrabold uppercase tracking-[0.14em] ${claro ? "text-[#f7d46c]" : "text-[#1b4d42]"}`}>
      {children}
    </p>
  );
}

function Img({ tela, className = "", prioridade = false, sizes = "(min-width: 1024px) 560px, 100vw" }: { tela: Tela; className?: string; prioridade?: boolean; sizes?: string }) {
  return <Image src={tela.src} alt={tela.alt} width={tela.width} height={tela.height} priority={prioridade} sizes={sizes} className={className} />;
}

/**
 * Botões de ação com alto contraste luminoso:
 * - "ouro": Dourado Champanhe vibrante igual ao criativo vencedor do Meta Ads (#f7d46c -> #eab308)
 * - "verde": Verde Esmeralda Vivo (#16a34a / #1fa855) para chamadas em fundo claro
 * - "claro": Branco puro com texto escuro
 */
function BotaoWhats({
  texto,
  mensagem,
  variante = "verde",
  origem,
  className = "",
}: {
  texto: React.ReactNode;
  mensagem: string;
  variante?: "verde" | "claro" | "argila";
  origem?: string;
  className?: string;
}) {
  const cor = {
    verde:
      "bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white shadow-[0_12px_28px_-8px_rgba(22,163,74,0.55)] ring-1 ring-white/20 hover:brightness-110",
    claro: "bg-white text-[#0c221d] shadow-md hover:bg-[#f0f7f4]",
    argila:
      "bg-gradient-to-r from-[#f7d46c] via-[#f3c64f] to-[#eab308] text-[#0c221d] shadow-[0_14px_34px_-8px_rgba(243,198,79,0.5)] ring-1 ring-[#fff6cf]/60 hover:brightness-105",
  }[variante];
  return (
    <a
      href={whatsappLink(mensagem, "clinica")}
      target="_blank"
      rel="noopener noreferrer"
      data-origem={origem}
      className={`inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-4 text-[15px] font-extrabold transition-[transform,filter,background-color] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3c64f] sm:whitespace-nowrap ${cor} ${className}`}
    >
      <FaWhatsapp className="h-[19px] w-[19px] shrink-0" aria-hidden /> {texto}
    </a>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <LuCheck className="mt-1 h-4 w-4 shrink-0 text-[#16a34a]" aria-hidden /> {children}
    </li>
  );
}

const navLink = "transition-colors hover:text-[#f7d46c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3c64f]";

export default function ClinicasPage() {
  const linkWhatsOferta = whatsappLink(ofertaMessage, "clinica");

  return (
    <div className={`${fontesClinica} font-manrope relative z-0 overflow-x-clip bg-[#faf9f5] pb-24 pt-9 text-[#122420] antialiased md:pb-12 md:pt-0`}>
      <a
        href="#conteudo"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-[#f3c64f] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-bold focus-visible:text-[#0c221d]"
      >
        Ir para o conteúdo
      </a>

      {/* Faixa da oferta em Ouro Champanhe + Esmeralda Escuro */}
      <FaixaOferta />

      {/* Cabeçalho Esmeralda Profundo */}
      <header className="sticky top-9 z-30 border-b border-white/10 bg-[#0c221d]/95 backdrop-blur md:top-0">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Voltar para o site da Morph Code">
            <Image src="/logo.jpeg" alt="" width={30} height={30} className="rounded-full ring-1 ring-[#f3c64f]/50" />
            <span className="font-fraunces text-base text-white">{PRODUTO}</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-white/75 lg:flex">
            <a href="#sistema" className={navLink}>O sistema</a>
            <a href="#simuladores" className={navLink}>Testar ao vivo</a>
            <a href="#como-funciona" className={navLink}>Como começar</a>
            <a href="#demo" className={navLink}>Demonstração</a>
            <a href="#planos" className="font-bold text-[#f7d46c] transition-colors hover:text-white">Planos e 50% OFF</a>
            <a href="#duvidas" className={navLink}>Dúvidas</a>
          </nav>
          <a
            href={whatsappLink(ofertaMessage, "clinica")}
            target="_blank"
            rel="noopener noreferrer"
            data-origem="cabecalho"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f7d46c] to-[#eab308] px-4 py-2 text-xs font-extrabold text-[#0c221d] shadow-sm transition hover:brightness-105 sm:text-sm"
          >
            <FaWhatsapp className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Garantir 50% OFF</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>
      </header>

      <main id="conteudo">
        {/* Abertura: Esmeralda Profundo (#0c221d) + Destaques em Ouro Champanhe (#f7d46c), idêntico ao criativo do anúncio */}
        <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-[#0c221d] via-[#112e27] to-[#0c221d] text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-32 h-[560px] w-[560px] rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, #f3c64f 0%, transparent 70%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-32 bottom-0 h-[440px] w-[440px] rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, #22c55e 0%, transparent 70%)" }}
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-28 pt-12 md:pt-20 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal>
              <SeloAoVivoClinica />

              <h1 className="text-balance text-[2.35rem] font-extrabold leading-[1.06] tracking-tight md:text-5xl lg:text-[3.5rem]">
                Perdeu a <em className="font-fraunces font-normal text-[#f7d46c]">ficha da paciente</em> de novo?
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#d9ebe5]">
                Ficha assinada no celular da paciente, agenda com lembrete no WhatsApp, estoque por lote e validade e financeiro com taxa de maquininha num só sistema, com a marca da sua clínica.
              </p>

              {/* Resumo dos 2 planos exatamente com a estética do criativo do Meta Ads (Branco/Esmeralda + Ouro Champanhe) */}
              <div className="mt-6 grid max-w-xl grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/15 bg-white/[0.08] p-4 backdrop-blur-sm">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#86efac]">
                    Plano mensal · Sem fidelidade
                  </span>
                  <p className="mt-1 font-fraunces text-3xl font-bold text-white">
                    R$ 149<span className="font-manrope text-sm font-normal text-white/75">/mês</span>
                  </p>
                  <p className="mt-1 text-xs text-white/85">
                    Implantação 50% OFF: de <s className="text-white/50">R$ 497</s> por <strong className="font-extrabold text-[#f7d46c]">R$ 248,50</strong>
                  </p>
                </div>

                <div className="rounded-2xl border border-[#f3c64f]/60 bg-gradient-to-br from-[#f7d46c]/25 via-[#f3c64f]/15 to-transparent p-4 shadow-lg shadow-black/20">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#f7d46c]">
                    Licença vitalícia · Economize R$ 700
                  </span>
                  <p className="mt-1 font-fraunces text-3xl font-bold text-[#f7d46c]">
                    R$ 2.000 <s className="font-manrope text-sm font-normal text-white/50">R$ 2.700</s>
                  </p>
                  <p className="mt-1 text-xs text-white/90">
                    12 meses inclusos · depois R$ 97/mês
                  </p>
                </div>
              </div>

              {/* Barra elegante das 5 vagas de implantação pela metade */}
              <PainelVagasClinica />

              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
                <BotaoWhats
                  variante="argila"
                  origem="hero-oferta"
                  texto={<TextoOferta durante="Garantir vaga com 50% na implantação" depois="Quero uma demonstração" />}
                  mensagem={ofertaMessage}
                />
                <a
                  href={DEMO.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-origem="hero-demo"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-white/[0.05] px-7 py-4 text-[15px] font-bold text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3c64f]"
                >
                  Ver a demonstração <LuArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>

              <p className="mt-5 text-sm text-[#b9d3ca]">
                A partir de <strong className="text-white">R$ 149/mês</strong> · sem fidelidade no plano mensal · demonstração aberta, sem cadastro
              </p>
            </Reveal>

            <Reveal delay={0.15} className="relative mx-auto w-full max-w-[600px]">
              <div className="rounded-[1.9rem] border border-[#f3c64f]/35 bg-[#081714] p-2 shadow-[0_40px_90px_-25px_rgba(0,0,0,0.8)]">
                <Img tela={telas.painel} prioridade className="h-auto w-full rounded-[1.5rem]" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* O problema e a saída */}
        <section id="rotina" className="relative -mt-12 scroll-mt-24 px-4 md:px-6">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-[#1b4d42]/10 bg-white p-6 shadow-[0_30px_80px_-30px_rgba(12,34,29,0.28)] md:p-12">
            <Reveal className="max-w-2xl">
              <Eyebrow>A rotina da clínica hoje</Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold leading-[1.12] tracking-tight text-[#0c221d] md:text-[2.5rem]">
                Uma única ampola vencida ou ficha perdida já custa mais que meses do sistema.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {dores.map((d, i) => (
                <Reveal key={d.hoje} delay={i * 0.07}>
                  <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#e2e8e5]">
                    <div className="bg-[#fff4f2] p-6">
                      <p className="text-xs font-extrabold uppercase tracking-wider text-[#b91c1c]">Hoje sem o sistema</p>
                      <p className="mt-2 text-[17px] font-bold leading-snug text-[#1e2926]">{d.hoje}</p>
                    </div>
                    <div className="flex-1 bg-[#eef7f3] p-6">
                      <p className="text-xs font-extrabold uppercase tracking-wider text-[#15803d]">Com o Morph Clínica</p>
                      <p className="mt-2 text-[15px] leading-relaxed text-[#1e2b28]">{d.morph}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <BotaoWhats
                variante="verde"
                origem="rotina"
                texto={<TextoOferta durante="Quero aproveitar os 50% na implantação" depois="Quero ver funcionando" />}
                mensagem={ofertaMessage}
              />
              <p className="text-sm font-medium text-[#4b5e58]">Resposta direto no WhatsApp, sem formulário.</p>
            </div>
          </div>
        </section>

        {/* O sistema, em quatro cartões */}
        <section id="sistema" className="scroll-mt-20 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="max-w-2xl">
              <Eyebrow>O sistema por dentro</Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold leading-[1.12] tracking-tight text-[#0c221d] md:text-[2.75rem]">
                Da ficha da paciente ao caixa do mês, tudo no mesmo lugar.
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <Reveal>
                <article className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-[#e6f3ee] ring-1 ring-[#c5dfd5]">
                  <div className="p-8 pb-0 md:p-10 md:pb-0">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#15803d]">Anamnese digital</p>
                    <h3 className="mt-2 text-balance text-2xl font-extrabold leading-tight tracking-tight text-[#0c221d] md:text-[1.9rem]">
                      A paciente assina antes de chegar.
                    </h3>
                    <p className="mt-3 leading-relaxed text-[#2b3f39]">
                      Você envia um link pelo WhatsApp. Ela responde as perguntas da sua clínica e assina com o dedo, sem baixar nada. A ficha vai direto para o prontuário.
                    </p>
                    <ul className="mt-5 space-y-2 text-[15px] font-medium text-[#1b312b]">
                      <Check>Termo de consentimento e aviso de privacidade inclusos</Check>
                      <Check>Autorização de uso de imagem, com registro de revogação</Check>
                      <Check>Você edita as perguntas da ficha, sem programador</Check>
                    </ul>
                  </div>
                  <div className="mt-8 flex flex-1 items-end justify-center gap-4 px-8">
                    <div className="h-[300px] w-[44%] max-w-[210px] overflow-hidden">
                      <Img tela={telas.saudeCelular} sizes="210px" className="h-auto w-full rounded-t-[1.6rem] border-[6px] border-b-0 border-[#0c221d] shadow-2xl" />
                    </div>
                    <div className="h-[300px] w-[44%] max-w-[210px] overflow-hidden pt-10">
                      <Img tela={telas.assinatura} sizes="210px" className="h-auto w-full rounded-t-[1.6rem] border-[6px] border-b-0 border-[#0c221d] shadow-2xl" />
                    </div>
                  </div>
                </article>
              </Reveal>

              {cartoes.map((c, i) => (
                <Reveal key={c.id} delay={(i + 1) * 0.06}>
                  <article id={c.id} className={`flex h-full scroll-mt-24 flex-col overflow-hidden rounded-[2rem] ${c.fundo}`}>
                    <div className="p-8 pb-0 md:p-10 md:pb-0">
                      <p className="text-xs font-extrabold uppercase tracking-wider text-[#1b4d42]">{c.eyebrow}</p>
                      <h3 className="mt-2 text-balance text-2xl font-extrabold leading-tight tracking-tight text-[#0c221d] md:text-[1.9rem]">
                        {c.titulo}
                      </h3>
                      <p className="mt-3 leading-relaxed text-[#2b3f39]">{c.texto}</p>
                      <ul className="mt-5 space-y-2 text-[15px] font-medium text-[#1b312b]">
                        {c.itens.map((t) => (
                          <Check key={t}>{t}</Check>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-8 flex-1 px-6 pb-6 md:px-8 md:pb-8">
                      <Img tela={c.tela} sizes="(min-width: 1024px) 520px, 100vw" className="h-auto w-full rounded-2xl shadow-[0_24px_50px_-24px_rgba(12,34,29,0.45)] ring-1 ring-black/5" />
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-16">
              <p className="text-lg font-extrabold text-[#0c221d]">E ainda vem junto:</p>
              <div className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {extras.map(({ icon: Icone, titulo: t, texto }) => (
                  <div key={t} className="flex items-start gap-4 rounded-2xl border border-[#e2e8e5] bg-white p-5 shadow-sm">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e6f3ee] text-[#15803d]">
                      <Icone className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-bold text-[#0c221d]">{t}</h3>
                      <p className="mt-0.5 text-sm text-[#4b5e58]">{texto}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-[#647871]">
                Os textos jurídicos podem ser ajustados pela clínica e devem ser revisados pela sua assessoria jurídica.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Simuladores interativos na própria página (Ficha no celular + Estoque FEFO + Financeiro) */}
        <section id="simuladores" className="scroll-mt-20 border-y border-[#e2e8e5] bg-[#f2f6f4] py-24">
          <div className="mx-auto max-w-6xl space-y-20 px-6">
            <div>
              <Reveal className="mb-10 max-w-2xl">
                <Eyebrow>Experimente aqui mesmo</Eyebrow>
                <h2 className="text-balance text-3xl font-extrabold leading-[1.12] tracking-tight text-[#0c221d] md:text-[2.75rem]">
                  Simule a ficha da paciente chegando ao prontuário em tempo real.
                </h2>
                <p className="mt-4 text-[#374b45]">
                  Marque <strong>“Sim”</strong> ou <strong>“Não”</strong> no celular abaixo e veja como os alertas clínicos aparecem imediatamente para a profissional:
                </p>
              </Reveal>
              <TestePaciente />
            </div>

            <div>
              <Reveal className="mb-8 max-w-2xl">
                <Eyebrow>Simulador de Estoque FEFO</Eyebrow>
                <h3 className="text-balance text-2xl font-extrabold leading-tight tracking-tight text-[#0c221d] md:text-4xl">
                  Clique em “Simular baixa FEFO” e veja o lote mais próximo sair primeiro.
                </h3>
              </Reveal>
              <MockupEstoque />
            </div>

            <div>
              <Reveal className="mb-8 max-w-2xl">
                <Eyebrow>Simulador Financeiro</Eyebrow>
                <h3 className="text-balance text-2xl font-extrabold leading-tight tracking-tight text-[#0c221d] md:text-4xl">
                  Alterne entre PIX, Crédito 1x e Crédito 3x para ver o cálculo líquido real.
                </h3>
              </Reveal>
              <MockupFinanceiro />
            </div>
          </div>
        </section>

        {/* Como começar */}
        <section id="como-funciona" className="scroll-mt-20 bg-gradient-to-b from-[#0c221d] to-[#112e27] py-24 text-white">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="max-w-2xl">
              <Eyebrow claro>Como começar</Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold leading-[1.12] tracking-tight md:text-[2.75rem]">
                Do primeiro contato à clínica usando, em três passos.
              </h2>
            </Reveal>
            <ol className="mt-12 grid gap-5 md:grid-cols-3">
              {passos.map((p, i) => (
                <li key={p.titulo}>
                  <Reveal delay={i * 0.08} className="h-full">
                    <div className="h-full rounded-3xl border border-white/10 bg-white/[0.06] p-7">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f3c64f] text-lg font-extrabold text-[#0c221d]">
                        {i + 1}
                      </span>
                      <h3 className="mt-5 text-xl font-bold text-white">{p.titulo}</h3>
                      <p className="mt-2 leading-relaxed text-[#cfe3dc]">{p.texto}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
            <Reveal className="mt-10">
              <BotaoWhats
                variante="argila"
                origem="como-funciona"
                texto={<TextoOferta durante="Começar pelo WhatsApp: 50% na implantação" depois="Começar pelo WhatsApp" />}
                mensagem={ofertaMessage}
              />
            </Reveal>
          </div>
        </section>

        {/* Demonstração */}
        <section id="demo" className="scroll-mt-20 py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
            <Reveal>
              <Eyebrow>Demonstração aberta</Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold leading-[1.12] tracking-tight text-[#0c221d] md:text-[2.75rem]">
                Teste como se fosse a sua clínica, agora.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-[#374b45]">
                Uma clínica de exemplo com prontuários, estoque, financeiro e agenda preenchidos. Dê baixa em um lote, cadastre uma paciente e envie uma ficha para o seu celular.
              </p>
              <p className="mt-4 text-sm text-[#5c706a]">Clínica e pacientes fictícios. As fichas de teste são apagadas em 24 horas.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-[1.75rem] border border-[#cde0d9] bg-[#eff6f3] p-9 shadow-lg shadow-[#0c221d]/5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#15803d]">Acesso livre e imediato</p>
                <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 rounded-2xl border border-[#d8e6e0] bg-white p-5 text-[15px]">
                  <dt className="text-[#5c706a]">Usuário</dt>
                  <dd className="font-mono font-bold text-[#0c221d]">{DEMO.usuario}</dd>
                  <dt className="text-[#5c706a]">Senha</dt>
                  <dd className="font-mono font-bold text-[#0c221d]">{DEMO.senha}</dd>
                </dl>
                <a
                  href={DEMO.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-origem="secao-demo"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0c221d] px-7 py-4 text-[15px] font-extrabold text-[#f7d46c] shadow-lg transition hover:bg-[#163830]"
                >
                  Abrir o sistema de demonstração <LuArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Planos e Oferta com Cronômetro em Blocos + Empilhamento de Entregáveis */}
        <section id="planos" className="scroll-mt-20 border-t border-[#e2e8e5] bg-[#f2f6f4] py-24">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal className="text-center">
              <Eyebrow>Planos e investimento</Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold leading-[1.12] tracking-tight text-[#0c221d] md:text-[2.75rem]">
                Tudo o que você leva ao garantir sua vaga hoje.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[#374b45]">
                Prontuário, estoque e financeiro inclusos nos dois planos, sem limite de pacientes e com banco de dados próprio e isolado.
              </p>

              {/* Cronômetro elegante em blocos Esmeralda & Ouro */}
              <CronometroPlanosClinica />

              <SeOferta>
                <p className="mx-auto mt-5 inline-block rounded-full border border-[#eab308]/40 bg-[#fef9c3] px-5 py-2 text-sm font-extrabold text-[#854d0e]">
                  Implantação pela metade (de R$ 497 por R$ 248,50 nas 5 vagas até 13/11) ou Licença Vitalícia por R$ 2.000 (até 23/12).
                </p>
              </SeOferta>
            </Reveal>

            {/* Empilhamento claro do que está incluso */}
            <Reveal className="mt-10">
              <div className="rounded-[1.75rem] border border-[#d8e6e0] bg-white p-6 shadow-[0_12px_36px_-16px_rgba(12,34,29,0.14)] md:p-8">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#15803d]">
                  Resumo do que está incluído na sua conta:
                </p>
                <ul className="mt-4 divide-y divide-[#e8efec]">
                  {entregaveisInclusos.map((item) => (
                    <li key={item.titulo} className="py-4 first:pt-2 last:pb-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-2.5 text-base font-bold text-[#0c221d]">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#dcfce7] text-[#15803d]">
                            <LuCheck className="h-3.5 w-3.5" aria-hidden />
                          </span>
                          {item.titulo}
                        </span>
                        <span className="rounded-full bg-[#fef3c7] px-3 py-0.5 text-xs font-extrabold text-[#92400e]">
                          {item.tag}
                        </span>
                      </div>
                      <p className="mt-1 pl-7 text-sm text-[#4b5e58]">{item.detalhe}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Os 2 cartões de planos com alto contraste (Branco + Verde vs Esmeralda + Ouro Champanhe) */}
            <div className="mt-10 grid gap-6 md:grid-cols-2 [&>*]:min-w-0">
              {planos.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.1}>
                  <div
                    className={`relative flex h-full flex-col rounded-[1.75rem] p-9 ${
                      p.destaque
                        ? "border-2 border-[#f3c64f] bg-gradient-to-b from-[#112e27] to-[#0c221d] text-white shadow-[0_28px_60px_-20px_rgba(12,34,29,0.65)]"
                        : "border border-[#d8e6e0] bg-white text-[#0c221d] shadow-[0_12px_36px_-16px_rgba(12,34,29,0.18)]"
                    }`}
                  >
                    {p.destaque ? (
                      <span className="absolute -top-3.5 right-8 rounded-full bg-gradient-to-r from-[#f7d46c] to-[#eab308] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#0c221d] shadow-md">
                        Economia de R$ 700 · Vitalícia
                      </span>
                    ) : (
                      <span className="absolute -top-3.5 right-8 rounded-full bg-[#16a34a] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-md">
                        Só 5 vagas com 50% na implantação
                      </span>
                    )}
                    <p className={`text-xs font-extrabold uppercase tracking-wider ${p.destaque ? "text-[#f7d46c]" : "text-[#15803d]"}`}>
                      {p.nome}
                    </p>
                    <p className="mt-4 text-5xl font-extrabold tracking-tight">{p.id === "mensal" ? p.preco : <PrecoLicenca />}</p>
                    <p className={`mt-2 text-sm ${p.destaque ? "text-[#d8eae4]" : "text-[#4b5e58]"}`}>
                      {p.id === "mensal" ? <PrecoImplantacao claro={p.destaque} /> : p.detalhe}
                    </p>
                    <ul className="mt-8 flex-1 space-y-3">
                      {p.itens.map((item) => (
                        <li key={item} className="flex items-center gap-3 text-[15px]">
                          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${p.destaque ? "bg-[#f3c64f]/20" : "bg-[#dcfce7]"}`}>
                            <LuCheck className={`h-3.5 w-3.5 ${p.destaque ? "text-[#f7d46c]" : "text-[#15803d]"}`} aria-hidden />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-9">
                      <BotaoWhats
                        origem={p.id === "mensal" ? "plano-mensal" : "plano-licenca"}
                        texto={p.id === "mensal" ? "Quero o plano mensal (50% na implantação)" : "Quero a licença vitalícia por R$ 2.000"}
                        mensagem={p.id === "mensal" ? ofertaMessage : ofertaLicencaMessage}
                        variante={p.destaque ? "argila" : "verde"}
                        className="w-full"
                      />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Garantia de tranquilidade clínica */}
            <Reveal className="mt-8">
              <div className="flex flex-col items-center gap-4 rounded-3xl border border-[#d8e6e0] bg-white p-6 shadow-sm sm:flex-row sm:px-8">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#dcfce7] text-[#15803d]">
                  <LuShieldCheck className="h-6 w-6" aria-hidden />
                </span>
                <div className="text-center sm:text-left">
                  <p className="font-bold text-[#0c221d]">Sem fidelidade no plano mensal e seus dados sempre seus.</p>
                  <p className="mt-0.5 text-sm text-[#4b5e58]">
                    Você testa a demonstração antes de fechar, acompanha a implantação ao vivo e pode cancelar o plano mensal quando quiser com aviso de 30 dias, levando cópia completa de todas as fichas e fotos.
                  </p>
                </div>
              </div>
            </Reveal>

            <p className="mt-8 text-center text-sm text-[#4b5e58]">
              Não sabe qual escolher? Conte o tamanho da sua clínica no WhatsApp e indicamos o plano.{" "}
              <a
                href={whatsappLink(clinicaMessage, "clinica")}
                target="_blank"
                rel="noopener noreferrer"
                data-origem="ajuda-planos"
                className="inline-flex items-center gap-1 font-extrabold text-[#15803d] underline underline-offset-4"
              >
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
              <h2 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-[#0c221d] md:text-4xl">
                Perguntas frequentes
              </h2>
            </Reveal>
            <div className="mt-10 divide-y divide-[#e2e8e5] border-y border-[#e2e8e5]">
              {faqClinica.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-[#0c221d] [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <LuPlus className="h-5 w-5 shrink-0 text-[#15803d] transition-transform group-open:rotate-45" aria-hidden />
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#374b45]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Chamada final */}
        <section className="px-4 pb-16 md:px-6">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[#f3c64f]/30 bg-gradient-to-b from-[#0c221d] to-[#112e27] px-8 py-16 text-center text-white shadow-2xl md:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full opacity-35 blur-3xl"
              style={{ background: "radial-gradient(circle, #f3c64f 0%, transparent 70%)" }}
            />
            <div className="relative">
              <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-[#f3c64f] p-1 shadow-lg shadow-black/25">
                <Image src="/logo.jpeg" alt="Morph Code" width={80} height={80} className="h-full w-full rounded-full object-cover" />
              </div>
              <h2 className="mt-6 text-balance text-3xl font-extrabold leading-[1.12] tracking-tight md:text-5xl">
                Garanta uma das 5 vagas com <span className="text-[#f7d46c]">50% na implantação</span>.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[#d8eae4]">
                <TextoOferta
                  durante="De R$ 497 por R$ 248,50 na implantação do plano mensal até sexta (13/11), ou Licença Vitalícia por R$ 2.000. Mostramos o sistema ao vivo em 20 minutos, com uma ficha de teste no seu WhatsApp."
                  depois="Já testado, aprovado e em uso atualmente por profissionais da área. Mostramos o sistema ao vivo em 20 minutos, com uma ficha de teste no seu WhatsApp."
                />
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <BotaoWhats
                  variante="argila"
                  origem="chamada-final"
                  texto={<TextoOferta durante="Quero garantir minha vaga pelo WhatsApp" depois="Agendar demonstração" />}
                  mensagem={ofertaMessage}
                />
                <a
                  href={DEMO.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-origem="chamada-final-demo"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 px-7 py-4 text-[15px] font-bold text-white transition-colors hover:bg-white/10"
                >
                  Explorar a demonstração <LuArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-[#5c706a]">
            {PRODUTO} é um produto{" "}
            <Link href="/" className="underline hover:text-[#0c221d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15803d]">
              Morph Code
            </Link>{" "}
            · Lucas Veiga Pinheiro · (11) 91215-0103 ·{" "}
            <a href="mailto:morphcode.dev@gmail.com" className="underline hover:text-[#0c221d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15803d]">
              morphcode.dev@gmail.com
            </a>{" "}
            · @morphcode.dev
          </p>
        </section>
      </main>

      {/* Toast flutuante + Barra fixa mobile com botão verde vibrante */}
      <FlutuantesClinica linkWhatsOferta={linkWhatsOferta} />

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(dadosEstruturados)} />
    </div>
  );
}
