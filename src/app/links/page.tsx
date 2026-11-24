import type { Metadata } from "next";
import LinksBio from "@/components/links/LinksBio";

// Página do link da bio do Instagram. Fica fora do Google e do menu do site:
// só chega aqui quem toca no link do perfil @morphcode.br.
export const metadata: Metadata = {
  title: "Morph Code | Links",
  description: "Morph Leads, Morph Clínica e Morph Code: escolha por onde começar.",
  alternates: { canonical: "/links" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LinksBio />;
}
