import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  LuArrowUpRight,
  LuBellRing,
  LuCalendarCheck,
  LuCamera,
  LuCheck,
  LuCloudDownload,
  LuDownload,
  LuHistory,
  LuLock,
  LuFileText,
  LuArchive,
  LuMonitor,
  LuPlus,
  LuBoxes,
  LuWallet,
  LuPalette,
  LuSparkles,
  LuShieldCheck,
  LuTrendingUp,
} from "react-icons/lu";
import { FaAndroid, FaApple, FaWhatsapp } from "react-icons/fa";
import Reveal from "@/components/Reveal";
import SlideCarousel from "@/components/clinica/SlideCarousel";
import TestePaciente from "@/components/clinica/TestePaciente";
import MockupEstoque from "@/components/clinica/MockupEstoque";
import MockupFinanceiro from "@/components/clinica/MockupFinanceiro";
import MockupEstilo from "@/components/clinica/MockupEstilo";
import { fontesClinica } from "@/lib/fontes-clinica";
import {
  APRESENTACAO_PDF,
  DEMO,
  PRODUTO,
  faqClinica,
  passosInstalarApp,
  planos,
  telas,
  type Tela,
} from "@/lib/clinica";
import { clinicaMessage, planoMessage, whatsappLink } from "@/lib/whatsapp";
import { jsonLd, siteUrl } from "@/lib/site";

