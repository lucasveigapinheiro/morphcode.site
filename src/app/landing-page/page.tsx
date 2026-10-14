import PaginaServico, { metadataServico } from "@/components/PaginaServico";
import { servico } from "@/lib/servicos";

const s = servico("landing-page");

export const metadata = metadataServico(s);

export default function Page() {
  return <PaginaServico s={s} />;
}
