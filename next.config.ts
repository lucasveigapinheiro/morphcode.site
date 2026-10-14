import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 75 é o padrão; 90 é usado nas capturas de tela dos projetos, que têm texto pequeno.
    qualities: [75, 90],
  },
  // Um endereço só para o Google: www vai para o domínio sem www.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.morphcode.com.br" }],
        destination: "https://morphcode.com.br/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
