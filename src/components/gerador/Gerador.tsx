"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
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

gsap.registerPlugin(useGSAP);

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

  // Entrada limpa e contida da hero.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from("[data-hero='texto']", { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.08 })
          .from("[data-hero='card']", { y: 24, autoAlpha: 0, duration: 0.65 }, "-=0.4");
      });
    },
    { scope: raiz },
  );

  // Mostra barra fixa no mobile só depois que o card do pedido sair da tela.
  useEffect(() => {
    const el = pedidoRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setMostrarSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Confere status do robô a cada 30s.
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

  // Retoma pedido salvo no navegador.
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

  // Meta Pixel: ViewContent.
  useEffect(() => {
    trackMetaViewContent({ content_name: "gerador", pagina: "/gerador" });
  }, []);

  // Meta Pixel: Purchase deduplicado por pedido.
  useEffect(() => {
    if (!andamento || !["pago", "gerando", "pronto"].includes(andamento.status)) return;
    try {
      if (localStorage.getItem(chaveCompra(andamento.id))) return;
      localStorage.setItem(chaveCompra(andamento.id), "1");
    } catch {}
    trackMetaPurchase({ ...PIXEL_PRODUTO, num_items: 1 }, `compra-${andamento.id}`);
  }, [andamento]);

  // Acompanha status até finalizar.
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

  return (
    <div ref={raiz}>
      {/* HERO BAND (Sage Canvas — assinatura visual Wise) */}
      <section className="bg-[var(--w-canvas-soft)] pb-14 pt-10 md:pb-20 md:pt-14">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-12">
          {/* Coluna esquerda: promessa clara, ancoragem de preço e garantias reais */}
          <div className="lg:pt-4">
            <h1
              data-hero="texto"
              className="font-[family-name:var(--f-display)] text-[clamp(2.35rem,5.2vw,4.1rem)] font-extrabold leading-[1.01] tracking-[-0.035em] text-[var(--w-ink)]"
            >
              {TOTAL_LEADS} clientes locais prontos pro seu WhatsApp, em minutos.
            </h1>

            <p data-hero="texto" className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--w-body)]">
              Pare de passar a tarde copiando número do Google Maps. Escolha o nicho e a cidade e baixe um Excel organizado com telefone, nota, prioridade e
              funil de vendas.
            </p>

            {/* Destaque de preço transparente (Wise style: clareza total) */}
            <div data-hero="texto" className="mt-7 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-[family-name:var(--f-display)] text-4xl font-extrabold tracking-tight tabular-nums text-[var(--w-ink)] sm:text-5xl">
                R$&nbsp;{PRECO_TEXTO}
              </span>
              <span className="rounded-full bg-[var(--w-primary-pale)] px-3 py-1 text-sm font-semibold text-[var(--w-positive-deep)]">
                R$&nbsp;{PRECO_POR_LEAD} por lead · pagamento único
              </span>
            </div>

            {/* 3 garantias reais e verificáveis antes do CTA */}
            <ul data-hero="texto" className="mt-7 space-y-3 text-sm text-[var(--w-ink)] sm:text-base">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--w-primary)] text-[var(--w-ink-deep)]">
                  <LuCheck className="h-3.5 w-3.5 stroke-[2.75]" aria-hidden />
                </span>
                <span>
                  <strong className="font-semibold">Vende sites?</strong> Filtramos automaticamente só os negócios que ainda não têm site.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--w-primary)] text-[var(--w-ink-deep)]">
                  <LuCheck className="h-3.5 w-3.5 stroke-[2.75]" aria-hidden />
                </span>
                <span>
                  <strong className="font-semibold">Garantia de {TOTAL_LEADS} leads:</strong> veio menos na sua região? Completamos com vizinhos sem custo.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--w-primary)] text-[var(--w-ink-deep)]">
                  <LuCheck className="h-3.5 w-3.5 stroke-[2.75]" aria-hidden />
                </span>
                <span>
                  <strong className="font-semibold">Sem mensalidade:</strong> pague uma vez no Pix ou cartão pelo Mercado Pago e baixe aqui mesmo.
                </span>
              </li>
            </ul>

            {/* Indicador vivo de fila/operação (transparência gera confiança) */}
            {estado && (
              <div
                data-hero="texto"
                className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-[var(--w-canvas)] px-4 py-2 text-xs font-medium text-[var(--w-body)]"
              >
                <span
                  aria-hidden
                  className={`h-2.5 w-2.5 rounded-full ${foraDoAr ? "bg-[var(--w-negative)]" : lotado ? "bg-amber-500" : "bg-[var(--w-positive)]"}`}
                />
                {foraDoAr ? (
                  <span>Sistema em manutenção rápida — tente em instantes</span>
                ) : lotado ? (
                  <span>Fila cheia agora — libera em ~{Math.max(1, Math.ceil(estado.minPorPedido))} min</span>
                ) : (
                  <span className="tabular-nums">
                    Robô ativo agora · entrega em cerca de {previsaoNovo} min após o pagamento
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Coluna direita: Card Interativo de 2 Etapas (estilo Converter Card da Wise) */}
          <div
            id="pedido"
            ref={pedidoRef}
            data-hero="card"
            className="scroll-mt-20 rounded-[24px] bg-[var(--w-canvas)] p-6 shadow-[0_20px_50px_-24px_rgba(14,15,12,0.18)] sm:p-7"
          >
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
                {/* Cabeçalho com indicador de 2 etapas */}
                <div className="mb-6 flex items-center justify-between gap-3 border-b border-[var(--w-canvas-soft)] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--w-ink)] font-[family-name:var(--f-mono)] text-xs font-semibold text-[var(--w-primary)]">
                      {etapa}/2
                    </span>
                    <h2 className="text-base font-bold text-[var(--w-ink)]">
                      {etapa === 1 ? "Monte sua planilha" : "Onde entregamos a lista?"}
                    </h2>
                  </div>
                  <span className="font-[family-name:var(--f-mono)] text-xs font-medium tabular-nums text-[var(--w-mute)]">
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
                        className={`mt-2.5 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium ${
                          filtraSemSite
                            ? "bg-[var(--w-primary-pale)] text-[var(--w-positive-deep)]"
                            : "bg-[var(--w-canvas-soft)] text-[var(--w-body)]"
                        }`}
                      >
                        <LuFilter className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        {filtraSemSite
                          ? "Filtro ativo: a planilha trará só negócios que ainda não têm site."
                          : "A planilha trará os melhores negócios do nicho, com ou sem site."}
                      </p>
                    </div>

                    {/* Resumo dinâmico do que será montado */}
                    <div className="rounded-2xl bg-[var(--w-canvas-soft)] p-4">
                      <div className="flex items-center justify-between gap-2 text-xs font-medium text-[var(--w-body)]">
                        <span>Sua planilha (.xlsx)</span>
                        <span className="font-[family-name:var(--f-mono)] tabular-nums text-[var(--w-ink)]">{TOTAL_LEADS} leads</span>
                      </div>
                      <p className="mt-1 truncate text-sm font-bold text-[var(--w-ink)]">
                        {nichoFinal || "Escolha um nicho"} · {regiaoFinal || "Digite a cidade"}
                      </p>
                    </div>

                    {erro && (
                      <p role="alert" className="rounded-xl bg-[var(--w-negative-bg)] px-3.5 py-2.5 text-sm font-medium text-[var(--w-negative)]">
                        {erro}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={avancarEtapa}
                      className="flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[var(--w-primary)] px-6 py-3.5 text-base font-bold text-[var(--w-ink)] transition-colors hover:bg-[var(--w-primary-hover)]"
                    >
                      <span>Continuar para entrega</span>
                      <LuArrowRight className="h-4 w-4" aria-hidden />
                    </button>

                    <p className="text-center text-xs text-[var(--w-mute)]">
                      Sem cadastro longo · pagamento só no próximo passo
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Resumo editável da Etapa 1 */}
                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--w-canvas-soft)] px-4 py-3">
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
                        className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-full bg-white px-3 text-xs font-semibold text-[var(--w-ink)] transition-colors hover:bg-[var(--w-primary-pale)]"
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

                    {/* Mensagem personalizada do WhatsApp (opcional e recolhida) */}
                    <div>
                      {!comMsg ? (
                        <button
                          type="button"
                          onClick={() => {
                            setComMsg(true);
                            requestAnimationFrame(() => msgRef.current?.focus());
                          }}
                          className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-dashed border-[var(--w-border)] bg-[var(--w-canvas-soft)]/50 px-3.5 py-2.5 text-left text-sm font-medium text-[var(--w-body)] transition-colors hover:border-[var(--w-ink)] hover:text-[var(--w-ink)]"
                        >
                          <LuPlus className="h-4 w-4 shrink-0" aria-hidden />
                          <span>Personalizar mensagem do WhatsApp (opcional)</span>
                        </button>
                      ) : (
                        <div className="rounded-2xl border border-[var(--w-border)] p-3.5">
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
                                className="min-h-8 rounded-full border border-[var(--w-border)] bg-[var(--w-canvas-soft)] px-2.5 font-[family-name:var(--f-mono)] text-[11px] font-medium text-[var(--w-ink)] transition-colors hover:border-[var(--w-ink)]"
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

                    <button
                      type="submit"
                      disabled={enviando || Boolean(avisoVenda)}
                      className="flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[var(--w-primary)] px-6 py-3.5 text-base font-bold text-[var(--w-ink)] transition-colors hover:bg-[var(--w-primary-hover)] disabled:opacity-60"
                    >
                      {enviando ? "Abrindo pagamento…" : `Gerar minha planilha · R$ ${PRECO_TEXTO}`}
                    </button>

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
                      <p className="text-center text-[11px] leading-relaxed text-[var(--w-mute)]">
                        Usamos seus dados só para entregar a planilha e avisar sobre o pedido.
                      </p>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAIXA 2 (Branco puro): Demonstração real interativa — o que você baixa */}
      <DemonstracaoPlanilha mensagem={textoMensagem} />

      {/* FAIXA 3 (Sálvia): Antes x Depois + Conta de ROI (Card Dark Wise) */}
      <section className="bg-[var(--w-canvas-soft)] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="font-[family-name:var(--f-display)] text-[clamp(1.85rem,3.6vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-[var(--w-ink)]">
              Menos tempo garimpando. Mais tempo fechando cliente.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--w-body)]">
              Prospectar no Google Maps funciona, mas fazer isso na mão come o dia inteiro. O robô faz o trabalho braçal em minutos.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            {/* Comparativo limpo em card branco */}
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

            {/* Card escuro de ancoragem de ROI (assinatura Wise card-feature-dark) */}
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
              <a
                href="#pedido"
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--w-primary)] px-6 text-sm font-bold text-[var(--w-ink)] transition-colors hover:bg-[var(--w-primary-hover)]"
              >
                Montar minha lista agora
                <LuArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAIXA 4 (Branco puro): Para quem serve + honestidade sobre limitações */}
      <section className="bg-[var(--w-canvas)] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
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

            {/* Transparência / Limitações (Ogilvy/Halbert: admitir limites gera confiança) */}
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
                    <strong className="font-semibold text-[var(--w-ink)]">Abre em qualquer lugar:</strong> arquivo <code className="font-[family-name:var(--f-mono)] text-xs">.xlsx</code> pronto
                    para Excel, Google Planilhas ou LibreOffice.
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

      {/* FAIXA 5 (Sálvia): FAQ + Fechamento */}
      <Perguntas />

      {/* Barra sticky no mobile quando o formulário saiu da tela */}
      {!andamento && mostrarSticky && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--w-ink)]/10 bg-[var(--w-canvas)]/95 px-4 py-3 backdrop-blur-sm lg:hidden">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
            <div>
              <p className="font-[family-name:var(--f-display)] text-lg font-extrabold leading-none tabular-nums text-[var(--w-ink)]">
                R$&nbsp;{PRECO_TEXTO}
              </p>
              <p className="mt-0.5 text-xs text-[var(--w-mute)]">{TOTAL_LEADS} leads · pagamento único</p>
            </div>
            <a
              href="#pedido"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-[var(--w-primary)] px-5 text-sm font-bold text-[var(--w-ink)] transition-colors hover:bg-[var(--w-primary-hover)]"
            >
              Montar lista
              <LuArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      )}
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
    <section id="exemplo" aria-labelledby="exemplo-titulo" className="scroll-mt-20 bg-[var(--w-canvas)] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
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

          {/* Seletor das 2 abas do Excel */}
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

        {/* Moldura limpa da planilha */}
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
                <a
                  href="#pedido"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-[var(--w-ink)] px-4 text-xs font-bold text-white transition-colors hover:bg-[var(--w-ink-deep)]"
                >
                  Quero para o meu nicho
                  <LuArrowRight className="h-3.5 w-3.5" aria-hidden />
                </a>
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
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
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
          <a
            href="#pedido"
            className="inline-flex min-h-13 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--w-primary)] px-7 text-base font-bold text-[var(--w-ink)] transition-colors hover:bg-[var(--w-primary-hover)]"
          >
            Gerar minha planilha
            <LuArrowRight className="h-4 w-4" aria-hidden />
          </a>
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

      <div className="mt-6 grid place-items-center gap-5 rounded-2xl bg-[var(--w-canvas-soft)] px-4 py-9">
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
                feito ? "bg-[var(--w-primary-pale)] font-semibold text-[var(--w-ink-deep)]" : "bg-[var(--w-canvas-soft)] text-[var(--w-mute)]"
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
        <p className="mt-5 rounded-xl bg-[var(--w-canvas-soft)] p-3.5 text-sm text-[var(--w-body)]">
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
          <button
            type="button"
            onClick={onPagar}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[var(--w-primary)] px-6 font-bold text-[var(--w-ink)] transition-colors hover:bg-[var(--w-primary-hover)]"
          >
            Pagar agora · R$ {PRECO_TEXTO}
          </button>
        )}
        {a.status === "pronto" && (
          <a
            href={`/api/gerador/arquivo/${a.id}`}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[var(--w-primary)] px-6 font-bold text-[var(--w-ink)] transition-colors hover:bg-[var(--w-primary-hover)]"
          >
            <LuDownload aria-hidden className="h-4 w-4" />
            Baixar planilha (.xlsx)
          </a>
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
