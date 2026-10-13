// Endereço público do site. Na Vercel vem do domínio de produção; fora dela, do ambiente local.
export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";
