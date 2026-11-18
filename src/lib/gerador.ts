// Gerador de planilha de leads: tipos, nichos e validação, compartilhados entre o formulário e as rotas.

export const PRECO_REAIS = 45.99; // hipótese de preço: ajuste conforme a conversão
export const PRECO_TEXTO = PRECO_REAIS.toFixed(2).replace(".", ","); // 45,99
export const TOTAL_LEADS = 50;

export const NICHOS = [
  "Estética automotiva",
  "Clínica de estética",
  "Clínica odontológica",
  "Barbearia",
  "Salão de beleza",
  "Academia",
  "Pet shop",
  "Oficina mecânica",
  "Nutricionista",
  "Fisioterapia",
] as const;

export type Status = "aguardando_pagamento" | "pago" | "gerando" | "pronto" | "falhou";

export type Pedido = {
  id: string;
  nicho: string;
  regiao: string;
  nome: string;
  whatsapp: string;
  email: string;
  /** Mensagem de abordagem opcional; aceita {nome}, {nota}, {avaliacoes} e {regiao}. */
  mensagem?: string;
  status: Status;
  criadoEm: string;
  leads?: number;
  erro?: string;
};

export type EntradaPedido = Pick<Pedido, "nicho" | "regiao" | "nome" | "whatsapp" | "email" | "mensagem">;

export const MAX_MENSAGEM = 300;
export const VARIAVEIS = ["{nome}", "{nota}", "{avaliacoes}", "{regiao}"] as const;

// Remove caracteres de controle (\p{C}) e < >, que não têm uso em nome, região ou mensagem.
const limpa = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[<>]/g, " ").replace(/\p{C}/gu, " ").replace(/\s+/g, " ").trim().slice(0, max) : "";

// Na mensagem, quebras de linha são permitidas.
const limpaMensagem = (v: unknown) =>
  typeof v === "string"
    ? v
        .replace(/[<>]/g, " ")
        .replace(/[^\P{C}\n]/gu, " ")
        .replace(/[ \t]+/g, " ")
        .trim()
        .slice(0, MAX_MENSAGEM)
    : "";

/** Devolve o pedido validado ou a mensagem do primeiro campo inválido. */
export function validarEntrada(bruto: unknown): { ok: true; dados: EntradaPedido } | { ok: false; erro: string } {
  const b = (bruto && typeof bruto === "object" ? bruto : {}) as Record<string, unknown>;
  const nicho = limpa(b.nicho, 60);
  const regiao = limpa(b.regiao, 80);
  const nome = limpa(b.nome, 80);
  const email = limpa(b.email, 120).toLowerCase();
  const whatsapp = limpa(b.whatsapp, 20).replace(/\D/g, "");
  const mensagem = limpaMensagem(b.mensagem);
  if (nicho.length < 3) return { ok: false, erro: "Escolha o nicho." };
  if (regiao.length < 3) return { ok: false, erro: "Informe a cidade ou o bairro." };
  if (nome.length < 2) return { ok: false, erro: "Informe seu nome." };
  const ddd = whatsapp.startsWith("55") ? whatsapp.slice(2) : whatsapp;
  if (ddd.length !== 11 || ddd[2] !== "9") return { ok: false, erro: "Informe o WhatsApp com DDD, 11 dígitos." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, erro: "Informe um e-mail válido." };
  return { ok: true, dados: { nicho, regiao, nome, whatsapp: "55" + ddd, email, ...(mensagem ? { mensagem } : {}) } };
}
