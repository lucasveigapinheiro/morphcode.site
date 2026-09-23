"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { LuTriangleAlert, LuCheck, LuRotateCcw, LuSend } from "react-icons/lu";

type Resposta = "Sim" | "Não" | null;

const PERGUNTAS = [
  { chave: "alergia", texto: "Tem alguma alergia?", detalhe: "Quais?", sugestao: "Dipirona", alerta: "Alergia" },
  { chave: "gestante", texto: "Está grávida ou amamentando?", detalhe: null, sugestao: "", alerta: "Gestante ou lactante" },
  { chave: "medicamento", texto: "Usa medicamento contínuo?", detalhe: "Qual?", sugestao: "Isotretinoína", alerta: "Medicamento contínuo" },
] as const;

type Chave = (typeof PERGUNTAS)[number]["chave"];

function Selo({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`grid place-items-center rounded-full border border-argila bg-nevoa/60 font-fraunces italic text-eucalipto shadow-[inset_0_0_0_3px_white,inset_0_0_0_4px_rgba(201,142,115,0.5)] ${className}`}
    >
      SB
    </span>
  );
}

/**
 * Demonstração interativa: o visitante responde uma mini ficha como paciente
 * e vê os alertas chegando ao prontuário da profissional em tempo real.
 */
export default function TestePaciente() {
  const reduzir = useReducedMotion();
  const [respostas, setRespostas] = useState<Record<Chave, Resposta>>({ alergia: null, gestante: null, medicamento: null });
  const [detalhes, setDetalhes] = useState<Record<Chave, string>>({ alergia: "", gestante: "", medicamento: "" });
  const [assinada, setAssinada] = useState(false);

  const alertas = useMemo(
    () =>
      PERGUNTAS.filter((p) => respostas[p.chave] === "Sim").map((p) => ({
        chave: p.chave,
        texto: p.alerta + (detalhes[p.chave] ? `: ${detalhes[p.chave]}` : ""),
      })),
    [respostas, detalhes]
  );

  const completa = PERGUNTAS.every((p) => respostas[p.chave]);

  function responder(chave: Chave, valor: Resposta) {
    setAssinada(false);
    setRespostas((r) => ({ ...r, [chave]: valor }));
  }

  function recomecar() {
    setRespostas({ alergia: null, gestante: null, medicamento: null });
    setDetalhes({ alergia: "", gestante: "", medicamento: "" });
    setAssinada(false);
  }

  const entrada = reduzir ? false : { opacity: 0, y: 8, scale: 0.96 };

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,380px)_auto_minmax(0,1fr)] lg:gap-6">
      {/* Celular da paciente */}
      <div className="mx-auto w-full max-w-[340px]">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-argila">Você, como paciente</p>
        <div className="rounded-[2.6rem] border-[10px] border-grafite bg-grafite shadow-2xl shadow-eucalipto/30">
          <div className="relative overflow-hidden rounded-[2rem] bg-white">
            <div className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-grafite" aria-hidden />
            <div className="px-5 pb-6 pt-10">
              <div className="flex flex-col items-center text-center">
                <Selo className="h-11 w-11 text-base" />
                <p className="mt-2 font-fraunces text-lg text-grafite">Studio Bella Estética</p>
                <p className="text-[11px] text-grafite/60">Ficha de anamnese</p>
              </div>

              <div className="mt-5 space-y-3">
                {PERGUNTAS.map((p) => (
                  <fieldset key={p.chave} className="rounded-2xl border border-grafite/10 bg-porcelana/70 p-3">
                    <legend className="sr-only">{p.texto}</legend>
                    <p className="text-[13px] font-semibold text-grafite" aria-hidden>
                      {p.texto} <span className="text-[#c0392b]">*</span>
                    </p>
                    <div className="mt-2 flex gap-2">
                      {(["Sim", "Não"] as const).map((opcao) => {
                        const marcada = respostas[p.chave] === opcao;
                        return (
                          <button
                            key={opcao}
                            type="button"
                            onClick={() => responder(p.chave, opcao)}
                            aria-pressed={marcada}
                            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                              marcada
                                ? "border-eucalipto bg-eucalipto/10 text-eucalipto"
                                : "border-grafite/20 bg-white text-grafite hover:border-eucalipto"
                            }`}
                          >
                            <span
                              className={`grid h-3.5 w-3.5 place-items-center rounded-full border ${
                                marcada ? "border-eucalipto" : "border-grafite/40"
                              }`}
                            >
                              {marcada && <span className="h-2 w-2 rounded-full bg-eucalipto" />}
                            </span>
                            {opcao}
                          </button>
                        );
                      })}
                    </div>
                    <AnimatePresence initial={false}>
                      {p.detalhe && respostas[p.chave] === "Sim" && (
                        <motion.div
                          initial={reduzir ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduzir ? undefined : { height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <input
                            value={detalhes[p.chave]}
                            onChange={(e) => {
                              setAssinada(false);
                              setDetalhes((d) => ({ ...d, [p.chave]: e.target.value.slice(0, 40) }));
                            }}
                            placeholder={`${p.detalhe} Ex.: ${p.sugestao}`}
                            aria-label={`${p.texto} ${p.detalhe}`}
                            className="mt-2 w-full rounded-xl border border-grafite/15 bg-white px-3 py-2 text-[13px] text-grafite outline-none focus:border-eucalipto focus:ring-4 focus:ring-eucalipto/15"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </fieldset>
                ))}
              </div>

              <button
                type="button"
                disabled={!completa}
                onClick={() => setAssinada(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-eucalipto py-3 text-sm font-semibold text-white shadow-lg shadow-eucalipto/30 transition-all enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <LuSend className="h-4 w-4" aria-hidden />
                {completa ? "Assinar e enviar ficha" : "Responda as 3 perguntas"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ligação entre as telas */}
      <div className="hidden flex-col items-center gap-2 text-argila lg:flex" aria-hidden>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">tempo real</span>
        <svg width="90" height="24" viewBox="0 0 90 24" fill="none">
          <motion.path
            d="M2 12 H80 M72 4 L82 12 L72 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduzir ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Prontuário da profissional */}
      <div>
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-argila lg:text-left">
          O que a Dra. vê no prontuário
        </p>
        <div className="rounded-3xl border border-grafite/10 bg-white p-6 shadow-2xl shadow-eucalipto/15">
          <div className="flex items-center gap-3 border-b border-grafite/10 pb-4">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-eucalipto/10 font-fraunces text-lg italic text-eucalipto">P</span>
            <div>
              <p className="font-fraunces text-lg text-grafite">Paciente de teste</p>
              <p className="text-xs text-grafite/55">Ficha de anamnese · hoje</p>
            </div>
            <span
              className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ${
                assinada ? "bg-[#e7f3ec] text-[#1f6b45]" : "bg-[#fbf0e4] text-[#a0541b]"
              }`}
            >
              {assinada ? "Ficha assinada" : "Aguardando assinatura"}
            </span>
          </div>

          <div className="mt-5 rounded-2xl border border-[#ebc1bd] bg-[#fdf6f5] p-4">
            <p className="flex items-center gap-2 font-fraunces text-base text-[#9c2a22]">
              <LuTriangleAlert className="h-4 w-4" aria-hidden /> Alertas clínicos
            </p>
            <div className="mt-3 flex min-h-9 flex-wrap gap-2" aria-live="polite">
              <AnimatePresence>
                {alertas.map((a) => (
                  <motion.span
                    key={a.chave}
                    layout
                    initial={entrada}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduzir ? undefined : { opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 380, damping: 26 }}
                    className="rounded-full border border-[#ebc1bd] bg-[#fceeec] px-3 py-1 text-[13px] font-semibold text-[#9c2a22]"
                  >
                    {a.texto}
                  </motion.span>
                ))}
              </AnimatePresence>
              {!alertas.length && (
                <p className="text-sm text-grafite/50">
                  {completa ? "Nenhuma contraindicação informada." : "Responda a ficha ao lado e veja os alertas chegarem aqui."}
                </p>
              )}
            </div>
          </div>

          <AnimatePresence>
            {assinada && (
              <motion.div
                initial={reduzir ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduzir ? undefined : { opacity: 0 }}
                className="mt-4 flex items-start gap-3 rounded-2xl bg-porcelana p-4"
              >
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-eucalipto text-white">
                  <LuCheck className="h-4 w-4" aria-hidden />
                </span>
                <div className="text-sm text-grafite/75">
                  <p className="font-semibold text-grafite">Assinada agora, com data, hora e protocolo.</p>
                  <p>Os termos e as perguntas ficam guardados exatamente como a paciente viu.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-5 flex items-center justify-between gap-3 text-xs text-grafite/50">
            <span>Simulação ilustrativa. No sistema real, a ficha é enviada por um link no WhatsApp.</span>
            <button
              type="button"
              onClick={recomecar}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-grafite/15 px-3 py-1.5 font-semibold text-grafite hover:border-eucalipto hover:text-eucalipto"
            >
              <LuRotateCcw className="h-3.5 w-3.5" aria-hidden /> Recomeçar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
