import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/MotionProvider";
import Spotlight from "@/components/Spotlight";
import ScrollProgress from "@/components/ScrollProgress";
import ConversionTracking from "@/components/ConversionTracking";
import MetaPixel from "@/components/MetaPixel";
import { Analytics } from "@vercel/analytics/next";
import { jsonLd, siteUrl } from "@/lib/site";
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

const title = "Criação de Sites em São Bernardo do Campo | Morph Code";
const description =
  "Criação de sites sob medida para o seu negócio aparecer no Google e receber orçamentos pelo WhatsApp. No ar em cerca de 7 dias. Atendemos todo o Brasil.";

// Dados da empresa para o Google e para assistentes de IA: quem é, o que faz, onde atende e como falar.
const empresa = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#empresa`,
      name: "Morph Code",
      description,
      url: siteUrl,
      logo: `${siteUrl}/logo.jpeg`,
      image: `${siteUrl}/logo.jpeg`,
      telephone: `+${PHONE}`,
      email: "morphcode.dev@gmail.com",
      address: { "@type": "PostalAddress", addressLocality: "São Bernardo do Campo", addressRegion: "SP", addressCountry: "BR" },
      sameAs: ["https://www.instagram.com/morphcode.dev"],
      areaServed: { "@type": "Country", name: "Brasil" },
      priceRange: "$$",
      knowsAbout: ["Criação de sites", "Landing pages", "SEO local", "Sistemas web sob medida", "Integração com WhatsApp"],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: `+${PHONE}`,
        contactType: "sales",
        availableLanguage: "Portuguese",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Serviços",
        itemListElement: [
          "Site institucional sob medida",
          "Landing page para receber orçamentos pelo WhatsApp",
          "SEO local para aparecer no Google",
          "Sistemas web sob medida (agenda, ordens de serviço, painel de gestão)",
          "Morph Clínica, sistema para clínicas de estética",
        ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#site`,
      url: siteUrl,
      name: "Morph Code",
      inLanguage: "pt-BR",
      publisher: { "@id": `${siteUrl}/#empresa` },
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Morph Code",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  twitter: { card: "summary_large_image", title, description },
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
        <MetaPixel />
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(empresa)} />
      </body>
    </html>
  );
}
