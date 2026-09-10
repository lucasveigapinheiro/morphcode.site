import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import CursorGlow from "@/components/CursorGlow";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
});

const title = "Morph Code — Sites e sistemas sob medida para o seu negócio";
const description =
  "Desenvolvemos sites, sistemas e automações que transformam ideias em resultado real. Design e desenvolvimento sob medida para o seu negócio.";

export const metadata: Metadata = {
  metadataBase: new URL("https://morphcode.site"),
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
      className={`${inter.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <div className="grain" />
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
