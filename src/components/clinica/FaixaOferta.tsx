"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { LuCheck, LuClock } from "react-icons/lu";

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
 * Faixa de topo clínica e elegante (argila + eucalipto-escuro), fixa no topo no celular e no rodapé no desktop,
 * com cronômetro real e atalho para os planos.
 */
export default function FaixaOferta() {
  const { hidratado, comVagas, encerrada, d, h, m, s } = useRelogioOferta();
  if (hidratado && encerrada) return null;

  const partes: [string, string][] = [
    [String(d), d === 1 ? "dia" : "dias"],
    [dois(h), "h"],
    [dois(m), "min"],
    [dois(s), "s"],
  ];

  return (
    <div className="fixed inset-x-0 top-0 z-40 flex h-9 items-center bg-argila px-3 text-eucalipto-escuro shadow-[0_6px_20px_-8px_rgba(0,0,0,0.35)] md:bottom-0 md:top-auto md:h-auto md:px-4 md:py-2.5 md:shadow-[0_-6px_20px_-8px_rgba(0,0,0,0.35)]">
      <div className="mx-auto flex max-w-6xl flex-row items-center justify-center gap-x-3 gap-y-1 text-center md:gap-x-6">
        <p className="whitespace-nowrap text-xs font-bold md:text-[13px]">
          <span className="md:hidden">
            {comVagas ? `Só ${VAGAS_TOTAL} vagas até 13/11 · 50% off` : "Oferta até 23/12 · 50% off"}
          </span>
          <span className="hidden md:inline">
            {comVagas
              ? `Só ${VAGAS_TOTAL} vagas até 13/11: implantação pela metade (R$ 248,50) ou Licença Vitalícia por R$ 2.000.`
              : "Fim de ano: 50% na implantação (R$ 248,50) ou licença por R$ 2.000, só até 23 de dezembro."}
          </span>
        </p>

        {hidratado && (
          <p
            className="flex items-center gap-1 text-xs font-bold md:gap-1.5 md:text-[13px]"
            role="timer"
            aria-label={comVagas ? "Tempo restante das vagas da semana" : "Tempo restante da oferta"}
          >
            <span className="hidden whitespace-nowrap sm:inline">{comVagas ? "Encerra em" : "Acaba em"}</span>
            {partes.map(([v, u], i) => (
              <span key={i} className="rounded bg-eucalipto-escuro px-1.5 py-0.5 tabular-nums text-white">
                {v}
                <span className="ml-0.5 text-[10px] font-semibold opacity-75">{u}</span>
              </span>
            ))}
          </p>
        )}

        <a
          href="#planos"
          className="hidden rounded-full bg-eucalipto-escuro px-3.5 py-1 text-xs font-bold text-white transition-opacity hover:opacity-90 lg:inline-block"
        >
          Ver condição →
        </a>
      </div>
    </div>
  );
}

/**
 * Selo suave no Hero: mostra clínicas conhecendo o sistema agora no tom botânico da página.
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
    <p className="mb-5 inline-flex flex-wrap items-center gap-2.5 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-nevoa ring-1 ring-white/15">
      <span className="relative flex h-2 w-2" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ade80] opacity-75 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ade80]" />
      </span>
      <span>
        Já em uso por profissionais da área · <strong className="text-white tabular-nums">{ativas} clínicas</strong> vendo esta página agora
      </span>
    </p>
  );
}

/**
 * Cartão elegante de escassez das 5 vagas de implantação pela metade no Hero.
 */
