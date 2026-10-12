"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// Respeita a preferência "reduzir movimento" do sistema em todas as animações.
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
