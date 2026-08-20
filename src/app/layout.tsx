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

export const metadata: Metadata = {
  title: "Morph Code — Sites e sistemas sob medida para o seu negócio",
  description:
    "Desenvolvemos sites, sistemas e automações que transformam ideias em resultado real. Design e desenvolvimento sob medida para o seu negócio.",
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
