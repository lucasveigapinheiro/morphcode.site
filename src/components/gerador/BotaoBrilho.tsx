"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Props = {
  children: ReactNode;
  className?: string;
  variante?: "primario" | "escuro";
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

/**
 * Botão de alta conversão com hover físico magnético (gsap.quickTo)
 * + feixe de brilho diagonal + holofote que acompanha o cursor.
 * Respeita prefers-reduced-motion e não aplica magnetismo em touch.
 */
export default function BotaoBrilho({
  children,
  className = "",
  variante = "primario",
  href,
  type = "button",
  disabled = false,
  onClick,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);
  const ativo = useRef(false);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
        ativo.current = true;
        quickX.current = gsap.quickTo(el, "x", { duration: 0.32, ease: "power3.out" });
        quickY.current = gsap.quickTo(el, "y", { duration: 0.32, ease: "power3.out" });
        return () => {
          ativo.current = false;
          quickX.current = null;
          quickY.current = null;
        };
      });
    },
    { scope: ref },
  );

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el || disabled) return;
    const rect = el.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
    const py = ((e.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
    el.style.setProperty("--bx", `${px}%`);
    el.style.setProperty("--by", `${py}%`);

    if (ativo.current && quickX.current && quickY.current) {
      const relX = (e.clientX - rect.left - rect.width / 2) * 0.14;
      const relY = (e.clientY - rect.top - rect.height / 2) * 0.2;
      quickX.current(Math.max(-8, Math.min(8, relX)));
      quickY.current(Math.max(-5, Math.min(5, relY)));
    }
  }

  function onMouseLeave() {
    if (quickX.current && quickY.current) {
      quickX.current(0);
      quickY.current(0);
    }
  }

  const base =
    variante === "primario"
      ? "ml-btn-glow bg-[var(--w-primary)] text-[var(--w-ink)] shadow-[0_12px_28px_-10px_rgba(159,232,112,0.7)] hover:bg-[var(--w-primary-hover)] hover:shadow-[0_18px_38px_-10px_rgba(159,232,112,0.9)]"
      : "ml-btn-glow-dark bg-[var(--w-ink)] text-white shadow-[0_12px_28px_-12px_rgba(14,15,12,0.45)] hover:bg-[var(--w-ink-deep)]";

  const classes = `relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-bold transition-[background-color,box-shadow,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 ${base} ${className}`;

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className={classes}
      >
        <span className="relative z-10 inline-flex items-center justify-center gap-2">{children}</span>
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={classes}
    >
      <span className="relative z-10 inline-flex items-center justify-center gap-2">{children}</span>
    </button>
  );
}
