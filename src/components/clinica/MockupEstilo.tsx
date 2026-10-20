"use client";

import { useState } from "react";
import { LuPalette, LuSparkles, LuCheck, LuSlidersHorizontal, LuSmartphone, LuLaptop } from "react-icons/lu";

type TemaOpcao = {
  id: string;
  nome: string;
  descricao: string;
  primaria: string;
  destaque: string;
  fundo: string;
  texto: string;
  selo: string;
};

const TEMAS: TemaOpcao[] = [
  {
    id: "eucalipto",
    nome: "Eucalipto & Terracota (Original)",
    descricao: "Tons botânicos e calmos inspirados em boticas tradicionais e spas premium.",
    primaria: "#2F5A52",
    destaque: "#C98E73",
    fundo: "#F2F5F3",
    texto: "#1E2B28",
    selo: "MC",
  },
  {
    id: "rosenude",
    nome: "Rosa Nude & Argila",
    descricao: "Suavidade acolhedora, ideal para harmonização facial e estética avançada.",
    primaria: "#7D4E57",
    destaque: "#D49B89",
    fundo: "#FAF6F5",
    texto: "#2B1E22",
    selo: "SB",
  },
  {
    id: "champagne",
    nome: "Areia & Bronze Nobre",
    descricao: "Minimalismo elegante e sofisticado para clínicas dermatológicas de alto padrão.",
    primaria: "#3A3D40",
    destaque: "#BFA07A",
    fundo: "#F7F6F2",
    texto: "#1A1B1C",
    selo: "DR",
  },
];

export default function MockupEstilo() {
  const [temaAtivo, setTemaAtivo] = useState<TemaOpcao>(TEMAS[0]);

  return (
    <div className="w-full overflow-hidden rounded-[2.5rem] border border-grafite/15 bg-white p-6 shadow-2xl shadow-eucalipto/10 md:p-10">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1.3fr]">
        {/* Lado esquerdo: Explicação da Direção Visual */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-argila/30 bg-argila/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-argila">
            <LuPalette className="h-3.5 w-3.5" /> O Novo Estilo Visual
          </span>
          <h3 className="mt-4 font-fraunces text-3xl md:text-4xl leading-tight text-grafite">
            Caderno de bem-estar: sofisticação e calma desde o primeiro olhar.
          </h3>
          <p className="mt-4 text-[15px] leading-relaxed text-grafite/70">
            Diferente dos sistemas hospitalares cinzentos ou dos softwares genéricos cheios de gradientes pesados, o Morph Clínica foi desenhado com o conceito de um caderno de botica de luxo: tipografia editorial com serifa delicada, botões em pílula, linhas finas e o selo monograma da clínica.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-3 text-sm text-grafite/80">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-eucalipto text-white">
                <LuCheck className="h-3 w-3" />
              </span>
              <span><strong>Tipografia Fraunces + Manrope:</strong> harmonia perfeita entre serifa clássica de títulos e clareza técnica dos dados de saúde.</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-grafite/80">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-eucalipto text-white">
                <LuCheck className="h-3 w-3" />
              </span>
              <span><strong>Selo com iniciais da clínica:</strong> um carimbo refinado que assina o sistema e as fichas no celular da paciente.</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-grafite/80">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-eucalipto text-white">
                <LuCheck className="h-3 w-3" />
              </span>
              <span><strong>Personalização em tempo real:</strong> mude a paleta nas configurações e veja todo o sistema se transformar na hora.</span>
            </div>
          </div>

          {/* Seletores de Paleta Interativos */}
          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-wider text-grafite/50 mb-3">
              Teste as paletas do sistema:
            </p>
            <div className="flex flex-wrap gap-2.5">
              {TEMAS.map((t) => {
                const ativo = t.id === temaAtivo.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemaAtivo(t)}
                    className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      ativo
                        ? "border-grafite bg-grafite text-white shadow-md"
                        : "border-grafite/20 bg-porcelana text-grafite hover:border-grafite/40"
                    }`}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: t.primaria }}
                    />
                    {t.nome.split(" (")[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lado direito: Prévia Dinâmica do Painel com o Tema Selecionado */}
        <div
          className="relative overflow-hidden rounded-3xl border border-grafite/15 p-6 shadow-xl transition-all duration-300 md:p-8"
          style={{ backgroundColor: temaAtivo.fundo, color: temaAtivo.texto }}
        >
          {/* Header simulado do sistema */}
          <div className="flex items-center justify-between border-b pb-5" style={{ borderColor: `${temaAtivo.texto}15` }}>
            <div className="flex items-center gap-3.5">
              {/* Selo Monograma de Botica */}
              <div
                className="grid h-12 w-12 place-items-center rounded-full font-fraunces text-lg italic shadow-inner"
                style={{
                  backgroundColor: `${temaAtivo.primaria}15`,
                  color: temaAtivo.primaria,
                  border: `1.5px solid ${temaAtivo.destaque}`,
                  boxShadow: `inset 0 0 0 2px white, inset 0 0 0 3px ${temaAtivo.destaque}60`,
                }}
              >
                {temaAtivo.selo}
              </div>
              <div>
                <span className="font-fraunces text-xl font-medium tracking-tight">Studio Bella Estética</span>
                <p className="text-xs opacity-65">Painel clínico · Caderno de bem-estar</p>
              </div>
            </div>

            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: `${temaAtivo.primaria}18`, color: temaAtivo.primaria }}
            >
              Exemplo ao vivo
            </span>
          </div>

          {/* Cards do Painel Simulado */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-3.5 shadow-sm border" style={{ borderColor: `${temaAtivo.texto}10` }}>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Atendimentos hoje</span>
              <p className="font-fraunces text-2xl font-semibold mt-0.5">5 pacientes</p>
              <span className="text-[11px] font-medium" style={{ color: temaAtivo.primaria }}>
                Próximo às 14:30
              </span>
            </div>

            <div className="rounded-2xl bg-white p-3.5 shadow-sm border" style={{ borderColor: `${temaAtivo.texto}10` }}>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Estoque FEFO</span>
              <p className="font-fraunces text-2xl font-semibold mt-0.5">100% em dia</p>
              <span className="text-[11px] font-medium" style={{ color: temaAtivo.destaque }}>
                0 ampolas vencidas
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl bg-white p-3.5 shadow-sm border" style={{ borderColor: `${temaAtivo.texto}10` }}>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Financeiro líquido</span>
              <p className="font-fraunces text-2xl font-semibold mt-0.5">R$ 13.330</p>
              <span className="text-[11px] font-medium opacity-70">
                Taxas descontadas
              </span>
            </div>
          </div>

          {/* Mini prévia de ação e botão no padrão de tema */}
          <div className="mt-5 rounded-2xl bg-white/90 p-4 border" style={{ borderColor: `${temaAtivo.texto}10` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-xs">Ficha assinada via celular</p>
                <p className="text-[11px] opacity-65">A paciente visualiza a mesma identidade visual no smartphone.</p>
              </div>
              <button
                type="button"
                className="rounded-full px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
                style={{ backgroundColor: temaAtivo.primaria }}
              >
                Abrir ficha
              </button>
            </div>
          </div>

          {/* Descrição do tema ativo */}
          <div className="mt-5 flex items-center justify-between text-xs opacity-75 pt-3 border-t" style={{ borderColor: `${temaAtivo.texto}15` }}>
            <span>{temaAtivo.descricao}</span>
            <span className="font-mono text-[11px]">{temaAtivo.primaria}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
