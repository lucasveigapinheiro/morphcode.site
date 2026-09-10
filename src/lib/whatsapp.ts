const PHONE = "5511930957162";

export function whatsappLink(message: string) {
  return `https://api.whatsapp.com/send?phone=${PHONE}&text=${encodeURIComponent(message)}`;
}

export const budgetMessage = `Olá, Morph Code! 🚀

Quero solicitar um orçamento.

▪️ Nome:
▪️ Tipo de projeto (site / sistema):
▪️ Prazo desejado:
▪️ Breve descrição da ideia:

Aguardo o retorno, obrigado(a)!`;

export function estimateMessage(kind: string) {
  return `Olá, Morph Code! 🚀

Vim pelo site e quero um orçamento para um ${kind}.

▪️ Nome:
▪️ Prazo desejado:
▪️ Breve descrição da ideia:

Aguardo o retorno, obrigado(a)!`;
}

export const generalMessage = `Olá, Morph Code! Vim pelo site e gostaria de tirar uma dúvida.`;
