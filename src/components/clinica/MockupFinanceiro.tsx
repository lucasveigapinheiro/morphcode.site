"use client";

import { useState } from "react";
import {
  LuWallet,
  LuTrendingUp,
  LuTrendingDown,
  LuCreditCard,
  LuCheck,
  LuCalendar,
  LuLock,
  LuPlus,
} from "react-icons/lu";

type FormaPagamento = "pix" | "cartao_vista" | "cartao_3x";

export default function MockupFinanceiro() {
  const [formaSimulada, setFormaSimulada] = useState<FormaPagamento>("cartao_3x");

  // Simulação de procedimento de R$ 1.200,00
  const valorBruto = 1200;
  const taxaPct = formaSimulada === "pix" ? 0 : formaSimulada === "cartao_vista" ? 3.2 : 4.8;
  const valorTaxa = (valorBruto * taxaPct) / 100;
  const valorLiquido = valorBruto - valorTaxa;

  return (
    <div className="w-full overflow-hidden rounded-[2rem] border border-grafite/15 bg-porcelana shadow-2xl shadow-eucalipto/15">
      {/* Barra superior estilo aplicativo */}
      <div className="flex flex-wrap items-center justify-between border-b border-grafite/10 bg-white/90 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-eucalipto/10 text-eucalipto">
            <LuWallet className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-fraunces text-xl font-medium text-grafite">Fluxo Financeiro</span>
              <span className="rounded-full bg-eucalipto/10 px-2.5 py-0.5 text-[11px] font-semibold text-eucalipto">
                Regime de Caixa Real
              </span>
            </div>
            <p className="text-xs text-grafite/60">
              Taxas de maquininha automáticas · Sinal de reserva · Auditoria sem exclusões
            </p>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 sm:mt-0">
          <div className="flex items-center gap-2 rounded-full border border-grafite/15 bg-white px-3 py-1 text-xs font-semibold text-grafite">
            <LuCalendar className="h-3.5 w-3.5 text-eucalipto" /> Outubro de 2026
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-eucalipto px-3.5 py-1.5 text-xs font-semibold text-white">
            <LuPlus className="h-3.5 w-3.5" /> Nova receita
          </span>
        </div>
      </div>

      {/* 4 KPIs idênticos aos do sistema */}
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
        <div className="rounded-2xl border border-grafite/10 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-grafite/55">Receitas no mês</span>
          <p className="mt-1 font-fraunces text-2xl font-semibold text-[#27ae60]">R$ 18.450 <span className="text-xs font-normal text-grafite/50">líquido</span></p>
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#27ae60]">
            <LuTrendingUp className="h-3 w-3" /> Já descontadas as taxas
          </span>
        </div>

        <div className="rounded-2xl border border-grafite/10 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-grafite/55">Despesas pagas</span>
          <p className="mt-1 font-fraunces text-2xl font-semibold text-argila">R$ 5.120 <span className="text-xs font-normal text-grafite/50">total</span></p>
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-argila">
            <LuTrendingDown className="h-3 w-3" /> Insumos, contas e aluguel
          </span>
        </div>

        <div className="rounded-2xl border border-eucalipto/20 bg-eucalipto/5 p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-eucalipto font-bold">Saldo operacional</span>
          <p className="mt-1 font-fraunces text-2xl font-semibold text-eucalipto">+ R$ 13.330</p>
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-eucalipto font-medium">
            <LuCheck className="h-3 w-3" /> Lucro líquido realizado
          </span>
        </div>

        <div className="rounded-2xl border border-grafite/10 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-grafite/55">A receber (futuro)</span>
          <p className="mt-1 font-fraunces text-2xl font-semibold text-grafite">R$ 6.800</p>
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-grafite/60">
            Parcelas e sinais previstos
          </span>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="grid gap-5 px-5 pb-5 lg:grid-cols-[1.45fr_1.1fr]">
        {/* Painel de Lançamentos Recentes */}
        <div className="overflow-hidden rounded-2xl border border-grafite/10 bg-white shadow-sm">
          <div className="border-b border-grafite/10 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-fraunces text-base font-medium text-grafite">Lançamentos recentes</p>
              <p className="text-xs text-grafite/55">Sinal vinculado à agenda e parcelas mês a mês</p>
            </div>
            <span className="rounded-full bg-porcelana px-2.5 py-1 text-[11px] font-mono text-grafite/70">
              Imutável
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-grafite/10 bg-porcelana/70 text-[11px] font-bold uppercase tracking-wider text-grafite/60">
                <tr>
                  <th className="py-2.5 pl-4 pr-2">Paciente / Descrição</th>
                  <th className="px-2 py-2.5">Forma</th>
                  <th className="px-2 py-2.5">Status</th>
                  <th className="py-2.5 pl-2 pr-4 text-right">Líquido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grafite/5">
                <tr className="hover:bg-porcelana/40">
                  <td className="py-3 pl-4 pr-2">
                    <p className="font-semibold text-grafite">Camila Silva</p>
                    <p className="text-[11px] text-grafite/50">Harmonização Facial (Parc. 1/3)</p>
                  </td>
                  <td className="px-2 py-3">
                    <span className="font-medium text-grafite/80">Crédito 3x</span>
                    <p className="text-[10px] text-grafite/50">Taxa 4.8% deduzida</p>
                  </td>
                  <td className="px-2 py-3">
                    <span className="inline-block rounded-full bg-[#27ae60]/10 px-2 py-0.5 text-[10px] font-semibold text-[#27ae60]">
                      Pago
                    </span>
                  </td>
                  <td className="py-3 pl-2 pr-4 text-right font-mono font-semibold text-grafite">
                    R$ 761,60
                  </td>
                </tr>

                <tr className="bg-eucalipto/5">
                  <td className="py-3 pl-4 pr-2">
                    <p className="font-semibold text-grafite">Mariana Ribeiro</p>
                    <p className="text-[11px] text-eucalipto font-medium">Sinal de Reserva (Agenda)</p>
                  </td>
                  <td className="px-2 py-3">
                    <span className="font-medium text-grafite/80">PIX</span>
                    <p className="text-[10px] text-grafite/50">Sem taxa</p>
                  </td>
                  <td className="px-2 py-3">
                    <span className="inline-block rounded-full bg-[#27ae60]/10 px-2 py-0.5 text-[10px] font-semibold text-[#27ae60]">
                      Recebido
                    </span>
                  </td>
                  <td className="py-3 pl-2 pr-4 text-right font-mono font-semibold text-[#27ae60]">
                    R$ 300,00
                  </td>
                </tr>

                <tr className="hover:bg-porcelana/40">
                  <td className="py-3 pl-4 pr-2">
                    <p className="font-semibold text-grafite">Mariana Ribeiro</p>
                    <p className="text-[11px] text-grafite/50">Restante no dia do procedimento</p>
                  </td>
                  <td className="px-2 py-3">
                    <span className="font-medium text-grafite/80">A definir</span>
                    <p className="text-[10px] text-grafite/50">Vence na consulta</p>
                  </td>
                  <td className="px-2 py-3">
                    <span className="inline-block rounded-full bg-[#f39c12]/15 px-2 py-0.5 text-[10px] font-semibold text-[#b7950b]">
                      Pendente
                    </span>
                  </td>
                  <td className="py-3 pl-2 pr-4 text-right font-mono font-semibold text-grafite/70">
                    R$ 900,00
                  </td>
                </tr>

                <tr className="hover:bg-porcelana/40">
                  <td className="py-3 pl-4 pr-2">
                    <p className="font-semibold text-grafite">Distribuidora Dermacare</p>
                    <p className="text-[11px] text-grafite/50">Insumos (Boleto faturado)</p>
                  </td>
                  <td className="px-2 py-3">
                    <span className="font-medium text-grafite/80">Boleto</span>
                  </td>
                  <td className="px-2 py-3">
                    <span className="inline-block rounded-full bg-argila/15 px-2 py-0.5 text-[10px] font-semibold text-argila">
                      Despesa
                    </span>
                  </td>
                  <td className="py-3 pl-2 pr-4 text-right font-mono font-semibold text-argila">
                    - R$ 1.840,00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Simulador de Taxas e Integração */}
        <div className="flex flex-col justify-between rounded-2xl border border-grafite/10 bg-white p-5 shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-argila">
                  Simulação em tempo real
                </span>
                <h4 className="font-fraunces text-lg font-medium text-grafite leading-tight mt-0.5">
                  Cálculo de Taxa da Maquininha
                </h4>
              </div>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-porcelana text-grafite/70">
                <LuCreditCard className="h-4 w-4" />
              </span>
            </div>

            <p className="mt-2 text-xs text-grafite/65">
              Escolha a forma de pagamento de um procedimento de R$ 1.200 e veja como o sistema calcula o líquido real:
            </p>

            {/* Seletor de forma de pagamento */}
            <div className="mt-3.5 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormaSimulada("pix")}
                className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition ${
                  formaSimulada === "pix"
                    ? "border-eucalipto bg-eucalipto/10 text-eucalipto shadow-sm"
                    : "border-grafite/15 bg-porcelana/60 text-grafite hover:border-eucalipto/50"
                }`}
              >
                PIX
                <span className="block text-[10px] font-normal text-grafite/55">0% taxa</span>
              </button>

              <button
                type="button"
                onClick={() => setFormaSimulada("cartao_vista")}
                className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition ${
                  formaSimulada === "cartao_vista"
                    ? "border-eucalipto bg-eucalipto/10 text-eucalipto shadow-sm"
                    : "border-grafite/15 bg-porcelana/60 text-grafite hover:border-eucalipto/50"
                }`}
              >
                Crédito 1x
                <span className="block text-[10px] font-normal text-grafite/55">3.2% taxa</span>
              </button>

              <button
                type="button"
                onClick={() => setFormaSimulada("cartao_3x")}
                className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition ${
                  formaSimulada === "cartao_3x"
                    ? "border-eucalipto bg-eucalipto/10 text-eucalipto shadow-sm"
                    : "border-grafite/15 bg-porcelana/60 text-grafite hover:border-eucalipto/50"
                }`}
              >
                Crédito 3x
                <span className="block text-[10px] font-normal text-grafite/55">4.8% taxa</span>
              </button>
            </div>

            {/* Resultado da simulação */}
            <div className="mt-4 rounded-xl border border-grafite/10 bg-porcelana/80 p-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-grafite/65">Valor cobrado do paciente:</span>
                <span className="font-semibold text-grafite">R$ 1.200,00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-grafite/65">Desconto da maquininha ({taxaPct}%):</span>
                <span className="font-semibold text-argila">- R$ {valorTaxa.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="border-t border-grafite/10 pt-2 flex justify-between">
                <span className="font-semibold text-grafite">Valor líquido na conta:</span>
                <span className="font-mono text-sm font-bold text-eucalipto">
                  R$ {valorLiquido.toFixed(2).replace(".", ",")}
                </span>
              </div>
              {formaSimulada === "cartao_3x" && (
                <div className="pt-1 text-[11px] text-grafite/60 border-t border-grafite/5">
                  Previsão mês a mês: 3 parcelas de R$ 380,80 creditadas exatamente no mês de compensação.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-eucalipto/20 bg-white p-3 text-xs text-grafite/75 flex items-start gap-2">
            <LuLock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-eucalipto" />
            <div>
              <p className="font-semibold text-grafite">Auditoria e Segurança Contábil</p>
              <p className="text-[11px] text-grafite/60">
                Lançamentos nunca são apagados: estornos e cancelamentos exigem motivo obrigatório e ficam salvos no histórico permanente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
