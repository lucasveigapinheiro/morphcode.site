import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Morph Code",
    short_name: "Morph Code",
    description: "Sites e sistemas sob medida para o seu negócio aparecer no Google e receber clientes pelo WhatsApp.",
    start_url: "/",
    display: "standalone",
    lang: "pt-BR",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [{ src: "/logo.jpeg", sizes: "1254x1254", type: "image/jpeg" }],
  };
}
