"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { LuBellRing, LuCheck, LuClock, LuSparkles } from "react-icons/lu";

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

const NOTIFICACOES_COMPRA = [
  {
    tempo: "Agora mesmo",
    clinica: "Clínica de Estética · São Paulo, SP",
    acao: "Garantiu 1 das 5 vagas com 50% OFF na implantação",
  },
  {
    tempo: "Há 2 min",
    clinica: "Dra. Biomédica Esteta · Curitiba, PR",
    acao: "Adquiriu a Licença Vitalícia por R$ 2.000",
  },
  {
    tempo: "Há 4 min",
    clinica: "Studio de Harmonização · Belo Horizonte, MG",
    acao: "Reservou o Plano Mensal com implantação por R$ 248,50",
  },
  {
    tempo: "Há 6 min",
    clinica: "Clínica Dermatológica · Campinas, SP",
    acao: "Garantiu 1 das 5 vagas com 50% OFF na implantação",
  },
];

const navLink =
  "transition-colors hover:text-[#f7d46c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3c64f]";

/**
 * Cabeçalho fixo no topo (sem faixa dourada acima) que alterna suavemente
 * entre a barra "Morph Clínica" e a notificação de compra em estilo push,
 * voltando ao normal após alguns segundos.
 */
export function CabecalhoClinica({
  produto,
  linkWhatsOferta,
}: {
  produto: string;
  linkWhatsOferta: string;
}) {
  const [indice, setIndice] = useState(0);
  const [mostrandoNotificacao, setMostrandoNotificacao] = useState(false);

  useEffect(() => {
    let tEsconder: ReturnType<typeof setTimeout>;

    const disparar = (novoIndice?: number) => {
      if (typeof novoIndice === "number") {
        setIndice(novoIndice);
      }
      setMostrandoNotificacao(true);
      tEsconder = setTimeout(() => {
        setMostrandoNotificacao(false);
      }, 4800);
    };

    const tInicial = setTimeout(() => disparar(0), 4500);

    const intervalo = setInterval(() => {
      setIndice((atual) => {
        const proximo = (atual + 1) % NOTIFICACOES_COMPRA.length;
        setMostrandoNotificacao(true);
        clearTimeout(tEsconder);
        tEsconder = setTimeout(() => {
          setMostrandoNotificacao(false);
        }, 4800);
        return proximo;
      });
    }, 18000);

    return () => {
      clearTimeout(tInicial);
      clearTimeout(tEsconder);
      clearInterval(intervalo);
    };
  }, []);

  const item = NOTIFICACOES_COMPRA[indice];

  return (
    <header className="sticky top-0 z-40 h-16 overflow-hidden border-b border-white/10 bg-[#0c221d]/95 backdrop-blur">
      <div className="relative mx-auto h-full max-w-6xl px-4 sm:px-6">
        {/* Topo padrão: Morph Clínica + Navegação + Botão WhatsApp */}
        <div
          aria-hidden={mostrandoNotificacao}
          className={`flex h-full items-center justify-between gap-4 transition-all duration-300 ease-out motion-reduce:transition-none ${
            mostrandoNotificacao
              ? "-translate-y-full opacity-0 pointer-events-none"
              : "translate-y-0 opacity-100"
          }`}
        >
          <Link href="/" className="flex items-center gap-2.5" aria-label="Voltar para o site da Morph Code">
            <Image src="/logo.jpeg" alt="" width={30} height={30} className="rounded-full ring-1 ring-[#f3c64f]/50" />
            <span className="font-fraunces text-base text-white">{produto}</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-white/75 lg:flex">
            <a href="#sistema" className={navLink}>O sistema</a>
            <a href="#planos" className="font-bold text-[#f7d46c] transition-colors hover:text-white">Planos e 50% OFF</a>
            <a href="#como-funciona" className={navLink}>Como começar</a>
            <a href="#demo" className={navLink}>Demonstração</a>
            <a href="#duvidas" className={navLink}>Dúvidas</a>
          </nav>
          <a
            href={linkWhatsOferta}
            target="_blank"
            rel="noopener noreferrer"
            data-origem="cabecalho"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f7d46c] to-[#eab308] px-4 py-2 text-xs font-extrabold text-[#0c221d] shadow-sm transition hover:brightness-105 sm:text-sm"
          >
            <FaWhatsapp className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Garantir 50% OFF</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>

        {/* Notificação superior em estilo push que substitui temporariamente o topo do Morph Clínica */}
        <div
          role="status"
          aria-live="polite"
          className={`absolute inset-x-3 inset-y-1.5 flex items-center justify-between gap-3 rounded-2xl border border-[#f3c64f]/50 bg-gradient-to-r from-[#13352d] via-[#173f35] to-[#13352d] px-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-all duration-300 ease-out motion-reduce:transition-none sm:inset-x-6 sm:px-4 ${
            mostrandoNotificacao
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <a
            href={linkWhatsOferta}
            target="_blank"
            rel="noopener noreferrer"
            data-origem="notificacao-topo"
            className="flex min-w-0 flex-1 items-center gap-3"
          >
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-[#0c221d] shadow-[0_0_12px_rgba(34,197,94,0.5)]">
              <LuCheck className="h-4 w-4 stroke-[2.75]" aria-hidden />
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-center gap-2">
                <span className="truncate text-[11px] font-extrabold text-[#f7d46c] sm:text-xs">
                  {item.clinica}
                </span>
                <span className="shrink-0 rounded-full bg-black/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#86efac]">
                  {item.tempo}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs font-semibold text-white sm:text-[13px]">
                {item.acao}
              </p>
            </div>
            <span className="hidden shrink-0 rounded-full bg-[#f3c64f] px-3 py-1 text-[11px] font-extrabold text-[#0c221d] sm:inline-flex sm:items-center sm:gap-1">
              <LuBellRing className="h-3 w-3" aria-hidden />
              Ver oferta
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}

/**
 * Selo ao vivo no Hero: mostra apenas o número de clínicas vendo a página agora,
 * com ponto verde pulsante sólido e perfeitamente alinhado no celular.
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
    <div className="mb-4 inline-flex max-w-full items-center gap-2.5 rounded-full border border-[#f3c64f]/35 bg-[#15352e]/95 px-3.5 py-1.5 text-xs font-semibold leading-none text-[#e6f2ee] shadow-sm sm:mb-5 sm:px-4 sm:py-2 sm:text-sm">
      <span
        aria-hidden
        className="relative inline-flex h-2.5 w-2.5 shrink-0 items-center justify-center"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_2px_rgba(34,197,94,0.85)] animate-pulse motion-reduce:animate-none" />
      </span>
      <span className="whitespace-nowrap">
        <strong className="font-extrabold text-[#f7d46c] tabular-nums">{ativas} clínicas</strong> vendo esta página agora
      </span>
    </div>
  );
}

/**
 * Painel de escassez das 5 vagas de implantação (usado na seção de Planos para manter o Hero limpo).
 */
export function PainelVagasClinica() {
  const { hidratado, d, h, m } = useRelogioOferta();
  const vagasRestantes = 2;
  const preenchidas = VAGAS_TOTAL - vagasRestantes;
  const percentual = Math.round((preenchidas / VAGAS_TOTAL) * 100);

  return (
    <div className="mx-auto mt-5 max-w-xl rounded-2xl border border-[#f3c64f]/45 bg-[#122e28] p-4 text-left text-white shadow-[0_20px_50px_-20px_rgba(12,34,29,0.45)] sm:mt-6 sm:p-5">
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
        <span>{preenchidas} de {VAGAS_TOTAL} vagas preenchidas nesta semana</span>
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

/**
 * Barra fixa inferior no celular para conversão rápida durante a rolagem.
 */
export function FlutuantesClinica({ linkWhatsOferta }: { linkWhatsOferta: string }) {
  const { hidratado, d, h, m } = useRelogioOferta();

  return (
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
  );
}
