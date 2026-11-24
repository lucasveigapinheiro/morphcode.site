"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  LuArrowLeft,
  LuArrowRight,
  LuCheck,
  LuChevronDown,
  LuClock,
  LuDownload,
  LuFileSpreadsheet,
  LuFilter,
  LuLock,
  LuMessageSquare,
  LuPlus,
  LuShieldCheck,
  LuSparkles,
  LuX,
} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa6";
import { trackMetaInitiateCheckout, trackMetaPurchase, trackMetaViewContent } from "@/components/MetaPixel";
import {
  MAX_MENSAGEM,
  MSG_FORA_DO_AR,
  msgFilaCheia,
  NICHOS,
  PRECO_REAIS,
  PRECO_TEXTO,
  SERVICOS,
  SERVICO_OUTRO,
  TOTAL_LEADS,
  VARIAVEIS,
  type Status,
} from "@/lib/gerador";
import HeroLeads3D from "./HeroLeads3D";
import BotaoBrilho from "./BotaoBrilho";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const OUTRO = "Outro";
const CHAVE = "gerador:pedido";
const chaveCompra = (id: string) => `gerador:compra:${id}`;
const PIXEL_PRODUTO = {
  value: PRECO_REAIS,
  currency: "BRL",
  content_name: `Planilha com ${TOTAL_LEADS} leads`,
  content_ids: "morph-leads",
  content_type: "product",
};
const PRECO_POR_LEAD = (PRECO_REAIS / TOTAL_LEADS).toFixed(2).replace(".", ",");

/** Resposta de /api/gerador/status. */
type Estado = { online: boolean; aceita: boolean; fila: number; minPorPedido: number };

type Andamento = {
  id: string;
  status: Status;
  nicho: string;
  regiao: string;
  leads?: number;
  erro?: string;
  pagamentoAtivo?: boolean;
  comMensagem?: boolean;
};

const ETAPAS: { status: Status[]; rotulo: string }[] = [
  { status: ["aguardando_pagamento", "pago", "gerando", "pronto"], rotulo: "Pedido recebido" },
  { status: ["pago", "gerando", "pronto"], rotulo: "Pagamento confirmado" },
  { status: ["gerando", "pronto"], rotulo: "Coletando os leads no Google Maps" },
  { status: ["pronto"], rotulo: "Planilha pronta para baixar" },
];

// Eventos ilustrativos de atividade ao vivo (urgência / prova social dinâmica)
const ATIVIDADES_RECENTES = [
  { pessoa: "Mariana S.", cidade: "São Paulo", nicho: "Clínica de estética", tempo: "há 2 min" },
  { pessoa: "Rafael M.", cidade: "Curitiba", nicho: "Barbearia", tempo: "há 4 min" },
  { pessoa: "Lucas P.", cidade: "Belo Horizonte", nicho: "Estética automotiva", tempo: "há 6 min" },
  { pessoa: "Camila R.", cidade: "Porto Alegre", nicho: "Clínica odontológica", tempo: "há 8 min" },
  { pessoa: "Thiago A.", cidade: "Campinas", nicho: "Oficina mecânica", tempo: "há 11 min" },
];

// Linhas fictícias/demonstrativas que vão sendo montadas na hero
const LINHAS_HERO = [
  { prio: "Alta", nome: "Box Detail Estética Automotiva", regiao: "Vila Mariana, SP", tel: "(11) 9••••-3850", nota: "4,9", aval: 416, semSite: true },
  { prio: "Alta", nome: "Uehara Estética Automotiva", regiao: "Santana, SP", tel: "(11) 9••••-5209", nota: "4,9", aval: 254, semSite: true },
  { prio: "Alta", nome: "3° Millenium Polimentos", regiao: "Penha, SP", tel: "(11) 9••••-8974", nota: "4,9", aval: 171, semSite: true },
  { prio: "Alta", nome: "WA Estética Automotiva", regiao: "São Caetano do Sul", tel: "(11) 9••••-5796", nota: "4,9", aval: 161, semSite: true },
  { prio: "Média", nome: "RS17 Detalhamento", regiao: "Santo Amaro, SP", tel: "(11) 9••••-8186", nota: "5,0", aval: 140, semSite: true },
  { prio: "Média", nome: "Prime Car Studio", regiao: "Mooca, SP", tel: "(11) 9••••-4412", nota: "4,8", aval: 98, semSite: true },
];

const FAIXA_BENEFICIOS = [
  `50 LEADS POR R$ ${PRECO_TEXTO}`,
  `R$ ${PRECO_POR_LEAD} POR CONTATO`,
  "FILTRO AUTOMÁTICO SÓ SEM SITE",
  "PAGAMENTO ÚNICO · SEM MENSALIDADE",
  "BOTÃO DE 1 CLIQUE PRO WHATSAPP",
  "GARANTIA DE 50 LEADS COMPLETOS",
];

const FAIXA_NICHOS = [
  "Estética automotiva",
  "Clínica de estética",
  "Clínica odontológica",
  "Barbearia",
  "Salão de beleza",
  "Academia",
  "Pet shop",
  "Oficina mecânica",
  "Nutricionista",
  "Fisioterapia",
];

