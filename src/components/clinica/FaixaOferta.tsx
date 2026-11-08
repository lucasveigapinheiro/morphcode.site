"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { LuCheck, LuClock, LuSparkles } from "react-icons/lu";

// Datas reais da oferta (horário de Brasília):
// - 5 vagas de implantação pela metade (R$ 497 -> R$ 248,50) até sexta, 13/11/2026
// - Oferta de fim de ano (Licença Vitalícia por R$ 2.000) até 23/12/2026
const FIM_OFERTA = new Date("2026-12-24T00:00:00-03:00").getTime();
const FIM_VAGAS = new Date("2026-11-14T00:00:00-03:00").getTime();
const VAGAS_TOTAL = 5;

const semAssinatura = () => () => {};
const dois = (n: number) => String(n).padStart(2, "0");

function useRelogioOferta() {
  const [agora, setAgora] = useState<number | null>(null);

  useEffect(() => {
    const t0 = setTimeout(() => setAgora(Date.now()), 0);
    const t = setInterval(() => setAgora(Date.now()), 1000);
    return () => {
      clearTimeout(t0);
      clearInterval(t);
    };
  }, []);

  const comVagas = agora === null || agora < FIM_VAGAS;
  const alvo = comVagas ? FIM_VAGAS : FIM_OFERTA;
  const encerrada = agora !== null && agora >= FIM_OFERTA;
  const resto = agora === null ? null : Math.max(0, alvo - agora);

  const d = resto === null ? 5 : Math.floor(resto / 86_400_000);
  const h = resto === null ? 11 : Math.floor((resto % 86_400_000) / 3_600_000);
  const m = resto === null ? 42 : Math.floor((resto % 3_600_000) / 60_000);
  const s = resto === null ? 18 : Math.floor((resto % 60_000) / 1000);

  return { hidratado: agora !== null, comVagas, encerrada, d, h, m, s };
}

/** Frase das vagas da semana para uso pontual em seções. */
export function VagasSemana({ className = "" }: { className?: string }) {
  const ativa = useSyncExternalStore(semAssinatura, () => Date.now() < FIM_VAGAS, () => false);
  if (!ativa) return null;
  return <p className={className}>Só {VAGAS_TOTAL} vagas de implantação com 50% de desconto até sexta (13/11).</p>;
}

/**
 * Faixa de topo de alto contraste (Ouro Champanhe Luminoso #F3C64F sobre Esmeralda Profundo #0D2621),
 * limpa e direta no celular.
 */
export default function FaixaOferta() {
  const { hidratado, comVagas, encerrada, d, h, m, s } = useRelogioOferta();
  if (hidratado && encerrada) return null;

  const partes: [string, string][] = [
    [String(d), d === 1 ? "d" : "d"],
    [dois(h), "h"],
    [dois(m), "m"],
    [dois(s), "s"],
  ];

  return (
    <div className="fixed inset-x-0 top-0 z-40 flex h-9 items-center border-b border-[#d49b27]/40 bg-gradient-to-r from-[#ecc046] via-[#f7d46c] to-[#ecc046] px-3 text-[#0c221d] shadow-[0_6px_24px_-6px_rgba(0,0,0,0.45)] md:bottom-0 md:top-auto md:h-auto md:border-b-0 md:border-t md:px-4 md:py-2.5 md:shadow-[0_-6px_24px_-6px_rgba(0,0,0,0.45)]">
      <div className="mx-auto flex max-w-6xl flex-row items-center justify-center gap-x-2.5 text-center md:gap-x-6">
        <p className="whitespace-nowrap text-xs font-extrabold tracking-tight md:text-[13.5px]">
          <span className="md:hidden">
            {comVagas ? `Só ${VAGAS_TOTAL} vagas · 50% OFF` : "Oferta 50% OFF"}
          </span>
          <span className="hidden md:inline">
            {comVagas
              ? `🔥 Só ${VAGAS_TOTAL} vagas até 13/11: implantação pela metade (R$ 248,50) ou Licença Vitalícia por R$ 2.000.`
              : "Fim de ano: 50% na implantação (R$ 248,50) ou Licença Vitalícia por R$ 2.000, só até 23 de dezembro."}
          </span>
        </p>

        {hidratado && (
          <p
            className="flex items-center gap-1 text-xs font-extrabold md:gap-1.5 md:text-[13px]"
            role="timer"
            aria-label={comVagas ? "Tempo restante das vagas da semana" : "Tempo restante da oferta"}
          >
            <span className="hidden whitespace-nowrap sm:inline">{comVagas ? "Encerra em" : "Acaba em"}</span>
            {partes.map(([v, u], i) => (
              <span key={i} className="rounded bg-[#0c221d] px-1.5 py-0.5 tabular-nums text-[#f7d46c]">
                {v}
                <span className="text-[10px] font-semibold text-white/80">{u}</span>
              </span>
            ))}
          </p>
        )}

        <a
          href="#planos"
          className="hidden rounded-full bg-[#0c221d] px-4 py-1 text-xs font-extrabold text-[#f7d46c] transition hover:bg-[#163830] lg:inline-block"
        >
          Garantir condição →
        </a>
      </div>
    </div>
  );
}

