"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Moldura animada da imagem do hero. Só usa transform e opacidade:
 * entrada em perspectiva, brilho que varre a tela uma vez, flutuação leve e inclinação 3D
 * que segue o mouse (só com mouse). Com "reduzir movimento" tudo fica parado.
 * Nada começa invisível, então a imagem não atrasa o LCP.
 */
export default function TelaHero({ children }: { children: ReactNode }) {
  const raiz = useRef<HTMLDivElement>(null);
  const cartao = useRef<HTMLDivElement>(null);
  const brilho = useRef<HTMLSpanElement>(null);
  const halo = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = raiz.current;
      const card = cartao.current;
      if (!el || !card) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Entrada: sobe de uma perspectiva inclinada até ficar de frente.
        gsap.set(card, { transformPerspective: 1100, transformOrigin: "50% 60%" });
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(card, { y: 56, rotationX: 14, scale: 0.94, duration: 1.15 })
          .from(halo.current, { scale: 0.7, opacity: 0, duration: 1.4 }, 0)
          .fromTo(
            brilho.current,
            { xPercent: -130, opacity: 0.9 },
            { xPercent: 130, opacity: 0, duration: 1.3, ease: "power2.inOut" },
            0.55,
          );

        // Depois da entrada, a imagem flutua devagar.
        const flutua = gsap.to(card, {
          y: -8,
          duration: 3.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.2,
        });

        // Inclinação 3D com o mouse. quickTo reaproveita o mesmo tween a cada movimento.
        const comMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        if (!comMouse) return () => { tl.kill(); flutua.kill(); };

        const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3" });
        const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3" });
        const gx = gsap.quickTo(halo.current, "x", { duration: 0.9, ease: "power3" });
        const gy = gsap.quickTo(halo.current, "y", { duration: 0.9, ease: "power3" });

        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          ry(nx * 9);
          rx(-ny * 7);
          gx(nx * 36);
          gy(ny * 28);
        };
        const onLeave = () => {
          rx(0);
          ry(0);
          gx(0);
          gy(0);
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          tl.kill();
          flutua.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: raiz },
  );

  return (
    <div ref={raiz} className="relative">
      <span
        ref={halo}
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_50%_40%,rgba(243,198,79,0.32),transparent_68%)] will-change-transform"
      />
      <div ref={cartao} className="relative will-change-transform">
        {children}
        <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.5rem] sm:rounded-[1.8rem]">
          <span
            ref={brilho}
            className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 will-change-transform"
          />
        </span>
      </div>
    </div>
  );
}
