import { redirect } from "next/navigation";
import { budgetMessage, PHONE, PHONE_CLINICA, whatsappDireto } from "@/lib/whatsapp";

export default async function WhatsappPage({ searchParams }: PageProps<"/whatsapp">) {
  const { texto, numero } = await searchParams;
  const mensagem = typeof texto === "string" && texto.trim() ? texto.slice(0, 500) : budgetMessage;
  const phone = numero === "clinica" ? PHONE_CLINICA : PHONE;
  redirect(whatsappDireto(mensagem, phone));
}