/**
 * Selo ao vivo no Hero: conciso no celular para não ocupar duas linhas.
 */
export function SeloAoVivoClinica() {
  const [ativas, setAtivas] = useState(9);

  useEffect(() => {
    const t = setInterval(() => {
      setAtivas((n) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(7, Math.min(14, n + delta));
      });
    }, 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f3c64f]/35 bg-[#15352e]/90 px-3.5 py-1.5 text-xs font-semibold text-[#e6f2ee] sm:mb-5 sm:px-4 sm:text-sm">
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-75 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22c55e]" />
      </span>
      <span>
        <strong className="font-bold text-[#f7d46c] tabular-nums">{ativas} clínicas</strong> vendo esta página agora
      </span>
    </p>
  );
}

/**
 * Painel de escassez das 5 vagas de implantação no Hero: enxuto e super legível no mobile.
 */
export function PainelVagasClinica() {
  const { hidratado, d, h, m } = useRelogioOferta();
  const vagasRestantes = 2;
  const preenchidas = VAGAS_TOTAL - vagasRestantes;
  const percentual = Math.round((preenchidas / VAGAS_TOTAL) * 100);

  return (
    <div className="mt-5 max-w-xl rounded-2xl border border-[#f3c64f]/45 bg-[#122e28]/95 p-3.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.65)] sm:mt-6 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-[13.5px]">
        <span className="inline-flex items-center gap-1.5 font-semibold text-white">
          <LuClock className="h-4 w-4 shrink-0 text-[#f3c64f]" aria-hidden />
          <span>
            Implantação 50% OFF: de <s className="text-white/45">R$ 497</s> por <strong className="font-extrabold text-[#f7d46c]">R$ 248,50</strong>
          </span>
        </span>
        <span className="rounded-full bg-[#f3c64f] px-2.5 py-0.5 text-[11px] font-extrabold text-[#0c221d] tabular-nums sm:px-3 sm:text-xs">
          Restam {vagasRestantes} de {VAGAS_TOTAL} vagas
        </span>
      </div>

      <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-black/35 ring-1 ring-white/10" aria-hidden>
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#22c55e] via-[#f3c64f] to-[#f59e0b] transition-[width] duration-500 motion-reduce:transition-none"
          style={{ width: `${percentual}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-[#cfe3dc] sm:text-xs">
        <span>{preenchidas} vagas preenchidas nesta semana</span>
        {hidratado && (
          <span className="font-mono text-white/90 tabular-nums">
            Fecha 13/11 ({d}d {dois(h)}h{dois(m)})
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Cronômetro grande em blocos dentro da seção de Planos e Investimento.
 */
export function CronometroPlanosClinica() {
  const { hidratado, comVagas, encerrada, d, h, m, s } = useRelogioOferta();
  if (hidratado && encerrada) return null;

  const blocos = [
    { valor: hidratado ? dois(d) : "05", rotulo: d === 1 ? "Dia" : "Dias" },
    { valor: hidratado ? dois(h) : "11", rotulo: "Horas" },
    { valor: hidratado ? dois(m) : "42", rotulo: "Min" },
    { valor: hidratado ? dois(s) : "18", rotulo: "Seg" },
  ];

  return (
    <div className="mx-auto mt-6 max-w-xl rounded-3xl border border-[#f3c64f]/40 bg-gradient-to-b from-[#112c26] to-[#0c221d] p-5 text-center text-white shadow-[0_24px_60px_-20px_rgba(12,34,29,0.55)] sm:mt-8 sm:p-6">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-[#f3c64f]/40 bg-[#f3c64f]/15 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#f7d46c] sm:text-xs">
        <LuSparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {comVagas
          ? "Só 5 vagas com 50% na implantação (até 13/11)"
          : "Oferta de fim de ano até 23/12"}
      </div>

      <div className="mt-3.5 flex items-center justify-center gap-1.5 sm:gap-3" role="timer" aria-label="Cronômetro regressivo da condição de implantação">
        {blocos.map((b, i) => (
          <div key={b.rotulo} className="flex items-center gap-1.5 sm:gap-3">
            <div className="min-w-[58px] rounded-2xl border border-[#f3c64f]/35 bg-[#081714] px-2.5 py-2 shadow-inner sm:min-w-[76px] sm:px-4 sm:py-2.5">
              <span className="block font-fraunces text-xl font-bold leading-none text-[#f7d46c] tabular-nums sm:text-3xl">
                {b.valor}
              </span>
              <span className="mt-1 block text-[9px] font-bold uppercase tracking-wider text-white/75 sm:text-[10px]">
                {b.rotulo}
              </span>
            </div>
            {i < blocos.length - 1 && <span className="font-fraunces text-lg font-bold text-[#f3c64f] sm:text-xl">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

const ATIVIDADES_RECENTES = [
  { local: "Clínica de Estética · São Paulo, SP", acao: "Reservou vaga de implantação por R$ 248,50" },
  { local: "Studio de Harmonização · Belo Horizonte, MG", acao: "Abriu a demonstração do sistema agora" },
  { local: "Dra. Biomédica Esteta · Curitiba, PR", acao: "Garantiu a Licença Vitalícia por R$ 2.000" },
  { local: "Clínica Dermatológica · Campinas, SP", acao: "Chamou no WhatsApp para ver a ficha no celular" },
];

/**
 * No celular mostra apenas a barra fixa inferior limpa (sem toast cobrindo a tela).
 * O toast flutuante aparece apenas em telas maiores (desktop).
 */
export function FlutuantesClinica({ linkWhatsOferta }: { linkWhatsOferta: string }) {
  const { hidratado, d, h, m } = useRelogioOferta();
  const [indice, setIndice] = useState(0);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setVisivel(true);
      setTimeout(() => setVisivel(false), 4500);
    }, 8000);

    const ciclo = setInterval(() => {
      setIndice((i) => (i + 1) % ATIVIDADES_RECENTES.length);
      setVisivel(true);
      setTimeout(() => setVisivel(false), 4500);
    }, 24000);

    return () => {
      clearTimeout(t1);
      clearInterval(ciclo);
    };
  }, []);

  const item = ATIVIDADES_RECENTES[indice];

  return (
    <>
      {/* Notificação discreta só no desktop (hidden md:block) para não poluir a tela do celular */}
      <div
        aria-live="polite"
        className={`pointer-events-none fixed bottom-14 left-6 z-30 hidden max-w-sm rounded-2xl border border-[#f3c64f]/45 bg-[#0c221d]/95 p-3.5 text-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.55)] backdrop-blur transition-[transform,opacity] duration-300 motion-reduce:transition-none md:block ${
          visivel ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f3c64f] text-[#0c221d]">
            <LuCheck className="h-4 w-4 stroke-[2.5]" aria-hidden />
          </span>
          <div className="min-w-0 text-xs leading-snug">
            <p className="truncate font-bold text-[#f7d46c]">{item.local}</p>
            <p className="text-white/90">{item.acao}</p>
          </div>
        </div>
      </div>

      {/* Barra fixa inferior no celular */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#f3c64f]/35 bg-[#0c221d]/98 px-4 pb-[max(0.7rem,env(safe-area-inset-bottom))] pt-2.5 text-white shadow-[0_-12px_32px_rgba(0,0,0,0.45)] backdrop-blur md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-fraunces text-base font-bold leading-tight text-white">
              R$ 149/mês <span className="font-manrope text-xs font-extrabold text-[#f7d46c]">· 50% na implantação</span>
            </p>
            <p className="truncate text-[11px] font-medium text-[#cfe3dc] tabular-nums">
              Restam 2 de 5 vagas {hidratado ? `· ${d}d ${dois(h)}h${dois(m)}` : "até 13/11"}
            </p>
          </div>
          <a
            href={linkWhatsOferta}
            target="_blank"
            rel="noopener noreferrer"
            data-origem="barra-mobile-fixa"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] px-5 py-3 text-xs font-extrabold text-white shadow-[0_6px_20px_rgba(34,197,94,0.4)] ring-1 ring-white/25 active:scale-[0.98]"
          >
            <FaWhatsapp className="h-4 w-4" aria-hidden />
            Garantir vaga
          </a>
        </div>
      </div>
    </>
  );
}
