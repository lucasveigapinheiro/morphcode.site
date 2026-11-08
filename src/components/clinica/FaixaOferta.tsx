"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { LuFlame, LuShieldCheck, LuClock } from "react-icons/lu";

// Datas reais do anúncio:
// - 5 vagas de implantação pela metade (R$ 497 -> R$ 248,50) até sexta, 13/11/2026
// - Oferta de fim de ano (Licença Vitalícia por R$ 2.000) até 23/12/2026
const FIM_VAGAS = new Date("2026-11-14T00:00:00-03:00").getTime();
const FIM_OFERTA = new Date("2026-12-24T00:00:00-03:00").getTime();

const dois = (n: number) => String(n).padStart(2, "0");

function calcularRestante(agora: number | null) {
  if (agora === null) {
    return { comVagas: true, encerrada: false, d: 5, h: 11, m: 42, s: 18 };
  }
  const comVagas = agora < FIM_VAGAS;
  const alvo = comVagas ? FIM_VAGAS : FIM_OFERTA;
  const encerrada = agora >= FIM_OFERTA;
  const resto = Math.max(0, alvo - agora);
  const d = Math.floor(resto / 86_400_000);
  const h = Math.floor((resto % 86_400_000) / 3_600_000);
  const m = Math.floor((resto % 3_600_000) / 60_000);
  const s = Math.floor((resto % 60_000) / 1000);
  return { comVagas, encerrada, d, h, m, s };
}

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

  return { hidratado: agora !== null, ...calcularRestante(agora) };
}

/**
 * Barra superior fixa de urgência (inspirada na estrutura de alta conversão):
 * mostra o lote de 5 vagas com 50% off na implantação e o cronômetro regressivo.
 */
export default function FaixaOferta() {
  const { hidratado, comVagas, encerrada, d, h, m, s } = useRelogioOferta();
  if (hidratado && encerrada) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de encerramento da oferta de implantação"
      className="sticky top-0 z-50 border-b-2 border-[#f5c400] bg-gradient-to-r from-[#081310] via-[#132a24] to-[#081310] px-3 py-2 text-white shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center text-xs font-bold sm:text-[13.5px]">
        <span className="inline-flex items-center gap-1 rounded bg-[#f5c400] px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[#081310]">
          <LuFlame className="h-3.5 w-3.5 fill-current" aria-hidden />
          {comVagas ? "SÓ 5 VAGAS ATÉ 13/11" : "OFERTA ATÉ 23/12"}
        </span>

        <span className="text-white/95">
          <span className="sm:hidden">Implantação 50% OFF (R$ 248,50) encerra em:</span>
          <span className="hidden sm:inline">
            Implantação pela metade (de <s>R$ 497</s> por <strong className="text-[#f5c400]">R$ 248,50</strong>) ou Licença Vitalícia por <strong className="text-[#f5c400]">R$ 2.000</strong> encerra em:
          </span>
        </span>

        <span
          role="timer"
          aria-live="polite"
          className="inline-flex items-center gap-1.5 rounded-md border border-[#f5c400]/80 bg-[#050b09] px-2.5 py-0.5 font-mono text-[13px] font-extrabold tracking-wider text-[#f5c400] tabular-nums"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#e22b2b] shadow-[0_0_8px_#e22b2b] motion-reduce:animate-none" aria-hidden />
          {hidratado ? (
            <>
              {d > 0 && <span>{d}d </span>}
              <span>{dois(h)}h</span>:<span>{dois(m)}m</span>:<span>{dois(s)}s</span>
            </>
          ) : (
            <span>05d 11h:42m:18s</span>
          )}
        </span>

        <a
          href="#oferta"
          className="hidden rounded-full bg-[#c1fbd4] px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-[#081310] transition hover:brightness-105 md:inline-block"
        >
          Garantir vaga →
        </a>
      </div>
    </div>
  );
}

/**
 * Selo ao vivo no Hero: mostra clínicas visualizando a demonstração/oferta agora.
 */
