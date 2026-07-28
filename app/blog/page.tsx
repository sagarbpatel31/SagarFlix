import Link from "next/link";
import { Play, Sparkles } from "lucide-react";
import { blogDrafts, blogIdeas } from "@/data/blogs";
import { BlogDraftsRail } from "@/components/BlogDraftsRail";

export default function BlogPage() {
  return (
    <div className="pb-20">
      <section className="relative -mt-20 h-[60vh] min-h-[430px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_28%,rgba(229,9,20,0.38),transparent_58%),linear-gradient(150deg,#160406_0%,#080808_58%,#050505_100%)]" />
        <div className="absolute inset-0 bg-cinematic-grid bg-[size:48px_48px] opacity-[0.08]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.95)_0%,rgba(5,5,5,0.7)_40%,transparent_76%)]" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-[linear-gradient(180deg,transparent,rgba(5,5,5,0.9)_58%,#050505)]" />

        <div className="relative flex h-full items-end pb-14">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-white/55">
              Blog Studio
            </p>
            <h1 className="mt-3 max-w-3xl text-5xl font-black leading-[0.9] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] sm:text-6xl">
              Technical writing, staged and shipped.
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/70">
              <span>{blogDrafts.length} drafts</span>
              <span className="text-white/25">•</span>
              <span>{blogIdeas.length} queued ideas</span>
              <span className="text-white/25">•</span>
              <span className="text-emerald-400">Generator live</span>
            </div>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              Organize ideas, stage drafts, and jump into the generator. Generation runs
              server-side behind a provider interface, so the same workflow backs both the
              local mock writer and OpenAI.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/blog/generate"
                className="inline-flex items-center gap-2 rounded bg-white px-7 py-3 text-base font-bold text-black transition hover:bg-white/80"
              >
                <Play className="h-5 w-5 fill-black" />
                Open Generator
              </Link>
              <Link
                href="/blog/drafts"
                className="inline-flex items-center gap-2 rounded bg-white/20 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
              >
                Draft Library
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-8 max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <BlogDraftsRail />

        <section>
          <div className="flex items-center gap-3">
            <span className="h-7 w-1 rounded-full bg-netflix-red shadow-[0_0_30px_rgba(229,9,20,0.6)]" />
            <h2 className="text-2xl font-bold text-white">Recent Drafts</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {blogDrafts.map((draft) => (
              <article
                key={draft.slug}
                className="group relative overflow-hidden rounded-lg border border-white/10 bg-panel/70 p-5 transition hover:border-netflix-red/40"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-netflix-red/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-netflix-red">
                    {draft.format}
                  </p>
                  <span className="rounded border border-white/15 px-2 py-0.5 text-[11px] text-white/55">
                    {draft.status}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-white">{draft.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">{draft.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-white/45">
                  <span className="rounded border border-white/15 px-2 py-0.5">{draft.tone}</span>
                  <span className="rounded border border-white/15 px-2 py-0.5">
                    {draft.updatedAt}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3">
            <span className="h-7 w-1 rounded-full bg-netflix-red shadow-[0_0_30px_rgba(229,9,20,0.6)]" />
            <h2 className="text-2xl font-bold text-white">Idea Queue</h2>
          </div>
          <p className="mt-2 pl-4 text-sm text-white/45">
            A lightweight queue for future generator prompts.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {blogIdeas.map((idea) => (
              <Link
                key={idea}
                href="/blog/generate"
                className="group flex items-start gap-3 rounded-lg border border-white/10 bg-panel/70 px-5 py-4 text-sm leading-6 text-white/70 transition hover:border-netflix-red/40 hover:text-white"
              >
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-netflix-red/70 transition group-hover:text-netflix-red" />
                {idea}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
