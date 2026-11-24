"use client";

import { useCallback, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import Image from "next/image";
import MorphLogo from "@/components/MorphLogo";
import { PRECO_TEXTO, TOTAL_LEADS } from "@/lib/gerador";
import s from "./links.module.css";

type Id = "leads" | "clinica" | "code";

const UTM = "utm_source=instagram&utm_medium=bio";

const PRODUTOS: {
  id: Id;
  nome: [string, string];
  linha: string;
  detalhe: string;
  href: string;
  cor: string;
}[] = [
  {
    id: "leads",
    nome: ["Morph", "Leads"],
    linha: `${TOTAL_LEADS} clientes locais do seu nicho numa planilha, prontos pra chamar no WhatsApp.`,
    detalhe: `R$ ${PRECO_TEXTO} · pagamento único`,
    href: `/gerador?${UTM}`,
    cor: "#D4F03C",
  },
  {
    id: "clinica",
    nome: ["Morph", "Clínica"],
    linha: "Ficha assinada no celular da paciente, agenda, estoque e financeiro da sua clínica.",
    detalhe: "Sistema para clínicas de estética",
    href: `/clinicas?${UTM}`,
    cor: "#F3C64F",
  },
  {
    id: "code",
    nome: ["Morph", "Code"],
    linha: "Sites e sistemas sob medida para o seu negócio aparecer e vender.",
    detalhe: "Criação de sites e sistemas web",
    href: `/?${UTM}`,
    cor: "#D4A94A",
  },
];

/** Planilha se montando linha por linha, como o Morph Leads entrega. */
function PreviaLeads() {
  const linhas = [
    ["Alta", 74, "Penha"],
    ["Alta", 58, "Mooca"],
    ["Alta", 66, "Tatuapé"],
    ["Média", 52, "Santana"],
  ] as const;
  return (
    <div className={s.planilha} aria-hidden="true">
      <div className={s.planilhaTopo}>
        <span className={s.xl}>X</span>
        leads-seu-nicho.xlsx
        <span className={s.contador}>{TOTAL_LEADS}/{TOTAL_LEADS}</span>
      </div>
      {linhas.map(([pri, largura, regiao], i) => (
        <div key={i} className={s.linha} style={{ "--i": i } as CSSProperties}>
          <span className={pri === "Alta" ? s.priAlta : s.priMedia}>{pri}</span>
          <span className={s.barra} style={{ width: `${largura}%` }} />
          <span className={s.regiao}>{regiao}</span>
          <span className={s.wa}>WhatsApp</span>
        </div>
      ))}
    </div>
  );
}

/** Painel de gestão da clínica: agenda do dia, assinatura e caixa do mês. */
function PreviaClinica() {
  const agenda = [
    ["09:00", "Limpeza de pele", 62],
    ["10:30", "Toxina botulínica", 74],
    ["14:00", "Peeling", 50],
  ] as const;
  const barras = [38, 54, 46, 70, 62, 84, 76];
  return (
    <div className={s.clinica} aria-hidden="true">
      <div className={s.clinicaAgenda}>
        <span className={s.clinicaRotulo}>Agenda de hoje</span>
        {agenda.map(([hora, proc, largura], i) => (
          <div key={hora} className={s.consulta} style={{ "--i": i } as CSSProperties}>
            <span className={s.hora}>{hora}</span>
            <span className={s.proc}>{proc}</span>
            <span className={s.consultaBarra} style={{ width: `${largura}%` }} />
          </div>
        ))}
      </div>
      <div className={s.clinicaLado}>
        <div className={s.ficha}>
          <span className={s.clinicaRotulo}>Ficha assinada</span>
          <svg viewBox="0 0 120 40" className={s.assinatura}>
            <path d="M4 30 C 14 6, 22 34, 32 18 S 48 8, 54 24 S 70 34, 78 14 S 96 10, 116 22" pathLength={1} />
          </svg>
        </div>
        <div className={s.caixa}>
          <span className={s.clinicaRotulo}>Financeiro</span>
          <div className={s.barras}>
            {barras.map((h, i) => (
              <span key={i} style={{ height: `${h}%`, "--i": i } as CSSProperties} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LinksBio() {
  const [ativo, setAtivoState] = useState<Id | null>(null);
  const [vezes, setVezes] = useState(0); // remonta o logo para repetir a entrada
  const atual = useRef<Id | null>(null);

  const setAtivo = useCallback((id: Id | null) => {
    if (id === "code" && atual.current !== "code") setVezes((v) => v + 1);
    atual.current = id;
    setAtivoState(id);
  }, []);

  // No celular não existe hover: as três prévias ficam acesas juntas, cada uma na sua faixa.
  const semHover = useSyncExternalStore(
    (avisar) => {
      const mq = window.matchMedia("(hover: none)");
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => window.matchMedia("(hover: none)").matches,
    () => false,
  );

  const cor = PRODUTOS.find((p) => p.id === ativo)?.cor ?? "#2A2A30";

  return (
    <main className={s.pagina} style={{ "--cor": cor } as CSSProperties} data-ativo={semHover ? "todos" : (ativo ?? "nenhum")}>
      <div className={s.aura} aria-hidden="true" />
      <div className={s.coluna}>
        <header className={s.topo}>
          <Image src="/logo.jpeg" alt="" width={56} height={56} className={s.avatar} priority />
          <p className={s.arroba}>@morphcode.br</p>
          <h1 className={s.titulo}>Escolha por onde começar.</h1>
        </header>

        <nav aria-label="Produtos da Morph Code" className={s.lista}>
          {PRODUTOS.map((p) => (
            <a
              key={p.id}
              href={p.href}
              className={s.cartao}
              data-produto={p.id}
              data-on={semHover || ativo === p.id}
              style={{ "--acento": p.cor } as CSSProperties}
              onPointerEnter={(e) => e.pointerType === "mouse" && setAtivo(p.id)}
              onPointerLeave={(e) => e.pointerType === "mouse" && setAtivo(null)}
              onFocus={() => setAtivo(p.id)}
              onBlur={() => setAtivo(null)}
            >
              <div className={s.previa}>
                {p.id === "leads" && <PreviaLeads />}
                {p.id === "clinica" && <PreviaClinica />}
                {p.id === "code" && (
                  <div className={s.logoPrevia} aria-hidden="true">
                    <MorphLogo key={vezes} glow className={s.logoGrande} label="" />
                  </div>
                )}
              </div>
              <div className={s.texto}>
                <span className={s.nome} translate="no">
                  {p.nome[0]}
                  <em>{p.nome[1]}</em>
                </span>
                <span className={s.linhaTexto}>{p.linha}</span>
                <span className={s.detalhe}>{p.detalhe}</span>
              </div>
              <span className={s.seta} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          ))}
        </nav>

        <p className={s.rodape}>morphcode.com.br</p>
      </div>
    </main>
  );
}
