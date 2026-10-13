"use client";

import { useEffect, useRef } from "react";

const R = 260; // raio da lente que revela a grade
const G = 300; // raio da luz difusa
const PASSO = 56; // mesmo tamanho da .hud-grid, para as linhas coincidirem

/**
 * Lente que segue o mouse dentro da seção: revela a grade de construção por baixo e arrasta
 * uma luz dourada que se estica com a velocidade, como líquido. Fica atrás do conteúdo, então
 * o vidro dos cartões desfoca essa luz e a revelação por rolagem não é afetada. Só existe com
 * mouse e sem "reduzir movimento".
 */
export default function CursorLens({ grid = 0.16, className = "" }: { grid?: number; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const linhas = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = box.current?.parentElement;
    const ln = lens.current;
    const gl = glow.current;
    const li = linhas.current;
    if (!host || !ln || !gl || !li) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;

    let cx = 0; // posição do mouse na janela
    let cy = 0;
    let tx = 0; // alvo dentro da seção
    let ty = 0;
    let lx = 0; // lente: segue rápido
    let ly = 0;
    let gx = 0; // luz: segue devagar, e o atraso vira o "estique"
    let gy = 0;
    let a = 0;
    let ta = 0;
    let raf = 0;

    const alvo = () => {
      const r = host.getBoundingClientRect();
      tx = cx - r.left;
      ty = cy - r.top;
    };

    const frame = () => {
      lx += (tx - lx) * 0.2;
      ly += (ty - ly) * 0.2;
      gx += (tx - gx) * 0.07;
      gy += (ty - gy) * 0.07;
      a += (ta - a) * 0.08;

      const vx = tx - gx;
      const vy = ty - gy;
      const atraso = Math.hypot(vx, vy);
      const s = Math.min(atraso / 320, 0.35);

      ln.style.transform = `translate3d(${lx - R}px, ${ly - R}px, 0)`;
      // A grade anda ao contrário dentro da lente (só transform), então fica parada na seção.
      const mx = (((lx - R) % PASSO) + PASSO) % PASSO;
      const my = (((ly - R) % PASSO) + PASSO) % PASSO;
      li.style.transform = `translate3d(${-mx}px, ${-my}px, 0)`;
      ln.style.opacity = a.toFixed(3);
      gl.style.transform = `translate3d(${gx - G}px, ${gy - G}px, 0) rotate(${Math.atan2(vy, vx)}rad) scale(${1 + s}, ${1 - s * 0.45})`;
      gl.style.opacity = a.toFixed(3);

      const parado = Math.abs(tx - lx) < 0.3 && Math.abs(ty - ly) < 0.3 && atraso < 0.3 && Math.abs(ta - a) < 0.004;
      raf = parado ? 0 : requestAnimationFrame(frame);
    };
    const animar = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cx = e.clientX;
      cy = e.clientY;
      alvo();
      // Entrando de novo depois de sumir: nasce onde o mouse está, sem atravessar a tela.
      if (a < 0.02) {
        lx = gx = tx;
        ly = gy = ty;
      }
      ta = 1;
      animar();
    };
    const onLeave = () => {
      ta = 0;
      animar();
    };
    // Rolando com o mouse parado, a seção anda e a lente precisa acompanhar.
    const onScroll = () => {
      if (!ta) return;
      alvo();
      animar();
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const linha = `rgba(232, 200, 118, ${grid})`;
  const mascara = "radial-gradient(circle closest-side, #000 10%, rgba(0, 0, 0, 0.45) 55%, transparent)";

  return (
    <div ref={box} aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        ref={glow}
        className="absolute left-0 top-0 rounded-full opacity-0 will-change-transform"
        style={{
          width: G * 2,
          height: G * 2,
          background: "radial-gradient(circle closest-side, rgba(212, 169, 74, 0.14), rgba(212, 169, 74, 0.05) 45%, transparent)",
        }}
      />
      <div
        ref={lens}
        className="absolute left-0 top-0 overflow-hidden opacity-0 will-change-transform"
        style={{ width: R * 2, height: R * 2, maskImage: mascara, WebkitMaskImage: mascara }}
      >
        <div
          ref={linhas}
          className="absolute left-0 top-0 will-change-transform"
          style={{
            width: R * 2 + PASSO,
            height: R * 2 + PASSO,
            backgroundImage: `linear-gradient(${linha} 1px, transparent 1px), linear-gradient(90deg, ${linha} 1px, transparent 1px)`,
            backgroundSize: `${PASSO}px ${PASSO}px`,
          }}
        />
      </div>
    </div>
  );
}