export function PainelVagasClinica() {
  const { hidratado, comVagas, d, h, m, s } = useRelogioOferta();
  const vagasRestantes = 2;
  const preenchidas = VAGAS_TOTAL - vagasRestantes;
  const percentual = Math.round((preenchidas / VAGAS_TOTAL) * 100);

  return (
    <div className="mt-6 max-w-xl rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/15 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-[13px]">
        <span className="inline-flex items-center gap-1.5 font-semibold text-nevoa">
          <LuClock className="h-4 w-4 shrink-0 text-argila" aria-hidden />
          <span>
            Implantação pela metade (<s className="text-white/50">R$ 497</s> por <strong className="text-white">R$ 248,50</strong>)
          </span>
        </span>
        <span className="rounded-full bg-argila px-3 py-0.5 text-xs font-bold text-eucalipto-escuro tabular-nums">
          Restam {vagasRestantes} de {VAGAS_TOTAL} vagas até 13/11
        </span>
      </div>

      <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/10" aria-hidden>
        <div
          className="h-full rounded-full bg-gradient-to-r from-nevoa via-argila to-[#e09f83] transition-[width] duration-500 motion-reduce:transition-none"
          style={{ width: `${percentual}%` }}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-white/75">
        <span>
          <strong className="text-white">{preenchidas} de {VAGAS_TOTAL} vagas</strong> desta semana já reservadas (implantação individual)
        </span>
        {hidratado && (
          <span className="font-mono text-nevoa tabular-nums">
            {comVagas ? "Encerra em " : "Restam "}
            <strong className="text-white">
              {d}d {dois(h)}h {dois(m)}m {dois(s)}s
            </strong>
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Cronômetro elegante em blocos dentro da seção de Planos e Investimento.
 */
export function CronometroPlanosClinica() {
  const { hidratado, comVagas, encerrada, d, h, m, s } = useRelogioOferta();
  if (hidratado && encerrada) return null;

  const blocos = [
    { valor: hidratado ? dois(d) : "05", rotulo: d === 1 ? "Dia" : "Dias" },
    { valor: hidratado ? dois(h) : "11", rotulo: "Horas" },
    { valor: hidratado ? dois(m) : "42", rotulo: "Minutos" },
    { valor: hidratado ? dois(s) : "18", rotulo: "Segundos" },
  ];

  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-3xl bg-eucalipto-escuro p-6 text-center text-white shadow-xl shadow-eucalipto/20 ring-1 ring-white/10">
      <div className="inline-flex items-center gap-2 rounded-full bg-argila/20 px-3.5 py-1 text-xs font-bold text-argila">
        <span className="h-2 w-2 animate-ping rounded-full bg-argila motion-reduce:animate-none" aria-hidden />
        {comVagas
          ? "Condição da semana · Só 5 vagas com implantação pela metade (até 13/11)"
          : "Oferta de fim de ano válida até 23 de dezembro"}
      </div>

      <p className="mt-2 text-sm text-nevoa/90">
        Depois de sexta-feira (13/11) ou assim que as 5 vagas fecharem, a implantação volta para R$ 497:
      </p>

      <div className="mt-4 flex items-center justify-center gap-2 sm:gap-3" role="timer" aria-label="Cronômetro regressivo da condição de implantação">
        {blocos.map((b, i) => (
          <div key={b.rotulo} className="flex items-center gap-2 sm:gap-3">
            <div className="min-w-[62px] rounded-2xl bg-white/[0.08] px-3 py-2.5 ring-1 ring-white/15 sm:min-w-[74px] sm:px-4">
              <span className="block font-fraunces text-2xl font-bold leading-none text-argila tabular-nums sm:text-3xl">
                {b.valor}
              </span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wider text-nevoa/80">
                {b.rotulo}
              </span>
            </div>
            {i < blocos.length - 1 && <span className="font-fraunces text-xl text-argila/70">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

const ATIVIDADES_RECENTES = [
  { local: "Clínica de Estética · São Paulo, SP", acao: "Solicitou apresentação + vaga de implantação por R$ 248,50" },
  { local: "Studio de Harmonização · Belo Horizonte, MG", acao: "Acabou de testar a ficha de anamnese no celular" },
  { local: "Dra. Biomédica Esteta · Curitiba, PR", acao: "Garantiu a Licença Vitalícia por R$ 2.000" },
  { local: "Clínica Dermatológica · Campinas, SP", acao: "Reservou 1 das 5 vagas com 50% na implantação pelo WhatsApp" },
];

/**
 * Toast flutuante suave (estilo caderno de bem-estar) + Barra fixa de WhatsApp no celular.
 */
export function FlutuantesClinica({ linkWhatsOferta }: { linkWhatsOferta: string }) {
  const { hidratado, d, h, m } = useRelogioOferta();
  const [indice, setIndice] = useState(0);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setVisivel(true);
      setTimeout(() => setVisivel(false), 4600);
    }, 7000);

    const ciclo = setInterval(() => {
      setIndice((i) => (i + 1) % ATIVIDADES_RECENTES.length);
      setVisivel(true);
      setTimeout(() => setVisivel(false), 4600);
    }, 22000);

    return () => {
      clearTimeout(t1);
      clearInterval(ciclo);
    };
  }, []);

  const item = ATIVIDADES_RECENTES[indice];

  return (
    <>
      {/* Notificação discreta no canto inferior esquerdo */}
      <div
        aria-live="polite"
        className={`pointer-events-none fixed bottom-24 left-4 right-4 z-30 max-w-sm rounded-2xl bg-white/95 p-3.5 text-grafite shadow-[0_20px_50px_-15px_rgba(29,60,54,0.35)] ring-1 ring-eucalipto/15 backdrop-blur transition-[transform,opacity] duration-300 motion-reduce:transition-none md:bottom-14 md:left-6 md:right-auto ${
          visivel ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-nevoa text-eucalipto">
            <LuCheck className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0 text-xs leading-snug">
            <p className="truncate font-bold text-eucalipto-escuro">{item.local}</p>
            <p className="text-grafite/75">{item.acao}</p>
          </div>
        </div>
      </div>

      {/* Barra fixa inferior no celular */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-grafite/10 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-10px_30px_-10px_rgba(29,60,54,0.25)] backdrop-blur md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-fraunces text-base font-bold leading-tight text-eucalipto-escuro">
              R$ 149/mês <span className="font-manrope text-xs font-semibold text-[#a4543a]">· Implantação 50% off</span>
            </p>
            <p className="truncate text-[11px] font-medium text-grafite/65 tabular-nums">
              Restam 2 de 5 vagas {hidratado ? `· encerra em ${d}d ${dois(h)}h${dois(m)}` : "até 13/11"}
            </p>
          </div>
          <a
            href={linkWhatsOferta}
            target="_blank"
            rel="noopener noreferrer"
            data-origem="barra-mobile-fixa"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#1fa855] px-5 py-3 text-xs font-bold text-white shadow-md shadow-[#1fa855]/30 active:scale-[0.98]"
          >
            <FaWhatsapp className="h-4 w-4" aria-hidden />
            Garantir vaga
          </a>
        </div>
      </div>
    </>
  );
}