function mascaraWhatsapp(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const inputBase =
  "w-full rounded-xl border border-[var(--w-ink)]/25 bg-white px-4 py-3 text-base text-[var(--w-ink)] placeholder:text-[var(--w-mute)] transition-colors hover:border-[var(--w-ink)]/50 focus:border-[var(--w-ink)] focus:outline-none";

const labelBase = "mb-1.5 block text-sm font-semibold text-[var(--w-ink)]";

export default function Gerador() {
  const raiz = useRef<HTMLDivElement>(null);
  const pedidoRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [nicho, setNicho] = useState<string>(NICHOS[0]);
  const [outro, setOutro] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [servico, setServico] = useState<string>(SERVICOS[0]);
  const [servicoOutro, setServicoOutro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [comMsg, setComMsg] = useState(false);
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [andamento, setAndamento] = useState<Andamento | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const [estado, setEstado] = useState<Estado | null>(null);
  const [mostrarSticky, setMostrarSticky] = useState(false);

  // Urgência ao vivo + toast discreto no desktop
  const [pessoasAgora, setPessoasAgora] = useState(5);
  const [atividadeIdx, setAtividadeIdx] = useState(0);
  const [toastVisivel, setToastVisivel] = useState(true);
  const [toastFechado, setToastFechado] = useState(false);

  const foraDoAr = estado?.online === false;
  const lotado = estado ? estado.online && !estado.aceita : false;
  const avisoVenda = foraDoAr ? MSG_FORA_DO_AR : lotado ? msgFilaCheia(estado?.minPorPedido ?? 5) : "";
  const previsaoNovo = estado ? Math.ceil((estado.fila + 1) * estado.minPorPedido) : null;

  const nichoFinal = nicho === OUTRO ? outro.trim() : nicho;
  const regiaoFinal = [bairro.trim(), cidade.trim()].filter(Boolean).join(" — ");
  const regiaoEnvio = [bairro.trim(), cidade.trim()].filter(Boolean).join(" ");
  const servicoFinal = servico === SERVICO_OUTRO ? servicoOutro.trim() : servico;
  const filtraSemSite = servico === SERVICOS[0];

  const textoMensagem = mensagem
    .replaceAll("{nome}", "Box Detail Estética")
    .replaceAll("{nota}", "4,9")
    .replaceAll("{avaliacoes}", "416")
    .replaceAll("{regiao}", regiaoEnvio || "sua região");

  // Oscilação natural do contador "X pessoas montando lista agora" e rotação do toast
  useEffect(() => {
    const tCount = setInterval(() => {
      setPessoasAgora((atual) => {
        const opcoes = [4, 5, 6, 7, 5, 6];
        const prox = opcoes[(opcoes.indexOf(atual) + 1) % opcoes.length];
        return prox ?? 5;
      });
    }, 11000);

    const tToast = setInterval(() => {
      setToastVisivel(false);
      setTimeout(() => {
        setAtividadeIdx((i) => (i + 1) % ATIVIDADES_RECENTES.length);
        setToastVisivel(true);
      }, 450);
    }, 9000);

    return () => {
      clearInterval(tCount);
      clearInterval(tToast);
    };
  }, []);

  // Animações GSAP de entrada + ScrollTrigger (somente transform e opacity, com reduced-motion)
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from("[data-hero='item']", { y: 24, autoAlpha: 0, duration: 0.65, stagger: 0.08 }).from(
          "[data-hero='planilha']",
          { y: 32, scale: 0.98, autoAlpha: 0, duration: 0.75 },
          "-=0.4",
        );

        gsap.utils.toArray<HTMLElement>("[data-revelar]").forEach((bloco) => {
          gsap.from(bloco, {
            y: 28,
            autoAlpha: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: bloco,
              start: "top 86%",
              once: true,
            },
          });
        });
      });
    },
    { scope: raiz },
  );

  // Mostra barra fixa no mobile quando o formulário não está na tela
  useEffect(() => {
    const el = pedidoRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setMostrarSticky(!entry.isIntersecting);
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Confere status do robô a cada 30s
  useEffect(() => {
    const checar = () =>
      fetch("/api/gerador/status", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((s) => s && setEstado(s as Estado))
        .catch(() => {});
    checar();
    const t = setInterval(checar, 30000);
    return () => clearInterval(t);
  }, []);

  // Retoma pedido salvo no navegador
  useEffect(() => {
    let salvo: string | null = null;
    try {
      salvo = localStorage.getItem(CHAVE);
    } catch {}
    if (!salvo) return;
    fetch(`/api/gerador/pedido/${salvo}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => {
        if (!p) return;
        setAndamento(p);
        const q = new URLSearchParams(window.location.search);
        if ((q.get("status") ?? q.get("collection_status")) === "approved") {
          setConfirmando(true);
          window.history.replaceState(null, "", window.location.pathname);
          requestAnimationFrame(() => document.getElementById("pedido")?.scrollIntoView({ behavior: "smooth" }));
        }
      })
      .catch(() => {});
  }, []);

  // Meta Pixel: ViewContent
  useEffect(() => {
    trackMetaViewContent({ content_name: "gerador", pagina: "/gerador" });
  }, []);

  // Meta Pixel: Purchase deduplicado por pedido
  useEffect(() => {
    if (!andamento || !["pago", "gerando", "pronto"].includes(andamento.status)) return;
    try {
      if (localStorage.getItem(chaveCompra(andamento.id))) return;
      localStorage.setItem(chaveCompra(andamento.id), "1");
    } catch {}
    trackMetaPurchase({ ...PIXEL_PRODUTO, num_items: 1 }, `compra-${andamento.id}`);
  }, [andamento]);

  // Acompanha status até finalizar
  useEffect(() => {
    if (!andamento || andamento.status === "pronto" || andamento.status === "falhou") return;
    const t = setInterval(() => {
      fetch(`/api/gerador/pedido/${andamento.id}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((p) => p && setAndamento((a) => (a ? { ...a, ...p } : p)))
        .catch(() => {});
    }, 4000);
    return () => clearInterval(t);
  }, [andamento]);

  function inserirVariavel(v: string) {
    const el = msgRef.current;
    const ini = el?.selectionStart ?? mensagem.length;
    const fim = el?.selectionEnd ?? mensagem.length;
    setMensagem((mensagem.slice(0, ini) + v + mensagem.slice(fim)).slice(0, MAX_MENSAGEM));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(ini + v.length, ini + v.length);
    });
  }

  function avancarEtapa() {
    setErro("");
    if (nichoFinal.length < 3) {
      setErro("Escolha um nicho ou digite o seu.");
      document.getElementById("g-outro")?.focus();
      return;
    }
    if (cidade.trim().length < 3) {
      setErro("Informe a cidade onde quer prospectar.");
      document.getElementById("g-cidade")?.focus();
      return;
    }
    if (servicoFinal.length < 3) {
      setErro("Diga o que você vende.");
      document.getElementById("g-servico")?.focus();
      return;
    }
    setEtapa(2);
    requestAnimationFrame(() => {
      document.getElementById("g-nome")?.focus();
    });
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (etapa === 1) {
      avancarEtapa();
      return;
    }
    setErro("");
    const digitos = whatsapp.replace(/\D/g, "");
    const invalido =
      nichoFinal.length < 3
        ? ["g-outro", "Escolha um nicho ou digite o seu."]
        : cidade.trim().length < 3
          ? ["g-cidade", "Informe a cidade."]
          : servicoFinal.length < 3
            ? ["g-servico", "Diga o que você vende."]
            : nome.trim().length < 2
              ? ["g-nome", "Informe seu nome."]
              : digitos.length !== 11 || digitos[2] !== "9"
                ? ["g-whats", "Informe o WhatsApp com DDD, 11 dígitos."]
                : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
                  ? ["g-email", "Informe um e-mail válido."]
                  : null;
    if (invalido) {
      setErro(invalido[1]);
      document.getElementById(invalido[0])?.focus();
      return;
    }
    setEnviando(true);
    try {
      const r = await fetch("/api/gerador/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nicho: nichoFinal,
          regiao: regiaoEnvio,
          cidade,
          bairro,
          servico: servicoFinal,
          nome,
          whatsapp,
          email,
          mensagem,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.erro ?? "Não foi possível registrar o pedido.");
      try {
        localStorage.setItem(CHAVE, d.id);
      } catch {}
      setAndamento({
        id: d.id,
        status: d.status,
        nicho: nichoFinal,
        regiao: regiaoEnvio,
        pagamentoAtivo: d.pagamentoAtivo,
        comMensagem: mensagem.trim().length > 0,
      });
      if (d.pagamentoAtivo) await irParaPagamento(d.id);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível registrar o pedido.");
    } finally {
      setEnviando(false);
    }
  }

  async function irParaPagamento(id: string) {
    try {
      const r = await fetch("/api/gerador/pagar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const d = await r.json();
      if (!r.ok || !d.url) throw new Error(d.erro ?? "Não foi possível abrir o pagamento.");
      trackMetaInitiateCheckout({ ...PIXEL_PRODUTO, num_items: 1 }, `checkout-${id}`);
      window.location.assign(d.url);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível abrir o pagamento.");
    }
  }

  function novoPedido() {
    try {
      localStorage.removeItem(CHAVE);
    } catch {}
    setAndamento(null);
    setEtapa(1);
    setErro("");
  }

  const atividadeAtual = ATIVIDADES_RECENTES[atividadeIdx];

  return (
    <div ref={raiz} className="overflow-x-clip">
      {/* HERO SECTION: 3D + Planilha fictícia sendo montada ao vivo no desktop; limpa e rápida no celular */}
      <section className="relative overflow-hidden bg-[var(--w-canvas-soft)] pb-14 pt-8 md:pb-20 md:pt-12">
        {/* Objetos 3D flutuantes (somente desktop >= 1024px) */}
        <HeroLeads3D />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          {/* Topo da Hero: Pílula ao vivo de atividade + oferta */}
          <div className="mx-auto max-w-4xl text-left lg:text-center">
            <div
              data-hero="item"
              className="inline-flex items-center gap-2.5 rounded-full border border-[var(--w-ink)]/10 bg-white/95 px-4 py-2 text-xs font-semibold text-[var(--w-ink)] shadow-[0_8px_24px_-12px_rgba(14,15,12,0.18)] backdrop-blur-sm sm:text-sm"
            >
              <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden>
                <span className="ml-ping absolute inline-flex h-full w-full rounded-full bg-[var(--w-positive)]" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--w-positive)]" />
              </span>
              <span className="tabular-nums">
                <strong>{pessoasAgora} pessoas</strong> montando planilha agora
              </span>
              <span className="hidden text-[var(--w-mute)] sm:inline">·</span>
              <span className="hidden text-[var(--w-body)] sm:inline">
                Última lista: {atividadeAtual.nicho} ({atividadeAtual.cidade})
              </span>
            </div>

            <h1
              data-hero="item"
              className="mt-5 font-[family-name:var(--f-display)] text-[clamp(2.3rem,5.4vw,4.5rem)] font-extrabold leading-[0.99] tracking-[-0.035em] text-[var(--w-ink)]"
            >
              {TOTAL_LEADS} clientes locais prontos pro seu WhatsApp, em minutos.
            </h1>

            <p data-hero="item" className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--w-body)] sm:text-lg lg:mx-auto">
              Pare de perder a tarde copiando número do Google Maps. Escolha o nicho e a cidade e baixe um Excel montado na hora com WhatsApp, nota,
              prioridade e funil. <strong className="font-semibold text-[var(--w-ink)]">Vende sites? Filtramos só quem não tem site.</strong>
            </p>

            {/* Bloco da Oferta + CTAs Brilhantes */}
            <div data-hero="item" className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:justify-center">
              <BotaoBrilho href="#pedido" className="min-h-14 px-8 text-base">
                <span>Montar minha planilha · R$&nbsp;{PRECO_TEXTO}</span>
                <LuArrowRight className="h-4 w-4" aria-hidden />
              </BotaoBrilho>

              <a
                href="#exemplo"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-[var(--w-ink)]/20 bg-white/90 px-6 text-sm font-bold text-[var(--w-ink)] transition-colors hover:border-[var(--w-ink)] hover:bg-white"
              >
                <LuFileSpreadsheet className="h-4 w-4 text-[var(--w-positive-deep)]" aria-hidden />
                Ver exemplo real
              </a>
            </div>

            {/* Micro-ancoragem de preço e garantias logo abaixo do CTA */}
            <div
              data-hero="item"
              className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-[var(--w-body)] lg:justify-center sm:text-sm"
            >
              <span className="inline-flex items-center gap-1.5">
                <LuCheck className="h-4 w-4 text-[var(--w-positive-deep)]" aria-hidden />
                R$&nbsp;{PRECO_POR_LEAD} por lead (pagamento único)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <LuCheck className="h-4 w-4 text-[var(--w-positive-deep)]" aria-hidden />
                Garantia de {TOTAL_LEADS} leads ou completamos grátis
              </span>
              <span className="inline-flex items-center gap-1.5">
                <LuLock className="h-3.5 w-3.5 text-[var(--w-positive-deep)]" aria-hidden />
                Pix ou cartão via Mercado Pago
              </span>
            </div>
          </div>

          {/* Palco Visual: Planilha fictícia sendo montada ao vivo */}
          <PlanilhaVivaHero previsaoNovo={previsaoNovo} foraDoAr={foraDoAr} lotado={lotado} />
        </div>
      </section>

      {/* FAIXAS PASSANDO (Marquee duplo em CSS puro — 60fps e pausa no hover) */}
      <div aria-hidden="true" className="ml-marquee-wrap select-none overflow-hidden">
        <div className="bg-[var(--w-ink)] py-3.5 text-white">
          <div className="ml-marquee-track flex items-center gap-8 font-[family-name:var(--f-mono)] text-xs font-semibold uppercase tracking-[0.14em]">
            {[...FAIXA_BENEFICIOS, ...FAIXA_BENEFICIOS].map((item, idx) => (
              <span key={idx} className="inline-flex shrink-0 items-center gap-8">
                <span className={idx % 2 === 0 ? "text-[var(--w-primary)]" : "text-white"}>{item}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--w-primary)]/60" />
              </span>
            ))}
          </div>
        </div>
        <div className="border-y border-[var(--w-ink)]/10 bg-[var(--w-primary)] py-2.5 text-[var(--w-ink)]">
          <div className="ml-marquee-track-rev flex items-center gap-6 text-xs font-bold tracking-tight sm:text-sm">
            {[...FAIXA_NICHOS, ...FAIXA_NICHOS].map((item, idx) => (
              <span key={idx} className="inline-flex shrink-0 items-center gap-6">
                <span>{item}</span>
                <span className="text-[var(--w-ink)]/40">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SEÇÃO DO PEDIDO: Configurador em 2 Etapas + Card de Oferta & Resumo Vivo */}
      <section id="pedido" ref={pedidoRef} className="scroll-mt-20 bg-[var(--w-canvas)] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div data-revelar className="mb-10 max-w-2xl">
            <h2 className="font-[family-name:var(--f-display)] text-[clamp(1.9rem,3.8vw,2.9rem)] font-extrabold leading-[1.06] tracking-[-0.03em] text-[var(--w-ink)]">
              Monte sua planilha em 30 segundos.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--w-body)]">
              Escolha o nicho, a cidade e o que você vende. Assim que o Pix ou cartão confirma, o robô coleta os {TOTAL_LEADS} negócios na hora e libera o
              download aqui mesmo.
            </p>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            {/* Formulário em 2 Etapas */}
            <div className="rounded-[24px] border border-[var(--w-ink)]/12 bg-[var(--w-canvas-soft)]/55 p-5 sm:p-8">
              {andamento ? (
                <Acompanhamento
                  a={andamento}
                  onNovo={novoPedido}
                  onPagar={() => irParaPagamento(andamento.id)}
                  erro={erro}
                  confirmando={confirmando}
                  foraDoAr={foraDoAr}
                  estado={estado}
                />
              ) : (
                <form onSubmit={enviar} noValidate>
                  {/* Barra de progresso das 2 etapas */}
                  <div className="mb-6 flex items-center justify-between gap-3 border-b border-[var(--w-border)] pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--w-ink)] font-[family-name:var(--f-mono)] text-xs font-semibold text-[var(--w-primary)]">
                        {etapa}/2
                      </span>
                      <div>
                        <p className="text-base font-bold text-[var(--w-ink)]">
                          {etapa === 1 ? "Configure sua lista" : "Para onde enviamos o arquivo?"}
                        </p>
                        <p className="text-xs text-[var(--w-mute)]">
                          {etapa === 1 ? "Sem dados pessoais neste passo" : "Falta só confirmar seus dados e gerar"}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 font-[family-name:var(--f-mono)] text-xs font-semibold tabular-nums text-[var(--w-ink)]">
                      R$&nbsp;{PRECO_TEXTO}
                    </span>
                  </div>

                  {etapa === 1 ? (
                    <div className="space-y-5">
                      {/* 1. Nicho */}
                      <div>
                        <p id="g-nicho-r" className={labelBase}>
                          1. Qual nicho você quer prospectar?
                        </p>
                        <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby="g-nicho-r">
                          {[...NICHOS, OUTRO].map((n) => (
                            <button
                              key={n}
                              type="button"
                              aria-pressed={nicho === n}
                              onClick={() => setNicho(n)}
                              className={`min-h-11 rounded-full border px-3.5 text-sm font-medium transition-colors sm:min-h-10 ${
                                nicho === n
                                  ? "border-[var(--w-ink)] bg-[var(--w-ink)] text-white"
                                  : "border-[var(--w-border)] bg-white text-[var(--w-body)] hover:border-[var(--w-ink)] hover:text-[var(--w-ink)]"
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                        {nicho === OUTRO && (
                          <input
                            id="g-outro"
                            name="nicho-outro"
                            autoComplete="off"
                            aria-label="Qual nicho?"
                            className={`${inputBase} mt-2.5`}
                            value={outro}
                            onChange={(e) => setOutro(e.target.value)}
                            maxLength={60}
                            placeholder="Ex.: loja de bicicletas, hamburgueria…"
                          />
                        )}
                      </div>

                      {/* 2. Cidade e Bairro */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label htmlFor="g-cidade" className={labelBase}>
                            2. Cidade
                          </label>
                          <input
                            id="g-cidade"
                            name="cidade"
                            className={inputBase}
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                            maxLength={50}
                            placeholder="Ex.: São Paulo"
                            autoComplete="address-level2"
                          />
                        </div>
                        <div>
                          <label htmlFor="g-bairro" className={labelBase}>
                            Bairro <span className="font-normal text-[var(--w-mute)]">(opcional)</span>
                          </label>
                          <input
                            id="g-bairro"
                            name="bairro"
                            autoComplete="off"
                            className={inputBase}
                            value={bairro}
                            onChange={(e) => setBairro(e.target.value)}
                            maxLength={50}
                            placeholder="Ex.: Mooca"
                          />
                        </div>
                      </div>

                      {/* 3. O que você vende */}
                      <div>
                        <p id="g-servico-r" className={labelBase}>
                          3. O que você vende?
                        </p>
                        <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby="g-servico-r">
                          {[...SERVICOS, SERVICO_OUTRO].map((s) => (
                            <button
                              key={s}
                              type="button"
                              aria-pressed={servico === s}
                              onClick={() => setServico(s)}
                              className={`min-h-11 rounded-full border px-3.5 text-sm font-medium transition-colors sm:min-h-10 ${
                                servico === s
                                  ? "border-[var(--w-ink)] bg-[var(--w-ink)] text-white"
                                  : "border-[var(--w-border)] bg-white text-[var(--w-body)] hover:border-[var(--w-ink)] hover:text-[var(--w-ink)]"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                        {servico === SERVICO_OUTRO && (
                          <input
                            id="g-servico"
                            name="servico-outro"
                            autoComplete="off"
                            aria-label="Qual serviço você vende?"
                            className={`${inputBase} mt-2.5`}
                            value={servicoOutro}
                            onChange={(e) => setServicoOutro(e.target.value)}
                            maxLength={60}
                            placeholder="Ex.: contabilidade, energia solar…"
                          />
                        )}
                        <p
                          aria-live="polite"
                          className={`mt-2.5 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold ${
                            filtraSemSite
                              ? "bg-[var(--w-primary-pale)] text-[var(--w-positive-deep)]"
                              : "bg-white text-[var(--w-body)]"
                          }`}
                        >
                          <LuFilter className="h-3.5 w-3.5 shrink-0" aria-hidden />
                          {filtraSemSite
                            ? "Filtro ativo: a planilha trará só negócios que ainda não têm site."
                            : "A planilha trará os melhores negócios do nicho, com ou sem site."}
                        </p>
                      </div>

                      {erro && (
                        <p role="alert" className="rounded-xl bg-[var(--w-negative-bg)] px-3.5 py-2.5 text-sm font-medium text-[var(--w-negative)]">
                          {erro}
                        </p>
                      )}

                      <BotaoBrilho type="button" onClick={avancarEtapa} className="min-h-14 w-full px-6 text-base">
                        <span>Continuar para entrega</span>
                        <LuArrowRight className="h-4 w-4" aria-hidden />
                      </BotaoBrilho>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Resumo editável da Etapa 1 */}
                      <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[var(--w-ink)]">
                            {TOTAL_LEADS} leads · {nichoFinal}
                          </p>
                          <p className="truncate text-xs text-[var(--w-body)]">
                            {regiaoFinal} · {servicoFinal}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEtapa(1);
                            setErro("");
                          }}
                          className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-full bg-[var(--w-canvas-soft)] px-3.5 text-xs font-semibold text-[var(--w-ink)] transition-colors hover:bg-[var(--w-primary-pale)]"
                        >
                          <LuArrowLeft className="h-3.5 w-3.5" aria-hidden />
                          Alterar
                        </button>
                      </div>

                      <div>
                        <label htmlFor="g-nome" className={labelBase}>
                          Seu nome
                        </label>
                        <input
                          id="g-nome"
                          name="nome"
                          className={inputBase}
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          maxLength={80}
                          autoComplete="name"
                          placeholder="Como podemos te chamar?"
                        />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label htmlFor="g-whats" className={labelBase}>
                            WhatsApp
                          </label>
                          <input
                            id="g-whats"
                            name="whatsapp"
                            type="tel"
                            inputMode="numeric"
                            className={inputBase}
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(mascaraWhatsapp(e.target.value))}
                            autoComplete="tel-national"
                            placeholder="(11) 90000-0000"
                          />
                        </div>
                        <div>
                          <label htmlFor="g-email" className={labelBase}>
                            E-mail
                          </label>
                          <input
                            id="g-email"
                            name="email"
                            type="email"
                            spellCheck={false}
                            className={inputBase}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            maxLength={120}
                            autoComplete="email"
                            placeholder="voce@empresa.com"
                          />
                        </div>
                      </div>

                      {/* Mensagem personalizada do WhatsApp */}
                      <div>
                        {!comMsg ? (
                          <button
                            type="button"
                            onClick={() => {
                              setComMsg(true);
                              requestAnimationFrame(() => msgRef.current?.focus());
                            }}
                            className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-dashed border-[var(--w-border)] bg-white px-3.5 py-2.5 text-left text-sm font-medium text-[var(--w-body)] transition-colors hover:border-[var(--w-ink)] hover:text-[var(--w-ink)]"
                          >
                            <LuPlus className="h-4 w-4 shrink-0" aria-hidden />
                            <span>Personalizar mensagem do WhatsApp (opcional)</span>
                          </button>
                        ) : (
                          <div className="rounded-2xl border border-[var(--w-border)] bg-white p-3.5">
                            <div className="mb-2 flex items-center justify-between gap-2">
                              <label htmlFor="g-msg" className="text-xs font-semibold text-[var(--w-ink)]">
                                Mensagem automática ao clicar em &ldquo;Abrir conversa&rdquo;
                              </label>
                              <button
                                type="button"
                                onClick={() => setComMsg(false)}
                                aria-label="Recolher campo de mensagem"
                                className="rounded-full p-1 text-[var(--w-mute)] hover:bg-[var(--w-canvas-soft)] hover:text-[var(--w-ink)]"
                              >
                                <LuX className="h-4 w-4" aria-hidden />
                              </button>
                            </div>
                            <textarea
                              id="g-msg"
                              name="mensagem"
                              ref={msgRef}
                              rows={3}
                              maxLength={MAX_MENSAGEM}
                              autoComplete="off"
                              value={mensagem}
                              onChange={(e) => setMensagem(e.target.value)}
                              placeholder="Oi! Vi a {nome} no Google ({nota} estrelas) e…"
                              className={`${inputBase} resize-none text-sm`}
                            />
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                              {VARIAVEIS.map((v) => (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => inserirVariavel(v)}
                                  className="min-h-9 rounded-full border border-[var(--w-border)] bg-[var(--w-canvas-soft)] px-2.5 font-[family-name:var(--f-mono)] text-[11px] font-medium text-[var(--w-ink)] transition-colors hover:border-[var(--w-ink)]"
                                >
                                  {v}
                                </button>
                              ))}
                              <span className="ml-auto font-[family-name:var(--f-mono)] text-[11px] tabular-nums text-[var(--w-mute)]">
                                {mensagem.length}/{MAX_MENSAGEM}
                              </span>
                            </div>
                            {mensagem.trim() && (
                              <div className="mt-3 rounded-xl rounded-tl-sm bg-[#DCF8C6] px-3 py-2 text-xs leading-relaxed text-[#163300]">
                                <span className="mb-0.5 block font-semibold">Prévia no WhatsApp:</span>
                                <span className="whitespace-pre-line">{textoMensagem}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {(avisoVenda || erro) && (
                        <p role="alert" className="rounded-xl bg-[var(--w-negative-bg)] px-3.5 py-2.5 text-sm font-medium text-[var(--w-negative)]">
                          {avisoVenda || erro}
                        </p>
                      )}

                      <BotaoBrilho type="submit" disabled={enviando || Boolean(avisoVenda)} className="min-h-14 w-full px-6 text-base">
                        <span>{enviando ? "Abrindo pagamento…" : `Gerar e pagar · R$ ${PRECO_TEXTO}`}</span>
                        {!enviando && <LuArrowRight className="h-4 w-4" aria-hidden />}
                      </BotaoBrilho>

                      <div className="space-y-1.5 pt-1 text-xs text-[var(--w-body)]">
                        <p className="flex items-center justify-center gap-1.5 font-semibold text-[var(--w-ink)]">
                          <LuLock className="h-3.5 w-3.5 shrink-0 text-[var(--w-positive-deep)]" aria-hidden />
                          Pagamento seguro pelo Mercado Pago · Pix ou cartão
                        </p>
                        {previsaoNovo !== null && !avisoVenda && (
                          <p className="text-center font-[family-name:var(--f-mono)] text-[11px] text-[var(--w-mute)]">
                            Previsão de entrega: ~{previsaoNovo} min após confirmação
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Coluna direita do pedido: Resumo Vivo da Oferta + Confiança */}
            <aside className="space-y-4 lg:sticky lg:top-20">
              <div className="rounded-[24px] bg-[var(--w-ink)] p-6 text-white sm:p-7">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--w-primary)]/15 px-3 py-1 font-[family-name:var(--f-mono)] text-xs font-semibold text-[var(--w-primary)]">
                    <LuSparkles className="h-3.5 w-3.5" aria-hidden />
                    Resumo do seu pedido
                  </span>
                  <span className="font-[family-name:var(--f-mono)] text-xs text-[var(--w-canvas-soft)]/70">.xlsx</span>
                </div>

                <p className="mt-4 font-[family-name:var(--f-display)] text-2xl font-extrabold leading-tight text-white">
                  {nichoFinal || "Seu nicho"}
                </p>
                <p className="mt-1 text-sm text-[var(--w-canvas-soft)]/75">
                  {regiaoFinal || "Escolha sua cidade ao lado"} · {servicoFinal}
                </p>

                <div className="mt-5 space-y-2.5 border-y border-white/10 py-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--w-canvas-soft)]/80">Quantidade garantida</span>
                    <span className="font-bold text-white">{TOTAL_LEADS} leads reais</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--w-canvas-soft)]/80">Filtro sem site</span>
                    <span className="font-semibold text-[var(--w-primary)]">{filtraSemSite ? "Ativado" : "Todos do nicho"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--w-canvas-soft)]/80">Aba Resumo + Funil</span>
                    <span className="font-semibold text-white">Inclusa</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-semibold text-white">Pagamento único</span>
                    <span className="font-[family-name:var(--f-display)] text-2xl font-extrabold tabular-nums text-[var(--w-primary)]">
                      R$&nbsp;{PRECO_TEXTO}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-[var(--w-canvas-soft)]/75">
                  <strong className="font-semibold text-white">Risco zero:</strong> vieram menos de {TOTAL_LEADS} leads na região? Completamos com vizinhos
                  sem custo. Deu erro? Devolvemos 100% pelo Mercado Pago.
                </p>
              </div>

              {/* Status real do robô */}
              {estado && (
                <div className="flex items-center gap-3 rounded-2xl border border-[var(--w-border)] bg-white px-4 py-3.5 text-xs font-medium text-[var(--w-body)]">
                  <span
                    aria-hidden
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${foraDoAr ? "bg-[var(--w-negative)]" : lotado ? "bg-amber-500" : "bg-[var(--w-positive)]"}`}
                  />
                  {foraDoAr ? (
                    <span>Sistema em manutenção rápida — tente em instantes.</span>
                  ) : lotado ? (
                    <span>Fila cheia agora — libera em cerca de {Math.max(1, Math.ceil(estado.minPorPedido))} min.</span>
                  ) : (
                    <span className="tabular-nums">
                      Robô online agora · entrega estimada em <strong className="text-[var(--w-ink)]">{previsaoNovo} min</strong> após o pagamento.
                    </span>
                  )}
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* FAIXA DE DEMONSTRAÇÃO REAL: O que vem dentro das 2 abas */}
      <DemonstracaoPlanilha mensagem={textoMensagem} />

      {/* ANTES X DEPOIS + CARD ESCURO DE ROI */}
      <section className="bg-[var(--w-canvas-soft)] py-16 md:py-24">
        <div data-revelar className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="font-[family-name:var(--f-display)] text-[clamp(1.85rem,3.6vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-[var(--w-ink)]">
              Menos tempo garimpando. Mais tempo fechando cliente.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--w-body)]">
              Prospectar no Google Maps funciona, mas fazer isso na mão come o dia inteiro. O robô faz o trabalho braçal em minutos.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="rounded-[24px] bg-[var(--w-canvas)] p-6 sm:p-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-bold text-[var(--w-mute)]">Fazendo no Maps à mão</p>
                  <ul className="mt-4 space-y-3.5 text-sm leading-relaxed text-[var(--w-body)]">
                    <li className="flex items-start gap-2.5">
                      <LuX className="mt-0.5 h-4 w-4 shrink-0 text-[var(--w-negative)]" aria-hidden />
                      <span>Abre perfil por perfil para checar se tem telefone e site</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <LuX className="mt-0.5 h-4 w-4 shrink-0 text-[var(--w-negative)]" aria-hidden />
                      <span>Copia número no bloco de notas e perde controle de quem já chamou</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <LuX className="mt-0.5 h-4 w-4 shrink-0 text-[var(--w-negative)]" aria-hidden />
                      <span>Horas gastas antes de mandar a primeira mensagem</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-[var(--w-canvas-soft)] pt-6 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                  <p className="text-sm font-bold text-[var(--w-positive-deep)]">Com o Morph Leads</p>
                  <ul className="mt-4 space-y-3.5 text-sm leading-relaxed text-[var(--w-ink)]">
                    <li className="flex items-start gap-2.5">
                      <LuCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--w-positive-deep)]" aria-hidden />
                      <span>{TOTAL_LEADS} negócios reais da sua cidade coletados na hora</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <LuCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--w-positive-deep)]" aria-hidden />
                      <span>Prioridade pronta (Alta, Média, Baixa) por nota e avaliações</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <LuCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--w-positive-deep)]" aria-hidden />
                      <span>Link direto que abre o WhatsApp já com sua abordagem escrita</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[24px] bg-[var(--w-ink)] p-6 text-white sm:p-8">
              <div>
                <span className="inline-flex rounded-full bg-[var(--w-primary)]/15 px-3 py-1 font-[family-name:var(--f-mono)] text-xs font-semibold text-[var(--w-primary)]">
                  R$&nbsp;{PRECO_POR_LEAD} por contato
                </span>
                <p className="mt-5 font-[family-name:var(--f-display)] text-3xl font-extrabold leading-[1.08] tracking-tight text-[var(--w-primary)] sm:text-4xl">
                  1 cliente fechado paga a planilha dezenas de vezes.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--w-canvas-soft)]/80">
                  Você paga R$&nbsp;{PRECO_TEXTO} uma única vez. Sem mensalidade, sem fidelidade, sem ferramenta complicada pra configurar.
                </p>
              </div>
              <BotaoBrilho href="#pedido" className="mt-7 min-h-12 w-full px-6 text-sm">
                <span>Montar minha lista agora</span>
                <LuArrowRight className="h-4 w-4" aria-hidden />
              </BotaoBrilho>
            </div>
          </div>
        </div>
      </section>

      {/* PARA QUEM SERVE + TRANSPARÊNCIA */}
      <section className="bg-[var(--w-canvas)] py-16 md:py-24">
        <div data-revelar className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
            <div>
              <h2 className="font-[family-name:var(--f-display)] text-[clamp(1.85rem,3.6vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-[var(--w-ink)]">
                Feito para quem vende serviço para negócios locais.
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--w-body)]">
                Se o seu cliente ideal tem ficha no Google Maps — clínica, oficina, barbearia, estética, pet shop, academia — a lista já vem no ponto de
                abordar.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  { titulo: "Criação de sites", desc: "Filtro exclusivo: entrega só negócios sem site cadastrado." },
                  { titulo: "Tráfego pago e social media", desc: "Negócios ativos na sua região com nota e volume de avaliações." },
                  { titulo: "Sistemas e automações", desc: "Estabelecimentos com movimento real para oferecer gestão." },
                  { titulo: "Serviços B2B locais", desc: "Contabilidade, foto/vídeo, consultoria ou fornecedores." },
                ].map((item) => (
                  <div key={item.titulo} className="rounded-2xl bg-[var(--w-canvas-soft)] p-4">
                    <p className="text-sm font-bold text-[var(--w-ink)]">{item.titulo}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--w-body)]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-[var(--w-border)] bg-[var(--w-canvas)] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--w-primary-pale)] text-[var(--w-positive-deep)]">
                  <LuShieldCheck className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="text-lg font-bold text-[var(--w-ink)]">Sem surpresas antes de pagar</h3>
              </div>

              <ul className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--w-body)]">
                <li className="flex items-start gap-3">
                  <LuClock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--w-ink)]" aria-hidden />
                  <span>
                    <strong className="font-semibold text-[var(--w-ink)]">Coleta em tempo real:</strong> não vendemos lista velha ou reciclada. O robô busca
                    no Google Maps assim que o pagamento confirma.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <LuFileSpreadsheet className="mt-0.5 h-4 w-4 shrink-0 text-[var(--w-ink)]" aria-hidden />
                  <span>
                    <strong className="font-semibold text-[var(--w-ink)]">Abre em qualquer lugar:</strong> arquivo{" "}
                    <code className="font-[family-name:var(--f-mono)] text-xs">.xlsx</code> pronto para Excel, Google Planilhas ou LibreOffice.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <LuMessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-[var(--w-ink)]" aria-hidden />
                  <span>
                    <strong className="font-semibold text-[var(--w-ink)]">O que a planilha não faz:</strong> não dispara mensagens em massa sozinha e não
                    traz e-mails privados de grandes indústrias. Os dados são de perfis públicos do Google Maps; confirme antes de abordar.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ + FECHAMENTO */}
      <Perguntas />

      {/* Toast discreto de prova social ao vivo no desktop (pode ser fechado) */}
      {!toastFechado && (
        <div
          aria-live="polite"
          className={`fixed bottom-5 left-5 z-40 hidden max-w-xs items-center gap-3 rounded-2xl border border-[var(--w-ink)]/10 bg-white/95 p-3.5 shadow-[0_18px_40px_-16px_rgba(14,15,12,0.28)] backdrop-blur-sm transition-[opacity,transform] duration-300 lg:flex ${
            toastVisivel ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--w-primary-pale)] text-[var(--w-positive-deep)]">
            <LuFileSpreadsheet className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1 text-xs">
            <p className="truncate font-bold text-[var(--w-ink)]">
              {atividadeAtual.pessoa} · {atividadeAtual.cidade}
            </p>
            <p className="truncate text-[var(--w-body)]">
              Gerou {TOTAL_LEADS} leads de {atividadeAtual.nicho}
            </p>
            <p className="mt-0.5 font-[family-name:var(--f-mono)] text-[10px] text-[var(--w-mute)]">{atividadeAtual.tempo}</p>
          </div>
          <button
            type="button"
            onClick={() => setToastFechado(true)}
            aria-label="Fechar aviso"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[var(--w-mute)] hover:bg-[var(--w-canvas-soft)] hover:text-[var(--w-ink)]"
          >
            <LuX className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      )}

      {/* Barra sticky no mobile quando o formulário não está na tela */}
      {!andamento && mostrarSticky && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--w-ink)]/10 bg-[var(--w-canvas)]/95 px-4 py-3 backdrop-blur-sm lg:hidden">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
            <div>
              <p className="font-[family-name:var(--f-display)] text-lg font-extrabold leading-none tabular-nums text-[var(--w-ink)]">
                R$&nbsp;{PRECO_TEXTO}
              </p>
              <p className="mt-0.5 text-xs text-[var(--w-mute)]">{TOTAL_LEADS} leads · pagamento único</p>
            </div>
            <BotaoBrilho href="#pedido" className="min-h-11 px-5 text-sm">
              <span>Montar lista</span>
              <LuArrowRight className="h-4 w-4" aria-hidden />
            </BotaoBrilho>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Planilha fictícia sendo montada ao vivo na Hero:
 * - No desktop: janela ampla em toda a largura da hero com barra de fórmula,
 *   contador subindo até 50/50, barra de progresso e linhas entrando em sequência.
 * - No celular: versão enxuta e bonita com 3 linhas animadas, rápida e legível.
 */
function PlanilhaVivaHero({
  previsaoNovo,
  foraDoAr,
  lotado,
}: {
  previsaoNovo: number | null;
  foraDoAr: boolean;
  lotado: boolean;
}) {
  const [linhasVisiveis, setLinhasVisiveis] = useState(LINHAS_HERO.length);
  const [contadorLeads, setContadorLeads] = useState(TOTAL_LEADS);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const t = setInterval(() => {
      setLinhasVisiveis((atual) => (atual >= LINHAS_HERO.length ? 1 : atual + 1));
      setContadorLeads((c) => (c >= TOTAL_LEADS ? 9 : Math.min(TOTAL_LEADS, c + 8)));
    }, 1500);

    return () => clearInterval(t);
  }, []);

  const progresso = Math.min(1, contadorLeads / TOTAL_LEADS);

  return (
    <div data-hero="planilha" className="mt-10 lg:mt-12">
      {/* Versão Desktop completa: planilha ampla ocupando toda a hero */}
      <div className="hidden overflow-hidden rounded-[24px] border border-[var(--w-ink)]/15 bg-white/95 shadow-[0_32px_80px_-28px_rgba(14,15,12,0.28)] backdrop-blur-md lg:block">
        {/* Topo da janela Excel */}
        <div className="flex items-center justify-between gap-4 border-b border-[var(--w-canvas-soft)] bg-[var(--w-canvas-soft)]/70 px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-[var(--w-positive-deep)] font-[family-name:var(--f-mono)] text-xs font-bold text-white">
              X
            </span>
            <span className="font-[family-name:var(--f-mono)] text-xs font-semibold text-[var(--w-ink)]">
              morph-leads-estetica-automotiva-sp.xlsx
            </span>
            <span className="rounded-full bg-[var(--w-primary-pale)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--w-positive-deep)]">
              Filtro: só sem site
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-[family-name:var(--f-mono)] text-xs font-semibold tabular-nums text-[var(--w-ink)]">
              Coletando do Google Maps… {contadorLeads}/{TOTAL_LEADS}
            </span>
            <div className="h-2 w-28 overflow-hidden rounded-full bg-[var(--w-border)]">
              <div
                className="h-full origin-left rounded-full bg-[var(--w-positive)] transition-transform duration-500 ease-out"
                style={{ transform: `scaleX(${progresso})` }}
              />
            </div>
          </div>
        </div>

        {/* Barra de fórmula */}
        <div className="flex items-center gap-3 border-b border-[var(--w-canvas-soft)] bg-white px-5 py-2 font-[family-name:var(--f-mono)] text-xs">
          <span className="rounded bg-[var(--w-canvas-soft)] px-2 py-0.5 italic text-[var(--w-mute)]">fx</span>
          <span className="text-[var(--w-ink)]">
            =MORPHLEADS(&quot;Estética automotiva&quot;; &quot;São Paulo&quot;; {TOTAL_LEADS}; &quot;sem_site&quot;)
          </span>
          <span className="ml-auto text-[11px] text-[var(--w-positive-deep)]">
            {foraDoAr
              ? "Manutenção rápida"
              : lotado
                ? "Fila cheia agora"
                : previsaoNovo
                  ? `Entrega em ~${previsaoNovo} min`
                  : "Pronto em minutos"}
          </span>
        </div>

        {/* Grade da planilha sendo montada */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--w-canvas-soft)] bg-[var(--w-canvas-soft)]/40 font-[family-name:var(--f-mono)] text-[11px] uppercase tracking-wider text-[var(--w-mute)]">
                <th scope="col" className="w-10 px-4 py-2.5 text-center">
                  #
                </th>
                <th scope="col" className="px-4 py-2.5 font-semibold">
                  Prioridade
                </th>
                <th scope="col" className="px-4 py-2.5 font-semibold">
                  Negócio (Google Maps)
                </th>
                <th scope="col" className="px-4 py-2.5 font-semibold">
                  Região
                </th>
                <th scope="col" className="px-4 py-2.5 font-semibold">
                  WhatsApp
                </th>
                <th scope="col" className="px-4 py-2.5 font-semibold">
                  Nota
                </th>
                <th scope="col" className="px-4 py-2.5 font-semibold">
                  Site
                </th>
                <th scope="col" className="px-4 py-2.5 font-semibold">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--w-canvas-soft)]">
              {LINHAS_HERO.map((l, idx) => {
                const visivel = idx < linhasVisiveis;
                const recemAdicionada = idx === linhasVisiveis - 1;
                return (
                  <tr
                    key={l.nome}
                    className={`transition-[opacity,transform,background-color] duration-500 ${
                      visivel ? "translate-y-0 opacity-100" : "translate-y-2 opacity-20"
                    } ${recemAdicionada ? "bg-[var(--w-primary-pale)]/55" : "bg-white"}`}
                  >
                    <td className="px-4 py-3 text-center font-[family-name:var(--f-mono)] text-xs text-[var(--w-mute)]">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          l.prio === "Alta"
                            ? "bg-[var(--w-primary-pale)] text-[var(--w-positive-deep)]"
                            : "bg-[var(--w-warning)] text-[var(--w-warning-content)]"
                        }`}
                      >
                        {l.prio}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--w-ink)]">{l.nome}</td>
                    <td className="px-4 py-3 text-[var(--w-body)]">{l.regiao}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-[family-name:var(--f-mono)] text-xs tabular-nums text-[var(--w-ink)]">{l.tel}</td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-[var(--w-ink)]">
                      {l.nota} <span className="text-[var(--w-mute)]">({l.aval})</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="rounded-full bg-[var(--w-ink)]/8 px-2.5 py-0.5 text-xs font-medium text-[var(--w-ink)]">Sem site</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--w-positive-deep)]">
                        <FaWhatsapp className="h-3.5 w-3.5" aria-hidden />
                        Abrir conversa
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Versão Mobile enxuta e bonita: 3 linhas animadas sem poluição */}
      <div className="overflow-hidden rounded-[22px] border border-[var(--w-ink)]/12 bg-white shadow-[0_18px_40px_-20px_rgba(14,15,12,0.2)] lg:hidden">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--w-canvas-soft)] bg-[var(--w-canvas-soft)]/70 px-4 py-2.5">
          <span className="flex items-center gap-2 font-[family-name:var(--f-mono)] text-[11px] font-semibold text-[var(--w-ink)]">
            <span className="grid h-5 w-5 place-items-center rounded bg-[var(--w-positive-deep)] text-[10px] font-bold text-white">X</span>
            sua-planilha.xlsx
          </span>
          <span className="font-[family-name:var(--f-mono)] text-[11px] font-semibold tabular-nums text-[var(--w-positive-deep)]">
            {contadorLeads}/{TOTAL_LEADS} leads
          </span>
        </div>

        <div className="divide-y divide-[var(--w-canvas-soft)]">
          {LINHAS_HERO.slice(0, 3).map((l, idx) => {
            const ativo = idx === (linhasVisiveis - 1) % 3;
            return (
              <div
                key={l.nome}
                className={`flex items-center justify-between gap-3 px-4 py-3 transition-colors duration-300 ${
                  ativo ? "bg-[var(--w-primary-pale)]/55" : "bg-white"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[var(--w-ink)]">{l.nome}</p>
                  <p className="mt-0.5 font-[family-name:var(--f-mono)] text-[11px] text-[var(--w-mute)]">
                    {l.tel} · ★ {l.nota} ({l.aval})
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--w-primary-pale)] px-2.5 py-1 text-[11px] font-semibold text-[var(--w-positive-deep)]">
                  <FaWhatsapp className="h-3 w-3" aria-hidden />
                  WhatsApp
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Exemplo real gerado pelo robô (Estética automotiva, SP e ABC).
const EXEMPLO: { nome: string; regiao: string; tel: string; nota: string; aval: number; prio: "Alta" | "Média" }[] = [
  { nome: "Box Detail - Estética Automotiva", regiao: "Vila Mariana", tel: "(11) 9••••-3850", nota: "4,9", aval: 416, prio: "Alta" },
  { nome: "Uehara Estética Automotiva", regiao: "Zona Norte (Santana)", tel: "(11) 9••••-5209", nota: "4,9", aval: 254, prio: "Alta" },
  { nome: "3° Millenium Estética Automotiva", regiao: "Penha", tel: "(11) 9••••-8974", nota: "4,9", aval: 171, prio: "Alta" },
  { nome: "WA Estética Automotiva", regiao: "São Caetano do Sul", tel: "(11) 9••••-5796", nota: "4,9", aval: 161, prio: "Alta" },
  { nome: "RS17 Estetica Automotiva", regiao: "Santo Amaro", tel: "(11) 9••••-8186", nota: "5,0", aval: 140, prio: "Alta" },
];

function DemonstracaoPlanilha({ mensagem }: { mensagem: string }) {
  const [aba, setAba] = useState<"leads" | "resumo">("leads");

  return (
    <section id="exemplo" aria-labelledby="exemplo-titulo" className="scroll-mt-20 border-t border-[var(--w-canvas-soft)] bg-[var(--w-canvas)] py-16 md:py-24">
      <div data-revelar className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2
              id="exemplo-titulo"
              className="font-[family-name:var(--f-display)] text-[clamp(1.85rem,3.6vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-[var(--w-ink)]"
            >
              Veja exatamente o que vem dentro da planilha.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--w-body)]">
              Trecho real gerado pelo robô para Estética Automotiva em São Paulo e ABC. Aqui ocultamos parte do número por privacidade; no seu arquivo ele vem
              completo, com o botão que abre o WhatsApp.
            </p>
          </div>

          <div role="tablist" aria-label="Abas da planilha" className="inline-flex w-fit rounded-full bg-[var(--w-canvas-soft)] p-1">
            <button
              id="tab-leads"
              type="button"
              role="tab"
              aria-selected={aba === "leads"}
              aria-controls="painel-planilha"
              onClick={() => setAba("leads")}
              className={`min-h-11 rounded-full px-4 text-sm font-semibold transition-colors sm:min-h-10 ${
                aba === "leads" ? "bg-[var(--w-ink)] text-white" : "text-[var(--w-body)] hover:text-[var(--w-ink)]"
              }`}
            >
              Aba 1: Leads ({TOTAL_LEADS})
            </button>
            <button
              id="tab-resumo"
              type="button"
              role="tab"
              aria-selected={aba === "resumo"}
              aria-controls="painel-planilha"
              onClick={() => setAba("resumo")}
              className={`min-h-11 rounded-full px-4 text-sm font-semibold transition-colors sm:min-h-10 ${
                aba === "resumo" ? "bg-[var(--w-ink)] text-white" : "text-[var(--w-body)] hover:text-[var(--w-ink)]"
              }`}
            >
              Aba 2: Resumo &amp; Funil
            </button>
          </div>
        </div>

        <div
          id="painel-planilha"
          role="tabpanel"
          aria-labelledby={aba === "leads" ? "tab-leads" : "tab-resumo"}
          className="mt-8 overflow-hidden rounded-[24px] border border-[var(--w-border)] bg-white"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--w-canvas-soft)] bg-[var(--w-canvas-soft)]/60 px-5 py-3">
            <span className="flex items-center gap-2 font-[family-name:var(--f-mono)] text-xs font-medium text-[var(--w-ink)]">
              <span aria-hidden className="grid h-5 w-5 place-items-center rounded bg-[var(--w-positive-deep)] text-[10px] font-bold text-white">
                X
              </span>
              leads-estetica-automotiva.xlsx
            </span>
            <span className="font-[family-name:var(--f-mono)] text-xs text-[var(--w-mute)]">
              {aba === "leads" ? `5 de ${TOTAL_LEADS} linhas reais` : "Estrutura da aba Resumo"}
            </span>
          </div>

          {aba === "leads" ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--w-canvas-soft)] bg-[var(--w-canvas-soft)]/40 font-[family-name:var(--f-mono)] text-[11px] uppercase tracking-wider text-[var(--w-mute)]">
                      <th scope="col" className="px-5 py-3 font-semibold">
                        Prioridade
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Negócio
                      </th>
                      <th scope="col" className="hidden px-4 py-3 font-semibold md:table-cell">
                        Região
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Telefone
                      </th>
                      <th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell">
                        Nota
                      </th>
                      <th scope="col" className="px-5 py-3 font-semibold">
                        Ação
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--w-canvas-soft)]">
                    {EXEMPLO.map((l) => (
                      <tr key={l.nome} className="transition-colors hover:bg-[var(--w-canvas-soft)]/35">
                        <td className="px-5 py-3.5">
                          <span className="inline-flex rounded-full bg-[var(--w-primary-pale)] px-2.5 py-0.5 text-xs font-semibold text-[var(--w-positive-deep)]">
                            {l.prio}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-[var(--w-ink)]">{l.nome}</td>
                        <td className="hidden px-4 py-3.5 text-[var(--w-body)] md:table-cell">{l.regiao}</td>
                        <td className="whitespace-nowrap px-4 py-3.5 font-[family-name:var(--f-mono)] text-xs tabular-nums text-[var(--w-ink)]">{l.tel}</td>
                        <td className="hidden whitespace-nowrap px-4 py-3.5 tabular-nums text-[var(--w-ink)] sm:table-cell">
                          {l.nota} <span className="text-[var(--w-mute)]">({l.aval})</span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--w-positive-deep)]">
                            <FaWhatsapp className="h-3.5 w-3.5" aria-hidden />
                            Abrir conversa
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col justify-between gap-4 border-t border-[var(--w-canvas-soft)] bg-[var(--w-canvas-soft)]/30 px-5 py-4 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <FaWhatsapp className="mt-0.5 h-5 w-5 shrink-0 text-[var(--w-positive-deep)]" aria-hidden />
                  <p className="text-xs leading-relaxed text-[var(--w-body)]">
                    <strong className="font-semibold text-[var(--w-ink)]">Ao clicar em &ldquo;Abrir conversa&rdquo;:</strong>{" "}
                    {mensagem.trim()
                      ? `o WhatsApp já abre preenchido com: “${mensagem.trim().slice(0, 110)}${mensagem.trim().length > 110 ? "…" : ""}”`
                      : "o WhatsApp abre direto no número do negócio (ou já com a mensagem que você escrever no passo 2)."}
                  </p>
                </div>
                <BotaoBrilho href="#pedido" variante="escuro" className="min-h-11 shrink-0 px-5 text-xs">
                  <span>Quero para o meu nicho</span>
                  <LuArrowRight className="h-3.5 w-3.5" aria-hidden />
                </BotaoBrilho>
              </div>
            </>
          ) : (
            <div className="p-6 sm:p-8">
              <p className="text-sm text-[var(--w-body)]">
                Conforme você atualiza o status de cada lead na aba 1 (<strong className="font-semibold text-[var(--w-ink)]">Novo</strong>,{" "}
                <strong className="font-semibold text-[var(--w-ink)]">Contatado</strong>,{" "}
                <strong className="font-semibold text-[var(--w-ink)]">Proposta</strong>,{" "}
                <strong className="font-semibold text-[var(--w-ink)]">Fechado</strong>), a aba Resumo calcula automaticamente seu funil:
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                {[
                  { rotulo: "Total da lista", valor: `${TOTAL_LEADS} leads`, detalhe: "Separados por prioridade" },
                  { rotulo: "Contatados", valor: "Fórmula automática", detalhe: "Acompanhe seu ritmo diário" },
                  { rotulo: "Taxa de fechamento", valor: "% em tempo real", detalhe: "Calculada sobre os contatos" },
                  { rotulo: "Receita fechada", valor: "Soma dos contratos", detalhe: "Veja o retorno da lista" },
                ].map((m) => (
                  <div key={m.rotulo} className="rounded-2xl bg-[var(--w-canvas-soft)] p-4">
                    <p className="font-[family-name:var(--f-mono)] text-[11px] uppercase tracking-wider text-[var(--w-mute)]">{m.rotulo}</p>
                    <p className="mt-2 font-[family-name:var(--f-display)] text-lg font-extrabold text-[var(--w-ink)]">{m.valor}</p>
                    <p className="mt-1 text-xs text-[var(--w-body)]">{m.detalhe}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const PERGUNTAS: { p: string; r: string }[] = [
  {
    p: "Os negócios da planilha são reais?",
    r: "Sim. O robô busca no Google Maps, na hora do seu pedido, negócios do nicho e da região que você escolheu, com nome, telefone, nota e número de avaliações do perfil público. Confirme os dados antes de abordar.",
  },
  {
    p: `E se o meu nicho tiver menos de ${TOTAL_LEADS} negócios na região?`,
    r: "Completamos a planilha com bairros e cidades vizinhas, sem custo. É só chamar a gente pelo botão de WhatsApp no topo da página.",
  },
  {
    p: "Como eu recebo a planilha?",
    r: "Nesta mesma página. Depois do pagamento, o botão de download aparece aqui em alguns minutos. Se fechar a aba, é só voltar neste navegador: o pedido fica salvo.",
  },
  {
    p: "E se der erro na geração?",
    r: "Você vê o aviso nesta página e a gente é notificado na hora. Resolvemos o seu pedido ou devolvemos 100% do valor pelo Mercado Pago.",
  },
  {
    p: "Como funciona o pagamento?",
    r: `Pagamento único de R$\u00A0${PRECO_TEXTO}, sem mensalidade e sem cobrança recorrente, por Pix ou cartão no Mercado Pago.`,
  },
];

function Perguntas() {
  return (
    <section id="perguntas" aria-labelledby="faq-titulo" className="scroll-mt-20 bg-[var(--w-canvas-soft)] py-16 pb-24 md:py-24">
      <div data-revelar className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <div>
            <h2
              id="faq-titulo"
              className="font-[family-name:var(--f-display)] text-[clamp(1.85rem,3.6vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-[var(--w-ink)]"
            >
              Perguntas frequentes
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--w-body)]">
              Tudo o que você precisa saber antes de gerar sua lista. Ficou alguma dúvida específica? Fale direto no WhatsApp.
            </p>
          </div>

          <div className="space-y-3">
            {PERGUNTAS.map((q) => (
              <details key={q.p} className="group rounded-2xl bg-[var(--w-canvas)] px-5 py-1">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-base font-bold text-[var(--w-ink)] [&::-webkit-details-marker]:hidden">
                  <span>{q.p}</span>
                  <LuChevronDown
                    aria-hidden
                    className="h-5 w-5 shrink-0 text-[var(--w-mute)] transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <p className="pb-4 pr-6 text-sm leading-relaxed text-[var(--w-body)] sm:text-base">{q.r}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Bloco final de fechamento */}
        <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-[24px] bg-[var(--w-ink)] p-7 text-white sm:p-10 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h3 className="font-[family-name:var(--f-display)] text-2xl font-extrabold leading-tight tracking-tight text-[var(--w-primary)] sm:text-3xl">
              Comece a prospectar hoje com {TOTAL_LEADS} contatos organizados.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--w-canvas-soft)]/80">
              R$&nbsp;{PRECO_TEXTO} uma única vez · entrega em minutos nesta página · garantia de {TOTAL_LEADS} leads.
            </p>
          </div>
          <BotaoBrilho href="#pedido" className="min-h-13 shrink-0 px-7 text-base">
            <span>Gerar minha planilha</span>
            <LuArrowRight className="h-4 w-4" aria-hidden />
          </BotaoBrilho>
        </div>
      </div>
    </section>
  );
}

const FRASES_GERANDO = (comMensagem: boolean) => [
  "Planilha sendo gerada…",
  "Coletando os leads no Google Maps…",
  "Separando os contatos com WhatsApp…",
  comMensagem ? "Escrevendo as mensagens de abordagem…" : "Montando o funil e o resumo…",
  "Dando os últimos detalhes…",
];

function Carregando({
  a,
  fase,
  foraDoAr,
  estado,
}: {
  a: Andamento;
  fase: "confirmando" | "pago" | "gerando";
  foraDoAr: boolean;
  estado: Estado | null;
}) {
  const naFrente = estado && fase !== "confirmando" ? Math.max(0, estado.fila - 1) : 0;
  const previsao = estado && fase !== "confirmando" ? Math.ceil(Math.max(1, estado.fila) * estado.minPorPedido) : null;
  const raiz = useRef<HTMLDivElement>(null);
  const frases =
    fase === "confirmando"
      ? ["Confirmando o seu pagamento…"]
      : fase === "pago"
        ? ["Pagamento confirmado. Preparando o pedido…"]
        : FRASES_GERANDO(Boolean(a.comMensagem));
  const [i, setI] = useState(0);
  const atual = frases[Math.min(i, frases.length - 1)];

  useEffect(() => {
    if (i >= frases.length - 1) return;
    const t = setTimeout(() => setI((n) => n + 1), 5000);
    return () => clearTimeout(t);
  }, [i, frases.length]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-g='orbita']", { rotation: 360, duration: 1.2, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
      });
    },
    { scope: raiz },
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo("[data-g='frase']", { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" });
      });
    },
    { scope: raiz, dependencies: [atual], revertOnUpdate: false },
  );

  return (
    <div ref={raiz}>
      <h2 className="font-[family-name:var(--f-display)] text-2xl font-extrabold tracking-tight text-[var(--w-ink)]">
        Estamos montando sua planilha
      </h2>
      <p className="mt-1 font-[family-name:var(--f-mono)] text-xs text-[var(--w-mute)]">
        {a.nicho} · {a.regiao}
      </p>

      <div className="mt-6 grid place-items-center gap-5 rounded-2xl bg-white px-4 py-9">
        <div aria-hidden className="relative h-16 w-16">
          <span className="absolute inset-0 rounded-full border-[3px] border-[var(--w-ink)]/15" />
          <span data-g="orbita" className="absolute inset-0">
            <span className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--w-ink)] bg-[var(--w-primary)]" />
          </span>
        </div>
        <p role="status" className="sr-only">
          Gerando sua planilha. Isso leva alguns minutos.
        </p>
        <p aria-hidden data-g="frase" className="min-h-[1.75rem] text-center text-base font-bold leading-snug text-[var(--w-ink)]">
          {atual}
        </p>
      </div>

      {foraDoAr && (
        <p role="alert" className="mt-4 rounded-xl bg-[var(--w-warning)] p-3.5 text-sm leading-relaxed text-[var(--w-warning-content)]">
          Nosso sistema está fora do ar por um tempo. Seu pagamento está confirmado e a planilha sai assim que voltarmos. Pode fechar esta página: o pedido fica
          salvo neste navegador.
        </p>
      )}

      <p className="mt-4 text-sm leading-relaxed text-[var(--w-body)]">
        {previsao !== null ? `Previsão: cerca de ${previsao} min.` : "Leva só alguns minutos."}
        {naFrente > 0 && ` Há ${naFrente} ${naFrente === 1 ? "pedido" : "pedidos"} na sua frente.`} Pode deixar esta página aberta: o botão de download aparece
        aqui quando ficar pronta.
      </p>
    </div>
  );
}

