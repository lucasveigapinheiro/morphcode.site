import type { Metadata } from "next";
import { budgetMessage, whatsappDireto } from "@/lib/whatsapp";
import AbrirWhatsapp from "./AbrirWhatsapp";

// Página de passagem: conta a conversão e abre a conversa. Fica fora do Google.
export const metadata: Metadata = {
  title: "Abrindo o WhatsApp | Morph Code",
  robots: { index: false, follow: false },
};

export default async function WhatsappPage({ searchParams }: PageProps<"/whatsapp">) {
  const { texto } = await searchParams;
  // Só a mensagem vem da URL; o número é sempre o da Morph Code.
  const mensagem = typeof texto === "string" && texto.trim() ? texto.slice(0, 500) : budgetMessage;
  return <AbrirWhatsapp href={whatsappDireto(mensagem)} />;
}
