const PHONE = "5511930957162";

export function whatsappLink(message: string) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}

export const budgetMessage = `Olá, Morph Code! 🚀

Quero solicitar um orçamento.

▪️ Nome:
▪️ Tipo de projeto (site / sistema / automação):
▪️ Prazo desejado:
▪️ Breve descrição da ideia:

Aguardo o retorno, obrigado(a)!`;

export const generalMessage = `Olá, Morph Code! Vim pelo site e gostaria de tirar uma dúvida.`;
