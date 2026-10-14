import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Robôs de busca e de IA liberados de propósito: o site quer ser citado em respostas do ChatGPT,
// Claude, Perplexity e Gemini, não só no Google. Previews não entram no índice.
const robosDeIa = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended"];

export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }, ...robosDeIa.map((userAgent) => ({ userAgent, allow: "/" }))],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
