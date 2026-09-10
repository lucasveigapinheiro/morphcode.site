import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Morph Code — Sites e sistemas sob medida para o seu negócio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/logo.jpeg"));
  const logoSrc = `data:image/jpeg;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "radial-gradient(circle at 85% 10%, rgba(212,169,74,0.35) 0%, #0a0a0a 55%)",
          backgroundColor: "#0a0a0a",
          color: "#f5f4f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={96} height={96} style={{ borderRadius: 999 }} alt="" />
          <div style={{ display: "flex", fontSize: 44, letterSpacing: 2 }}>
            MORPH<span style={{ color: "#d4a94a" }}>.CODE</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 68, lineHeight: 1.1, maxWidth: 980 }}>
            Sites e sistemas sob medida para o seu negócio
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#a3a09c" }}>
            Design, desenvolvimento e automação com alta performance.
          </div>
        </div>

        <div style={{ display: "flex", height: 6, width: 160, background: "#d4a94a", borderRadius: 999 }} />
      </div>
    ),
    { ...size }
  );
}