const titulo = `${PRODUTO} | Sistema Completo para Clínicas de Estética`;
const descricao =
  "Ficha de anamnese assinada no celular da paciente, estoque inteligente por lote e validade (FEFO), controle financeiro com taxas de maquininha e novo estilo caderno de bem-estar.";

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
        { "@type": "Offer", name: "Plano mensal", price: "149", priceCurrency: "BRL", description: "R$ 149/mês + implantação de R$ 497 (estoque e financeiro inclusos)" },
        { "@type": "Offer", name: "Licença vitalícia", price: "2700", priceCurrency: "BRL", description: "Depois R$ 97/mês de hospedagem (estoque e financeiro inclusos)" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqClinica.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

const passosFicha: { tela: Tela; titulo: string; texto: string }[] = [
  { tela: telas.fichaCelular, titulo: "Envie o link pelo WhatsApp", texto: "Um link individual, de uso único, já com o nome da paciente." },
  { tela: telas.saudeCelular, titulo: "A paciente responde", texto: "Perguntas grandes, fáceis de tocar, com as regras da sua clínica." },
  { tela: telas.assinatura, titulo: "Assina com o dedo", texto: "Tudo vai direto para o prontuário, com data, hora e protocolo." },
];

const seguranca = [
  { icon: LuLock, titulo: "Ficha que não se altera", texto: "Cada ficha assinada recebe um código de verificação e fica guardada como foi enviada." },
  { icon: LuFileText, titulo: "Termos inclusos", texto: "Aviso de privacidade, termo de consentimento e declaração de veracidade." },
  { icon: LuCamera, titulo: "Uso de imagem", texto: "Autorização separada para prontuário e divulgação, com registro de revogação." },
  { icon: LuHistory, titulo: "Histórico de acessos e auditoria", texto: "Registro de quem viu, alterou ou movimentou valores e prontuários." },
  { icon: LuArchive, titulo: "Guarda de 20 anos", texto: "Paciente é arquivada, nunca apagada, como exige a lei do prontuário." },
  { icon: LuCloudDownload, titulo: "Backup em 1 clique", texto: "Cópia completa de todos os dados, guardada onde a clínica quiser." },
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

function BotaoWhats({ texto, mensagem, claro = false }: { texto: string; mensagem: string; claro?: boolean }) {
  return (
    <a
      href={whatsappLink(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
        claro
          ? "bg-white text-eucalipto hover:bg-nevoa"
          : "bg-eucalipto text-white shadow-lg shadow-eucalipto/30 hover:brightness-110"
      }`}
    >
      <FaWhatsapp className="h-4 w-4" aria-hidden /> {texto}
    </a>
  );
}

export default function ClinicasPage() {
  return (
    <div className={`${fontesClinica} font-manrope relative z-0 bg-porcelana text-grafite antialiased`}>
      {/* Cabeçalho */}
      <header className="sticky top-0 z-30 border-b border-grafite/10 bg-porcelana/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Voltar para o site da Morph Code">
            <Image src="/logo.jpeg" alt="" width={30} height={30} className="rounded-full" />
            <span className="text-sm text-grafite/60">
              Morph Code <span className="text-grafite/30">/</span>{" "}
              <span className="font-fraunces text-base text-grafite">{PRODUTO}</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-grafite/65 lg:flex">
            <a href="#como-funciona" className="hover:text-eucalipto transition-colors">Como funciona</a>
            <a href="#estoque" className="hover:text-eucalipto transition-colors">Estoque FEFO</a>
            <a href="#financeiro" className="hover:text-eucalipto transition-colors">Financeiro</a>
            <a href="#estilo" className="hover:text-eucalipto transition-colors">Novo estilo</a>
            <a href="#demo" className="hover:text-eucalipto transition-colors">Demonstração</a>
            <a href="#planos" className="hover:text-eucalipto transition-colors">Planos</a>
          </nav>
          <a
            href={whatsappLink(clinicaMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-eucalipto px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            <FaWhatsapp className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Pedir demonstração</span>
            <span className="sm:hidden">Demonstração</span>
          </a>
        </div>
      </header>

      <main>
        {/* Abertura (Hero) */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 -top-40 h-[640px] w-[640px] rounded-full opacity-70 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--nevoa) 0%, transparent 70%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--argila) 0%, transparent 70%)" }}
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-20 pt-14 md:pt-20 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="rounded-full bg-eucalipto/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-eucalipto">
                  Sistema de Gestão Clínica & Estética
                </span>
                <span className="rounded-full border border-argila/30 bg-argila/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-argila">
                  Novidades: Estoque FEFO & Financeiro
                </span>
              </div>
              <h1 className="font-fraunces text-[2.5rem] leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
                A ficha sai do papel, o estoque <em className="text-eucalipto">avisa antes</em> e o financeiro calcula cada taxa.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-grafite/75 leading-relaxed">
                A paciente preenche e assina no celular. O estoque prioriza o lote que vence primeiro (FEFO) para não perder ampolas caras. O financeiro desconta taxas de maquininha e controla sinais de agendamento. Tudo com o novo visual elegante <strong className="text-eucalipto font-medium">caderno de bem-estar</strong> e a marca da sua clínica.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <BotaoWhats texto="Quero uma demonstração" mensagem={clinicaMessage} />
                <a
                  href={DEMO.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-grafite/20 px-7 py-3.5 text-sm font-semibold text-grafite transition-colors hover:border-eucalipto hover:text-eucalipto"
                >
                  Explorar o sistema <LuArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-grafite/65">
                {[
                  "Ficha digital no celular",
                  "Estoque FEFO e validades",
                  "Financeiro com taxas de cartão",
                  "Caderno de bem-estar",
                  "A partir de R$ 149/mês",
                ].map((t) => (
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

        {/* Como funciona a ficha */}
        <section id="como-funciona" className="border-t border-grafite/10 bg-white py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="max-w-2xl">
              <Eyebrow>Anamnese digital</Eyebrow>
              <h2 className="font-fraunces text-4xl leading-tight md:text-5xl">A ficha no celular da paciente, em 3 passos.</h2>
              <p className="mt-4 text-grafite/70">Sem aplicativo para a paciente baixar. Ela abre o link pelo WhatsApp, responde as perguntas com toque confortável e assina com a ponta do dedo.</p>
            </Reveal>
            <div className="mt-14 grid gap-10 md:grid-cols-3">
              {passosFicha.map((p, i) => (
                <Reveal key={p.titulo} delay={i * 0.1}>
                  <div className="flex aspect-[4/5] items-end justify-center overflow-hidden rounded-3xl bg-porcelana px-8 pt-8">
                    <Image
                      src={p.tela.src}
                      alt={p.tela.alt}
                      width={p.tela.width}
                      height={p.tela.height}
                      sizes="(min-width: 768px) 300px, 80vw"
                      className="h-auto w-full rounded-t-2xl shadow-2xl shadow-eucalipto/25"
                    />
                  </div>
                  <div className="mt-5 flex gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-argila font-fraunces text-lg text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold">{p.titulo}</h3>
                      <p className="mt-1 text-sm text-grafite/65">{p.texto}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Simulador Interativo da Ficha */}
            <div className="mt-20 border-t border-grafite/10 pt-16">
              <Reveal className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-argila">Experimente ao vivo</span>
                <h3 className="font-fraunces text-3xl font-medium text-grafite mt-2">
                  Teste agora como se fosse a sua paciente
                </h3>
                <p className="mt-3 text-sm text-grafite/65">
                  Toque nas perguntas no celular abaixo e veja os alertas clínicos surgirem instantaneamente no prontuário da doutora:
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="rounded-3xl border border-grafite/10 bg-porcelana/80 p-6 md:p-10">
                  <TestePaciente />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* NOVO: Estoque Inteligente com FEFO */}
        <section id="estoque" className="border-t border-grafite/10 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-eucalipto/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-eucalipto mb-4">
                <LuBoxes className="h-4 w-4" /> Novo Módulo
              </div>
              <h2 className="font-fraunces text-4xl leading-tight md:text-5xl">
                Controle de estoque por lote e validade com a regra FEFO.
              </h2>
              <p className="mt-5 text-lg text-grafite/70 leading-relaxed">
                Em clínicas de estética, toxinas botulínicas, preenchedores e bioestimuladores custam caro. O Morph Clínica organiza tudo por lote e validade, garantindo que o produto mais antigo saia primeiro e bloqueando o uso de insumos vencidos.
              </p>
            </Reveal>

            {/* Grid de 4 pilares do Estoque */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-grafite/10 bg-white p-6 shadow-sm">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-eucalipto/10 text-eucalipto">
                  <LuSparkles className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-base text-grafite">Baixa Inteligente FEFO</h3>
                <p className="mt-2 text-xs text-grafite/65 leading-relaxed">
                  First Expire, First Out: ao registrar um procedimento, o sistema deduz prioritariamente do lote mais próximo do vencimento.
                </p>
              </div>

              <div className="rounded-2xl border border-grafite/10 bg-white p-6 shadow-sm">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-argila/15 text-argila">
                  <LuShieldCheck className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-base text-grafite">Bloqueio de Vencidos</h3>
                <p className="mt-2 text-xs text-grafite/65 leading-relaxed">
                  Proteção jurídica e sanitária: lote vencido não pode ser selecionado para aplicação em paciente, exigindo descarte com motivo formal.
                </p>
              </div>

              <div className="rounded-2xl border border-grafite/10 bg-white p-6 shadow-sm">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-eucalipto/10 text-eucalipto">
                  <LuTrendingUp className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-base text-grafite">Sugestão de Compra</h3>
                <p className="mt-2 text-xs text-grafite/65 leading-relaxed">
                  Defina o mínimo e o ideal de cada produto. O sistema calcula a quantidade exata a pedir sem empatar capital de giro desnecessário.
                </p>
              </div>

              <div className="rounded-2xl border border-grafite/10 bg-white p-6 shadow-sm">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-porcelana text-grafite">
                  <LuHistory className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-base text-grafite">Histórico Permanente</h3>
                <p className="mt-2 text-xs text-grafite/65 leading-relaxed">
                  Movimentações nunca são apagadas: entradas, saídas com motivo e descartes ficam guardados junto ao backup do sistema.
                </p>
              </div>
            </div>

            {/* Mockup Interativo de Estoque */}
            <div className="mt-14">
              <Reveal>
                <MockupEstoque />
              </Reveal>
            </div>
          </div>
        </section>

        {/* NOVO: Gestão Financeira com Taxas de Cartão */}
        <section id="financeiro" className="border-t border-grafite/10 bg-white py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-argila/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-argila mb-4">
                <LuWallet className="h-4 w-4" /> Novo Módulo
              </div>
              <h2 className="font-fraunces text-4xl leading-tight md:text-5xl">
                Financeiro feito para a rotina real de quem atende.
              </h2>
              <p className="mt-5 text-lg text-grafite/70 leading-relaxed">
                Chega de planilhas confusas com parcelamento de cartão e de ser surpreendida pelas taxas da maquininha. O Morph Clínica calcula o líquido real que cai na conta e organiza sinais de reserva diretamente na agenda.
              </p>
            </Reveal>

            {/* Grid de 4 pilares do Financeiro */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-grafite/10 bg-porcelana/70 p-6 shadow-sm">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-eucalipto text-white">
                  <LuWallet className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-base text-grafite">Taxas de Maquininha</h3>
                <p className="mt-2 text-xs text-grafite/65 leading-relaxed">
                  Cadastre as taxas de débito e crédito (1x até 12x). Ao registrar a venda, o valor líquido real é apurado na hora e gravado historicamente.
                </p>
              </div>

              <div className="rounded-2xl border border-grafite/10 bg-porcelana/70 p-6 shadow-sm">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-argila text-white">
                  <LuCalendarCheck className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-base text-grafite">Sinal de Agendamento</h3>
                <p className="mt-2 text-xs text-grafite/65 leading-relaxed">
                  Reduza faltas e no-show: registre a entrada na reserva do horário e provisione o saldo para o dia do atendimento no mesmo agendamento.
                </p>
              </div>

              <div className="rounded-2xl border border-grafite/10 bg-porcelana/70 p-6 shadow-sm">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-eucalipto text-white">
                  <LuTrendingUp className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-base text-grafite">Regime de Caixa Real</h3>
                <p className="mt-2 text-xs text-grafite/65 leading-relaxed">
                  O dinheiro entra no mês em que realmente foi pago. Vendas parceladas entram parcela a parcela para você ter clareza total dos meses seguintes.
                </p>
              </div>

              <div className="rounded-2xl border border-grafite/10 bg-porcelana/70 p-6 shadow-sm">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-grafite text-white">
                  <LuLock className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-base text-grafite">Auditoria Contábil</h3>
                <p className="mt-2 text-xs text-grafite/65 leading-relaxed">
                  Lançamentos não são apagados arbitrariamente: estornos e cancelamentos exigem motivo obrigatório e mantêm o livro-caixa íntegro.
                </p>
              </div>
            </div>

            {/* Mockup Interativo de Financeiro */}
            <div className="mt-14">
              <Reveal>
                <MockupFinanceiro />
              </Reveal>
            </div>
          </div>
        </section>

        {/* NOVO: O Novo Estilo Caderno de Bem-Estar */}
        <section id="estilo" className="border-t border-grafite/10 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="max-w-2xl mb-12">
              <Eyebrow>Identidade & Experiência</Eyebrow>
              <h2 className="font-fraunces text-4xl leading-tight md:text-5xl">
                O novo estilo: caderno de bem-estar para clínicas elegantes.
              </h2>
              <p className="mt-5 text-lg text-grafite/70 leading-relaxed">
                A experiência da paciente começa na apresentação do seu consultório. O Morph Clínica substitui o visual de software hospitalar por um design acolhedor, sofisticado e orgânico, com selo monograma de botica e personalização total.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <MockupEstilo />
            </Reveal>
          </div>
        </section>

        {/* Demonstração */}
        <section id="demo" className="border-t border-grafite/10 bg-white py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
            <Reveal>
              <Eyebrow>Demonstração pública</Eyebrow>
              <h2 className="font-fraunces text-4xl leading-tight md:text-5xl">Explore o sistema como se fosse a sua clínica.</h2>
              <p className="mt-5 text-grafite/70">
                Uma clínica de exemplo com prontuários, fichas assinadas, alertas, estoque com ampolas reais, financeiro com lançamentos e agenda preenchida. Mexa à vontade: teste a baixa de estoque, cadastre uma paciente, envie uma ficha para o seu celular e troque as cores da clínica.
              </p>
              <p className="mt-4 text-sm text-grafite/55">
                Clínica e pacientes fictícios. As fichas de teste são apagadas automaticamente em 24 horas.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-[2rem] border border-grafite/10 bg-porcelana p-9 shadow-lg shadow-eucalipto/10">
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
                <p className="mt-3 text-center text-xs text-grafite/50">Abre em outra aba. Funciona perfeitamente no celular, tablet e computador.</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Recursos: Agenda & Personalização */}
        <section id="recursos" className="border-t border-grafite/10 py-24">
          <div className="mx-auto max-w-6xl space-y-28 px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <Reveal delay={0.1} className="order-last lg:order-first">
                <Moldura tela={telas.agenda} />
              </Reveal>
              <Reveal>
                <Eyebrow>Agenda e lembretes</Eyebrow>
                <h2 className="font-fraunces text-4xl leading-tight">Menos faltas, sem conflito de horário.</h2>
                <p className="mt-5 text-grafite/70">
                  A agenda avisa quem tem horário amanhã e ainda não foi lembrada. Um toque abre o WhatsApp com a mensagem
                  pronta, com nome, procedimento e horário.
                </p>
                <div className="mt-6 max-w-sm rounded-2xl rounded-bl-md bg-[#e8f8ee] p-4 text-sm leading-relaxed text-[#173d26] shadow-sm">
                  Olá Ana! Passando para lembrar do seu horário de Harmonização Facial amanhã (24/09), às 09:00, com Dra.
                  Carolina. Podemos confirmar sua presença?
                </div>
                <ul className="mt-6 space-y-2 text-sm text-grafite/70">
                  <li className="flex gap-2"><LuBellRing className="mt-0.5 h-4 w-4 text-eucalipto" aria-hidden /> Registro de quem já recebeu o lembrete</li>
                  <li className="flex gap-2"><LuCalendarCheck className="mt-0.5 h-4 w-4 text-eucalipto" aria-hidden /> Compareceu, faltou ou cancelou, com encaixe quando precisar</li>
                </ul>
              </Reveal>
            </div>

            <div className="grid items-center gap-12 lg:grid-cols-2">
              <Reveal>
                <Eyebrow>Personalização total</Eyebrow>
                <h2 className="font-fraunces text-4xl leading-tight">Com a cara da sua clínica, e você mesma ajusta.</h2>
                <p className="mt-5 text-grafite/70">
                  Logo, foto, cores, letras, procedimentos, tabela de preços, perguntas da ficha e mensagens. Sem depender de programador: você altera na tela de configurações e vale na hora, inclusive na ficha que a paciente abre.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Logo e monograma",
                    "8 paletas refinadas",
                    "Tabela de procedimentos",
                    "Editor de anamnese",
                    "Módulos on/off",
                    "Taxas de cartão",
                    "Dados legais",
                  ].map((c) => (
                    <span key={c} className="rounded-full border border-nevoa bg-white px-4 py-1.5 text-sm font-semibold text-eucalipto shadow-sm">
                      {c}
                    </span>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.1} className="space-y-5">
                <Moldura tela={telas.cores} />
                <Moldura tela={telas.editorFicha} className="ml-auto w-[82%]" />
              </Reveal>
            </div>
          </div>
        </section>

        {/* Aplicativo PWA */}
        <section id="aplicativo" className="border-t border-grafite/10 bg-white py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="max-w-2xl">
              <Eyebrow>Aplicativo instalável</Eyebrow>
              <h2 className="font-fraunces text-4xl leading-tight md:text-5xl">Instale como aplicativo, sem loja.</h2>
              <p className="mt-5 text-grafite/70">
                O sistema vira um app no celular, no tablet e no computador: ícone com a marca da sua clínica na tela inicial,
                abre em tela cheia, sem a barra do navegador. Não precisa baixar nada da App Store nem da Play Store, e as
                atualizações chegam sozinhas.
              </p>
              <p className="mt-4 inline-flex items-start gap-2 text-sm text-grafite/60">
                <LuLock className="mt-0.5 h-4 w-4 shrink-0 text-eucalipto" aria-hidden />
                As fichas e prontuários continuam guardados no servidor seguro com banco exclusivo da sua clínica.
              </p>
            </Reveal>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {passosInstalarApp.map((sistema, i) => {
                const Icone = sistema.id === "iphone" ? FaApple : sistema.id === "android" ? FaAndroid : LuMonitor;
                return (
                  <Reveal key={sistema.id} delay={i * 0.08}>
                    <div className="h-full rounded-[2rem] border border-grafite/10 bg-porcelana p-8 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-eucalipto text-white">
                          <Icone className="h-5 w-5" aria-hidden />
                        </span>
                        <h3 className="font-fraunces text-2xl">{sistema.titulo}</h3>
                      </div>
                      <ol className="mt-6 space-y-4">
                        {sistema.passos.map((passo, n) => (
                          <li key={passo} className="flex gap-3 text-[15px] leading-relaxed text-grafite/75">
                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-eucalipto/10 text-xs font-bold text-eucalipto">
                              {n + 1}
                            </span>
                            <span>{passo}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </Reveal>
                );
              })}
            </div>
            <Reveal className="mt-10 text-center">
              <a
                href={DEMO.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-eucalipto hover:underline"
              >
                Experimente agora: instale a demonstração no seu celular <LuArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </Reveal>
          </div>
        </section>

        {/* Segurança e LGPD */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="max-w-2xl">
              <Eyebrow>Segurança e LGPD</Eyebrow>
              <h2 className="font-fraunces text-4xl leading-tight md:text-5xl">Segurança jurídica desde a primeira consulta.</h2>
            </Reveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {seguranca.map(({ icon: Icone, titulo: t, texto }, i) => (
                <Reveal key={t} delay={i * 0.05}>
                  <div className="h-full rounded-3xl border border-grafite/10 bg-white p-6 shadow-sm">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-eucalipto text-white">
                      <Icone className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="mt-5 text-lg font-bold">{t}</h3>
                    <p className="mt-2 text-sm text-grafite/65">{texto}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-6 text-xs text-grafite/50">
              Os textos jurídicos podem ser ajustados pela clínica e devem ser revisados pela sua assessoria jurídica.
            </p>
          </div>
        </section>

        {/* Apresentação comercial */}
        <section id="apresentacao" className="border-t border-grafite/10 bg-white py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <Reveal>
              <Eyebrow>Apresentação comercial</Eyebrow>
              <h2 className="font-fraunces text-4xl leading-tight">Veja a apresentação completa.</h2>
              <p className="mt-5 text-grafite/70">
                Os mesmos slides que usamos nas reuniões com clínicas de estética. Navegue pelas setas ou baixe o PDF para mostrar à
                sua sócia ou equipe.
              </p>
              <a
                href={APRESENTACAO_PDF}
                download
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-grafite/20 px-6 py-3 text-sm font-semibold transition-colors hover:border-eucalipto hover:text-eucalipto"
              >
                <LuDownload className="h-4 w-4" aria-hidden /> Baixar apresentação (PDF)
              </a>
            </Reveal>
            <Reveal delay={0.1}>
              <SlideCarousel tema="claro" />
            </Reveal>
          </div>
        </section>

        {/* Planos */}
        <section id="planos" className="relative overflow-hidden py-24">
          <div className="relative mx-auto max-w-5xl px-6">
            <Reveal className="text-center">
              <Eyebrow>Planos e investimento</Eyebrow>
              <h2 className="font-fraunces text-4xl leading-tight md:text-5xl">Escolha como começar na sua clínica.</h2>
              <p className="mx-auto mt-4 max-w-xl text-grafite/65">
                Prontuário digital, estoque FEFO e financeiro inclusos. Sem limite de pacientes e com banco de dados próprio e isolado.
              </p>
            </Reveal>
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {planos.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.1}>
                  <div
                    className={`relative flex h-full flex-col rounded-[2rem] p-9 ${
                      p.destaque
                        ? "bg-eucalipto text-white shadow-2xl shadow-eucalipto/40"
                        : "border border-grafite/10 bg-white shadow-lg shadow-eucalipto/10"
                    }`}
                  >
                    {p.destaque && (
                      <span className="absolute -top-3 right-8 rounded-full bg-argila px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                        Mais econômico
                      </span>
                    )}
                    <p className={`text-xs font-bold uppercase tracking-[0.2em] ${p.destaque ? "text-nevoa" : "text-argila"}`}>{p.nome}</p>
                    <p className="mt-4 font-fraunces text-5xl">{p.preco}</p>
                    <p className={`mt-2 text-sm ${p.destaque ? "text-nevoa/85" : "text-grafite/60"}`}>{p.detalhe}</p>
                    <ul className="mt-8 flex-1 space-y-3">
                      {p.itens.map((item) => (
                        <li key={item} className="flex items-center gap-3 text-[15px]">
                          <span className={`grid h-5 w-5 place-items-center rounded-full ${p.destaque ? "bg-white/15" : "bg-eucalipto/10"}`}>
                            <LuCheck className={`h-3 w-3 ${p.destaque ? "text-white" : "text-eucalipto"}`} aria-hidden />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-9">
                      <BotaoWhats texto={p.cta} mensagem={planoMessage(p.nome)} claro={p.destaque} />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Dúvidas (FAQ) */}
        <section className="py-24 border-t border-grafite/10 bg-white">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal className="text-center">
              <Eyebrow>Tire suas dúvidas</Eyebrow>
              <h2 className="font-fraunces text-4xl leading-tight">Perguntas frequentes das doutoras</h2>
            </Reveal>
            <div className="mt-10 divide-y divide-grafite/10 border-y border-grafite/10">
              {faqClinica.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-grafite [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <LuPlus className="h-5 w-5 shrink-0 text-argila transition-transform group-open:rotate-45" aria-hidden />
                  </summary>
                  <p className="mt-3 text-grafite/70 leading-relaxed text-[15px]">{f.a}</p>
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
                <Image
                  src="/logo.jpeg"
                  alt="Morph Code"
                  width={80}
                  height={80}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <h2 className="mt-6 font-fraunces text-4xl leading-tight md:text-5xl">Vamos ver funcionando na sua clínica?</h2>
              <p className="mx-auto mt-4 max-w-lg text-nevoa/90">
                Demonstração ao vivo de 20 minutos, com ficha de teste no seu WhatsApp e simulação de estoque e financeiro.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <BotaoWhats texto="Agendar demonstração" mensagem={clinicaMessage} claro />
                <a
                  href={DEMO.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Explorar a demonstração <LuArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
                <a
                  href={APRESENTACAO_PDF}
                  download
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <LuDownload className="h-4 w-4" aria-hidden /> Baixar apresentação
                </a>
              </div>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-grafite/50">
            {PRODUTO} é um produto <Link href="/" className="underline hover:text-eucalipto">Morph Code</Link> · Lucas Veiga Pinheiro ·
            (11) 93095-7162 ·{" "}
            <a href="mailto:morphcode.dev@gmail.com" className="underline hover:text-eucalipto">morphcode.dev@gmail.com</a> · @morphcode.dev
          </p>
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(dadosEstruturados)} />
    </div>
  );
}
