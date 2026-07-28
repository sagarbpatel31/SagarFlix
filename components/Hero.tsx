"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Info, Play } from "lucide-react";

const meta = ["Embedded Linux", "Robotics", "AI / ML", "Systems Engineering"];

/**
 * Full-bleed billboard.
 *
 * Netflix's hero is a backdrop that the page content sits on top of, not a
 * bordered panel in a column. The scrims matter as much as the artwork: a
 * left-to-right wash keeps the copy legible, and the bottom fade dissolves the
 * billboard into the first row instead of ending on a hard edge.
 */
export function Hero() {
  return (
    <section className="relative -mt-20 h-[88vh] min-h-[560px] w-full overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_35%,rgba(229,9,20,0.42),transparent_58%),radial-gradient(ellipse_at_20%_10%,rgba(255,255,255,0.10),transparent_45%),linear-gradient(160deg,#1a0407_0%,#080808_55%,#050505_100%)]" />
      <div className="absolute inset-0 bg-cinematic-grid bg-[size:52px_52px] opacity-[0.08]" />
      <motion.div
        aria-hidden
        animate={{ opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[8%] top-[22%] h-[26rem] w-[26rem] rounded-full bg-netflix-red/25 blur-[120px]"
      />

      {/* Scrims: left-to-right for copy legibility, bottom fade into the rows */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.95)_0%,rgba(5,5,5,0.75)_38%,transparent_72%)]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(180deg,transparent,rgba(5,5,5,0.85)_55%,#050505)]" />

      {/* Bottom padding has to clear the rows that overlap upward into the
          billboard, or the first row title lands on the CTA buttons. */}
      <div className="relative flex h-full items-end pb-44 sm:pb-48">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.42em] text-white/55">
              <span className="text-netflix-red">S</span>
              <span>Series</span>
              <span className="text-white/25">•</span>
              <span>Career OS</span>
            </div>

            <h1 className="mt-3 text-6xl font-black leading-[0.88] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] sm:text-7xl lg:text-8xl">
              SagarFlix
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/70">
              <span className="rounded border border-white/25 px-1.5 py-0.5 text-[11px] font-medium text-white/60">
                2026
              </span>
              {meta.map((item) => (
                <span key={item} className="flex items-center gap-3">
                  {item}
                  <span className="text-white/20">•</span>
                </span>
              ))}
              <span className="text-emerald-400">Available now</span>
            </div>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/75 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] sm:text-lg">
              Portfolio work, live technical systems, a job tracker, and an AI blog studio —
              the whole career stack, arranged like something you would actually want to browse.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 rounded bg-white px-7 py-3 text-base font-bold text-black transition hover:bg-white/80"
              >
                <Play className="h-5 w-5 fill-black" />
                Play
              </Link>
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 rounded bg-white/20 px-7 py-3 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
              >
                <Info className="h-5 w-5" />
                More Info
              </Link>
              <Link
                href="/blog/generate"
                className="inline-flex items-center gap-1 rounded-full border border-netflix-red/40 bg-netflix-red/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-netflix-red hover:shadow-glow"
              >
                Blog Studio
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