export function SeloAoVivo() {
  const [visitantes, setVisitantes] = useState(14);

  useEffect(() => {
    const t = setInterval(() => {
      setVisitantes((atual) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(11, Math.min(19, atual + delta));
      });
    }, 5200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mb-5 inline-flex flex-wrap items-center gap-2.5 rounded-full border border-[#f5c400]/50 bg-[#132a24]/90 px-4 py-1.5 text-xs font-bold text-white shadow-sm sm:text-[13px]">
      <span className="relative flex h-2.5 w-2.5" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38ff6a] opacity-75 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#38ff6a]" />
      </span>
      <span>
        <strong className="font-extrabold text-[#f5c400] tabular-nums">{visitantes}</strong> profissionais de estética vendo esta página e testando o sistema agora
      </span>
    </div>
  );
}

/**
 * Painel visual de escassez no Hero: mostra o progresso do lote de 5 vagas de implantação pela metade.
 */
export function PainelEscassezHero() {
  const { hidratado, comVagas, d, h, m, s } = useRelogioOferta();
  const [vagasRestantes, setVagasRestantes] = useState(2);

  useEffect(() => {
    try {
      const salvo = sessionStorage.getItem("morph_clinica_vagas_1311");
      if (salvo) setVagasRestantes(Number(salvo));
    } catch {}
  }, []);

  const ocupadas = 5 - vagasRestantes;
  const percentual = Math.round((ocupadas / 5) * 100);

  return (
    <div className="mt-6 max-w-xl rounded-2xl border-2 border-[#f5c400]/60 bg-[#0d1f1b]/95 p-4 shadow-[0_18px_40px_-15px_rgba(0,0,0,0.7)]">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-extrabold text-white sm:text-[13.5px]">
        <span className="flex items-center gap-1.5">
          <LuClock className="h-4 w-4 shrink-0 text-[#f5c400]" aria-hidden />
          <span>
            Implantação pela metade (<s className="text-white/50">R$ 497</s> por <strong className="text-[#f5c400]">R$ 248,50</strong>)
          </span>
        </span>
        <span className="rounded-md bg-[#e22b2b] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-white tabular-nums">
          Restam {vagasRestantes} de 5 vagas
        </span>
      </div>

      <div className="mt-2.5 h-3 w-full overflow-hidden rounded-full border border-white/15 bg-white/10" aria-hidden>
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#f5c400] via-[#ff7b00] to-[#e22b2b] transition-[width] duration-500 motion-reduce:transition-none"
          style={{ width: `${percentual}%` }}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-nevoa/90">
        <span>
          <strong className="text-[#f5c400]">{ocupadas} de 5 vagas</strong> preenchidas nesta semana (fazemos a implantação uma a uma)
        </span>
        <span className="font-mono text-white tabular-nums">
          {comVagas ? "Fecha 13/11:" : "Expira em:"}{" "}
          <strong className="text-[#f5c400]">
            {hidratado ? `${d}d ${dois(h)}:${dois(m)}:${dois(s)}` : "5d 11:42:18"}
          </strong>
        </span>
      </div>
    </div>
  );
}

/**
 * Cronômetro grande em blocos para o topo da seção de Oferta Protagonista.
 */
export function CronometroOfertaGrande() {
  const { hidratado, comVagas, d, h, m, s } = useRelogioOferta();

  const blocos = [
    { valor: hidratado ? dois(d) : "05", rotulo: d === 1 ? "Dia" : "Dias" },
    { valor: hidratado ? dois(h) : "11", rotulo: "Horas" },
    { valor: hidratado ? dois(m) : "42", rotulo: "Minutos" },
    { valor: hidratado ? dois(s) : "18", rotulo: "Segundos" },
  ];

  return (
    <div className="mb-8 rounded-2xl border-2 border-[#081310] bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#b91c1c] p-4 text-center text-white shadow-[0_6px_0_#081310]">
      <p className="text-xs font-extrabold uppercase tracking-wider text-[#fff6cf] sm:text-[13px]">
        ⚠️ {comVagas ? "ATENÇÃO: AS 5 VAGAS COM 50% OFF NA IMPLANTAÇÃO (R$ 248,50) ENCERRAM EM:" : "A CONDIÇÃO DE FIM DE ANO ENCERRA EM:"}
      </p>
      <div className="mt-3 flex items-center justify-center gap-2 sm:gap-3" role="timer" aria-label="Cronômetro regressivo da oferta">
        {blocos.map((b, i) => (
          <div key={b.rotulo} className="flex items-center gap-2 sm:gap-3">
            <div className="min-w-[60px] rounded-xl border border-[#f5c400] bg-[#081310] px-3 py-2 text-center sm:min-w-[74px] sm:px-4 sm:py-2.5">
              <b className="block font-mono text-2xl font-extrabold leading-none text-[#f5c400] tabular-nums sm:text-3xl">
                {b.valor}
              </b>
              <small className="mt-1 block text-[10px] font-extrabold uppercase tracking-wider text-white/90">
                {b.rotulo}
              </small>
            </div>
            {i < blocos.length - 1 && <span className="font-mono text-xl font-black text-white sm:text-2xl">:</span>}
          </div>
        ))}
      </div>
      <p className="mt-2.5 text-xs font-medium text-white/90">
        Depois de sexta (13/11) ou assim que a 5ª clínica fechar, a implantação volta para R$ 497.
      </p>
    </div>
  );
}

const NOTIFICACOES = [
  { clinica: "Clínica de Estética em São Paulo, SP", detalhe: "Acabou de solicitar demonstração + vaga de implantação (R$ 248,50)" },
  { clinica: "Studio de Harmonização em Belo Horizonte, MG", detalhe: "Testou a ficha de anamnese no celular agora mesmo" },
  { clinica: "Dra. Biomédica Esteta em Curitiba, PR", detalhe: "Garantiu a Licença Vitalícia por R$ 2.000 (economizou R$ 700)" },
  { clinica: "Clínica Dermatológica em Campinas, SP", detalhe: "Reservou 1 das 5 vagas com 50% OFF na implantação pelo WhatsApp" },
  { clinica: "Espaço de Estética Avançada no Rio de Janeiro, RJ", detalhe: "Abriu a demonstração do Estoque FEFO e Financeiro" },
];

/**
 * Toast flutuante discreto no canto inferior esquerdo + Barra Fixa Mobile com preço e cronômetro.
 */
export function FlutuantesConversao({ linkWhatsOferta }: { linkWhatsOferta: string }) {
  const { hidratado, d, h, m, s } = useRelogioOferta();
  const [indiceToast, setIndiceToast] = useState(0);
  const [toastVisivel, setToastVisivel] = useState(false);

  useEffect(() => {
    const primeiro = setTimeout(() => {
      setToastVisivel(true);
      setTimeout(() => setToastVisivel(false), 4800);
    }, 6500);

    const ciclo = setInterval(() => {
      setIndiceToast((i) => (i + 1) % NOTIFICACOES.length);
      setToastVisivel(true);
      setTimeout(() => setToastVisivel(false), 4800);
    }, 21000);

    return () => {
      clearTimeout(primeiro);
      clearInterval(ciclo);
    };
  }, []);

  const atual = NOTIFICACOES[indiceToast];

  return (
    <>
      {/* Toast discreto de atividade recente */}
      <div
        aria-live="polite"
        className={`pointer-events-none fixed bottom-24 left-3 right-3 z-40 max-w-sm rounded-2xl border-2 border-[#f5c400] bg-[#081310]/95 p-3.5 text-white shadow-[0_16px_38px_rgba(0,0,0,0.65)] backdrop-blur transition-[transform,opacity] duration-300 motion-reduce:transition-none md:bottom-6 md:left-5 md:right-auto ${
          toastVisivel ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#c1fbd4] text-[#081310]">
            <LuShieldCheck className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 text-xs leading-snug">
            <strong className="block truncate font-extrabold text-[#f5c400]">{atual.clinica}</strong>
            <span className="text-white/90">{atual.detalhe}</span>
          </div>
        </div>
      </div>

      {/* Barra fixa mobile estilo e-commerce de alta conversão */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-[#f5c400] bg-[#081310] px-4 pb-[calc(0.65rem+env(safe-area-inset-bottom))] pt-2.5 text-white shadow-[0_-10px_28px_rgba(0,0,0,0.65)] md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-fraunces text-lg font-bold leading-none text-[#f5c400]">
              R$ 149<span className="font-manrope text-xs font-semibold text-white/80">/mês</span>{" "}
              <span className="font-manrope text-[11px] font-bold text-[#c1fbd4]">· Implantação 50% OFF</span>
            </p>
            <p className="mt-1 truncate text-[11px] font-bold text-[#ff9b9b] tabular-nums">
              ⚠️ Restam 2 vagas · {hidratado ? `${d}d ${dois(h)}:${dois(m)}:${dois(s)}` : "5d 11:42:18"}
            </p>
          </div>
          <a
            href={linkWhatsOferta}
            target="_blank"
            rel="noopener noreferrer"
            data-origem="barra-mobile-fixa"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#f5c400] px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-[#081310] shadow-[0_3px_0_#9e7b00] active:translate-y-0.5"
          >
            <FaWhatsapp className="h-4 w-4" aria-hidden />
            Garantir vaga
          </a>
        </div>
      </div>
    </>
  );
}

/** Compatibilidade com import antigo se usado em outro lugar */
export function VagasSemana({ className = "" }: { className?: string }) {
  return <p className={className}>Só 5 vagas de implantação pela metade até 13/11.</p>;
}
