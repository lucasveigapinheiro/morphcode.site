import PaginaServico, { metadataServico } from "@/components/PaginaServico";
import { servico } from "@/lib/servicos";

const s = servico("criacao-de-sites");

export const metadata = metadataServico(s);

export default function Page() {
  return <PaginaServico s={s} />;
}
