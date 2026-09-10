const PHONE = "5511930957162";

export function whatsappLink(message: string) {
  return `https://api.whatsapp.com/send?phone=${PHONE}&text=${encodeURIComponent(message)}`;
}

export const budgetMessage = `Olá, Morph Code! Vim pelo site e gostaria de um orçamento.`;

export function estimateMessage(kind: string) {
  return `Olá, Morph Code! Vim pelo site e gostaria de um orçamento para um ${kind}.`;
}

export const generalMessage = `Olá, Morph Code! Vim pelo site e gostaria de tirar uma dúvida.`;
