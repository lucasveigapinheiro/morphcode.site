export const PHONE = "5511912150103";

/** Número usado nas páginas e anúncios do Morph Clínica. */
export const PHONE_CLINICA = "5511912150103";
export const PHONE_CLINICA_TEXTO = "(11) 91215-0103";

/** Endereço final no WhatsApp, já com a mensagem. */
export function whatsappDireto(message: string, phone: string = PHONE) {
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}

// Os botões passam por /whatsapp antes de abrir a conversa: é a página que o Google Ads
// usa para contar o pedido de orçamento como conversão.
// `numero: "clinica"` escolhe o número do Morph Clínica; só esse valor é aceito na URL.
export function whatsappLink(message: string, numero?: "clinica") {
  const extra = numero ? `&numero=${numero}` : "";
  return `/whatsapp?texto=${encodeURIComponent(message)}${extra}`;
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

export const ofertaMessage = `Olá, Morph Code! Vi a oferta de fim de ano do Morph Clínica (50% na implantação) e quero aproveitar.`;

export const ofertaLicencaMessage = `Olá, Morph Code! Vi a oferta de fim de ano da licença vitalícia do Morph Clínica por R$ 2.000 e quero aproveitar.`;
