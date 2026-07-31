"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight, Info, Play } from "lucide-react";
import { Billboard, BillboardAction } from "@/components/Billboard";

const meta = ["Embedded Linux", "Robotics", "AI / ML", "Systems Engineering"];

/**
 * The homepage billboard.
 *
 * Renders through `Billboard` so the scrims, height, and copy stack have one
 * definition — this was previously a hand-built copy whose scrim stops had
 * already drifted from the shared component. What stays here is genuinely
 * unique: the animated glow backdrop and the extra bottom padding that clears
 * the rows overlapping upward into it.
 */
export function Hero() {
  // MotionConfig's "user" mode still allows opacity animations, and an infinite
  // pulse is exactly the kind of thing reduced-motion users want stopped, so
  // this one is opted out explicitly.
  const reduceMotion = useReducedMotion();

  return (
    <Billboard
      size="lg"
      contentClassName="pb-44 sm:pb-48"
      eyebrow="Series • Career OS"
      title="SagarFlix"
      meta={[
        <span key="year" className="rounded border border-white/25 px-1.5 py-0.5 text-[11px] font-medium text-white/60">
          2026
        </span>,
        ...meta.map((item) => <span key={item}>{item}</span>),
        <span key="status" className="text-emerald-400">
          Available now
        </span>,
      ]}
      description="Portfolio work, live technical systems, a job tracker, and an AI blog studio — the whole career stack, arranged like something you would actually want to browse."
      backdrop={
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_35%,rgba(229,9,20,0.42),transparent_58%),radial-gradient(ellipse_at_20%_10%,rgba(255,255,255,0.10),transparent_45%),linear-gradient(160deg,#1a0407_0%,#080808_55%,#050505_100%)]" />
          <motion.div
            aria-hidden
            animate={reduceMotion ? { opacity: 0.7 } : { opacity: [0.55, 0.85, 0.55] }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: 9, repeat: Infinity, ease: "easeInOut" }
            }
            className="absolute right-[8%] top-[22%] h-[26rem] w-[26rem] rounded-full bg-netflix-red/25 blur-[120px]"
          />
        </>
      }
    >
      <BillboardAction href="/portfolio">
        <Play className="h-5 w-5 fill-black" />
        Play
      </BillboardAction>
      <BillboardAction href="/resume" variant="secondary">
        <Info className="h-5 w-5" />
        More Info
      </BillboardAction>
      <BillboardAction
        href="/blog/generate"
        variant="secondary"
        className="rounded-full border border-netflix-red/40 bg-netflix-red/10 px-5 text-sm font-semibold hover:bg-netflix-red"
      >
        Blog Studio
        <ChevronRight className="h-4 w-4" />
      </BillboardAction>
    </Billboard>
  );
}
