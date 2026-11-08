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
    fundo: "bg-[#fbeee8]",
  },
  {
    id: "estoque",
    eyebrow: "Estoque",
    titulo: "Veja o que vence antes de perder a ampola.",
    texto: "Toxinas, preenchedores e bioestimuladores por lote e validade. O atendimento dá baixa no lote que vence primeiro.",
    itens: ["Lote vencido bloqueado, com descarte e motivo", "Mínimo, ideal e sugestão de compra", "Valor em estoque pelo custo de cada lote"],
    tela: telas.estoque,
    fundo: "bg-porcelana",
  },
  {
    id: "financeiro",
    eyebrow: "Financeiro",
    titulo: "Quanto realmente cai na conta.",
    texto: "As taxas da maquininha entram no cálculo e o cartão parcelado aparece parcela a parcela, no mês em que cai.",
    itens: ["Sinal no agendamento e recebimentos em atraso", "Lançamentos nunca apagados: estorno com motivo", "Resultado do mês antes de impostos e retirada"],
    tela: telas.financeiro,
    fundo: "bg-[#f4efe6]",
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
  return <p className={`mb-3 text-sm font-bold ${claro ? "text-argila" : "text-eucalipto"}`}>{children}</p>;
}

function Img({ tela, className = "", prioridade = false, sizes = "(min-width: 1024px) 560px, 100vw" }: { tela: Tela; className?: string; prioridade?: boolean; sizes?: string }) {
  return <Image src={tela.src} alt={tela.alt} width={tela.width} height={tela.height} priority={prioridade} sizes={sizes} className={className} />;
}

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
    verde: "bg-eucalipto text-white shadow-lg shadow-eucalipto/30 hover:brightness-110",
    claro: "bg-white text-eucalipto hover:bg-nevoa",
    argila: "bg-argila text-eucalipto-escuro shadow-lg shadow-black/25 hover:brightness-105",
  }[variante];
  return (
    <a
      href={whatsappLink(mensagem, "clinica")}
      target="_blank"
      rel="noopener noreferrer"
      data-origem={origem}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-[15px] font-bold transition-[transform,filter,background-color] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-argila sm:whitespace-nowrap ${cor} ${className}`}
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
  const linkWhatsOferta = whatsappLink(ofertaMessage, "clinica");

  return (
    <div className={`${fontesClinica} font-manrope relative z-0 overflow-x-clip bg-white pb-24 pt-9 text-grafite antialiased md:pb-12 md:pt-0`}>
      <a
        href="#conteudo"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-eucalipto focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:text-white"
      >
        Ir para o conteúdo
      </a>

      {/* Faixa da oferta: cronômetro real até o fim das vagas da semana (13/11) e depois até 23/12 */}
      <FaixaOferta />

      {/* Cabeçalho original */}
      <header className="sticky top-9 z-30 bg-eucalipto-escuro/95 backdrop-blur md:top-0">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Voltar para o site da Morph Code">
            <Image src="/logo.jpeg" alt="" width={30} height={30} className="rounded-full" />
            <span className="font-fraunces text-base text-white">{PRODUTO}</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-white/65 lg:flex">
            <a href="#sistema" className={navLink}>O sistema</a>
            <a href="#simuladores" className={navLink}>Testar ao vivo</a>
            <a href="#como-funciona" className={navLink}>Como começar</a>
            <a href="#demo" className={navLink}>Demonstração</a>
            <a href="#planos" className={navLink}>Planos e oferta</a>
            <a href="#duvidas" className={navLink}>Dúvidas</a>
          </nav>
          <a
            href={whatsappLink(clinicaMessage, "clinica")}
            target="_blank"
            rel="noopener noreferrer"
            data-origem="cabecalho"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-eucalipto-escuro hover:bg-nevoa"
          >
            <FaWhatsapp className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Falar no WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>
      </header>

      <main id="conteudo">
        {/* Abertura (estilo original em eucalipto-escuro + argila + Fraunces, alinhada ao anúncio) */}
        <section id="hero" className="relative overflow-hidden bg-eucalipto-escuro text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-32 h-[560px] w-[560px] rounded-full opacity-35 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--argila) 0%, transparent 70%)" }}
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-28 pt-12 md:pt-20 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal>
              <SeloAoVivoClinica />

              <h1 className="text-balance text-[2.3rem] font-extrabold leading-[1.08] tracking-tight md:text-5xl lg:text-[3.45rem]">
                Perdeu a <em className="font-fraunces font-normal text-argila">ficha da paciente</em> de novo?
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
                Ficha assinada no celular da paciente, agenda com lembrete no WhatsApp, estoque por lote e validade e financeiro com taxa de maquininha num só sistema, com a marca da sua clínica.
              </p>

              {/* Resumo claro dos 2 planos exatamente como no criativo do anúncio */}
              <div className="mt-6 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/15">
                  <span className="text-xs font-bold uppercase tracking-wider text-nevoa">Plano mensal · Sem fidelidade</span>
                  <p className="mt-1 font-fraunces text-2xl font-bold text-white">R$ 149/mês</p>
                  <p className="mt-0.5 text-xs text-white/75">
                    Implantação com 50% off: de <s>R$ 497</s> por <strong className="text-argila">R$ 248,50</strong>
                  </p>
                </div>

                <div className="rounded-2xl bg-argila/15 p-4 ring-1 ring-argila/50">
                  <span className="text-xs font-bold uppercase tracking-wider text-argila">Licença vitalícia · 12 meses inclusos</span>
                  <p className="mt-1 font-fraunces text-2xl font-bold text-white">
                    R$ 2.000 <s className="font-manrope text-sm font-normal text-white/50">R$ 2.700</s>
                  </p>
                  <p className="mt-0.5 text-xs text-white/80">
                    À vista ou em 3x · depois R$ 97/mês de hospedagem
                  </p>
                </div>
              </div>

              {/* Barra elegante das 5 vagas de implantação pela metade */}
              <PainelVagasClinica />

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-4 text-[15px] font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-argila"
                >
                  Testar a demonstração <LuArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>

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
              <h2 className="text-balance text-3xl font-extrabold leading-[1.12] tracking-tight md:text-[2.5rem]">
                Uma única ampola vencida ou ficha perdida já custa mais que meses do sistema.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {dores.map((d, i) => (
                <Reveal key={d.hoje} delay={i * 0.07}>
                  <div className="flex h-full flex-col overflow-hidden rounded-3xl ring-1 ring-grafite/10">
                    <div className="bg-[#fbeee8] p-6">
                      <p className="text-xs font-bold uppercase tracking-wide text-[#a4543a]">Hoje sem o sistema</p>
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
              <BotaoWhats
                origem="rotina"
                texto={<TextoOferta durante="Quero aproveitar os 50% na implantação" depois="Quero ver funcionando" />}
                mensagem={ofertaMessage}
              />
              <p className="text-sm text-grafite/60">Resposta direto no WhatsApp, sem formulário.</p>
            </div>
          </div>
        </section>

        {/* O sistema, em quatro cartões */}
        <section id="sistema" className="scroll-mt-20 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="max-w-2xl">
              <Eyebrow>O sistema por dentro</Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold leading-[1.12] tracking-tight md:text-[2.75rem]">
                Da ficha da paciente ao caixa do mês, tudo no mesmo lugar.
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <Reveal>
                <article className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-nevoa">
                  <div className="p-8 pb-0 md:p-10 md:pb-0">
                    <p className="text-sm font-bold text-eucalipto">Anamnese digital</p>
                    <h3 className="mt-2 text-balance text-2xl font-extrabold leading-tight tracking-tight md:text-[1.9rem]">
                      A paciente assina antes de chegar.
                    </h3>
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
              <p className="mt-4 text-xs text-grafite/50">
                Os textos jurídicos podem ser ajustados pela clínica e devem ser revisados pela sua assessoria jurídica.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Simuladores interativos na própria página (Ficha no celular + Estoque FEFO + Financeiro) */}
        <section id="simuladores" className="scroll-mt-20 bg-porcelana py-24">
          <div className="mx-auto max-w-6xl space-y-20 px-6">
            <div>
              <Reveal className="mb-10 max-w-2xl">
                <Eyebrow>Experimente aqui mesmo</Eyebrow>
                <h2 className="text-balance text-3xl font-extrabold leading-[1.12] tracking-tight md:text-[2.75rem]">
                  Simule a ficha da paciente chegando ao prontuário em tempo real.
                </h2>
                <p className="mt-4 text-grafite/70">
                  Marque <strong>“Sim”</strong> ou <strong>“Não”</strong> no celular abaixo e veja como os alertas clínicos aparecem imediatamente para a profissional:
                </p>
              </Reveal>
              <TestePaciente />
            </div>

            <div>
              <Reveal className="mb-8 max-w-2xl">
                <Eyebrow>Simulador de Estoque FEFO</Eyebrow>
                <h3 className="text-balance text-2xl font-extrabold leading-tight tracking-tight md:text-4xl">
                  Clique em “Simular baixa FEFO” e veja o lote mais próximo sair primeiro.
                </h3>
              </Reveal>
              <MockupEstoque />
            </div>

            <div>
              <Reveal className="mb-8 max-w-2xl">
                <Eyebrow>Simulador Financeiro</Eyebrow>
                <h3 className="text-balance text-2xl font-extrabold leading-tight tracking-tight md:text-4xl">
                  Alterne entre PIX, Crédito 1x e Crédito 3x para ver o cálculo líquido real.
                </h3>
              </Reveal>
              <MockupFinanceiro />
            </div>
          </div>
        </section>

        {/* Como começar */}
        <section id="como-funciona" className="scroll-mt-20 bg-eucalipto-escuro py-24 text-white">
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
              <h2 className="text-balance text-3xl font-extrabold leading-[1.12] tracking-tight md:text-[2.75rem]">
                Teste como se fosse a sua clínica, agora.
              </h2>
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
                  data-origem="secao-demo"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-eucalipto px-7 py-4 text-[15px] font-bold text-white shadow-lg shadow-eucalipto/30 transition hover:brightness-110"
                >
                  Abrir o sistema de demonstração <LuArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Planos e Oferta com Cronômetro em Blocos + Empilhamento de Entregáveis */}
        <section id="planos" className="scroll-mt-20 bg-porcelana py-24">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal className="text-center">
              <Eyebrow>Planos e investimento</Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold leading-[1.12] tracking-tight md:text-[2.75rem]">
                Tudo o que você leva ao garantir sua vaga hoje.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-grafite/65">
                Prontuário, estoque e financeiro inclusos nos dois planos, sem limite de pacientes e com banco de dados próprio e isolado.
              </p>

              {/* Cronômetro elegante em blocos nas cores da Morph Clínica */}
              <CronometroPlanosClinica />

              <SeOferta>
                <p className="mx-auto mt-5 inline-block rounded-full bg-argila/15 px-5 py-2 text-sm font-bold text-[#a4543a]">
                  Implantação pela metade (de R$ 497 por R$ 248,50 nas 5 vagas até 13/11) ou Licença Vitalícia por R$ 2.000 (até 23/12).
                </p>
              </SeOferta>
            </Reveal>

            {/* Empilhamento claro do que está incluso */}
            <Reveal className="mt-10">
              <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_8px_30px_-12px_rgba(29,60,54,0.15)] ring-1 ring-grafite/5 md:p-8">
                <p className="text-sm font-bold uppercase tracking-wider text-eucalipto">Resumo do que está incluído na sua conta:</p>
                <ul className="mt-4 divide-y divide-grafite/10">
                  {entregaveisInclusos.map((item) => (
                    <li key={item.titulo} className="py-4 first:pt-2 last:pb-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-2.5 text-base font-bold text-grafite">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-eucalipto/10 text-eucalipto">
                            <LuCheck className="h-3.5 w-3.5" aria-hidden />
                          </span>
                          {item.titulo}
                        </span>
                        <span className="rounded-full bg-nevoa/70 px-3 py-0.5 text-xs font-bold text-eucalipto-escuro">
                          {item.tag}
                        </span>
                      </div>
                      <p className="mt-1 pl-7 text-sm text-grafite/70">{item.detalhe}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Os 2 cartões de planos no estilo Morph Clínica */}
            <div className="mt-10 grid gap-6 md:grid-cols-2 [&>*]:min-w-0">
              {planos.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.1}>
                  <div
                    className={`relative flex h-full flex-col rounded-[1.75rem] p-9 ${
                      p.destaque
                        ? "bg-eucalipto-escuro text-white shadow-2xl shadow-eucalipto/40"
                        : "bg-white shadow-[0_8px_30px_-12px_rgba(29,60,54,0.2)] ring-1 ring-grafite/5"
                    }`}
                  >
                    {p.destaque ? (
                      <span className="absolute -top-3 right-8 rounded-full bg-argila px-3 py-1 text-xs font-bold uppercase tracking-wider text-eucalipto-escuro">
                        Economia de R$ 700 · Menor custo no longo prazo
                      </span>
                    ) : (
                      <span className="absolute -top-3 right-8 rounded-full bg-eucalipto px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                        Só 5 vagas com 50% na implantação
                      </span>
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
              <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-6 ring-1 ring-grafite/10 sm:flex-row sm:px-8">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-nevoa text-eucalipto">
                  <LuShieldCheck className="h-6 w-6" aria-hidden />
                </span>
                <div className="text-center sm:text-left">
                  <p className="font-bold text-grafite">Sem fidelidade no plano mensal e seus dados sempre seus.</p>
                  <p className="mt-0.5 text-sm text-grafite/70">
                    Você testa a demonstração antes de fechar, acompanha a implantação ao vivo e pode cancelar o plano mensal quando quiser com aviso de 30 dias, levando cópia completa de todas as fichas e fotos.
                  </p>
                </div>
              </div>
            </Reveal>

            <p className="mt-8 text-center text-sm text-grafite/60">
              Não sabe qual escolher? Conte o tamanho da sua clínica no WhatsApp e indicamos o plano.{" "}
              <a
                href={whatsappLink(clinicaMessage, "clinica")}
                target="_blank"
                rel="noopener noreferrer"
                data-origem="ajuda-planos"
                className="inline-flex items-center gap-1 font-bold text-eucalipto underline underline-offset-4"
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
              <h2 className="mt-6 text-balance text-3xl font-extrabold leading-[1.12] tracking-tight md:text-5xl">
                Garanta uma das 5 vagas com 50% na implantação.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-nevoa/90">
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
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-4 text-[15px] font-bold text-white transition-colors hover:bg-white/10"
                >
                  Explorar a demonstração <LuArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-grafite/50">
            {PRODUTO} é um produto{" "}
            <Link href="/" className="underline hover:text-eucalipto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-eucalipto">
              Morph Code
            </Link>{" "}
            · Lucas Veiga Pinheiro · (11) 91215-0103 ·{" "}
            <a href="mailto:morphcode.dev@gmail.com" className="underline hover:text-eucalipto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-eucalipto">
              morphcode.dev@gmail.com
            </a>{" "}
            · @morphcode.dev
          </p>
        </section>
      </main>

      {/* Toast flutuante suave + Barra fixa mobile com preço e vagas */}
      <FlutuantesClinica linkWhatsOferta={linkWhatsOferta} />

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(dadosEstruturados)} />
    </div>
  );
}
