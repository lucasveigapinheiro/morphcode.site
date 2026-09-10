import { FaWhatsapp } from "react-icons/fa";
import { whatsappLink, budgetMessage } from "@/lib/whatsapp";

export default function WhatsAppFloat() {
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 bg-gradient-to-t from-background via-background/80 to-transparent">
      <a
        href={whatsappLink(budgetMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-medium text-background shadow-xl shadow-black/40 active:bg-gold-light transition-colors"
      >
        <FaWhatsapp className="h-5 w-5" aria-hidden />
        Falar no WhatsApp
      </a>
    </div>
  );
}
