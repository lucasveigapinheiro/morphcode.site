"use client";

import { useSyncExternalStore } from "react";

// Oferta de fim de ano: 50% na implantação para quem fecha até 23/12/2026 (horário de Brasília).
const FIM = new Date("2026-12-24T00:00:00-03:00").getTime();

const semAssinatura = () => () => {};

// No servidor a oferta aparece ligada; no navegador vale a data de hoje.
function useOfertaAtiva() {
  return useSyncExternalStore(semAssinatura, () => Date.now() < FIM, () => true);
}

/** Mostra o conteúdo só enquanto a oferta está valendo. */
export function SeOferta({ children }: { children: React.ReactNode }) {
  return useOfertaAtiva() ? <>{children}</> : null;
}

/** Mostra o conteúdo só depois que a oferta acabou. */
export function SeSemOferta({ children }: { children: React.ReactNode }) {
  return useOfertaAtiva() ? null : <>{children}</>;
}

/** Texto que troca sozinho quando a oferta acaba. */
export function TextoOferta({ durante, depois }: { durante: string; depois: string }) {
  return <>{useOfertaAtiva() ? durante : depois}</>;
}

/** Valor da implantação do plano mensal, com o preço cheio riscado durante a oferta. */
export function PrecoImplantacao({ claro = false }: { claro?: boolean }) {
  const ativa = useOfertaAtiva();
  if (!ativa) return <>+ implantação de R$ 497 (paga uma vez)</>;
  return (
    <>
      + implantação de <s className={claro ? "text-nevoa/60" : "text-grafite/40"}>R$ 497</s>{" "}
      <strong className={claro ? "text-white" : "text-eucalipto"}>R$ 248,50</strong> (paga uma vez)
    </>
  );
}

/** Preço da licença vitalícia: R$ 2.000 durante a oferta, R$ 2.700 depois. */
export function PrecoLicenca() {
  const ativa = useOfertaAtiva();
  if (!ativa) return <>R$ 2.700</>;
  return (
    <>
      <s className="block text-2xl text-nevoa/55">R$ 2.700</s>
      R$ 2.000
    </>
  );
}
