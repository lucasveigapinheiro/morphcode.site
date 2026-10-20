"use client";

import { useState } from "react";
import {
  LuBoxes,
  LuTriangleAlert,
  LuCheck,
  LuPlus,
  LuArrowRightLeft,
  LuClock,
  LuShoppingCart,
  LuInfo,
  LuSparkles,
  LuShieldAlert,
} from "react-icons/lu";

type InsumoExemplo = {
  id: string;
  nome: string;
  categoria: string;
  lote: string;
  validade: string;
  diasValidade: number;
  saldo: string;
  custo: string;
  status: "normal" | "alerta" | "fefo";
  motivoStatus: string;
};

const INSUMOS: InsumoExemplo[] = [
  {
    id: "1",
    nome: "Dysport 500U (Toxina Botulínica)",
    categoria: "Injetáveis",
    lote: "LOTE-DP2026A",
    validade: "15/11/2026",
    diasValidade: 27,
    saldo: "3 frascos",
    custo: "R$ 820,00",
    status: "fefo",
    motivoStatus: "FEFO: Vence em 27 dias · Prioridade de saída",
  },
  {
    id: "2",
    nome: "Juvederm Voluma 1ml (Ácido Hialurônico)",
    categoria: "Preenchedores",
    lote: "LOTE-JV884",
    validade: "10/05/2027",
    diasValidade: 203,
    saldo: "6 seringas",
    custo: "R$ 680,00",
    status: "normal",
    motivoStatus: "Estoque saudável",
  },
  {
    id: "3",
    nome: "Sculptra Bioestimulador de Colágeno",
    categoria: "Injetáveis",
    lote: "LOTE-SC102",
    validade: "20/03/2027",
    diasValidade: 152,
    saldo: "1 frasco",
    custo: "R$ 1.150,00",
    status: "alerta",
    motivoStatus: "Abaixo do mínimo (mín. 3) · Comprar +3",
  },
  {
    id: "4",
    nome: "Cânula 22G 50mm SoftFil",
    categoria: "Descartáveis",
    lote: "LOTE-CN410",
    validade: "18/08/2028",
    diasValidade: 668,
    saldo: "24 un",
    custo: "R$ 38,00",
    status: "normal",
    motivoStatus: "Estoque adequado",
  },
];