function Acompanhamento({
  a,
  onNovo,
  onPagar,
  erro,
  confirmando,
  foraDoAr,
  estado,
}: {
  a: Andamento;
  onNovo: () => void;
  onPagar: () => void;
  erro: string;
  confirmando: boolean;
  foraDoAr: boolean;
  estado: Estado | null;
}) {
  const fase =
    a.status === "gerando" ? "gerando" : a.status === "pago" ? "pago" : a.status === "aguardando_pagamento" && confirmando ? "confirmando" : null;
  if (fase) return <Carregando key={fase} a={a} fase={fase} foraDoAr={foraDoAr && fase !== "confirmando"} estado={estado} />;
  const falhou = a.status === "falhou";

  return (
    <div aria-live="polite">
      <h2 className="font-[family-name:var(--f-display)] text-2xl font-extrabold tracking-tight text-[var(--w-ink)]">
        {a.status === "pronto" ? "Sua planilha está pronta." : falhou ? "Não conseguimos gerar a planilha." : "Pedido em andamento"}
      </h2>
      <p className="mt-1 font-[family-name:var(--f-mono)] text-xs text-[var(--w-mute)]">
        {a.nicho} · {a.regiao}
      </p>

      <ol className="mt-6 space-y-2.5">
        {ETAPAS.map((e, i) => {
          const feito = !falhou && e.status.includes(a.status);
          return (
            <li
              key={e.rotulo}
              className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm ${
                feito ? "bg-[var(--w-primary-pale)] font-semibold text-[var(--w-ink-deep)]" : "bg-white text-[var(--w-mute)]"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="font-[family-name:var(--f-mono)] text-xs">{i + 1}</span>
                <span>{e.rotulo}</span>
              </span>
              {feito && <LuCheck aria-hidden className="h-4 w-4 shrink-0 text-[var(--w-positive-deep)]" />}
            </li>
          );
        })}
      </ol>

      {a.status === "aguardando_pagamento" && (
        <p className="mt-5 rounded-xl bg-white p-3.5 text-sm text-[var(--w-body)]">
          {a.pagamentoAtivo
            ? "Falta só confirmar o pagamento para o robô começar a coleta."
            : "O pagamento ainda está sendo ativado. Seu pedido ficou registrado e entramos em contato pelo WhatsApp informado."}
        </p>
      )}
      {falhou && (
        <p className="mt-5 rounded-xl bg-[var(--w-negative-bg)] p-3.5 text-sm font-medium text-[var(--w-negative)]">
          {a.erro ?? "Tente de novo ou fale com a gente no WhatsApp."}
        </p>
      )}
      {erro && a.status === "aguardando_pagamento" && (
        <p role="alert" className="mt-3 text-sm font-medium text-[var(--w-negative)]">
          {erro}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {a.status === "aguardando_pagamento" && a.pagamentoAtivo && (
          <BotaoBrilho type="button" onClick={onPagar} className="min-h-12 flex-1 px-6 text-sm">
            <span>Pagar agora · R$ {PRECO_TEXTO}</span>
          </BotaoBrilho>
        )}
        {a.status === "pronto" && (
          <BotaoBrilho href={`/api/gerador/arquivo/${a.id}`} className="min-h-12 flex-1 px-6 text-sm">
            <LuDownload aria-hidden className="h-4 w-4" />
            <span>Baixar planilha (.xlsx)</span>
          </BotaoBrilho>
        )}
        <button
          type="button"
          onClick={onNovo}
          className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-[var(--w-body)] underline underline-offset-4 hover:text-[var(--w-ink)]"
        >
          Fazer outro pedido
        </button>
      </div>
    </div>
  );
}
