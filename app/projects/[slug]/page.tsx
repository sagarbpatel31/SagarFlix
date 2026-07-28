import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Play, Plus, Sparkles } from "lucide-react";
import { getProjectBySlug, projects } from "@/data/projects";
import { TitleCard } from "@/components/TitleCard";
import { cn } from "@/lib/utils";

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
  const moreLikeThis = projects
    .filter((item) => item.slug !== project.slug)
    .filter((item) => item.tags.some((tag) => project.tags.includes(tag)))
    .slice(0, 4);

  return (
    <div className="pb-20">
      {/* Backdrop, the way a Netflix title page opens: artwork first, with the
          copy sitting on a scrim that dissolves into the page below. */}
      <section className="relative -mt-20 h-[72vh] min-h-[520px] w-full overflow-hidden">
        {/* The per-project accent is a low-opacity gradient, so it needs two
            passes and a lighter scrim to survive as colour rather than sludge. */}
        <div className={cn("absolute inset-0 bg-gradient-to-br", project.accent)} />
        <div className={cn("absolute inset-0 bg-gradient-to-tr", project.accent)} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_68%_28%,rgba(229,9,20,0.34),transparent_58%)]" />
        <div className="absolute inset-0 bg-cinematic-grid bg-[size:48px_48px] opacity-[0.07]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.92)_0%,rgba(5,5,5,0.55)_45%,transparent_82%)]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-[linear-gradient(180deg,transparent,rgba(5,5,5,0.9)_58%,#050505)]" />

        <div className="relative flex h-full items-end pb-16">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to portfolio
            </Link>

            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.4em] text-white/55">
              {project.category}
            </p>
            <h1 className="mt-3 max-w-4xl text-5xl font-black leading-[0.9] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] sm:text-6xl lg:text-7xl">
              {project.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              <span className="font-semibold text-emerald-400">{project.status}</span>
              <span className="text-white/25">•</span>
              <span className="text-white/70">{project.year}</span>
              <span className="text-white/25">•</span>
              <span className="rounded border border-white/25 px-1.5 py-0.5 text-[11px] text-white/60">
                {project.stack.length} technologies
              </span>
            </div>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {project.hero}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {liveLink ? (
                <a
                  href={liveLink.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded bg-white px-7 py-3 text-base font-bold text-black transition hover:bg-white/80"
                >
                  <Play className="h-5 w-5 fill-black" />
                  Open live site
                </a>
              ) : (
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 rounded bg-white px-7 py-3 text-base font-bold text-black transition hover:bg-white/80"
                >
                  <Play className="h-5 w-5 fill-black" />
                  Browse portfolio
                </Link>
              )}
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 rounded bg-white/20 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
              >
                <Plus className="h-5 w-5" />
                Match to roles
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
          <div>
            <p className="text-base leading-8 text-white/75">{project.summary}</p>

            {/* Highlights read as the "episode list" of the title. */}
            <section className="mt-10">
              <h2 className="text-2xl font-bold text-white">Highlights</h2>
              <div className="mt-5 divide-y divide-white/8 overflow-hidden rounded-lg border border-white/10 bg-panel/60">
                {project.highlights.map((item, index) => (
                  <div
                    key={item}
                    className="group flex gap-5 p-5 transition hover:bg-white/[0.04]"
                  >
                    <span className="w-6 shrink-0 text-2xl font-black text-white/25 transition group-hover:text-netflix-red">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-7 text-white/70">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40">
                Stack
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/70">{project.stack.join(", ")}</p>
            </div>

            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40">
                Tags
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/70">{project.tags.join(", ")}</p>
            </div>

            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40">
                Metrics
              </h3>
              <ul className="mt-3 space-y-2">
                {project.metrics.map((metric) => (
                  <li key={metric} className="flex gap-2 text-sm leading-6 text-white/70">
                    <Sparkles className="mt-1 h-3.5 w-3.5 shrink-0 text-netflix-red" />
                    {metric}
                  </li>
                ))}
              </ul>
            </div>

            {project.links.length > 0 ? (
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40">
                  Links
                </h3>
                <div className="mt-3 space-y-2">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noreferrer" : undefined}
                      className="flex items-center gap-2 text-sm text-white/70 transition hover:text-netflix-red"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>

        {moreLikeThis.length > 0 ? (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-white">More Like This</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {moreLikeThis.map((item) => (
                <TitleCard key={item.slug} project={item} expanded />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
