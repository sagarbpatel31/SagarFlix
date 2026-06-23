"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Film, Play, Sparkles, Tv2 } from "lucide-react";

const stats = [
  { label: "Portfolio projects", value: "8+" },
  { label: "Live systems", value: "2" },
  { label: "Career views", value: "Netflix-style" },
  { label: "Content studio", value: "Blog-ready" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(229,9,20,0.4),_transparent_28%),radial-gradient(circle_at_70%_20%,_rgba(255,255,255,0.12),_transparent_22%),linear-gradient(180deg,_rgba(0,0,0,0.1),_rgba(0,0,0,0.82))]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(229,9,20,0.13),transparent_35%,rgba(255,255,255,0.02)_55%,transparent_78%)]" />
      <div className="absolute inset-0 bg-cinematic-grid bg-[size:44px_44px] opacity-[0.09]" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-2 rounded-full border border-netflix-red/30 bg-black/45 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-white/82 backdrop-blur-md"
            >
              <Sparkles className="h-4 w-4 text-netflix-red" />
              Career OS for Embedded Linux, Robotics, AI, and Software Engineering
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-5 text-6xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl"
            >
              SagarFlix
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-5 max-w-2xl text-lg leading-8 text-white/74 sm:text-xl"
            >
              A cinematic career operating system that combines portfolio work,
              live technical sites, job tracking, and a future blog pipeline into
              one premium dashboard.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
              >
                View Portfolio
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-netflix-red/50 hover:bg-white/10"
              >
                Open Job Tracker
              </Link>
              <Link
                href="/blog/generate"
                className="inline-flex items-center gap-2 rounded-full border border-netflix-red/30 bg-netflix-red/12 px-6 py-3 text-sm font-semibold text-white transition hover:bg-netflix-red"
              >
                <Play className="h-4 w-4" />
                Generate Blog
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 18 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-0 -left-6 top-8 rounded-[2rem] bg-netflix-red/25 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/65">
                  <Tv2 className="h-4 w-4 text-netflix-red" />
                  <span className="text-xs uppercase tracking-[0.28em]">Featured queue</span>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">
                  Now playing
                </span>
              </div>

              <div className="mt-5 aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(229,9,20,0.55),_rgba(0,0,0,0.85)_55%)] p-5">
                <div className="flex h-full flex-col justify-between">
                  <div className="space-y-3">
                    <span className="inline-flex rounded-full bg-black/35 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-white/75">
                      Career Signal
                    </span>
                    <h3 className="max-w-xs text-3xl font-black leading-none text-white">
                      Portfolio, jobs, blog, and systems in one place
                    </h3>
                    <p className="max-w-xs text-sm leading-6 text-white/72">
                      High-contrast cards, motion, and horizontal rows designed to feel like a streaming interface.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
                      <Film className="h-5 w-5 text-netflix-red" />
                      <p className="mt-3 text-sm text-white/75">Cinematic layout</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
                      <Sparkles className="h-5 w-5 text-netflix-red" />
                      <p className="mt-3 text-sm text-white/75">Premium motion</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:border-netflix-red/30 hover:bg-white/[0.07]"
            >
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-2 text-sm text-white/55">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
