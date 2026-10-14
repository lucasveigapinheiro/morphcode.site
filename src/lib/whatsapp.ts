export const PHONE = "5511930957162";

/** Endereço final no WhatsApp, já com a mensagem. */
export function whatsappDireto(message: string) {
  return `https://api.whatsapp.com/send?phone=${PHONE}&text=${encodeURIComponent(message)}`;
}

// Os botões passam por /whatsapp antes de abrir a conversa: é a página que o Google Ads
// usa para contar o pedido de orçamento como conversão.
export function whatsappLink(message: string) {
  return `/whatsapp?texto=${encodeURIComponent(message)}`;
}

export const budgetMessage = `Olá, Morph Code! Vim pelo site e gostaria de um orçamento.`;

export function estimateMessage(kind: string) {
  return `Olá, Morph Code! Vim pelo site e gostaria de um orçamento para um ${kind}.`;
}

export const generalMessage = `Olá, Morph Code! Vim pelo site e gostaria de tirar uma dúvida.`;

export const clinicaMessage = `Olá, Morph Code! Vim pelo site e quero conhecer o Morph Clínica, o sistema para clínicas de estética.`;

export function planoMessage(plano: string) {
  return `Olá, Morph Code! Vim pelo site e tenho interesse na opção "${plano}" do Morph Clínica.`;
}