export default function MockupEstoque() {
  const [insumoSelecionado, setInsumoSelecionado] = useState<string>("1");
  const [baixaRealizada, setBaixaRealizada] = useState(false);

  const selecionado = INSUMOS.find((i) => i.id === insumoSelecionado) || INSUMOS[0];

  function simularBaixaFefo() {
    setBaixaRealizada(true);
    setTimeout(() => setBaixaRealizada(false), 3500);
  }

  return (
    <div className="w-full overflow-hidden rounded-[2rem] border border-grafite/15 bg-porcelana shadow-2xl shadow-eucalipto/15">
      {/* Barra superior estilo aplicativo */}
      <div className="flex flex-wrap items-center justify-between border-b border-grafite/10 bg-white/90 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-eucalipto/10 text-eucalipto">
            <LuBoxes className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-fraunces text-xl font-medium text-grafite">Estoque da Clínica</span>
              <span className="rounded-full bg-eucalipto/10 px-2.5 py-0.5 text-[11px] font-semibold text-eucalipto">
                Regra FEFO Ativa
              </span>
            </div>
            <p className="text-xs text-grafite/60">
              Insumos por lote e validade · Baixa automática do que vence primeiro
            </p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 sm:mt-0">
          <button
            type="button"
            onClick={simularBaixaFefo}
            className="inline-flex items-center gap-1.5 rounded-full border border-eucalipto/30 bg-white px-3.5 py-1.5 text-xs font-semibold text-eucalipto transition hover:bg-eucalipto/10"
          >
            <LuArrowRightLeft className="h-3.5 w-3.5" /> Simular baixa FEFO
          </button>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-eucalipto px-3.5 py-1.5 text-xs font-semibold text-white">
            <LuPlus className="h-3.5 w-3.5" /> Novo insumo
          </span>
        </div>
      </div>

      {/* Banner de feedback da simulação */}
      {baixaRealizada && (
        <div className="border-b border-[#27ae60]/30 bg-[#eafaf1] px-6 py-2.5 text-xs font-medium text-[#1e8449] transition-all">
          <span className="inline-flex items-center gap-1.5">
            <LuCheck className="h-4 w-4" /> <strong>Baixa registrada com sucesso:</strong> 1 unidade de Dysport 500U deduzida automaticamente do lote LOTE-DP2026A (vencimento mais próximo). Histórico gravado.
          </span>
        </div>
      )}

      {/* 4 KPIs idênticos ao do sistema */}
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
        <div className="rounded-2xl border border-grafite/10 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-grafite/55">Total de insumos</span>
          <p className="mt-1 font-fraunces text-2xl font-semibold text-grafite">28 <span className="text-xs font-normal text-grafite/50">itens</span></p>
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-eucalipto">
            <LuCheck className="h-3 w-3" /> Todos com lote e rastreio
          </span>
        </div>

        <div className="rounded-2xl border border-[#e67e22]/30 bg-[#fef9e7]/70 p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#b7950b]">Abaixo do mínimo</span>
          <p className="mt-1 font-fraunces text-2xl font-semibold text-[#7d6608]">2 <span className="text-xs font-normal text-grafite/50">produtos</span></p>
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#b7950b]">
            <LuShoppingCart className="h-3 w-3" /> Sugestão de compra pronta
          </span>
        </div>

        <div className="rounded-2xl border border-[#c98e73]/40 bg-[#fbf6f3] p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-argila">Vencendo em 30 dias</span>
          <p className="mt-1 font-fraunces text-2xl font-semibold text-argila">1 <span className="text-xs font-normal text-grafite/50">lote</span></p>
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-argila">
            <LuClock className="h-3 w-3" /> Priorizado nas aplicações
          </span>
        </div>

        <div className="rounded-2xl border border-grafite/10 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-grafite/55">Lotes vencidos</span>
          <p className="mt-1 font-fraunces text-2xl font-semibold text-[#27ae60]">0 <span className="text-xs font-normal text-grafite/50">perdas</span></p>
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#27ae60]">
            <LuShieldAlert className="h-3 w-3" /> Saída de vencido bloqueada
          </span>
        </div>
      </div>

      {/* Conteúdo principal em duas colunas */}
      <div className="grid gap-5 px-5 pb-5 lg:grid-cols-[1.55fr_1fr]">
        {/* Tabela de Insumos */}
        <div className="overflow-hidden rounded-2xl border border-grafite/10 bg-white shadow-sm">
          <div className="border-b border-grafite/10 px-4 py-3">
            <p className="font-fraunces text-base font-medium text-grafite">Insumos em estoque</p>
            <p className="text-xs text-grafite/55">Clique para ver o lote e a inteligência de uso</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-grafite/10 bg-porcelana/70 text-[11px] font-bold uppercase tracking-wider text-grafite/60">
                <tr>
                  <th className="py-2.5 pl-4 pr-2">Insumo</th>
                  <th className="px-2 py-2.5">Lote / Validade</th>
                  <th className="px-2 py-2.5">Saldo</th>
                  <th className="py-2.5 pl-2 pr-4 text-right">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grafite/5">
                {INSUMOS.map((insumo) => {
                  const ativa = insumo.id === insumoSelecionado;
                  return (
                    <tr
                      key={insumo.id}
                      onClick={() => setInsumoSelecionado(insumo.id)}
                      className={`cursor-pointer transition-colors ${
                        ativa ? "bg-eucalipto/5" : "hover:bg-porcelana/50"
                      }`}
                    >
                      <td className="py-3 pl-4 pr-2">
                        <p className="font-semibold text-grafite">{insumo.nome}</p>
                        <p className="text-[11px] text-grafite/50">{insumo.categoria}</p>
                      </td>
                      <td className="px-2 py-3">
                        <span className="font-mono text-[11px] font-medium text-grafite/80">{insumo.lote}</span>
                        <p className="text-[11px] text-grafite/50">{insumo.validade}</p>
                      </td>
                      <td className="px-2 py-3 font-semibold text-grafite">
                        {insumo.saldo}
                      </td>
                      <td className="py-3 pl-2 pr-4 text-right">
                        {insumo.status === "fefo" && (
                          <span className="inline-block rounded-full bg-argila/15 px-2.5 py-0.5 text-[11px] font-semibold text-argila">
                            FEFO: prioridade
                          </span>
                        )}
                        {insumo.status === "alerta" && (
                          <span className="inline-block rounded-full bg-[#f39c12]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#b7950b]">
                            Repor estoque
                          </span>
                        )}
                        {insumo.status === "normal" && (
                          <span className="inline-block rounded-full bg-[#27ae60]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#27ae60]">
                            Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detalhe inteligente do item selecionado */}
        <div className="flex flex-col justify-between rounded-2xl border border-grafite/10 bg-white p-5 shadow-sm">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-argila">
                  Rastreabilidade e Regra FEFO
                </span>
                <h4 className="font-fraunces text-lg font-medium text-grafite leading-tight mt-0.5">
                  {selecionado.nome}
                </h4>
              </div>
              <span className="rounded-full border border-eucalipto/20 bg-eucalipto/5 px-2.5 py-0.5 text-[11px] font-bold text-eucalipto">
                {selecionado.custo}
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-grafite/10 bg-porcelana/70 p-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-grafite/60">Lote ativo:</span>
                <span className="font-mono font-semibold text-grafite">{selecionado.lote}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-grafite/60">Vencimento:</span>
                <span className="font-semibold text-grafite">{selecionado.validade} ({selecionado.diasValidade} dias)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-grafite/60">Saldo disponível:</span>
                <span className="font-semibold text-eucalipto">{selecionado.saldo}</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-argila/20 bg-[#fbf6f3] p-3 text-xs leading-relaxed text-grafite/80">
              <p className="flex items-start gap-1.5 font-medium text-argila">
                <LuSparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Como o Morph Clínica protege sua clínica:
              </p>
              <p className="mt-1.5 text-[11px] text-grafite/70">
                Ao registrar um procedimento no prontuário da paciente, o sistema dá baixa prioritária no lote que vence mais cedo. Nunca mais deixe um produto caro vencer por esquecimento no fundo do armário.
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-grafite/10 pt-4 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 text-grafite/60">
              <LuInfo className="h-3.5 w-3.5 text-eucalipto" /> Histórico permanente e sem deleção
            </span>
            <span className="font-semibold text-eucalipto">Padrão Anvisa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
