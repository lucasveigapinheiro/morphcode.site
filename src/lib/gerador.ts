// Gerador de planilha de leads: tipos, nichos e validação, compartilhados entre o formulário e as rotas.

export const PRECO_REAIS = 45.99; // hipótese de preço: ajuste conforme a conversão
export const PRECO_TEXTO = PRECO_REAIS.toFixed(2).replace(".", ","); // 45,99
export const TOTAL_LEADS = 50;
export const MSG_FORA_DO_AR = "Estamos fora do ar por alguns minutos. Tente de novo daqui a pouco.";
export const msgFilaCheia = (minutos: number) =>
  `Todas as vagas estão ocupadas agora. Só aceitamos pagamento quando dá para gerar na hora. Tente de novo em cerca de ${Math.max(1, Math.ceil(minutos))} min.`;

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

/** Opções do campo "O que você vende?". Só quem vende site recebe a lista filtrada por negócios sem site. */
export const SERVICOS = ["Criação de sites", "Tráfego pago e anúncios", "Gestão de redes sociais", "Sistemas e software"] as const;
export const SERVICO_OUTRO = "Outro";
const VENDE_SITE = /\b(sites?|landing|loja virtual|e-?commerce)\b/i;

export type Pedido = {
  id: string;
  nicho: string;
  regiao: string;
  /** Cidade e bairro separados: o robô usa para manter os leads na região pedida. Pedidos antigos não têm. */
  cidade?: string;
  bairro?: string;
  /** O que o cliente vende; define se a lista é filtrada por negócios sem site. */
  servico?: string;
  semSite?: boolean;
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

export type EntradaPedido = Pick<Pedido, "nicho" | "regiao" | "cidade" | "bairro" | "servico" | "semSite" | "nome" | "whatsapp" | "email" | "mensagem">;

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
  const cidade = limpa(b.cidade, 50);
  const bairro = limpa(b.bairro, 50);
  const regiao = limpa(b.regiao, 80) || [bairro, cidade].filter(Boolean).join(" ");
  const servico = limpa(b.servico, 60);
  const nome = limpa(b.nome, 80);
  const email = limpa(b.email, 120).toLowerCase();
  const whatsapp = limpa(b.whatsapp, 20).replace(/\D/g, "");
  const mensagem = limpaMensagem(b.mensagem);
  if (nicho.length < 3) return { ok: false, erro: "Escolha o nicho." };
  if (regiao.length < 3) return { ok: false, erro: "Informe a cidade ou o bairro." };
  if (cidade.length < 3) return { ok: false, erro: "Informe a cidade." };
  if (servico.length < 3) return { ok: false, erro: "Diga o que você vende." };
  if (nome.length < 2) return { ok: false, erro: "Informe seu nome." };
  const ddd = whatsapp.startsWith("55") ? whatsapp.slice(2) : whatsapp;
  if (ddd.length !== 11 || ddd[2] !== "9") return { ok: false, erro: "Informe o WhatsApp com DDD, 11 dígitos." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, erro: "Informe um e-mail válido." };
  const semSite = VENDE_SITE.test(servico);
  return {
    ok: true,
    dados: { nicho, regiao, cidade, ...(bairro ? { bairro } : {}), servico, semSite, nome, whatsapp: "55" + ddd, email, ...(mensagem ? { mensagem } : {}) },
  };
}
