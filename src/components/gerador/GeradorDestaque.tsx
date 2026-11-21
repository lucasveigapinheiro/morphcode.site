import Link from "next/link";
import { LuArrowRight, LuCheck } from "react-icons/lu";
import Reveal from "../Reveal";
import Magnetic from "../Magnetic";
import { PRECO_TEXTO, TOTAL_LEADS } from "@/lib/gerador";

const pontos = [
  `${TOTAL_LEADS} negócios do Google Maps na região que você escolher (para quem vende sites, só os que não têm site)`,
  "Nota, avaliações e telefone de cada um, com prioridade por cor",
  "Botão que abre o WhatsApp com a sua mensagem já escrita (opcional)",
  "Funil de vendas e aba Resumo com taxa de fechamento e receita",
];

const COLUNAS = ["Prioridade", "Nome", "WhatsApp", "Nota", "Status"];
const LINHAS: [string, string, number][] = [
  ["Alta", "bg-[#C6EFCE] text-[#0B5A2F]", 62],
  ["Alta", "bg-[#C6EFCE] text-[#0B5A2F]", 48],
  ["Média", "bg-[#FFEB9C] text-[#7A5A00]", 70],
  ["Média", "bg-[#FFEB9C] text-[#7A5A00]", 55],
  ["Baixa", "bg-[#E4E4E4] text-[#444]", 44],
];

// Apresentação do gerador na página inicial, no mesmo papel do ProdutoDestaque (Morph Clínica).
// A planilha aparece clara sobre o fundo escuro: é o mesmo visual da página /gerador.
export default function GeradorDestaque() {
  return (
    <section id="gerador-leads" className="section-border relative overflow-hidden py-24 md:py-32">
      <div className="relative mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Reveal delay={0.1} className="order-2 lg:order-1">
          <div className="overflow-hidden rounded-xl border border-[#111412] bg-white text-[#111412] shadow-[8px_8px_0_0_#D8F24A]">
            <div className="flex items-center justify-between border-b border-[#D3D6CC] bg-[#E9EBE2] px-4 py-2.5 font-mono text-xs">
              <span className="flex items-center gap-2">
                <span aria-hidden className="grid h-4 w-4 place-items-center rounded-[3px] bg-[#107C41] text-[9px] font-semibold text-white">
                  X
                </span>
                leads-estetica-automotiva.xlsx
              </span>
              <span className="text-[#585F57]">{TOTAL_LEADS} leads</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[440px] border-collapse text-left text-xs">
                <thead>
                  <tr>
                    {COLUNAS.map((c) => (
                      <th key={c} scope="col" className="border-l border-white/20 bg-[#107C41] px-4 py-2.5 font-semibold text-white first:border-l-0">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LINHAS.map(([p, cor, l], i) => (
                    <tr key={i} className="border-b border-[#D3D6CC]">
                      <td className="px-4 py-3">
                        <span className={`rounded px-2 py-0.5 font-semibold ${cor}`}>{p}</span>
                      </td>
                      <td className="border-l border-[#D3D6CC] px-4 py-3">
                        <span className="block h-2 rounded-sm bg-[#111412]/15" style={{ width: `${l}%` }} />
                      </td>
                      <td className="border-l border-[#D3D6CC] px-4 py-3 text-[#1A6BFF] underline underline-offset-2">Abrir conversa</td>
                      <td className="border-l border-[#D3D6CC] px-4 py-3">
                        <span className="block h-2 w-8 rounded-sm bg-[#111412]/15" />
                      </td>
                      <td className="border-l border-[#D3D6CC] px-4 py-3 text-[#585F57]">Novo</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-[#D3D6CC] px-4 py-3 text-xs text-[#585F57]">
              Estrutura da planilha: as linhas reais vêm do Google Maps, na hora do pedido.
            </p>
          </div>
        </Reveal>

        <Reveal className="order-1 lg:order-2">
          <p className="mb-4 inline-flex items-center gap-2 rounded-md bg-[#D8F24A] px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#111412]">
            Novo
          </p>
          <h2 className="font-[var(--font-display)] text-3xl leading-tight md:text-5xl">
            Morph Leads: {TOTAL_LEADS} clientes do seu nicho, <span className="gold-gradient-text">numa planilha pronta.</span>
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-muted">
            Você escolhe o nicho e a região, e a gente entrega a lista de negócios, com WhatsApp e funil de vendas. Serve para quem vende
            site, tráfego, sistema ou qualquer outro serviço.
          </p>

          <ul className="mt-7 space-y-3">
            {pontos.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-foreground/90">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#107C41] text-white">
                  <LuCheck className="h-3 w-3" aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <p className="mt-7 text-sm text-muted">
            <span className="font-[var(--font-display)] text-2xl text-foreground">R$ {PRECO_TEXTO}</span> por lista de {TOTAL_LEADS} leads, pagamento
            único
          </p>

          <div className="mt-6">
            <Magnetic strength={0.25}>
              <Link
                href="/gerador"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D8F24A] px-7 py-3.5 text-sm font-bold text-[#111412] transition-[background-color,box-shadow] hover:bg-[#e6ff63] hover:shadow-[0_0_30px_rgba(216,242,74,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8F24A] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Gerar minha planilha <LuArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
