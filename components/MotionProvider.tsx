"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Honours the OS "reduce motion" setting for every Framer Motion animation.
 *
 * `reducedMotion="user"` drops transform and layout animations — the row
 * push-aside, the hover scale, the billboard rise — while leaving opacity
 * transitions intact, so the interface still responds without moving.
 * CSS-driven motion is handled separately in globals.css.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
