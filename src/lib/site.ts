// Endereço público do site. Em produção é sempre o domínio próprio, para o Google não indexar
// o endereço da Vercel; em previews e localmente, o endereço daquele ambiente.
export const PRODUCTION_URL = "https://morphcode.com.br";

export const siteUrl =
  process.env.VERCEL_ENV === "production"
    ? PRODUCTION_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

/** JSON para <script type="application/ld+json">, sem deixar "<" fechar a tag. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
