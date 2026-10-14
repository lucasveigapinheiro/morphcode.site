import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { servicos } from "@/lib/servicos";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    ...servicos.map((s) => ({ url: `${siteUrl}/${s.slug}`, lastModified, changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: `${siteUrl}/clinicas`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}
