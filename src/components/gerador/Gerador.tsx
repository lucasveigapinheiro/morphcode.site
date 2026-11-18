"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LuArrowLeft, LuArrowRight, LuCheck, LuDownload } from "react-icons/lu";
import { MAX_MENSAGEM, NICHOS, PRECO_REAIS, TOTAL_LEADS, VARIAVEIS, type Status } from "@/lib/gerador";

gsap.registerPlugin(useGSAP);

const PASSOS = ["Nicho", "Região", "Mensagem", "Contato"] as const;
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

const campo =
  "w-full rounded-lg border border-white/10 bg-background px-3.5 py-3 text-base text-foreground placeholder:text-muted/60 transition-colors hover:border-white/20 focus-visible:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30";

export default function Gerador() {
  const raiz = useRef<HTMLDivElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const barra = useRef<HTMLSpanElement>(null);
  const primeira = useRef(true);

  const [passo, setPasso] = useState(0);
  const [nicho, setNicho] = useState<string>(NICHOS[0]);
  const [outro, setOutro] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const msgRef = useRef<HTMLTextAreaElement>(null);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [andamento, setAndamento] = useState<Andamento | null>(null);

  const nichoFinal = nicho === OUTRO ? outro.trim() : nicho;
  const regiaoFinal = [bairro.trim(), cidade.trim()].filter(Boolean).join(" ");

  // Entrada da página: título, formulário e linhas da prévia, em uma só linha do tempo.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.7 } });
        tl.from("[data-g='titulo']", { y: 24, autoAlpha: 0, stagger: 0.09 })
          .from("[data-g='form']", { y: 28, autoAlpha: 0 }, "<0.15")
          .from("[data-g='previa']", { y: 28, autoAlpha: 0 }, "<0.1")
          .from("[data-g='linha']", { autoAlpha: 0, x: -12, duration: 0.45, stagger: 0.07 }, "-=0.35");
      });
    },
    { scope: raiz },
  );

  // A cada troca de passo: barra de progresso e painel deslizam suavemente.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(barra.current, { scaleX: (passo + 1) / PASSOS.length, duration: 0.5, ease: "power3.out" });
        if (primeira.current) {
          primeira.current = false;
          return;
        }
        gsap.fromTo(painel.current, { autoAlpha: 0, x: 20 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power3.out" });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(barra.current, { scaleX: (passo + 1) / PASSOS.length });
      });
    },
    { scope: raiz, dependencies: [passo] },
  );

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
    const novo = (mensagem.slice(0, ini) + v + mensagem.slice(fim)).slice(0, MAX_MENSAGEM);
    setMensagem(novo);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(ini + v.length, ini + v.length);
    });
  }

  function avancar() {
    setErro("");
    if (passo === 0 && nichoFinal.length < 3) return setErro("Escolha um nicho ou digite o seu.");
    if (passo === 1 && cidade.trim().length < 3) return setErro("Informe a cidade.");
    setPasso((p) => Math.min(p + 1, PASSOS.length - 1));
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (passo < PASSOS.length - 1) return avancar();
    setErro("");
    const digitos = whatsapp.replace(/\D/g, "");
    const invalido =
      nome.trim().length < 2
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
    setPasso(0);
  }

  return (
    <div ref={raiz} className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
      <div>
        <p data-g="titulo" className="text-[13px] font-medium tracking-[0.02em] text-gold">
          Gerador de planilha de leads
        </p>
        <h1 data-g="titulo" className="mt-4 font-[var(--font-display)] text-4xl leading-[1.05] md:text-5xl">
          Uma lista de clientes do seu nicho, <span className="gold-gradient-text">pronta para chamar.</span>
        </h1>
        <p data-g="titulo" className="mt-5 max-w-md text-muted">
          Você escolhe o nicho e a região. A gente coleta {TOTAL_LEADS} negócios sem site no Google Maps e entrega a planilha com nota,
          avaliações, WhatsApp e funil de vendas.
        </p>

        <section data-g="form" aria-label="Pedido" className="mt-10 rounded-xl border border-white/10 bg-surface">
          {andamento ? (
            <Acompanhamento a={andamento} onNovo={novoPedido} />
          ) : (
            <form onSubmit={enviar} noValidate>
              <div className="px-5 pt-5 sm:px-6">
                <ol className="flex items-center justify-between text-xs text-muted" aria-label="Passos">
                  {PASSOS.map((p, i) => (
                    <li key={p} aria-current={i === passo ? "step" : undefined} className={i === passo ? "text-foreground" : i < passo ? "text-gold" : ""}>
                      {i + 1}. {p}
                    </li>
                  ))}
                </ol>
                <div className="mt-3 h-px w-full bg-white/10">
                  <span ref={barra} className="block h-px origin-left bg-gold" style={{ transform: "scaleX(0.3333)" }} />
                </div>
              </div>

              <div ref={painel} className="px-5 py-6 sm:px-6">
                {passo === 0 && (
                  <fieldset>
                    <legend className="text-lg font-medium">Qual nicho você quer prospectar?</legend>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {[...NICHOS, OUTRO].map((n) => (
                        <button
                          key={n}
                          type="button"
                          aria-pressed={nicho === n}
                          onClick={() => setNicho(n)}
                          className={`min-h-11 rounded-lg border px-3.5 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 ${
                            nicho === n ? "border-gold bg-gold/10 text-foreground" : "border-white/10 text-muted hover:border-white/25 hover:text-foreground"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    {nicho === OUTRO && (
                      <div className="mt-4">
                        <label htmlFor="g-outro" className="mb-1.5 block text-sm text-muted">
                          Qual nicho?
                        </label>
                        <input id="g-outro" name="nicho-outro" autoComplete="off" className={campo} value={outro} onChange={(e) => setOutro(e.target.value)} maxLength={60} placeholder="Ex.: loja de bicicletas…" />
                      </div>
                    )}
                  </fieldset>
                )}

                {passo === 1 && (
                  <fieldset>
                    <legend className="text-lg font-medium">Em que região?</legend>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="g-cidade" className="mb-1.5 block text-sm text-muted">
                          Cidade
                        </label>
                        <input id="g-cidade" name="cidade" className={campo} value={cidade} onChange={(e) => setCidade(e.target.value)} maxLength={50} placeholder="São Paulo" autoComplete="address-level2" />
                      </div>
                      <div>
                        <label htmlFor="g-bairro" className="mb-1.5 block text-sm text-muted">
                          Bairro <span className="text-muted/70">(opcional)</span>
                        </label>
                        <input id="g-bairro" name="bairro" autoComplete="off" className={campo} value={bairro} onChange={(e) => setBairro(e.target.value)} maxLength={50} placeholder="Mooca…" />
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-muted">Com bairro, a lista fica mais perto de você. Sem bairro, pegamos a cidade toda.</p>
                  </fieldset>
                )}

                {passo === 2 && (
                  <fieldset>
                    <legend className="text-lg font-medium">Mensagem de abordagem</legend>
                    <p className="mt-1 text-sm text-muted">
                      Opcional. O botão &ldquo;Abrir conversa&rdquo; de cada lead já abre o WhatsApp com esta mensagem pronta. Deixe em branco para abrir a conversa vazia.
                    </p>
                    <label htmlFor="g-msg" className="mt-4 mb-1.5 block text-sm text-muted">
                      Sua mensagem
                    </label>
                    <textarea
                      id="g-msg"
                      name="mensagem"
                      ref={msgRef}
                      rows={5}
                      maxLength={MAX_MENSAGEM}
                      autoComplete="off"
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      placeholder="Oi, tudo bem? Vi o perfil da {nome} e…"
                      className={`${campo} resize-y`}
                    />
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted">Inserir:</span>
                      {VARIAVEIS.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => inserirVariavel(v)}
                          className="min-h-8 rounded-md border border-white/10 px-2 font-mono text-xs text-muted transition-colors hover:border-gold hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
                        >
                          {v}
                        </button>
                      ))}
                      <span className="ml-auto text-xs tabular-nums text-muted">
                        {mensagem.length}/{MAX_MENSAGEM}
                      </span>
                    </div>
                    {mensagem.trim() && (
                      <p className="mt-3 rounded-lg border border-white/10 bg-background p-3 text-sm text-muted">
                        <span className="mb-1 block text-xs">Como o lead vai ver</span>
                        {mensagem
                          .replaceAll("{nome}", "Nome do negócio")
                          .replaceAll("{nota}", "4,9")
                          .replaceAll("{avaliacoes}", "42")
                          .replaceAll("{regiao}", regiaoFinal || "sua região")}
                      </p>
                    )}
                    <p className="mt-3 text-xs leading-relaxed text-muted">
                      {"{nome}"} vira o nome de cada negócio; {"{nota}"}, {"{avaliacoes}"} e {"{regiao}"} também mudam por lead.
                    </p>
                  </fieldset>
                )}

                {passo === 3 && (
                  <fieldset>
                    <legend className="text-lg font-medium">Para onde enviamos?</legend>
                    <div className="mt-4 grid gap-4">
                      <div>
                        <label htmlFor="g-nome" className="mb-1.5 block text-sm text-muted">
                          Seu nome
                        </label>
                        <input id="g-nome" name="nome" className={campo} value={nome} onChange={(e) => setNome(e.target.value)} maxLength={80} autoComplete="name" />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="g-whats" className="mb-1.5 block text-sm text-muted">
                            WhatsApp
                          </label>
                          <input id="g-whats" name="whatsapp" type="tel" className={campo} value={whatsapp} onChange={(e) => setWhatsapp(mascaraWhatsapp(e.target.value))} inputMode="tel" autoComplete="tel-national" placeholder="(11) 90000-0000…" />
                        </div>
                        <div>
                          <label htmlFor="g-email" className="mb-1.5 block text-sm text-muted">
                            E-mail
                          </label>
                          <input id="g-email" name="email" type="email" spellCheck={false} className={campo} value={email} onChange={(e) => setEmail(e.target.value)} maxLength={120} autoComplete="email" />
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-muted">
                      Usamos seus dados só para entregar a planilha e avisar sobre o pedido. Os dados dos negócios vêm de perfis públicos do Google Maps; confirme
                      antes de abordar cada um.
                    </p>
                  </fieldset>
                )}

                <p role="alert" className="mt-4 min-h-5 text-sm text-red-400">
                  {erro}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => setPasso((p) => Math.max(p - 1, 0))}
                  disabled={passo === 0}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm text-muted transition-colors hover:text-foreground disabled:invisible"
                >
                  <LuArrowLeft aria-hidden /> Voltar
                </button>
                <button
                  type="submit"
                  disabled={enviando}
                  className="btn-shine inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gold px-5 text-sm font-medium text-background transition-[background-color,box-shadow] hover:bg-gold-light hover:shadow-[0_0_28px_rgba(212,169,74,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 disabled:opacity-60"
                >
                  {passo < PASSOS.length - 1 ? (
                    <>
                      Continuar <LuArrowRight aria-hidden />
                    </>
                  ) : enviando ? (
                    "Registrando…"
                  ) : (
                    <>Gerar minha planilha · R$ {PRECO_REAIS}</>
                  )}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>

      <Previa nicho={nichoFinal} regiao={regiaoFinal} />
    </div>
  );
}

function Acompanhamento({ a, onNovo }: { a: Andamento; onNovo: () => void }) {
  const falhou = a.status === "falhou";
  return (
    <div className="px-5 py-6 sm:px-6" aria-live="polite">
      <h2 className="text-lg font-medium">
        {a.status === "pronto" ? "Sua planilha está pronta." : falhou ? "Não conseguimos gerar a planilha." : "Pedido em andamento"}
      </h2>
      <p className="mt-1 text-sm text-muted">
        {a.nicho} · {a.regiao}
      </p>
      <ol className="mt-5 space-y-3">
        {ETAPAS.map((e) => {
          const feito = !falhou && e.status.includes(a.status);
          return (
            <li key={e.rotulo} className={`flex items-center gap-3 text-sm ${feito ? "text-foreground" : "text-muted"}`}>
              <span className={`grid h-5 w-5 place-items-center rounded-full border ${feito ? "border-gold bg-gold text-background" : "border-white/15"}`}>
                {feito && <LuCheck aria-hidden className="h-3 w-3" />}
              </span>
              {e.rotulo}
            </li>
          );
        })}
      </ol>

      {a.status === "aguardando_pagamento" && (
        <p className="mt-5 rounded-lg border border-white/10 bg-background p-3 text-sm text-muted">
          {a.pagamentoAtivo
            ? "Falta só o pagamento para começarmos."
            : "O pagamento ainda está sendo ativado. Seu pedido ficou registrado e entramos em contato pelo WhatsApp informado."}
        </p>
      )}
      {falhou && <p className="mt-5 text-sm text-red-400">{a.erro ?? "Tente de novo ou fale com a gente."}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {a.status === "pronto" && (
          <a
            href={`/api/gerador/arquivo/${a.id}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-gold px-5 text-sm font-medium text-background transition-colors hover:bg-gold-light"
          >
            <LuDownload aria-hidden /> Baixar planilha
          </a>
        )}
        <button type="button" onClick={onNovo} className="min-h-11 rounded-lg px-3 text-sm text-muted transition-colors hover:text-foreground">
          Fazer outro pedido
        </button>
      </div>
    </div>
  );
}

const COLUNAS = ["Prioridade", "Nome", "Região", "WhatsApp", "Nota", "Status"];
const PRIORIDADES = ["Alta", "Alta", "Alta", "Média", "Média", "Baixa"];
const LARGURAS = [62, 48, 70, 55, 66, 44];
const COR: Record<string, string> = { Alta: "bg-emerald-400/15 text-emerald-300", Média: "bg-amber-300/15 text-amber-200", Baixa: "bg-white/10 text-muted" };

// Estrutura da planilha, sem dados inventados: barras no lugar dos nomes.
function Previa({ nicho, regiao }: { nicho: string; regiao: string }) {
  return (
    <aside data-g="previa" aria-label="Prévia da estrutura da planilha" className="self-start lg:sticky lg:top-28">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-surface">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-sm">
          <span className="truncate font-medium">{nicho || "Seu nicho"}</span>
          <span className="ml-3 shrink-0 text-muted">{regiao || "Sua região"}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-xs">
            <thead>
              <tr className="text-muted">
                {COLUNAS.map((c) => (
                  <th key={c} scope="col" className="px-4 py-2.5 font-medium">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRIORIDADES.map((p, i) => (
                <tr key={i} data-g="linha" className="border-t border-white/5">
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 ${COR[p]}`}>{p}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="block h-2 rounded bg-white/10" style={{ width: `${LARGURAS[i]}%` }} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="block h-2 w-14 rounded bg-white/10" />
                  </td>
                  <td className="px-4 py-3 text-sky-300">Abrir conversa</td>
                  <td className="px-4 py-3">
                    <span className="block h-2 w-8 rounded bg-white/10" />
                  </td>
                  <td className="px-4 py-3 text-muted">Novo</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-white/10 px-4 py-3 text-xs text-muted">
          {TOTAL_LEADS} leads · aba Resumo com funil, taxa de fechamento e receita · filtros e status em lista
        </div>
      </div>
    </aside>
  );
}
