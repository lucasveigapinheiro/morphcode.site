"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";

/**
 * Bolha de vidro que acompanha o mouse dentro da seção. O vidro borra e realça o que passa por
 * baixo (backdrop-filter), como uma lente. Só aparece com mouse e some se o sistema pede menos movimento.
 */
export default function GlassBubble({ rootRef }: { rootRef: RefObject<HTMLElement | null> }) {
  const big = useRef<HTMLDivElement>(null);
  const small = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const a = big.current;
    const b = small.current;
    if (!root || !a || !b) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;

    gsap.set([a, b], { scale: 0, opacity: 0 });
    const ax = gsap.quickTo(a, "x", { duration: 0.5, ease: "power3" });
    const ay = gsap.quickTo(a, "y", { duration: 0.5, ease: "power3" });
    const bx = gsap.quickTo(b, "x", { duration: 0.95, ease: "power3" });
    const by = gsap.quickTo(b, "y", { duration: 0.95, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      ax(x - a.offsetWidth / 2);
      ay(y - a.offsetHeight / 2);
      bx(x + 34);
      by(y + 38);
    };
    const onEnter = (e: PointerEvent) => {
      onMove(e);
      gsap.to(a, { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.8)" });
      gsap.to(b, { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(2)", delay: 0.08 });
    };
    const onLeave = () => {
      gsap.to([a, b], { scale: 0, opacity: 0, duration: 0.35, ease: "power2.in" });
    };

    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf([a, b]);
    };
  }, [rootRef]);

  return (
    <>
      <div ref={big} aria-hidden className="clinic-bubble pointer-events-none absolute left-0 top-0 z-30 h-32 w-32 rounded-full" />
      <div ref={small} aria-hidden className="clinic-bubble clinic-bubble-sm pointer-events-none absolute left-0 top-0 z-30 h-9 w-9 rounded-full" />
    </>
  );
}
