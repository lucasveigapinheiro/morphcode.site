export const PHONE = "5511912150103";

/** Número usado nas páginas e anúncios do Morph Clínica. */
export const PHONE_CLINICA = "5511912150103";
export const PHONE_CLINICA_TEXTO = "(11) 91215-0103";

/**
 * Endereço final no WhatsApp, já com a mensagem. O wa.me abre o aplicativo no celular (inclusive
 * de dentro do navegador do Instagram e do Facebook) e, no computador, oferece o WhatsApp Desktop
 * ou o WhatsApp Web.
 */
export function whatsappDireto(message: string, phone: string = PHONE) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// Abre a conversa direto no WhatsApp, sem passar pela tela intermediária.
// O rastreamento (Meta Pixel, CAPI e Vercel Analytics) dispara no clique pelo ConversionTracking.
export function whatsappLink(message: string, numero?: "clinica") {
  const phone = numero === "clinica" ? PHONE_CLINICA : PHONE;
  return whatsappDireto(message, phone);
}

export const budgetMessage = `Olá, Morph Code! Vim pelo site e gostaria de um orçamento.`;

export function estimateMessage(kind: string) {
  return `Olá, Morph Code! Vim pelo site e gostaria de um orçamento para um ${kind}.`;
}

export const generalMessage = `Olá, Morph Code! Vim pelo site e gostaria de tirar uma dúvida.`;

// Mensagens do Morph Clínica: curtas e no tom de quem está só perguntando, para a pessoa não
// desistir antes de enviar.
export const clinicaMessage = `Oi! Vi o Morph Clínica e quero saber mais.`;

export function planoMessage(plano: string) {
  return `Oi! Vi o Morph Clínica e quero saber do "${plano}".`;
}

export const ofertaMessage = `Oi! Vi o Morph Clínica e quero saber da implantação com 50% OFF.`;

export const ofertaLicencaMessage = `Oi! Vi o Morph Clínica e quero saber da licença vitalícia por R$ 2.000.`;
