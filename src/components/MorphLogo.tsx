"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Props = {
  className?: string;
  /** Inclina o logo seguindo o mouse (usar só no logo grande do hero). */
  tilt?: boolean;
  /** Mostra o brilho de vidro e o halo atrás do logo. */
  glow?: boolean;
  label?: string;
  /** Chamado quando o dedo segura o logo no toque (para esconder a dica "aperte e segure"). */
  onPress?: () => void;
};

/**
 * Logo da Morph Code redesenhado em SVG para poder animar cada parte.
 * Hover: o anel gira, os colchetes </> se abrem e o M recebe um pulso de luz.
 */
export default function MorphLogo({ className = "", tilt = false, glow = true, label = "Morph Code", onPress }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const el = root.current;
      const s = svg.current;
      if (!el || !s || !contextSafe) return;

      const q = (sel: string) => s.querySelector(sel);
      const ring = q(".ml-ring");
      const m = q(".ml-m");
      const lb = q(".ml-lb");
      const rb = q(".ml-rb");
      const slash = q(".ml-slash");
      const halo = el.querySelector(".ml-halo");
      const sheen = el.querySelector(".ml-sheen");

      gsap.set([ring, m, lb, rb, slash], { transformBox: "fill-box", transformOrigin: "50% 50%" });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Entrada: o anel se desenha e as partes entram em sequência.
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        const len = (ring as SVGPathElement).getTotalLength();
        intro
          .fromTo(ring, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, 0)
          .from(m, { opacity: 0, y: 24, duration: 0.9 }, 0.35)
          .from(lb, { opacity: 0, x: 40, duration: 0.8 }, 0.6)
          .from(rb, { opacity: 0, x: -40, duration: 0.8 }, 0.6)
          .from(slash, { opacity: 0, y: 20, duration: 0.7 }, 0.75)
          .add(() => {
            if (ring) gsap.set(ring, { clearProps: "strokeDasharray,strokeDashoffset" });
          });

        // Respiração do halo, bem sutil.
        if (halo) gsap.to(halo, { opacity: 0.85, scale: 1.08, duration: 3.2, yoyo: true, repeat: -1, ease: "sine.inOut" });

        const hover = gsap
          .timeline({ paused: true, defaults: { duration: 0.8, ease: "power3.out" } })
          .to(ring, { rotation: 360, duration: 1.4, ease: "power4.inOut" }, 0)
          .to(lb, { x: -46, ease: "back.out(2)" }, 0)
          .to(rb, { x: 46, ease: "back.out(2)" }, 0)
          .to(slash, { rotation: 10, scaleY: 1.12 }, 0)
          .to(m, { scale: 1.06 }, 0);
        if (halo) hover.to(halo, { opacity: 1, scale: 1.25 }, 0);
        if (sheen) hover.fromTo(sheen, { xPercent: -140 }, { xPercent: 140, duration: 1.1, ease: "power2.inOut" }, 0);

        const enter = contextSafe(() => hover.timeScale(1).play());
        const leave = contextSafe(() => hover.timeScale(1.4).reverse());
        // Mouse/caneta: pointer events. Toque: no iOS o pointer event é cancelado no começo do
        // "segurar" (callout/seleção), então o toque usa touchstart/touchend, que seguem até soltar.
        const pEnter = (e: PointerEvent) => {
          if (e.pointerType !== "touch") enter();
        };
        const pLeave = (e: PointerEvent) => {
          if (e.pointerType !== "touch") leave();
        };
        const tStart = contextSafe(() => {
          hover.timeScale(1).play();
          onPress?.();
        });
        el.addEventListener("pointerenter", pEnter);
        el.addEventListener("pointerleave", pLeave);
        el.addEventListener("touchstart", tStart, { passive: true });
        el.addEventListener("touchend", leave);
        el.addEventListener("touchcancel", leave);
        el.addEventListener("focus", enter);
        el.addEventListener("blur", leave);

        let rx: ((v: number) => void) | undefined;
        let ry: ((v: number) => void) | undefined;
        let onMove: ((e: PointerEvent) => void) | undefined;
        let onOut: (() => void) | undefined;
        if (tilt) {
          rx = gsap.quickTo(s, "rotationX", { duration: 0.6, ease: "power3" });
          ry = gsap.quickTo(s, "rotationY", { duration: 0.6, ease: "power3" });
          onMove = (e) => {
            if (e.pointerType === "touch") return;
            const r = el.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            ry?.(px * 22);
            rx?.(-py * 22);
          };
          onOut = () => {
            rx?.(0);
            ry?.(0);
          };
          el.addEventListener("pointermove", onMove);
          el.addEventListener("pointerleave", onOut);
        }

        return () => {
          el.removeEventListener("pointerenter", pEnter);
          el.removeEventListener("pointerleave", pLeave);
          el.removeEventListener("touchstart", tStart);
          el.removeEventListener("touchend", leave);
          el.removeEventListener("touchcancel", leave);
          el.removeEventListener("focus", enter);
          el.removeEventListener("blur", leave);
          if (onMove) el.removeEventListener("pointermove", onMove);
          if (onOut) el.removeEventListener("pointerleave", onOut);
        };
      });
    },
    { scope: root, dependencies: [tilt, onPress] }
  );

  return (
    <div
      ref={root}
      className={`relative isolate [perspective:900px] ${className}`}
      role="img"
      aria-label={label}
      onContextMenu={(e) => e.preventDefault()}
      style={{ touchAction: "pan-y", WebkitTouchCallout: "none", WebkitUserSelect: "none", userSelect: "none", WebkitTapHighlightColor: "transparent" }}
    >
      {glow && (
        <div
          aria-hidden
          className="ml-halo pointer-events-none absolute inset-[8%] -z-10 rounded-full opacity-60 blur-2xl"
          style={{ background: "radial-gradient(circle, rgba(232,200,118,0.55) 0%, rgba(212,169,74,0.18) 45%, transparent 70%)" }}
        />
      )}
      <svg ref={svg} viewBox="0 0 1254 1254" className="h-full w-full overflow-visible [transform-style:preserve-3d]" aria-hidden>
        <defs>
          <linearGradient id="ml-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3d98f" />
            <stop offset="0.55" stopColor="#d4a94a" />
            <stop offset="1" stopColor="#a9792f" />
          </linearGradient>
          <linearGradient id="ml-white" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#d9d6cf" />
          </linearGradient>
        </defs>
        <path
          className="ml-ring"
          d="M1040 520 A430 430 0 1 0 945 885"
          fill="none"
          stroke="url(#ml-gold)"
          strokeWidth="17"
          strokeLinecap="round"
        />
        <polygon className="ml-m" fill="url(#ml-white)" points="394,384 625,612 856,384 856,812 805,853 805,507 625,686 445,507 445,664 394,702" />
        <polygon className="ml-lb" fill="url(#ml-gold)" points="355,787 473,693 473,735 407,787 473,832 473,878" />
        <polygon className="ml-rb" fill="url(#ml-gold)" points="1017,680 886,571 886,613 963,680 886,737 886,785" />
        <polygon className="ml-slash" fill="url(#ml-gold)" points="637,738 665,738 612,878 584,878" />
      </svg>
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
        <div
          className="ml-sheen absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)", transform: "translateX(-140%)" }}
        />
      </div>
    </div>
  );
}
