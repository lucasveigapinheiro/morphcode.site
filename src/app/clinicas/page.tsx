import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  LuArrowRight,
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
  LuSmartphone,
  LuPlus,
} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import Reveal from "@/components/Reveal";
import SlideCarousel from "@/components/clinica/SlideCarousel";
import TestePaciente from "@/components/clinica/TestePaciente";
import { fontesClinica } from "@/lib/fontes-clinica";
import {
  APRESENTACAO_PDF,
  PRODUTO,
  faqClinica,
  passosImplantacao,
  planos,
  telas,
  type Tela,
} from "@/lib/clinica";
import { clinicaMessage, planoMessage, whatsappLink } from "@/lib/whatsapp";

const titulo = `${PRODUTO} | Sistema para clínicas de estética`;
const descricao =
  "Ficha de anamnese assinada no celular, prontuário com alertas, agenda com lembretes pelo WhatsApp e LGPD, com a marca da sua clínica.";

export const metadata: Metadata = {
  title: titulo,
  description: descricao,
  openGraph: { title: titulo, description: descricao, url: "/clinicas", siteName: "Morph Code", locale: "pt_BR", type: "website" },
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
  { icon: LuHistory, titulo: "Histórico de acessos", texto: "Registro de quem viu, alterou ou enviou cada informação." },
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
          <nav className="hidden items-center gap-7 text-sm text-grafite/65 md:flex">
            <a href="#como-funciona" className="hover:text-eucalipto">Como funciona</a>
            <a href="#teste" className="hover:text-eucalipto">Teste agora</a>
            <a href="#recursos" className="hover:text-eucalipto">Recursos</a>
            <a href="#planos" className="hover:text-eucalipto">Planos</a>
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
        {/* Abertura */}
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
              <Eyebrow>Sistema para clínicas de estética</Eyebrow>
              <h1 className="font-fraunces text-[2.6rem] leading-[1.05] tracking-tight md:text-6xl">
                A ficha de anamnese sai do papel e <em className="text-eucalipto">avisa antes</em> do procedimento.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-grafite/70">
                A paciente preenche e assina no celular. Alergias e contraindicações aparecem em destaque no prontuário.
                Agenda, lembretes e LGPD, tudo com a marca da sua clínica.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <BotaoWhats texto="Quero uma demonstração" mensagem={clinicaMessage} />
                <a
                  href="#teste"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-grafite/20 px-7 py-3.5 text-sm font-semibold text-grafite transition-colors hover:border-eucalipto hover:text-eucalipto"
                >
                  Testar como paciente <LuArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-grafite/60">
                {["Sem instalar nada", "Funciona no celular", "A partir de R$ 89/mês"].map((t) => (
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

        {/* Como funciona */}
        <section id="como-funciona" className="border-t border-grafite/10 bg-white py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="max-w-2xl">
              <Eyebrow>Como funciona</Eyebrow>
              <h2 className="font-fraunces text-4xl leading-tight md:text-5xl">A ficha no celular da paciente, em 3 passos.</h2>
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
          </div>
        </section>

        {/* Teste interativo */}
        <section id="teste" className="relative overflow-hidden py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--nevoa) 0%, transparent 70%)" }}
          />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Teste agora</Eyebrow>
              <h2 className="font-fraunces text-4xl leading-tight md:text-5xl">Responda como paciente. Veja o que a doutora vê.</h2>
              <p className="mt-4 text-grafite/65">
                Marque &quot;Sim&quot; em alguma pergunta e acompanhe o alerta chegando ao prontuário, na hora.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-14">
              <TestePaciente />
            </Reveal>
          </div>
        </section>

        {/* Recursos */}
        <section id="recursos" className="border-t border-grafite/10 bg-white py-24">
          <div className="mx-auto max-w-6xl space-y-28 px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <Reveal>
                <Eyebrow>Prontuário</Eyebrow>
                <h2 className="font-fraunces text-4xl leading-tight">Um prontuário que avisa antes do procedimento.</h2>
                <ul className="mt-7 space-y-4 text-grafite/75">
                  {[
                    ["Alertas automáticos", "alergias, gestação, medicamentos e doenças em destaque."],
                    ["Evolução de cada atendimento", "produto, lote, validade, dose e região aplicada."],
                    ["Fotos antes e depois", "só com a autorização da paciente registrada na ficha."],
                    ["Impressão e PDF", "prontuário completo para imprimir ou arquivar."],
                  ].map(([t, d]) => (
                    <li key={t} className="flex gap-3">
                      <LuCheck className="mt-1 h-4 w-4 shrink-0 text-eucalipto" aria-hidden />
                      <span><strong className="text-grafite">{t}:</strong> {d}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.1} className="relative">
                <Moldura tela={telas.alertas} />
                <Moldura tela={telas.evolucao} className="relative -mt-16 ml-auto w-[78%]" />
              </Reveal>
            </div>

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
                <Eyebrow>Personalização</Eyebrow>
                <h2 className="font-fraunces text-4xl leading-tight">Com a cara da sua clínica, e ela mesma ajusta.</h2>
                <p className="mt-5 text-grafite/70">
                  Logo, foto, cores, letras, serviços, perguntas da ficha e mensagens. Sem programador: a clínica muda na tela
                  de configurações e vale na hora, inclusive na ficha que a paciente recebe.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Logo e foto", "8 paletas prontas", "Serviços", "Perguntas da ficha", "Mensagens", "Dados legais"].map((c) => (
                    <span key={c} className="rounded-full border border-nevoa bg-porcelana px-4 py-1.5 text-sm font-semibold text-eucalipto">
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
              Os textos jurídicos podem ser ajustados pela clínica e devem ser revisados pela sua assessoria.
            </p>
          </div>
        </section>

        {/* Apresentação */}
        <section id="apresentacao" className="border-t border-grafite/10 bg-white py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <Reveal>
              <Eyebrow>Apresentação</Eyebrow>
              <h2 className="font-fraunces text-4xl leading-tight">Veja a apresentação completa.</h2>
              <p className="mt-5 text-grafite/70">
                Os mesmos slides que usamos nas reuniões com clínicas. Navegue pelas setas ou baixe o PDF para mostrar à
                sua equipe.
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
              <Eyebrow>Planos</Eyebrow>
              <h2 className="font-fraunces text-4xl leading-tight md:text-5xl">Escolha como começar.</h2>
              <p className="mx-auto mt-4 max-w-xl text-grafite/65">
                Hospedagem, backup, suporte e atualizações inclusos. Você só abre o link e usa.
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

        {/* Implantação */}
        <section className="border-t border-grafite/10 bg-white py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="max-w-2xl">
              <Eyebrow>Implantação</Eyebrow>
              <h2 className="font-fraunces text-4xl leading-tight md:text-5xl">Da conversa ao sistema funcionando em poucos dias.</h2>
            </Reveal>
            <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
              <span aria-hidden className="absolute left-5 right-5 top-5 hidden h-px bg-nevoa md:block" />
              {passosImplantacao.map((p, i) => (
                <li key={p.titulo} className="relative">
                  <Reveal delay={i * 0.08}>
                    <span className="relative grid h-10 w-10 place-items-center rounded-full bg-eucalipto font-fraunces text-lg text-white ring-8 ring-white">
                      {i + 1}
                    </span>
                    <h3 className="mt-5 text-lg font-bold">{p.titulo}</h3>
                    <p className="mt-1 text-sm text-grafite/65">{p.texto}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
            <div className="mt-14 flex items-center gap-4 rounded-3xl bg-porcelana p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-eucalipto text-white">
                <LuSmartphone className="h-6 w-6" aria-hidden />
              </span>
              <p className="text-grafite/75">
                Funciona no computador, tablet e celular. Não precisa instalar nada: é só abrir o link.
              </p>
            </div>
          </div>
        </section>

        {/* Dúvidas */}
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal className="text-center">
              <Eyebrow>Dúvidas</Eyebrow>
              <h2 className="font-fraunces text-4xl leading-tight">Perguntas das clínicas</h2>
            </Reveal>
            <div className="mt-10 divide-y divide-grafite/10 border-y border-grafite/10">
              {faqClinica.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <LuPlus className="h-5 w-5 shrink-0 text-argila transition-transform group-open:rotate-45" aria-hidden />
                  </summary>
                  <p className="mt-3 text-grafite/70">{f.a}</p>
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
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-argila font-fraunces text-2xl italic shadow-[inset_0_0_0_4px_var(--eucalipto),inset_0_0_0_5px_rgba(201,142,115,0.55)]">
                MC
              </span>
              <h2 className="mt-6 font-fraunces text-4xl leading-tight md:text-5xl">Vamos ver funcionando na sua clínica?</h2>
              <p className="mx-auto mt-4 max-w-lg text-nevoa/90">
                Demonstração de 20 minutos, com uma ficha de teste enviada para o seu celular.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <BotaoWhats texto="Agendar demonstração" mensagem={clinicaMessage} claro />
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
    </div>
  );
}
