import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ContentRow } from "@/components/ContentRow";
import { ProjectCard } from "@/components/ProjectCard";
import { JobCard } from "@/components/JobCard";
import { projects } from "@/data/projects";
import { blogDrafts } from "@/data/blogs";
import { jobs } from "@/data/jobs";
import { ArrowRight } from "lucide-react";

const continueBuilding = projects.filter((project) => project.status !== "Archived").slice(0, 4);
const featuredProjects = projects.filter((project) => project.status === "Featured").slice(0, 4);
const roboticsProjects = projects.filter((project) =>
  project.tags.some((tag) => ["Robotics", "AI/ML", "Simulation"].includes(tag)),
);
const blogCards = blogDrafts.slice(0, 3);

export default function HomePage() {
  return (
    <div className="space-y-12 pb-12">
      <Hero />

      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <ContentRow
          title="Continue Building"
          description="The active layer of the career OS."
          href="/portfolio"
        >
          {continueBuilding.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </ContentRow>

        <ContentRow
          title="Featured Projects"
          description="High-signal portfolio stories with clear technical depth."
          href="/portfolio"
        >
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </ContentRow>

        <ContentRow
          title="Robotics & AI"
          description="Simulation, autonomy, and machine-intelligence work."
          href="/portfolio"
        >
          {roboticsProjects.slice(0, 4).map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </ContentRow>

        <ContentRow
          title="Career Intelligence"
          description="A short-list of roles and systems with strong fit potential."
          href="/jobs"
        >
          {jobs.slice(0, 4).map((job) => (
            <JobCard key={job.slug} job={job} />
          ))}
        </ContentRow>

        <ContentRow
          title="Job Application Tracker"
          description="Mock tracker cards that make the future spreadsheet-backed flow concrete."
          href="/jobs"
        >
          {jobs.slice(4, 8).map((job) => (
            <JobCard key={job.slug} job={job} />
          ))}
        </ContentRow>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Blog Studio</h2>
              <p className="mt-1 text-sm text-white/55">
                Draft ideas, pipeline status, and generator-ready entry points.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-medium text-white/65 transition hover:text-white"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {blogCards.map((draft) => (
              <article
                key={draft.slug}
                className="rounded-3xl border border-white/10 bg-panel p-5"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-netflix-red">{draft.format}</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{draft.title}</h3>
                <p className="mt-2 text-sm text-white/60">{draft.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/65">
                  <span className="rounded-full bg-white/8 px-3 py-1">{draft.tone}</span>
                  <span className="rounded-full bg-white/8 px-3 py-1">{draft.status}</span>
                  <span className="rounded-full bg-white/8 px-3 py-1">{draft.updatedAt}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
