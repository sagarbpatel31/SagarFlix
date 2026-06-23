"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, BadgeCheck, PlayCircle } from "lucide-react";
import type { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      whileHover={{ scale: 1.025, y: -6 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="group relative h-full overflow-hidden rounded-[1.8rem] border border-white/10 bg-panel shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${project.accent} opacity-80 transition duration-300 group-hover:opacity-95`} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_28%,rgba(0,0,0,0.75)_88%)]" />
      <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),transparent)] blur-2xl" />
      </div>

      <div className="relative flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/78 backdrop-blur">
                <BadgeCheck className="h-3.5 w-3.5 text-netflix-red" />
                {project.category}
              </span>
              <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/78 backdrop-blur">
                {project.status}
              </span>
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white">{project.title}</h3>
          </div>
          <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs text-white/65">
            {project.year}
          </span>
        </div>

        <p className="mt-4 text-sm leading-6 text-white/76">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs text-white/78 backdrop-blur"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 grid gap-2 text-sm text-white/74">
          {project.metrics.slice(0, 3).map((metric) => (
            <div key={metric} className="rounded-2xl border border-white/8 bg-black/30 px-3 py-2 transition duration-300 group-hover:border-white/12">
              {metric}
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-3xl border border-white/10 bg-black/35 p-4 opacity-100 transition duration-300 md:opacity-0 md:group-hover:opacity-100">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/55">
            <PlayCircle className="h-4 w-4 text-netflix-red" />
            Quick preview
          </div>
          <p className="mt-3 text-sm leading-6 text-white/72">
            {project.hero}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition duration-300 group-hover:-translate-y-0.5"
          >
            View Detail
            <ArrowRight className="h-4 w-4" />
          </Link>

          {project.links.some((link) => link.external) ? (
            <a
              href={project.links.find((link) => link.external)?.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-medium text-white transition hover:border-netflix-red/40 hover:bg-netflix-red/10"
            >
              <ExternalLink className="h-4 w-4" />
              Live Site
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
