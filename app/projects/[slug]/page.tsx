import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Sparkles, Film } from "lucide-react";
import { getProjectBySlug, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const liveLink = project.links.find((link) => link.external);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/portfolio"
        className="inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to portfolio
      </Link>

      <section className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-black/45 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
        <div className={`h-48 bg-gradient-to-br ${project.accent} sm:h-56`} />
        <div className="relative -mt-16 p-6 sm:-mt-20 sm:p-8">
          <div className="rounded-[2rem] border border-white/10 bg-black/55 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/70">
                {project.category}
              </span>
              <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/70">
                {project.status}
              </span>
              <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/70">
                {project.year}
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-black text-white sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-4xl text-base leading-8 text-white/65 sm:text-lg">
              {project.hero}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 rounded-full bg-netflix-red px-5 py-3 text-sm font-semibold text-white shadow-glow"
              >
                <Sparkles className="h-4 w-4" />
                Match to roles
              </Link>
              {liveLink ? (
                <a
                  href={liveLink.href}
                  target={liveLink.external ? "_blank" : undefined}
                  rel={liveLink.external ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
                >
                  Open live site
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                <div className="flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-white/45">
                  <Film className="h-4 w-4 text-netflix-red" />
                  Summary
                </div>
                <p className="mt-3 text-sm leading-7 text-white/65">{project.summary}</p>

                <div className="mt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
                    Highlights
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-white/72">
                    {project.highlights.map((item) => (
                      <li key={item} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                  <h2 className="text-xl font-semibold text-white">Stack</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span key={item} className="rounded-full bg-white/8 px-3 py-1 text-sm text-white/75">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                  <h2 className="text-xl font-semibold text-white">Metrics</h2>
                  <div className="mt-4 space-y-3">
                    {project.metrics.map((metric) => (
                      <div key={metric} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white/70">
                        {metric}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
