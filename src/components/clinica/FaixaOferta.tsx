"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

// Datas reais da oferta (horário de Brasília). Ao mudar as vagas da semana, troque só estas linhas.
const FIM_OFERTA = new Date("2026-12-24T00:00:00-03:00").getTime(); // fecha até 23/12/2026
const FIM_VAGAS = new Date("2026-11-14T00:00:00-03:00").getTime(); // vagas válidas até sexta, 13/11/2026
const VAGAS = 5;

const semAssinatura = () => () => {};

/** Frase das vagas da semana. Só aparece no navegador e só enquanto as vagas valem; depois some sozinha. */
export function VagasSemana({ className = "" }: { className?: string }) {
  const ativa = useSyncExternalStore(semAssinatura, () => Date.now() < FIM_VAGAS, () => false);
  if (!ativa) return null;
  return <p className={className}>Só {VAGAS} vagas de implantação até o fim da semana.</p>;
}

const dois = (n: number) => String(n).padStart(2, "0");

/**
 * Faixa de topo com cronômetro até o fim real da condição. Enquanto valem as vagas da semana, conta
 * até o fim delas; depois, até 23/12. Passada a oferta, some. Nunca reinicia por visitante.
 */
export default function FaixaOferta() {
  const [agora, setAgora] = useState<number | null>(null);

  useEffect(() => {
    const t0 = setTimeout(() => setAgora(Date.now()), 0);
    const t = setInterval(() => setAgora(Date.now()), 1000);
    return () => {
      clearTimeout(t0);
      clearInterval(t);
    };
  }, []);

  // Antes de hidratar mostra só o texto fixo, igual no servidor.
  const comVagas = agora !== null && agora < FIM_VAGAS;
  const alvo = comVagas ? FIM_VAGAS : FIM_OFERTA;
  if (agora !== null && agora >= FIM_OFERTA) return null;

  const resto = agora === null ? null : Math.max(0, alvo - agora);
  const d = resto === null ? 0 : Math.floor(resto / 86_400_000);
  const h = resto === null ? 0 : Math.floor((resto % 86_400_000) / 3_600_000);
  const m = resto === null ? 0 : Math.floor((resto % 3_600_000) / 60_000);
  const s = resto === null ? 0 : Math.floor((resto % 60_000) / 1000);
  const partes: [string, string][] = [
    [String(d), d === 1 ? "dia" : "dias"],
    [dois(h), "h"],
    [dois(m), "min"],
    [dois(s), "s"],
  ];

  return (
    // Fixa na tela o tempo todo. No celular fica no topo (altura fixa h-9, que o cabeçalho e a página compensam); no desktop, no rodapé.
    <div className="fixed inset-x-0 top-0 z-40 flex h-9 items-center bg-argila px-3 text-eucalipto-escuro shadow-[0_6px_20px_-8px_rgba(0,0,0,0.35)] md:bottom-0 md:top-auto md:h-auto md:px-4 md:py-2.5 md:shadow-[0_-6px_20px_-8px_rgba(0,0,0,0.35)]">
      <div className="mx-auto flex max-w-6xl flex-row items-center justify-center gap-x-3 gap-y-1 text-center md:gap-x-6">
        <p className="whitespace-nowrap text-xs font-bold md:text-[13px]">
          <span className="md:hidden">{comVagas ? `Só ${VAGAS} vagas` : "50% off"}</span>
          <span className="hidden md:inline">
            {comVagas
              ? `Só ${VAGAS} vagas de implantação até o fim da semana. 50% off + licença por R$ 2.000.`
              : "Fim de ano: 50% na implantação ou licença por R$ 2.000, só até 23 de dezembro."}
          </span>
        </p>
        {resto !== null && (
          <p className="flex items-center gap-1.5 text-[13px] font-bold" role="timer" aria-label={comVagas ? "Tempo restante das vagas da semana" : "Tempo restante da oferta"}>
            <span className="whitespace-nowrap">{comVagas ? "Termina em" : "Acaba em"}</span>
            {partes.map(([v, u], i) => (
              <span key={i} className="rounded bg-eucalipto-escuro px-1.5 py-0.5 tabular-nums text-white">
                {v}
                <span className="ml-0.5 text-[10px] font-semibold opacity-75">{u}</span>
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
