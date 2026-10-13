import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/MotionProvider";
import Spotlight from "@/components/Spotlight";
import ScrollProgress from "@/components/ScrollProgress";

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

const title = "Site profissional no ar em cerca de 7 dias | Morph Code";
const description =
  "Site profissional para o seu negócio aparecer no Google e receber orçamentos pelo WhatsApp. Pronto em 7 dias, em média.";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  // Vercel sets this to the production domain (custom domain once one is added).
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"
  ),
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
      </body>
    </html>
  );
}
