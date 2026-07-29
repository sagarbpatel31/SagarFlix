import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/Hero";
import { ContentRow } from "@/components/ContentRow";
import { TitleCard } from "@/components/TitleCard";
import { JobCard } from "@/components/JobCard";
import { projects } from "@/data/projects";
import { blogDrafts } from "@/data/blogs";
import { jobs } from "@/data/jobs";

const continueBuilding = projects.filter((project) => project.status !== "Archived").slice(0, 6);
const featuredProjects = projects.filter((project) => project.status === "Featured").slice(0, 6);
const roboticsProjects = projects.filter((project) =>
  project.tags.some((tag) => ["Robotics", "AI/ML", "Simulation"].includes(tag)),
);
const embeddedProjects = projects.filter((project) =>
  project.tags.some((tag) => ["Embedded", "Systems", "Security", "Edge Computing"].includes(tag)),
);
const blogCards = blogDrafts.slice(0, 3);

export default function HomePage() {
  return (
    <div className="pb-16">
      <Hero />

      {/* Rows overlap the billboard's bottom fade so the page reads as one
          continuous surface, the way a streaming home screen does. */}
      <div className="relative z-10 -mt-28 space-y-2 sm:-mt-32">
        <div className="mx-auto max-w-7xl space-y-2 px-4 sm:px-6 lg:px-8">
          <ContentRow
            title="Continue Building"
            description="The active layer of the career OS."
            href="/portfolio"
          >
            {continueBuilding.map((project) => (
              <TitleCard key={project.slug} project={project} />
            ))}
          </ContentRow>

          <ContentRow
            title="Featured Projects"
            description="High-signal portfolio stories with clear technical depth."
            href="/portfolio"
          >
            {featuredProjects.map((project) => (
              <TitleCard key={project.slug} project={project} />
            ))}
          </ContentRow>

          <ContentRow
            title="Robotics & AI"
            description="Simulation, autonomy, and machine-intelligence work."
            href="/portfolio"
          >
            {roboticsProjects.slice(0, 6).map((project) => (
              <TitleCard key={project.slug} project={project} />
            ))}
          </ContentRow>

          <ContentRow
            title="Embedded & Systems"
            description="Low-level work: kernels, edge devices, and the tooling around them."
            href="/portfolio"
          >
            {embeddedProjects.slice(0, 6).map((project) => (
              <TitleCard key={project.slug} project={project} />
            ))}
          </ContentRow>

          <ContentRow
            title="Career Intelligence"
            description="A short-list of roles and systems with strong fit potential."
            href="/jobs"
          >
            {jobs.slice(0, 6).map((job) => (
              <JobCard key={job.slug} job={job} />
            ))}
          </ContentRow>

          <section className="space-y-3 pt-6">
            <div className="flex items-end justify-between gap-4 px-1">
              <div className="flex items-center gap-3">
                <span className="h-7 w-1 rounded-full bg-netflix-red shadow-[0_0_30px_rgba(229,9,20,0.6)]" />
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Blog Studio
                  </h2>
                  <p className="mt-1 text-sm text-white/55">
                    Draft ideas, pipeline status, and generator-ready entry points.
                  </p>
                </div>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/50 transition hover:text-white"
              >
                Explore all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-3 px-1 md:grid-cols-3">
              {blogCards.map((draft) => (
                <Link
                  key={draft.slug}
                  href="/blog"
                  className="group relative overflow-hidden rounded-lg border border-white/10 bg-panel p-5 transition hover:border-netflix-red/40"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-netflix-red/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-netflix-red">
                    {draft.format}
                  </p>
                  <h3 className="mt-3 text-lg font-bold text-white">{draft.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-white/55">{draft.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-white/50">
                    <span className="rounded border border-white/15 px-2 py-0.5">{draft.tone}</span>
                    <span className="rounded border border-white/15 px-2 py-0.5">{draft.status}</span>
                    <span className="rounded border border-white/15 px-2 py-0.5">
                      {draft.updatedAt}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
