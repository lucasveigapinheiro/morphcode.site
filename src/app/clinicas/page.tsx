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
  LuTriangleAlert,
  LuSparkles,
  LuLock,
} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import Reveal from "@/components/Reveal";
import FaixaOferta, {
  CronometroOfertaGrande,
  FlutuantesConversao,
  PainelEscassezHero,
  SeloAoVivo,
} from "@/components/clinica/FaixaOferta";
import TestePaciente from "@/components/clinica/TestePaciente";
import MockupEstoque from "@/components/clinica/MockupEstoque";
import MockupFinanceiro from "@/components/clinica/MockupFinanceiro";
import { PrecoImplantacao, PrecoLicenca, TextoOferta } from "@/components/clinica/Oferta";
import { fontesClinica } from "@/lib/fontes-clinica";
import { APRESENTACAO_PDF, DEMO, PRODUTO, faqClinica, planos, telas, type Tela } from "@/lib/clinica";
import { clinicaMessage, ofertaLicencaMessage, ofertaMessage, whatsappLink } from "@/lib/whatsapp";
import { jsonLd, siteUrl } from "@/lib/site";

const titulo = `${PRODUTO} | Ficha Digital, Agenda, Estoque e Financeiro para Clínicas [50% OFF Implantação]`;
const descricao =
  "Perdeu a ficha da paciente de novo? Ficha digital assinada no celular, agenda com lembrete no WhatsApp, estoque por lote e validade e financeiro com taxa de maquininha. Só 5 vagas com 50% OFF na implantação.";

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
        { "@type": "Offer", name: "Plano mensal", price: "149", priceCurrency: "BRL", description: "R$ 149/mês + implantação de R$ 248,50 (50% OFF de R$ 497 nas 5 vagas da semana)" },
        { "@type": "Offer", name: "Licença vitalícia", price: "2000", priceCurrency: "BRL", description: "R$ 2.000 (de R$ 2.700) com 12 meses de hospedagem e suporte inclusos; depois R$ 97/mês" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqClinica.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

const comparativosPrejuizo = [
  {
    tag: "Sem o sistema na rotina",
    ruim: true,
    titulo: "1 único frasco de Toxina ou Bioestimulador vencido",
    texto: "Custa de R$ 820 a R$ 1.150 jogados no lixo porque ficou esquecido no fundo do armário — mais que 6 meses inteiros do Morph Clínica.",
  },
  {
    tag: "Sem ficha assinada no celular",
    ruim: true,
    titulo: "1 paciente que questiona procedimento sem termo",
    texto: "Ficha de papel some na gaveta, fica sem assinatura ou sem alerta de alergia visível na hora da aplicação.",
  },
  {
    tag: "Com o Morph Clínica hoje",
    ruim: false,
    titulo: "Clínica blindada por R$ 149/mês (ou R$ 4,96/dia)",
    texto: "Ficha assinada no celular antes da paciente chegar, baixa automática do lote que vence primeiro (FEFO) e lucro líquido real descontando a maquininha.",
  },
];

const empilhamentoEntregaveis = [
  {
    titulo: "1. Prontuário + Ficha de Anamnese Assinada no Celular",
    tag: "Incluso nos 2 planos",
    detalhe: "Você manda 1 link no WhatsApp; a paciente responde e assina com o dedo. Alergias e medicamentos contínuos piscam em vermelho no topo do prontuário.",
  },
  {
    titulo: "2. Controle de Estoque por Lote e Validade (Regra FEFO)",
    tag: "Incluso nos 2 planos",
    detalhe: "Ao registrar o atendimento, o sistema dá baixa automática no lote que vence mais cedo e bloqueia o uso de insumo vencido.",
  },
  {
    titulo: "3. Financeiro com Taxas de Maquininha e Parcelado Mês a Mês",
    tag: "Incluso nos 2 planos",
    detalhe: "Saiba exatamente quanto sobra líquido no PIX, débito ou crédito parcelado, com sinal vinculado à agenda e histórico sem exclusões.",
  },
  {
    titulo: "4. Agenda com Lembrete em 1 Toque no WhatsApp",
    tag: "Incluso nos 2 planos",
    detalhe: "Reduza faltas e atrasos abrindo o WhatsApp da paciente já com a mensagem de confirmação preenchida.",
  },
  {
    titulo: "5. Implantação Completa: Sua Ficha de Papel + Sua Marca e Cores",
    tag: "50% OFF (de R$ 497 por R$ 248,50)",
    detalhe: "Nós mesmas passamos as perguntas da sua ficha atual para o sistema e configuramos o aplicativo com o logotipo e a paleta da sua clínica.",
  },
  {
    titulo: "6. Banco de Dados Isolado + Hospedagem + Backup Diário + Suporte",
    tag: "Incluso",
    detalhe: "Sem limite de pacientes cadastradas, backup completo em 1 clique e suporte direto pelo WhatsApp.",
  },
];

const passos = [
  {
    num: "01",
    titulo: "Toque no botão e chame no WhatsApp",
    texto: "Você garante 1 das 5 vagas com implantação pela metade (R$ 248,50) ou a Licença Vitalícia por R$ 2.000. Sem formulário e sem robô.",
  },
  {
    num: "02",
    titulo: "Receba uma ficha de teste no seu celular",
    texto: "Em 15 minutos mostramos o sistema ao vivo e enviamos uma ficha de anamnese para você assinar no próprio celular como se fosse sua paciente.",
  },
  {
    num: "03",
    titulo: "Entregamos configurado com a sua marca",
    texto: "Passamos a sua ficha de papel, seus termos e as cores da sua clínica para o sistema. Você já começa a atender com tudo pronto.",
  },
];

const extras = [
  { icon: LuBellRing, titulo: "Agenda com lembrete", texto: "Um toque abre o WhatsApp da paciente com a confirmação pronta." },
  { icon: LuHandshake, titulo: "Convênios e parcerias", texto: "Percentual de desconto por convênio calculado direto na receita." },
  { icon: LuChartPie, titulo: "Relatório de retorno", texto: "Procedimentos mais feitos, fichas assinadas e pacientes para chamar." },
  { icon: LuSmartphone, titulo: "App com a sua marca", texto: "Ícone da sua clínica na tela inicial do celular e do computador." },
  { icon: LuShieldCheck, titulo: "Acesso em 2 etapas", texto: "Proteção com verificação e registro completo de quem acessou." },
  { icon: LuCloudDownload, titulo: "Backup em 1 clique", texto: "Seus dados, fotos e fichas são seus: baixe uma cópia quando quiser." },
];

function Img({ tela, className = "", prioridade = false, sizes = "(min-width: 1024px) 560px, 100vw" }: { tela: Tela; className?: string; prioridade?: boolean; sizes?: string }) {
  return <Image src={tela.src} alt={tela.alt} width={tela.width} height={tela.height} priority={prioridade} sizes={sizes} className={className} />;
}

function CtaWhatsApp({
  tituloPrincipal,
  subtitulo,
  mensagem,
  origem,
  variante = "ouro",
  className = "",
}: {
  tituloPrincipal: React.ReactNode;
  subtitulo?: React.ReactNode;
  mensagem: string;
  origem: string;
  variante?: "ouro" | "menta" | "preto";
  className?: string;
}) {
  const estilos = {
    ouro: "bg-gradient-to-b from-[#ffe033] to-[#f5c400] text-[#081310] border-2 border-[#081310] shadow-[0_6px_0_#9e7b00,0_16px_34px_rgba(245,196,0,0.3)] hover:-translate-y-0.5 active:translate-y-1",
    menta: "bg-[#c1fbd4] text-[#081310] border-2 border-[#081310] shadow-[0_5px_0_#1d3c36] hover:-translate-y-0.5 active:translate-y-1",
    preto: "bg-[#081310] text-white border-2 border-[#081310] shadow-[0_5px_0_#2f5a52] hover:bg-[#132a24] hover:-translate-y-0.5",
  }[variante];

  return (
    <a
      href={whatsappLink(mensagem, "clinica")}
      target="_blank"
      rel="noopener noreferrer"
      data-origem={origem}
      className={`inline-flex flex-col items-center justify-center rounded-full px-7 py-4 text-center transition-[transform,background-color,filter] motion-reduce:transition-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#f5c400] ${estilos} ${className}`}
    >
      <span className="inline-flex items-center gap-2.5 text-base font-extrabold tracking-tight sm:text-lg">
        <FaWhatsapp className="h-5 w-5 shrink-0" aria-hidden />
        <span>{tituloPrincipal}</span>
      </span>
      {subtitulo && (
        <small className={`mt-0.5 block text-xs font-bold ${variante === "preto" ? "text-[#c1fbd4]" : "text-[#1d3c36]"}`}>
          {subtitulo}
        </small>
      )}
    </a>
  );
}

export default function ClinicasPage() {
  const linkWhatsPrincipal = whatsappLink(ofertaMessage, "clinica");

  return (
    <div
      style={{ fontFeatureSettings: '"ss03"' }}
      className={`${fontesClinica} font-manrope relative z-0 overflow-x-clip bg-[#fbfbf5] pb-24 text-[#081310] antialiased md:pb-0`}
    >
      <a
        href="#oferta"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60] focus-visible:rounded-full focus-visible:bg-[#f5c400] focus-visible:px-5 focus-visible:py-2.5 focus-visible:text-sm focus-visible:font-extrabold focus-visible:text-[#081310]"
      >
        Pular direto para a oferta com 50% OFF na implantação
      </a>

      {/* 1. BARRA SUPERIOR FIXA DE URGÊNCIA E CRONÔMETRO */}
      <FaixaOferta />

      {/* CABEÇALHO ESCURO CINEMÁTICO (Padrão Shopify Dark Track) */}
      <header className="border-b border-white/10 bg-[#081310] text-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Morph Clínica - Voltar para Morph Code">
            <Image src="/logo.jpeg" alt="" width={32} height={32} className="rounded-full ring-1 ring-[#f5c400]/60" />
            <span className="font-fraunces text-lg font-normal tracking-tight text-white">{PRODUTO}</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-white/75 lg:flex">
            <a href="#teste-anamnese" className="transition hover:text-white">Testar Ficha</a>
            <a href="#estoque-financeiro" className="transition hover:text-white">Estoque & Financeiro</a>
            <a href="#demo" className="transition hover:text-white">Demonstração</a>
            <a href="#oferta" className="font-bold text-[#f5c400] transition hover:underline">Oferta 50% OFF</a>
            <a href="#duvidas" className="transition hover:text-white">Dúvidas</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={DEMO.url}
              target="_blank"
              rel="noopener noreferrer"
              data-origem="cabecalho-demo"
              className="hidden rounded-full border border-white/35 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/10 sm:inline-flex sm:items-center sm:gap-1.5"
            >
              Abrir Demo <LuArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </a>
            <a
              href={linkWhatsPrincipal}
              target="_blank"
              rel="noopener noreferrer"
              data-origem="cabecalho-whats"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#c1fbd4] px-4 py-2 text-xs font-extrabold text-[#081310] transition hover:brightness-105 sm:text-sm"
            >
              <FaWhatsapp className="h-4 w-4" aria-hidden />
              <span>Garantir 50% OFF</span>
            </a>
          </div>
        </div>
      </header>

      <main id="conteudo">
        {/* 2. HERO CINEMÁTICO COM PROMESSA IDÊNTICA AO ANÚNCIO + ESCASSEZ DAS 5 VAGAS */}
        <section id="hero" className="relative overflow-hidden border-b-4 border-[#f5c400] bg-[#081310] pb-16 pt-8 text-white md:pb-24 md:pt-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-28 top-0 h-[520px] w-[520px] rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, #f5c400 0%, transparent 70%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-28 bottom-0 h-[460px] w-[460px] rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, #2f5a52 0%, transparent 70%)" }}
          />

          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12">
            <div>
              <SeloAoVivo />

              <p className="font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-[#c1fbd4] sm:text-sm">
                💥 Implantação pela metade · Só 5 vagas até sexta (13/11)
              </p>

              <h1 className="mt-2 font-fraunces text-[2.35rem] font-normal leading-[1.03] tracking-tight text-white sm:text-5xl lg:text-[3.65rem]">
                Perdeu a <span className="italic text-[#f5c400] underline decoration-[#e22b2b] decoration-4 underline-offset-4">ficha da paciente</span> de novo?
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                Coloque <strong className="text-white">ficha digital assinada no celular</strong>, <strong className="text-white">agenda com lembrete no WhatsApp</strong>, <strong className="text-white">estoque por lote e validade</strong> e <strong className="text-white">financeiro com taxa de maquininha</strong> num só sistema — já configurado com o logotipo e as cores da sua clínica.
              </p>

              {/* Resumo direto dos 2 planos exatamente como nos criativos do anúncio */}
              <div className="mt-6 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-4">
                  <span className="inline-block rounded-full bg-[#c1fbd4] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[#081310]">
                    Sem fidelidade
                  </span>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white/70">Plano Mensal</p>
                  <p className="mt-0.5 font-fraunces text-3xl font-semibold text-white">
                    R$ 149<span className="font-manrope text-sm font-normal text-white/75">/mês</span>
                  </p>
                  <p className="mt-1 text-xs text-white/85">
                    Implantação 50% OFF: de <s>R$ 497</s> por <strong className="text-[#f5c400]">R$ 248,50</strong>
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-[#f5c400] bg-[#f5c400]/15 p-4">
                  <span className="inline-block rounded-full bg-[#f5c400] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[#081310]">
                    Economize R$ 700
                  </span>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#f5c400]">Licença Vitalícia</p>
                  <p className="mt-0.5 font-fraunces text-3xl font-semibold text-[#f5c400]">
                    R$ 2.000 <s className="font-manrope text-sm font-normal text-white/50">R$ 2.700</s>
                  </p>
                  <p className="mt-1 text-xs text-white/90">
                    Implantação + 12 meses inclusos (depois R$ 97/mês)
                  </p>
                </div>
              </div>

              {/* Barra de escassez das 5 vagas de implantação */}
              <PainelEscassezHero />

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <CtaWhatsApp
                  origem="hero-principal"
                  variante="ouro"
                  tituloPrincipal="Quero garantir minha vaga com 50% OFF"
                  subtitulo="Falar no WhatsApp e ver o sistema funcionando na minha clínica"
                  mensagem={ofertaMessage}
                  className="w-full sm:w-auto"
                />
                <a
                  href={DEMO.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-origem="hero-demo"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-6 py-4 text-sm font-extrabold text-white transition hover:bg-white hover:text-[#081310]"
                >
                  Testar demonstração agora <LuArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>

              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-[#c1fbd4] sm:text-[13px]">
                <li className="flex items-center gap-1.5">
                  <LuCheck className="h-4 w-4 text-[#f5c400]" aria-hidden /> A paciente não baixa app (assina pelo link)
                </li>
                <li className="flex items-center gap-1.5">
                  <LuCheck className="h-4 w-4 text-[#f5c400]" aria-hidden /> Passamos sua ficha de papel para o sistema
                </li>
                <li className="flex items-center gap-1.5">
                  <LuCheck className="h-4 w-4 text-[#f5c400]" aria-hidden /> Demonstração aberta sem cadastro
                </li>
              </ul>
            </div>

            {/* Coluna Direita: Imagem real do sistema + selo da oferta */}
            <div className="relative mx-auto w-full max-w-[560px]">
              <div className="overflow-hidden rounded-[1.5rem] border-2 border-[#f5c400] bg-[#0d1f1b] shadow-[0_28px_70px_rgba(0,0,0,0.8)]">
                <div className="flex items-center justify-between border-b border-white/10 bg-[#081310] px-4 py-2.5 text-xs">
                  <span className="font-semibold text-white/80">Tela real do {PRODUTO} (Computador + Celular da Paciente)</span>
                  <span className="rounded-full bg-[#c1fbd4] px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-[#081310]">
                    Pronto para usar
                  </span>
                </div>
                <Img tela={telas.painel} prioridade className="h-auto w-full" />
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-xs text-white/90">
                <span>
                  🔓 <strong className="text-[#f5c400]">Demonstração pública liberada:</strong> usuário <code className="rounded bg-black/50 px-1.5 py-0.5 font-mono text-[#c1fbd4]">{DEMO.usuario}</code> · senha <code className="rounded bg-black/50 px-1.5 py-0.5 font-mono text-[#c1fbd4]">{DEMO.senha}</code>
                </span>
                <a
                  href={DEMO.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-origem="hero-card-demo"
                  className="font-extrabold text-[#f5c400] underline underline-offset-2 hover:text-white"
                >
                  Abrir sistema →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FAIXA DE DESTAQUES RÁPIDOS (Inspirada na barra de conversão) */}
        <div className="border-b-2 border-[#081310] bg-[#c1fbd4] py-3 text-[#081310]">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1.5 px-5 text-xs font-extrabold uppercase tracking-wider sm:text-[13px]">
            <span>✓ Ficha digital assinada com o dedo</span>
            <span>★</span>
            <span>✓ Alerta de alergia no topo do prontuário</span>
            <span>★</span>
            <span>✓ Estoque FEFO (lote que vence primeiro)</span>
            <span>★</span>
            <span>✓ Financeiro com taxa de maquininha</span>
            <span>★</span>
            <span>✓ Lembrete de agenda no WhatsApp</span>
          </div>
        </div>

        {/* 4. SEÇÃO DE DOR & RETORNO IMEDIATO (PAS: Quanto custa continuar no papel/planilha) */}
        <section id="rotina" className="scroll-mt-20 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal className="max-w-3xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#b91c1c]">
                Faça a conta na ponta do lápis
              </p>
              <h2 className="mt-2 font-fraunces text-3xl font-normal leading-[1.08] tracking-tight text-[#081310] sm:text-5xl">
                Uma única ampola vencida ou ficha perdida já custa mais caro que o sistema inteiro.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#3f3f46] sm:text-lg">
                Clínica de estética movimenta insumos caros e procedimentos delicados. Continuar espalhando <strong className="text-[#081310]">ficha em pasta de arquivo</strong>, <strong className="text-[#081310]">agenda no caderno</strong> e <strong className="text-[#081310]">caixa em planilha</strong> faz você perder dinheiro todo mês sem perceber:
              </p>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {comparativosPrejuizo.map((c) => (
                <div
                  key={c.titulo}
                  className={`flex flex-col justify-between rounded-2xl border-2 p-6 ${
                    c.ruim
                      ? "border-[#e6c5bf] bg-[#fff8f6]"
                      : "border-[#081310] bg-[#c1fbd4] shadow-[6px_6px_0_#081310]"
                  }`}
                >
                  <div>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider ${
                        c.ruim ? "bg-[#fee2e2] text-[#991b1b]" : "bg-[#081310] text-[#f5c400]"
                      }`}
                    >
                      {c.tag}
                    </span>
                    <h3 className="mt-4 font-fraunces text-2xl font-medium leading-snug text-[#081310]">
                      {c.titulo}
                    </h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-[#27272a]">
                      {c.texto}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. SIMULADOR INTERATIVO 1: TESTE A FICHA DE ANAMNESE NO CELULAR AGORA */}
        <section id="teste-anamnese" className="scroll-mt-20 border-y border-[#e4e4e7] bg-white py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal className="mb-12 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c1fbd4] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#081310]">
                <LuSparkles className="h-3.5 w-3.5" aria-hidden /> Teste interativo ao vivo · Sem sair desta página
              </span>
              <h2 className="mt-3 font-fraunces text-3xl font-normal leading-[1.08] tracking-tight text-[#081310] sm:text-5xl">
                Veja como a sua paciente assina a ficha no celular em 1 minuto.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#3f3f46] sm:text-lg">
                Toque em <strong>“Sim”</strong> ou <strong>“Não”</strong> no celular abaixo como se fosse a paciente. Repare como os <strong className="text-[#9c2a22]">alertas clínicos de alergia, gestante e medicamentos</strong> aparecem na mesma hora para a doutora:
              </p>
            </Reveal>

            <TestePaciente />

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-[#081310] bg-[#d4f9e0] p-6">
              <div>
                <p className="font-fraunces text-xl font-medium text-[#081310]">
                  Quer usar as perguntas da sua ficha de papel atual?
                </p>
                <p className="mt-1 text-sm text-[#27272a]">
                  Na implantação nós cadastramos todas as perguntas e termos da sua clínica para você. E depois você edita quando quiser.
                </p>
              </div>
              <CtaWhatsApp
                origem="simulador-ficha"
                variante="preto"
                tituloPrincipal="Quero minha ficha no celular"
                subtitulo="Implantação com 50% OFF (R$ 248,50) até 13/11"
                mensagem={ofertaMessage}
              />
            </div>
          </div>
        </section>

        {/* 6. SIMULADORES INTERATIVOS 2 E 3: ESTOQUE FEFO + FINANCEIRO COM TAXA DE MAQUININHA */}
        <section id="estoque-financeiro" className="scroll-mt-20 py-16 md:py-24">
          <div className="mx-auto max-w-6xl space-y-20 px-5">
            {/* Bloco Estoque FEFO */}
            <div>
              <Reveal className="mb-8 max-w-3xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c1fbd4] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#081310]">
                  Módulo de Estoque FEFO Incluso
                </span>
                <h2 className="mt-3 font-fraunces text-3xl font-normal leading-[1.08] tracking-tight text-[#081310] sm:text-5xl">
                  Nunca mais descubra uma ampola vencida na hora de aplicar.
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#3f3f46] sm:text-lg">
                  Clique nos insumos abaixo ou no botão <strong>“Simular baixa FEFO”</strong>. O sistema prioriza automaticamente o lote que vence primeiro e trava lotes vencidos:
                </p>
              </Reveal>
              <MockupEstoque />
            </div>

            {/* Bloco Financeiro Líquido */}
            <div>
              <Reveal className="mb-8 max-w-3xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c1fbd4] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#081310]">
                  Módulo Financeiro com Maquininha Incluso
                </span>
                <h2 className="mt-3 font-fraunces text-3xl font-normal leading-[1.08] tracking-tight text-[#081310] sm:text-5xl">
                  Saiba exatamente quanto cai líquido na conta da clínica.
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#3f3f46] sm:text-lg">
                  Teste o simulador de taxas à direita (PIX, Crédito 1x ou Crédito 3x). O cartão parcelado entra parcela por parcela no mês em que compensa, e nenhum lançamento pode ser apagado sem histórico:
                </p>
              </Reveal>
              <MockupFinanceiro />
            </div>

            {/* Extras inclusos */}
            <div>
              <h3 className="font-fraunces text-2xl font-medium text-[#081310] sm:text-3xl">
                E tudo isso também já vem pronto na sua conta:
              </h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {extras.map(({ icon: Icone, titulo: t, texto }) => (
                  <div key={t} className="flex items-start gap-4 rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-sm">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#c1fbd4] text-[#081310]">
                      <Icone className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <h4 className="font-bold text-[#081310]">{t}</h4>
                      <p className="mt-1 text-sm text-[#52525b]">{texto}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7. DEMONSTRAÇÃO PÚBLICA IMEDIATA (Transparência Total antes de pagar) */}
        <section id="demo" className="scroll-mt-20 border-y-2 border-[#081310] bg-[#081310] py-16 text-white md:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <span className="inline-block rounded-full bg-[#f5c400] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#081310]">
                Prova real · Nada escondido
              </span>
              <h2 className="mt-3 font-fraunces text-3xl font-normal leading-[1.08] tracking-tight text-white sm:text-5xl">
                Entre no sistema agora mesmo antes de gastar 1 real.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
                Deixamos uma clínica de demonstração inteira aberta para você clicar em tudo: abrir prontuários, enviar ficha para o seu WhatsApp, dar baixa em lote de toxina e testar o financeiro.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={DEMO.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-origem="secao-demo-botao"
                  className="inline-flex items-center gap-2 rounded-full bg-[#c1fbd4] px-7 py-4 text-sm font-extrabold text-[#081310] transition hover:brightness-105"
                >
                  Abrir sistema de demonstração <LuArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
                <a
                  href={APRESENTACAO_PDF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Ver apresentação em PDF
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-3xl border-2 border-[#f5c400] bg-[#0d1f1b] p-7 shadow-2xl">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#f5c400]">
                  Credenciais públicas de teste (copie ou clique para entrar)
                </p>
                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 rounded-2xl border border-white/10 bg-[#081310] p-5 text-base">
                  <dt className="text-white/60">Endereço:</dt>
                  <dd className="truncate font-mono text-sm font-semibold text-[#c1fbd4]">morph-clinica-demo.vercel.app</dd>
                  <dt className="text-white/60">Usuário:</dt>
                  <dd className="font-mono font-bold text-white">{DEMO.usuario}</dd>
                  <dt className="text-white/60">Senha:</dt>
                  <dd className="font-mono font-bold text-white">{DEMO.senha}</dd>
                </dl>
                <p className="mt-4 text-xs text-white/65">
                  * Clínica e pacientes fictícios. Não pede e-mail nem cartão de crédito.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 8. COMO FUNCIONA EM 3 PASSOS */}
        <section id="como-funciona" className="scroll-mt-20 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#2f5a52]">
                Rápido e sem dor de cabeça
              </p>
              <h2 className="mt-2 font-fraunces text-3xl font-normal leading-[1.08] tracking-tight text-[#081310] sm:text-5xl">
                Como colocamos a sua clínica no ar esta semana:
              </h2>
            </Reveal>

            <ol className="mt-10 grid gap-5 md:grid-cols-3">
              {passos.map((p) => (
                <li key={p.num} className="rounded-2xl border-2 border-[#081310] bg-white p-7 shadow-[5px_5px_0_#081310]">
                  <span className="inline-grid h-10 w-10 place-items-center rounded-lg border-2 border-[#081310] bg-[#f5c400] font-mono text-sm font-extrabold text-[#081310]">
                    {p.num}
                  </span>
                  <h3 className="mt-4 font-fraunces text-2xl font-medium text-[#081310]">{p.titulo}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#3f3f46]">{p.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 9. SEÇÃO DE OFERTA PROTAGONISTA (Caixa de Conversão com Cronômetro Grande + Empilhamento + 2 Planos) */}
        <section
          id="oferta"
          className="scroll-mt-16 border-t-4 border-[#f5c400] bg-gradient-to-b from-[#081310] via-[#0d1f1b] to-[#081310] py-16 text-white md:py-24"
        >
          <div className="mx-auto max-w-5xl px-5">
            <div className="rounded-[2rem] border-3 border-[#f5c400] bg-white p-6 text-[#081310] shadow-[0_28px_70px_rgba(0,0,0,0.75),0_0_0_6px_rgba(245,196,0,0.16)] sm:p-10">
              {/* Cronômetro Regressivo Grande em Blocos */}
              <CronometroOfertaGrande />

              <div className="text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#f5b5b5] bg-[#fff2f2] px-4 py-1.5 text-xs font-extrabold text-[#991414] sm:text-sm">
                  <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#e22b2b] motion-reduce:animate-none" aria-hidden />
                  🔥 Só 5 vagas de implantação com 50% OFF até 13/11 · Restam 2 vagas disponíveis
                </span>

                <h2 className="mt-4 font-fraunces text-3xl font-normal leading-[1.06] tracking-tight text-[#081310] sm:text-5xl">
                  Tudo o que a sua clínica leva ao garantir a vaga hoje:
                </h2>
                <p className="mx-auto mt-2 max-w-2xl text-base text-[#52525b]">
                  Os dois planos incluem todos os módulos liberados, pacientes ilimitadas e banco de dados exclusivo da sua clínica:
                </p>
              </div>

              {/* Empilhamento de Valor (Value Stack estilo 100 Receitas) */}
              <ul className="mx-auto mt-8 max-w-3xl divide-y divide-dashed divide-[#d4d4d8] rounded-2xl border-2 border-[#081310] bg-[#fbfbf5] px-5 py-2 sm:px-7">
                {empilhamentoEntregaveis.map((item) => (
                  <li key={item.titulo} className="py-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="flex items-center gap-2.5 text-base font-extrabold text-[#081310] sm:text-[17px]">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#081310] text-[#f5c400]">
                          <LuCheck className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        {item.titulo}
                      </span>
                      <span className="rounded-md border border-[#9e7b00] bg-[#fff6cf] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[#081310]">
                        {item.tag}
                      </span>
                    </div>
                    <p className="mt-1 pl-8 text-sm text-[#52525b]">{item.detalhe}</p>
                  </li>
                ))}
              </ul>

              {/* Cartões dos 2 Planos (Polaridade Shopify: Branco vs Aloe Mint/Ouro) */}
              <div id="planos" className="mt-10 grid gap-6 md:grid-cols-2">
                {planos.map((p) => {
                  const ehMensal = p.id === "mensal";
                  return (
                    <div
                      key={p.id}
                      className={`relative flex flex-col justify-between rounded-2xl border-2 border-[#081310] p-7 ${
                        ehMensal
                          ? "bg-white shadow-[6px_6px_0_#081310]"
                          : "bg-[#c1fbd4] shadow-[8px_8px_0_#081310]"
                      }`}
                    >
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-[#081310]">
                            {p.nome}
                          </span>
                          {ehMensal ? (
                            <span className="rounded-full bg-[#f5c400] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#081310]">
                              Implantação 50% OFF (Só 5 vagas)
                            </span>
                          ) : (
                            <span className="rounded-full bg-[#081310] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#f5c400]">
                              Economia de R$ 700 · Vitalícia
                            </span>
                          )}
                        </div>

                        <div className="mt-4">
                          <p className="font-fraunces text-5xl font-semibold tracking-tight text-[#081310]">
                            {ehMensal ? p.preco : <PrecoLicenca />}
                          </p>
                          <p className="mt-2 text-sm font-bold text-[#1e2b28]">
                            {ehMensal ? <PrecoImplantacao claro={false} /> : p.detalhe}
                          </p>
                        </div>

                        <ul className="mt-6 space-y-2.5 border-t border-[#081310]/15 pt-5 text-sm font-semibold text-[#081310]">
                          {p.itens.map((item) => (
                            <li key={item} className="flex items-start gap-2.5">
                              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#081310] text-[#c1fbd4]">
                                <LuCheck className="h-3 w-3" aria-hidden />
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-8">
                        <CtaWhatsApp
                          origem={ehMensal ? "plano-mensal" : "plano-licenca"}
                          variante={ehMensal ? "ouro" : "preto"}
                          tituloPrincipal={
                            ehMensal
                              ? "Garantir Plano Mensal (Implantação R$ 248,50)"
                              : "Garantir Licença Vitalícia (R$ 2.000)"
                          }
                          subtitulo={
                            ehMensal
                              ? "Economize R$ 248,50 na implantação · Sem fidelidade"
                              : "De R$ 2.700 por R$ 2.000 à vista ou em até 3x"
                          }
                          mensagem={ehMensal ? ofertaMessage : ofertaLicencaMessage}
                          className="w-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bloco de Garantia / Risco Zero */}
              <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border-2 border-[#9e7b00] bg-[#fff6cf] p-5 text-left sm:flex-row sm:p-6">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-2 border-[#f5c400] bg-[#081310] text-center font-mono text-xs font-extrabold leading-tight text-[#f5c400]">
                  <span>
                    RISCO
                    <strong className="block text-sm text-white">ZERO</strong>
                  </span>
                </div>
                <div className="text-sm leading-relaxed text-[#151c17]">
                  <p className="text-base font-extrabold text-[#081310]">
                    Você testa antes de decidir e não fica presa a contrato de fidelidade.
                  </p>
                  <p className="mt-1">
                    Você pode explorar a demonstração agora mesmo ou pedir uma apresentação de 20 minutos pelo WhatsApp. No plano mensal não existe multa nem fidelidade, e os dados da sua clínica (fichas assinadas, fotos e histórico) são 100% seus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. PERGUNTAS FREQUENTES (Quebra de Objeções) */}
        <section id="duvidas" className="scroll-mt-20 py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-5">
            <Reveal className="text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#2f5a52]">
                Tire suas dúvidas antes de chamar
              </p>
              <h2 className="mt-2 font-fraunces text-3xl font-normal leading-tight tracking-tight text-[#081310] sm:text-5xl">
                Perguntas frequentes
              </h2>
            </Reveal>

            <div className="mt-10 space-y-3">
              {faqClinica.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-[#e4e4e7] bg-white px-6 py-5 shadow-sm open:border-[#081310]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-extrabold text-[#081310] [&::-webkit-details-marker]:hidden">
                    <span>{f.q}</span>
                    <LuPlus className="h-5 w-5 shrink-0 text-[#b91c1c] transition-transform group-open:rotate-45" aria-hidden />
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#3f3f46]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 11. CHAMADA FINAL DE URGÊNCIA */}
        <section className="border-t-2 border-[#081310] bg-[#081310] px-5 py-16 text-center text-white md:py-20">
          <div className="mx-auto max-w-3xl">
            <span className="inline-block rounded-full bg-[#e22b2b] px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-white">
              ⚠️ Últimas vagas da semana com 50% OFF na implantação
            </span>
            <h2 className="mt-4 font-fraunces text-3xl font-normal leading-[1.08] tracking-tight text-white sm:text-5xl">
              Não espere perder outra ficha ou vencer mais uma ampola.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              <TextoOferta
                durante="Garanta uma das 5 vagas até sexta (13/11) para pagar metade na implantação (de R$ 497 por R$ 248,50) ou levar a Licença Vitalícia por R$ 2.000."
                depois="Chame no WhatsApp para ver o sistema ao vivo em 20 minutos, com uma ficha de teste chegando no seu celular."
              />
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CtaWhatsApp
                origem="fechamento-final"
                variante="ouro"
                tituloPrincipal="Quero garantir minha vaga pelo WhatsApp"
                subtitulo="Resposta rápida · Implantação R$ 248,50 ou Vitalícia R$ 2.000"
                mensagem={ofertaMessage}
              />
            </div>
            <p className="mt-10 text-xs text-white/50">
              {PRODUTO} é um produto{" "}
              <Link href="/" className="underline hover:text-white">
                Morph Code
              </Link>{" "}
              · Lucas Veiga Pinheiro · (11) 91215-0103 ·{" "}
              <a href="mailto:morphcode.dev@gmail.com" className="underline hover:text-white">
                morphcode.dev@gmail.com
              </a>{" "}
              · @morphcode.dev
            </p>
          </div>
        </section>
      </main>

      {/* TOAST DE ATIVIDADE AO VIVO + BARRA FIXA MOBILE */}
      <FlutuantesConversao linkWhatsOferta={linkWhatsPrincipal} />

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(dadosEstruturados)} />
    </div>
  );
}
