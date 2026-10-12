"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MorphLogo from "./MorphLogo";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Lado direito do hero: o logo dentro de um disco de vidro, esferas em órbita
 * e painéis de vidro com conteúdo real. Cada camada tem uma profundidade
 * diferente no parallax do mouse e do scroll.
 */
export default function HeroScene() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_c, contextSafe) => {
      const el = root.current;
      if (!el || !contextSafe) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".hs-disc", { opacity: 0, scale: 0.8, duration: 1.2, ease: "power3.out" });
        gsap.from(".hs-orb", { opacity: 0, scale: 0.4, duration: 1.2, stagger: 0.15, delay: 0.3, ease: "back.out(1.6)" });
        gsap.from(".hs-card", { opacity: 0, y: 36, duration: 0.9, stagger: 0.18, delay: 0.7, ease: "power3.out" });

        gsap.to(".hs-orbit", { rotation: 360, duration: 60, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
        gsap.to(".hs-orbit-rev", { rotation: -360, duration: 90, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
        gsap.to(".hs-float-a", { y: -14, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });
        gsap.to(".hs-float-b", { y: 12, duration: 5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 0.6 });

        // Parallax por camada seguindo o mouse.
        const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", el);
        const setters = layers.map((l) => ({
          x: gsap.quickTo(l, "x", { duration: 0.8, ease: "power3" }),
          y: gsap.quickTo(l, "y", { duration: 0.8, ease: "power3" }),
          d: Number(l.dataset.depth || 0),
        }));
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - (r.left + r.width / 2)) / r.width;
          const py = (e.clientY - (r.top + r.height / 2)) / r.height;
          setters.forEach((s) => {
            s.x(px * s.d);
            s.y(py * s.d);
          });
        };
        const onLeave = () => setters.forEach((s) => (s.x(0), s.y(0)));
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);

        // Parallax de scroll: a cena sobe mais devagar que a página.
        gsap.to(el, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
        });

        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative mx-auto aspect-square w-full max-w-[600px] select-none">
      {/* Órbitas */}
      <svg aria-hidden viewBox="0 0 520 520" className="absolute inset-0 h-full w-full overflow-visible">
        <g className="hs-orbit" style={{ transformOrigin: "260px 260px" }}>
          <circle cx="260" cy="260" r="250" fill="none" stroke="rgba(212,169,74,0.28)" strokeWidth="1" strokeDasharray="2 8" />
          <circle cx="260" cy="10" r="5" fill="#e8c876" />
        </g>
        <g className="hs-orbit-rev" style={{ transformOrigin: "260px 260px" }}>
          <circle cx="260" cy="260" r="205" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <circle cx="465" cy="260" r="4" fill="#fff" opacity="0.8" />
        </g>
      </svg>

      {/* Esferas, como no layout de referência */}
      <div
        data-depth="-34"
        className="hs-orb absolute left-[2%] top-[4%] h-20 w-20 rounded-full sm:h-24 sm:w-24"
        style={{ background: "radial-gradient(circle at 32% 28%, #f6e2a6 0%, #d4a94a 38%, #6b4a14 78%, #1a1204 100%)", boxShadow: "0 0 60px rgba(212,169,74,0.35)" }}
      />
      <div
        data-depth="28"
        className="hs-orb absolute right-[10%] bottom-[34%] h-10 w-10 rounded-full sm:h-12 sm:w-12"
        style={{ background: "radial-gradient(circle at 34% 30%, #ffffff 0%, #9b988f 40%, #2a2a2c 85%)", boxShadow: "0 0 40px rgba(255,255,255,0.12)" }}
      />

      {/* Disco de vidro com o logo */}
      <div data-depth="12" className="hs-disc absolute inset-[7%]">
        <div className="glass-strong absolute inset-0 rounded-full" />
        <div
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{ background: "conic-gradient(from 210deg, transparent 0 55%, rgba(232,200,118,0.28) 72%, transparent 86%)", mask: "radial-gradient(circle, transparent 62%, #000 63%)", WebkitMask: "radial-gradient(circle, transparent 62%, #000 63%)" }}
        />
        <div className="absolute inset-[6%]">
          <MorphLogo tilt className="h-full w-full cursor-pointer rounded-full outline-offset-4" label="Logo da Morph Code" />
        </div>
      </div>

      {/* Painéis de vidro com conteúdo real */}
      <div data-depth="-18" className="absolute -left-2 bottom-[2%] z-10 w-[44%] sm:-left-6">
        <div className="hs-card hs-float-b glass rounded-xl p-2.5">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
            <Image
              src="/projects/2b-estetica.jpg"
              alt="Site da 2B Estética Automotiva, feito pela Morph Code"
              fill
              sizes="(min-width: 640px) 300px, 55vw"
              className="object-cover object-top"
              priority
            />
          </div>
          <p className="mt-2 px-1 font-mono text-[10px] text-muted">2B Estética Automotiva · no ar</p>
        </div>
      </div>

      <div data-depth="22" className="absolute right-0 top-[10%] z-10 sm:-right-4">
        <div className="hs-card hs-float-a glass rounded-xl px-4 py-3">
          <p className="font-mono text-[10px] text-muted">Prazo médio</p>
          <p className="mt-0.5 font-[var(--font-display)] text-2xl text-gold">7 dias</p>
        </div>
      </div>

      <div data-depth="30" className="absolute -right-2 bottom-[10%] z-10 hidden sm:block">
        <div className="hs-card hs-float-b glass flex items-center gap-2.5 rounded-full py-2 pl-2.5 pr-4">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#25d366]/20">
            <span className="h-2 w-2 rounded-full bg-[#25d366] shadow-[0_0_10px_#25d366]" />
          </span>
          <span className="text-xs text-foreground">Orçamento pelo WhatsApp</span>
        </div>
      </div>
    </div>
  );
}
