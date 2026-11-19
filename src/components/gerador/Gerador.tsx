"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LuCheck, LuDownload } from "react-icons/lu";
import { MAX_MENSAGEM, NICHOS, PRECO_TEXTO, TOTAL_LEADS, VARIAVEIS, type Status } from "@/lib/gerador";

gsap.registerPlugin(useGSAP);

const OUTRO = "Outro";
const CHAVE = "gerador:pedido";

type Andamento = { id: string; status: Status; nicho: string; regiao: string; leads?: number; erro?: string; pagamentoAtivo?: boolean };

const ETAPAS: { status: Status[]; rotulo: string }[] = [
  { status: ["aguardando_pagamento", "pago", "gerando", "pronto"], rotulo: "Pedido recebido" },
  { status: ["pago", "gerando", "pronto"], rotulo: "Pagamento confirmado" },
  { status: ["gerando", "pronto"], rotulo: "Coletando os leads no Google Maps" },
  { status: ["pronto"], rotulo: "Planilha pronta" },
];

function mascaraWhatsapp(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// Célula de entrada: sem borda própria; o anel de foco é a seleção da célula, como numa planilha.
const entrada =
  "w-full bg-transparent px-3 py-3 text-base text-[var(--tinta)] placeholder:text-[var(--suave)]/70 focus:outline-none";
const celula = "relative min-w-0 border-l border-[var(--linha)] bg-white focus-within:z-10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-[var(--azul)]";
const rotulo = "flex items-center border-l border-[var(--linha)] bg-[var(--cab)] px-3 font-[family-name:var(--f-mono)] text-[11px] font-medium uppercase tracking-wider text-[var(--suave)]";
const gutter = "grid place-items-center bg-[var(--cab)] font-[family-name:var(--f-mono)] text-[11px] text-[var(--suave)]";

export default function Gerador() {
  const raiz = useRef<HTMLDivElement>(null);
  const painel = useRef<HTMLFormElement>(null);
  const banda = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  const [nicho, setNicho] = useState<string>(NICHOS[0]);
  const [outro, setOutro] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [andamento, setAndamento] = useState<Andamento | null>(null);

  const nichoFinal = nicho === OUTRO ? outro.trim() : nicho;
  const regiaoFinal = [bairro.trim(), cidade.trim()].filter(Boolean).join(" ");
  const textoMensagem = mensagem
    .replaceAll("{nome}", "Nome do negócio")
    .replaceAll("{nota}", "4,9")
    .replaceAll("{avaliacoes}", "42")
    .replaceAll("{regiao}", regiaoFinal || "sua região");

  // Entrada da página: título, marca-texto, janela da planilha e linhas da prévia.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from("[data-g='titulo']", { yPercent: 40, autoAlpha: 0, duration: 0.8, stagger: 0.1 })
          .fromTo("[data-g='marca']", { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power2.inOut", transformOrigin: "left center" }, "-=0.35")
          .from("[data-g='janela']", { y: 40, autoAlpha: 0, duration: 0.8 }, "-=0.55")
          .from("[data-g='linha']", { autoAlpha: 0, x: -14, duration: 0.4, stagger: 0.06 }, "-=0.3");
      });
    },
    { scope: raiz },
  );

  // A barra de fórmula acende quando nicho ou região mudam.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo("[data-g='formula']", { backgroundColor: "#D8F24A" }, { backgroundColor: "rgba(216,242,74,0)", duration: 0.9, ease: "power2.out" });
      });
    },
    { scope: raiz, dependencies: [nichoFinal, regiaoFinal], revertOnUpdate: false },
  );

  // Faixa de seleção: desliza até a linha do campo que recebeu o foco.
  function moverBanda(e: React.FocusEvent<HTMLFormElement>) {
    const linha = (e.target as HTMLElement).closest<HTMLElement>("[data-campo]");
    const p = painel.current;
    const b = banda.current;
    if (!linha || !p || !b) return;
    const a = linha.getBoundingClientRect();
    const r = p.getBoundingClientRect();
    gsap.to(b, { y: a.top - r.top, height: a.height, autoAlpha: 1, duration: 0.35, ease: "power3.out", overwrite: true });
  }
  function esconderBanda(e: React.FocusEvent<HTMLFormElement>) {
    if (!painel.current?.contains(e.relatedTarget as Node | null)) gsap.to(banda.current, { autoAlpha: 0, duration: 0.25 });
  }

  // Retoma o pedido salvo neste navegador.
  useEffect(() => {
    let salvo: string | null = null;
    try {
      salvo = localStorage.getItem(CHAVE);
    } catch {}
    if (!salvo) return;
    fetch(`/api/gerador/pedido/${salvo}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => p && setAndamento(p))
      .catch(() => {});
  }, []);

  // Acompanha o pedido até ficar pronto.
  useEffect(() => {
    if (!andamento || andamento.status === "pronto" || andamento.status === "falhou") return;
    const t = setInterval(() => {
      fetch(`/api/gerador/pedido/${andamento.id}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((p) => p && setAndamento((a) => (a ? { ...a, ...p } : p)))
        .catch(() => {});
    }, 6000);
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

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    const digitos = whatsapp.replace(/\D/g, "");
    const invalido =
      nichoFinal.length < 3
        ? ["g-outro", "Escolha um nicho ou digite o seu."]
        : cidade.trim().length < 3
          ? ["g-cidade", "Informe a cidade."]
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
        body: JSON.stringify({ nicho: nichoFinal, regiao: regiaoFinal, nome, whatsapp, email, mensagem }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.erro ?? "Não foi possível registrar o pedido.");
      try {
        localStorage.setItem(CHAVE, d.id);
      } catch {}
      setAndamento({ id: d.id, status: d.status, nicho: nichoFinal, regiao: regiaoFinal, pagamentoAtivo: d.pagamentoAtivo });
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível registrar o pedido.");
    } finally {
      setEnviando(false);
    }
  }

  function novoPedido() {
    try {
      localStorage.removeItem(CHAVE);
    } catch {}
    setAndamento(null);
  }

  return (
    <div ref={raiz}>
      <section className="mx-auto grid max-w-6xl items-end gap-8 px-4 pb-10 pt-12 sm:px-6 md:pt-20 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div>
        <p data-g="titulo" className="font-[family-name:var(--f-mono)] text-xs uppercase tracking-[0.18em] text-[var(--verde)]">
          Gerador de planilha de leads
        </p>
        <h1 className="mt-4 text-[clamp(2.2rem,5.6vw,4.6rem)] font-extrabold leading-[0.98] tracking-[-0.035em]">
          <span data-g="titulo" className="block">
            {TOTAL_LEADS} clientes do seu nicho,
          </span>
          <span data-g="titulo" className="block">
            numa{" "}
            <span className="relative inline-block">
              <span data-g="marca" aria-hidden className="absolute -inset-x-2 bottom-[0.06em] top-[0.2em] -z-0 bg-[var(--lime)]" />
              <span className="relative">planilha pronta.</span>
            </span>
          </span>
        </h1>
        <p data-g="titulo" className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--suave)]">
          Escolha o nicho e a região. Você recebe negócios sem site, direto do Google Maps, com WhatsApp, nota e funil de vendas.
        </p>
        </div>
        <div
          data-g="titulo"
          className="w-fit -rotate-2 rounded-xl border-2 border-[var(--tinta)] bg-[var(--lime)] px-6 py-5 shadow-[5px_5px_0_0_var(--tinta)]"
        >
          <p className="font-[family-name:var(--f-mono)] text-[11px] font-semibold uppercase tracking-wider">Pagamento único</p>
          <p className="text-5xl font-extrabold leading-none tracking-tight">R$ {PRECO_TEXTO}</p>
          <p className="mt-1 text-sm font-medium">{TOTAL_LEADS} leads na sua região</p>
        </div>
      </section>

      <section id="pedido" aria-label="Pedido" className="mx-auto max-w-6xl scroll-mt-6 px-4 pb-20 sm:px-6">
        <div data-g="janela" className="overflow-hidden rounded-xl border border-[var(--tinta)]/80 bg-white shadow-[8px_8px_0_0_var(--tinta)]">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--linha)] bg-[var(--cab)] px-4 py-2.5">
            <span className="flex items-center gap-2 font-[family-name:var(--f-mono)] text-xs">
              <span aria-hidden className="grid h-4 w-4 place-items-center rounded-[3px] bg-[var(--verde)] text-[9px] font-semibold text-white">
                X
              </span>
              pedido-de-leads.xlsx
            </span>
            <span className="font-[family-name:var(--f-mono)] text-[11px] text-[var(--suave)]">
              {TOTAL_LEADS} leads · R$ {PRECO_TEXTO}
            </span>
          </div>

          <div className="flex items-stretch border-b border-[var(--linha)] font-[family-name:var(--f-mono)] text-xs">
            <span className="grid w-10 place-items-center border-r border-[var(--linha)] bg-[var(--cab)] italic text-[var(--suave)]">fx</span>
            <span data-g="formula" className="min-w-0 flex-1 truncate px-3 py-2.5">
              =LEADS(&quot;{nichoFinal || "…"}&quot;; &quot;{regiaoFinal || "…"}&quot;; {TOTAL_LEADS})
            </span>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
            {andamento ? (
              <Acompanhamento a={andamento} onNovo={novoPedido} />
            ) : (
              <form ref={painel} onSubmit={enviar} noValidate onFocus={moverBanda} onBlur={esconderBanda} className="relative border-b border-[var(--linha)] lg:border-b-0 lg:border-r">
                <div
                  ref={banda}
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-[var(--azul)]/[0.07]"
                  style={{ height: 0, opacity: 0, visibility: "hidden" }}
                />
                <div className="grid grid-cols-[2.25rem_1fr] border-b border-[var(--linha)]">
                  <span className={gutter} aria-hidden />
                  <span className="border-l border-[var(--linha)] bg-[var(--cab)] px-3 py-1.5 font-[family-name:var(--f-mono)] text-[11px] text-[var(--suave)]">
                    Preencha as células
                  </span>
                </div>

                <div data-campo className="grid grid-cols-[2.25rem_1fr] border-b border-[var(--linha)]">
                  <span className={gutter}>1</span>
                  <div className="min-w-0">
                    <p className={`${rotulo} h-8 border-b border-[var(--linha)]`} id="g-nicho-r">
                      Nicho
                    </p>
                    <div className={`${celula} px-2 py-2`} role="group" aria-labelledby="g-nicho-r">
                      <div className="flex flex-wrap gap-1.5">
                        {[...NICHOS, OUTRO].map((n) => (
                          <button
                            key={n}
                            type="button"
                            aria-pressed={nicho === n}
                            onClick={() => setNicho(n)}
                            className={`min-h-11 rounded-md border px-3 text-sm sm:min-h-9 sm:px-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azul)] ${
                              nicho === n
                                ? "border-[var(--tinta)] bg-[var(--tinta)] text-white"
                                : "border-[var(--linha)] bg-white text-[var(--suave)] hover:border-[var(--tinta)] hover:text-[var(--tinta)]"
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
                          className={`${entrada} mt-2 rounded-md border border-[var(--linha)]`}
                          value={outro}
                          onChange={(e) => setOutro(e.target.value)}
                          maxLength={60}
                          placeholder="Ex.: loja de bicicletas…"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <Linha n={2} data="Cidade" htmlFor="g-cidade">
                  <input id="g-cidade" name="cidade" className={entrada} value={cidade} onChange={(e) => setCidade(e.target.value)} maxLength={50} placeholder="São Paulo…" autoComplete="address-level2" />
                </Linha>
                <Linha n={3} data="Bairro (opcional)" htmlFor="g-bairro">
                  <input id="g-bairro" name="bairro" autoComplete="off" className={entrada} value={bairro} onChange={(e) => setBairro(e.target.value)} maxLength={50} placeholder="Mooca…" />
                </Linha>

                <div data-campo className="grid grid-cols-[2.25rem_1fr] border-b border-[var(--linha)]">
                  <span className={gutter}>4</span>
                  <div className="min-w-0">
                    <label htmlFor="g-msg" className={`${rotulo} h-8 border-b border-[var(--linha)]`}>
                      Mensagem do WhatsApp (opcional)
                    </label>
                    <div className={celula}>
                      <textarea
                        id="g-msg"
                        name="mensagem"
                        ref={msgRef}
                        rows={4}
                        maxLength={MAX_MENSAGEM}
                        autoComplete="off"
                        value={mensagem}
                        onChange={(e) => setMensagem(e.target.value)}
                        placeholder="Oi, tudo bem? Vi a {nome} e…"
                        className={`${entrada} resize-none`}
                      />
                      <div className="flex flex-wrap items-center gap-1.5 border-t border-[var(--linha)] px-2 py-2">
                        {VARIAVEIS.map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => inserirVariavel(v)}
                            className="min-h-10 rounded border border-[var(--linha)] px-2 font-[family-name:var(--f-mono)] text-[11px] text-[var(--suave)] transition-colors hover:border-[var(--tinta)] hover:text-[var(--tinta)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azul)]"
                          >
                            {v}
                          </button>
                        ))}
                        <span className="ml-auto font-[family-name:var(--f-mono)] text-[11px] tabular-nums text-[var(--suave)]">
                          {mensagem.length}/{MAX_MENSAGEM}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Linha n={5} data="Seu nome" htmlFor="g-nome">
                  <input id="g-nome" name="nome" className={entrada} value={nome} onChange={(e) => setNome(e.target.value)} maxLength={80} autoComplete="name" />
                </Linha>
                <Linha n={6} data="WhatsApp" htmlFor="g-whats">
                  <input id="g-whats" name="whatsapp" type="tel" className={entrada} value={whatsapp} onChange={(e) => setWhatsapp(mascaraWhatsapp(e.target.value))} autoComplete="tel-national" placeholder="(11) 90000-0000…" />
                </Linha>
                <Linha n={7} data="E-mail" htmlFor="g-email">
                  <input id="g-email" name="email" type="email" spellCheck={false} className={entrada} value={email} onChange={(e) => setEmail(e.target.value)} maxLength={120} autoComplete="email" placeholder="voce@empresa.com…" />
                </Linha>

                <div className="p-4">
                  <p role="alert" className="mb-3 min-h-5 text-sm font-medium text-[var(--erro)]">
                    {erro}
                  </p>
                  <button
                    type="submit"
                    disabled={enviando}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--verde)] px-5 text-base font-bold text-white transition-colors hover:bg-[var(--verde-esc)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azul)] focus-visible:ring-offset-2 disabled:opacity-60"
                  >
                    {enviando ? "Registrando…" : `Gerar minha planilha · R$ ${PRECO_TEXTO}`}
                  </button>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--suave)]">
                    Usamos seus dados só para entregar a planilha e avisar sobre o pedido. Os dados dos negócios vêm de perfis públicos do Google Maps;
                    confirme antes de abordar cada um.
                  </p>
                </div>
              </form>
            )}

            <Previa nicho={nichoFinal} regiao={regiaoFinal} mensagem={textoMensagem} />
          </div>
        </div>
      </section>
    </div>
  );
}

function Linha({ n, data, htmlFor, children }: { n: number; data: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div data-campo className="grid grid-cols-[2.25rem_1fr] border-b border-[var(--linha)]">
      <span className={gutter}>{n}</span>
      <div className="min-w-0">
        <label htmlFor={htmlFor} className={`${rotulo} h-8 border-b border-[var(--linha)]`}>
          {data}
        </label>
        <div className={celula}>{children}</div>
      </div>
    </div>
  );
}

function Acompanhamento({ a, onNovo }: { a: Andamento; onNovo: () => void }) {
  const falhou = a.status === "falhou";
  return (
    <div className="border-b border-[var(--linha)] p-5 sm:p-6 lg:border-b-0 lg:border-r" aria-live="polite">
      <h2 className="text-2xl font-extrabold tracking-tight">
        {a.status === "pronto" ? "Sua planilha está pronta." : falhou ? "Não conseguimos gerar a planilha." : "Pedido em andamento"}
      </h2>
      <p className="mt-1 font-[family-name:var(--f-mono)] text-xs text-[var(--suave)]">
        {a.nicho} · {a.regiao}
      </p>
      <ol className="mt-6 divide-y divide-[var(--linha)] border-y border-[var(--linha)]">
        {ETAPAS.map((e, i) => {
          const feito = !falhou && e.status.includes(a.status);
          return (
            <li key={e.rotulo} className="grid grid-cols-[2.25rem_1fr_2rem] items-center">
              <span className={`${gutter} h-11`}>{i + 1}</span>
              <span className={`px-3 text-sm ${feito ? "font-semibold" : "text-[var(--suave)]"}`}>{e.rotulo}</span>
              <span className={`grid h-11 place-items-center ${feito ? "text-[var(--verde)]" : "text-transparent"}`}>
                <LuCheck aria-hidden className="h-4 w-4" />
              </span>
            </li>
          );
        })}
      </ol>

      {a.status === "aguardando_pagamento" && (
        <p className="mt-5 rounded-md border border-[var(--linha)] bg-[var(--cab)] p-3 text-sm">
          {a.pagamentoAtivo
            ? "Falta só o pagamento para começarmos."
            : "O pagamento ainda está sendo ativado. Seu pedido ficou registrado e entramos em contato pelo WhatsApp informado."}
        </p>
      )}
      {falhou && <p className="mt-5 text-sm font-medium text-[var(--erro)]">{a.erro ?? "Tente de novo ou fale com a gente."}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {a.status === "pronto" && (
          <a
            href={`/api/gerador/arquivo/${a.id}`}
            className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[var(--verde)] px-5 font-bold text-white transition-colors hover:bg-[var(--verde-esc)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azul)] focus-visible:ring-offset-2"
          >
            <LuDownload aria-hidden /> Baixar planilha
          </a>
        )}
        <button type="button" onClick={onNovo} className="min-h-11 rounded-md px-3 text-sm underline underline-offset-4 hover:text-[var(--verde)]">
          Fazer outro pedido
        </button>
      </div>
    </div>
  );
}

const COLUNAS = ["Prioridade", "Nome", "Região", "WhatsApp", "Nota", "Status"];
const LETRAS = ["A", "B", "C", "D", "E", "F"];
const PRIORIDADES: [string, string][] = [
  ["Alta", "bg-[#C6EFCE] text-[#0B5A2F]"],
  ["Alta", "bg-[#C6EFCE] text-[#0B5A2F]"],
  ["Alta", "bg-[#C6EFCE] text-[#0B5A2F]"],
  ["Média", "bg-[#FFEB9C] text-[#7A5A00]"],
  ["Média", "bg-[#FFEB9C] text-[#7A5A00]"],
  ["Baixa", "bg-[#E4E4E4] text-[#444]"],
];
// Colunas Região e Nota somem no celular para a tabela caber sem rolar.
const ESCONDE_MOBILE = [2, 4];
const LARGURAS = [62, 48, 70, 55, 66, 44];

// Estrutura da planilha, sem dados inventados: barras no lugar dos nomes.
function Previa({ nicho, regiao, mensagem }: { nicho: string; regiao: string; mensagem: string }) {
  return (
    <aside aria-label="Prévia da estrutura da planilha" className="min-w-0 self-start bg-white lg:sticky lg:top-4">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--linha)] px-4 py-2.5 text-sm">
        <span className="truncate font-bold">{nicho || "Seu nicho"}</span>
        <span className="shrink-0 font-[family-name:var(--f-mono)] text-xs text-[var(--suave)]">{regiao || "Sua região"}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse sm:min-w-[560px] text-left text-xs">
          <thead>
            <tr aria-hidden className="bg-[var(--cab)] font-[family-name:var(--f-mono)] text-[10px] text-[var(--suave)]">
              <th className="w-9 border-b border-[var(--linha)]" />
              {LETRAS.map((l, i) => (
                <th key={l} className={`border-b border-l border-[var(--linha)] py-1 text-center font-normal ${ESCONDE_MOBILE.includes(i) ? "hidden sm:table-cell" : ""}`}>
                  {l}
                </th>
              ))}
            </tr>
            <tr>
              <th className="bg-[var(--cab)] text-center font-[family-name:var(--f-mono)] text-[10px] font-normal text-[var(--suave)]">1</th>
              {COLUNAS.map((c, i) => (
                <th key={c} scope="col" className={`border-l border-white/20 bg-[var(--verde)] px-3 py-2.5 font-semibold text-white ${ESCONDE_MOBILE.includes(i) ? "hidden sm:table-cell" : ""}`}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PRIORIDADES.map(([p, cor], i) => (
              <tr key={i} data-g="linha" className="border-b border-[var(--linha)]">
                <td className="bg-[var(--cab)] text-center font-[family-name:var(--f-mono)] text-[10px] text-[var(--suave)]">{i + 2}</td>
                <td className="border-l border-[var(--linha)] px-3 py-3">
                  <span className={`rounded px-2 py-0.5 font-semibold ${cor}`}>{p}</span>
                </td>
                <td className="border-l border-[var(--linha)] px-3 py-3">
                  <span className="block h-2 rounded-sm bg-[var(--tinta)]/15" style={{ width: `${LARGURAS[i]}%` }} />
                </td>
                <td className="hidden border-l border-[var(--linha)] px-3 py-3 sm:table-cell">
                  <span className="block h-2 w-14 rounded-sm bg-[var(--tinta)]/15" />
                </td>
                <td className="border-l border-[var(--linha)] px-3 py-3 text-[var(--azul)] underline underline-offset-2">Abrir conversa</td>
                <td className="hidden border-l border-[var(--linha)] px-3 py-3 sm:table-cell">
                  <span className="block h-2 w-8 rounded-sm bg-[var(--tinta)]/15" />
                </td>
                <td className="border-l border-[var(--linha)] px-3 py-3 text-[var(--suave)]">Novo</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="font-[family-name:var(--f-mono)] text-[11px] uppercase tracking-wider text-[var(--suave)]">Ao clicar em &ldquo;Abrir conversa&rdquo;</p>
          <p className="mt-2 max-w-md whitespace-pre-line rounded-lg rounded-tl-sm bg-[#DCF8C6] px-3.5 py-2.5 text-sm leading-snug text-[#1b2b17]">
            {mensagem.trim() || "Sem mensagem: o WhatsApp abre a conversa vazia."}
          </p>
        </div>
        <p className="font-[family-name:var(--f-mono)] text-[11px] leading-relaxed text-[var(--suave)] sm:text-right">
          + aba Resumo:
          <br />
          funil, taxa de fechamento
          <br />e receita
        </p>
      </div>
    </aside>
  );
}
