import Link from "next/link";
import { blogDrafts, blogIdeas } from "@/data/blogs";
import { BlogDraftsRail } from "@/components/BlogDraftsRail";

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/45 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(229,9,20,0.22),_transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_35%,rgba(0,0,0,0.25))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-netflix-red/80 to-transparent" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-netflix-red">Blog</p>
            <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl lg:text-6xl">
              A content dashboard for technical writing and short-form posts.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
              Use this space to organize ideas, stage drafts, and jump into the generator.
              Real AI generation is not wired yet. This first pass focuses on structure and workflow.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/blog/generate"
              className="inline-flex items-center justify-center rounded-full bg-netflix-red px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02] w-full sm:w-auto"
            >
              Open Generator
            </Link>
            <Link
              href="/blog/drafts"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 w-full sm:w-auto"
            >
              Open Draft Library
            </Link>
          </div>
        </div>

        <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-white/45">Saved Drafts</p>
            <p className="mt-3 text-2xl font-bold text-white">{blogDrafts.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-white/45">Idea Queue</p>
            <p className="mt-3 text-2xl font-bold text-white">{blogIdeas.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-white/45">Generator</p>
            <p className="mt-3 text-2xl font-bold text-white">Provider-ready</p>
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <BlogDraftsRail />

        <section className="rounded-3xl border border-white/10 bg-panel p-6">
          <h2 className="text-2xl font-semibold text-white">Recent Drafts</h2>
          <div className="mt-5 space-y-4">
            {blogDrafts.map((draft) => (
              <article key={draft.slug} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-medium text-white">{draft.title}</h3>
                  <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/70">
                    {draft.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-white/60">{draft.excerpt}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/60">
                  <span className="rounded-full bg-white/8 px-3 py-1">{draft.tone}</span>
                  <span className="rounded-full bg-white/8 px-3 py-1">{draft.format}</span>
                  <span className="rounded-full bg-white/8 px-3 py-1">{draft.updatedAt}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/50 p-6">
          <h2 className="text-2xl font-semibold text-white">Idea Queue</h2>
          <p className="mt-2 text-sm text-white/55">
            A lightweight queue for future blog generator prompts.
          </p>
          <div className="mt-5 grid gap-3">
            {blogIdeas.map((idea) => (
              <div key={idea} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-4 text-sm text-white/75">
                {idea}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
