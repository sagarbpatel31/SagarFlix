"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, ExternalLink, Play, Plus } from "lucide-react";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

/**
 * Netflix title tile.
 *
 * At rest this is a quiet 16:9 backdrop with just the title, the way a Netflix
 * row reads before you interact with it. The metadata, synopsis, and actions
 * only appear on hover, which is what keeps a dense row scannable instead of
 * turning it into a wall of text.
 */
export function TitleCard({ project, expanded = false }: { project: Project; expanded?: boolean }) {
  const liveLink = project.links.find((link) => link.external);

  return (
    <article className="group/card relative h-full w-full">
      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-panel shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
        {/* Backdrop */}
        <div className="relative aspect-video w-full">
          <div className={cn("absolute inset-0 bg-gradient-to-br", project.accent)} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_55%)]" />
          <div className="absolute inset-0 bg-cinematic-grid bg-[size:28px_28px] opacity-[0.07]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(0,0,0,0.55)_70%,rgba(5,5,5,0.95))]" />

          <span className="absolute left-3 top-3 rounded-sm bg-black/55 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
            {project.category}
          </span>

          {project.status === "Featured" ? (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-sm bg-netflix-red px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
              Top Pick
            </span>
          ) : null}

          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="text-xl font-black leading-tight tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:text-2xl">
              {project.title}
            </h3>
          </div>

          {/* The artwork itself has to be tappable. The drawer's buttons only
              exist on hover, which never fires on touch, so without this the
              whole tile is dead on a phone. */}
          <Link
            href={`/projects/${project.slug}`}
            className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-netflix-red"
          >
            <span className="sr-only">{project.title}</span>
          </Link>
        </div>

        {/* Hover drawer. Collapsed to zero height at rest so the row stays compact. */}
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
            expanded
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0 group-hover/card:grid-rows-[1fr] group-hover/card:opacity-100 group-focus-within/card:grid-rows-[1fr] group-focus-within/card:opacity-100",
          )}
        >
          <div className="overflow-hidden">
            <div className="space-y-3 bg-panel p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black transition hover:bg-white/85"
                >
                  <Play className="h-3.5 w-3.5 fill-black" />
                  Open
                </Link>
                <Link
                  href="/jobs"
                  aria-label="Match this project to roles"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/75 transition hover:border-white hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                </Link>
                {liveLink ? (
                  <a
                    href={liveLink.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open the live site for ${project.title}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/75 transition hover:border-white hover:text-white"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
                <Link
                  href={`/projects/${project.slug}`}
                  aria-label={`More information about ${project.title}`}
                  className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/75 transition hover:border-white hover:text-white"
                >
                  <ChevronDown className="h-4 w-4" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium">
                <span className="text-emerald-400">{project.status}</span>
                <span className="text-white/35">•</span>
                <span className="text-white/60">{project.year}</span>
                <span className="rounded border border-white/25 px-1.5 py-0.5 text-[10px] text-white/55">
                  {project.stack.length} tech
                </span>
              </div>

              <p className="line-clamp-3 text-xs leading-5 text-white/65">{project.summary}</p>

              <div className="flex flex-wrap gap-1.5">
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[11px] text-white/55">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Static grid variant. The row version leans on hover to reveal detail, which
 * never fires on touch, so grid pages render the drawer open.
 */
export function TitleCardStatic({ project }: { project: Project }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
      className="h-full"
    >
      <TitleCard project={project} expanded />
    </motion.div>
  );
}
