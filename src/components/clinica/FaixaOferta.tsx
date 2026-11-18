"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { LuSparkles } from "react-icons/lu";

// Data real da oferta (horário de Brasília): implantação com 50% OFF
// (R$ 497 -> R$ 248,50) e Licença Vitalícia por R$ 2.000, até 23/12/2026.
const FIM_OFERTA = new Date("2026-12-24T00:00:00-03:00").getTime();

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

  const encerrada = agora !== null && agora >= FIM_OFERTA;
  const resto = agora === null ? null : Math.max(0, FIM_OFERTA - agora);

  const d = resto === null ? 0 : Math.floor(resto / 86_400_000);
  const h = resto === null ? 0 : Math.floor((resto % 86_400_000) / 3_600_000);
  const m = resto === null ? 0 : Math.floor((resto % 3_600_000) / 60_000);
  const s = resto === null ? 0 : Math.floor((resto % 60_000) / 1000);

  return { hidratado: agora !== null, encerrada, d, h, m, s };
}

const navLink =
  "transition-colors hover:text-[#f7d46c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3c64f]";

/** Cabeçalho fixo no topo: marca, navegação e botão de WhatsApp sempre visíveis. */
export function CabecalhoClinica({
  produto,
  linkWhatsOferta,
}: {
  produto: string;
  linkWhatsOferta: string;
}) {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-white/10 bg-[#0c221d]/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
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
    </header>
  );
}

/**
 * Cronômetro grande em blocos dentro da seção de Planos e Investimento.
 */
export function CronometroPlanosClinica() {
  const { hidratado, encerrada, d, h, m, s } = useRelogioOferta();
  if (hidratado && encerrada) return null;

  const blocos = [
    { valor: hidratado ? dois(d) : "--", rotulo: d === 1 ? "Dia" : "Dias" },
    { valor: hidratado ? dois(h) : "--", rotulo: "Horas" },
    { valor: hidratado ? dois(m) : "--", rotulo: "Min" },
    { valor: hidratado ? dois(s) : "--", rotulo: "Seg" },
  ];

  return (
    <div className="mx-auto mt-6 max-w-xl rounded-3xl border border-[#f3c64f]/40 bg-gradient-to-b from-[#112c26] to-[#0c221d] p-5 text-center text-white shadow-[0_24px_60px_-20px_rgba(12,34,29,0.55)] sm:mt-8 sm:p-6">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-[#f3c64f]/40 bg-[#f3c64f]/15 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#f7d46c] sm:text-xs">
        <LuSparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Oferta de fim de ano: 50% na implantação até 23/12
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
            Oferta até 23/12{hidratado ? ` · ${d}d ${dois(h)}h${dois(m)}` : ""}
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
          Garantir 50% OFF
        </a>
      </div>
    </div>
  );
}
