import type { Metadata } from "next";
import { budgetMessage, PHONE, PHONE_CLINICA, whatsappDireto } from "@/lib/whatsapp";
import AbrirWhatsapp from "./AbrirWhatsapp";

// Página de passagem: conta a conversão e abre a conversa. Fica fora do Google.
export const metadata: Metadata = {
  title: "Abrindo o WhatsApp | Morph Code",
  robots: { index: false, follow: false },
};

export default async function WhatsappPage({ searchParams }: PageProps<"/whatsapp">) {
  const { texto, numero } = await searchParams;
  // Da URL vem só a mensagem e a escolha entre dois números fixos; nunca um número livre.
  const mensagem = typeof texto === "string" && texto.trim() ? texto.slice(0, 500) : budgetMessage;
  const phone = numero === "clinica" ? PHONE_CLINICA : PHONE;
  return <AbrirWhatsapp href={whatsappDireto(mensagem, phone)} />;
}
