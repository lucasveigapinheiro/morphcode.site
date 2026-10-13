import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/MotionProvider";
import Spotlight from "@/components/Spotlight";
import ScrollProgress from "@/components/ScrollProgress";
import ConversionTracking from "@/components/ConversionTracking";
import { Analytics } from "@vercel/analytics/next";
import { siteUrl } from "@/lib/site";
import { PHONE } from "@/lib/whatsapp";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const title = "Seu negócio no Google, os clientes no seu WhatsApp | Morph Code";
const description =
  "Site sob medida para o seu negócio aparecer no Google e receber pedidos de orçamento pelo WhatsApp. No ar em cerca de 7 dias, falando direto com quem faz.";

// Dados da empresa para o Google (resultado com nome, telefone e e-mail).
const empresa = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Morph Code",
  description,
  url: siteUrl,
  image: `${siteUrl}/logo.jpeg`,
  telephone: `+${PHONE}`,
  email: "morphcode.dev@gmail.com",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Morph Code",
    locale: "pt_BR",
    type: "website",
  },
  icons: {
    icon: "/logo.jpeg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
        >
          Ir para o conteúdo
        </a>
        <ScrollProgress />
        <Spotlight />
        <MotionProvider>{children}</MotionProvider>
        <ConversionTracking />
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(empresa) }} />
      </body>
    </html>
  );
}
