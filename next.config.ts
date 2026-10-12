import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 75 é o padrão; 90 é usado nas capturas de tela dos projetos, que têm texto pequeno.
    qualities: [75, 90],
  },
};

export default nextConfig;
