// Alerta no WhatsApp do dono quando entra pedido pago ou um pedido falha.
// Usa o CallMeBot (serviço gratuito de terceiros). Variáveis na Vercel:
//   ALERTA_WHATSAPP_FONE    número com país e DDD, ex.: +5511999999999
//   ALERTA_WHATSAPP_APIKEY  chave que o CallMeBot manda quando você autoriza o seu número
// Sem as duas, não faz nada. O texto leva só nicho e região: nada de nome, e-mail ou telefone do cliente.

export async function alertar(texto: string) {
  const fone = process.env.ALERTA_WHATSAPP_FONE;
  const chave = process.env.ALERTA_WHATSAPP_APIKEY;
  if (!fone || !chave) return;
  try {
    const url = new URL("https://api.callmebot.com/whatsapp.php");
    url.search = new URLSearchParams({ phone: fone, text: texto.slice(0, 400), apikey: chave }).toString();
    const r = await fetch(url, { signal: AbortSignal.timeout(5000), cache: "no-store" });
    if (!r.ok) console.error("[gerador] alerta WhatsApp recusado", r.status);
  } catch (e) {
    console.error("[gerador] alerta WhatsApp falhou", e); // o alerta nunca derruba o fluxo do pedido
  }
}
