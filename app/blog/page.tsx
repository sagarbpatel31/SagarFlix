import Link from "next/link";
import { Play, Sparkles } from "lucide-react";
import { blogDrafts, blogIdeas } from "@/data/blogs";
import { Billboard, BillboardAction } from "@/components/Billboard";
import { BlogDraftsRail } from "@/components/BlogDraftsRail";

export default function BlogPage() {
  return (
    <div className="pb-20">
      <Billboard
        size="sm"
        eyebrow="Blog Studio"
        title="Technical writing, staged and shipped."
        meta={[
          <span key="drafts">{blogDrafts.length} drafts</span>,
          <span key="ideas">{blogIdeas.length} queued ideas</span>,
          <span key="live" className="text-emerald-400">
            Generator live
          </span>,
        ]}
        description="Organize ideas, stage drafts, and jump into the generator. Generation runs server-side behind a provider interface, so the same workflow backs both the local mock writer and OpenAI."
      >
        <BillboardAction href="/blog/generate">
          <Play className="h-5 w-5 fill-black" />
          Open Generator
        </BillboardAction>
        <BillboardAction href="/blog/drafts" variant="secondary">
          Draft Library
        </BillboardAction>
      </Billboard>

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
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-white/55">
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
          <p className="mt-2 pl-4 text-sm text-white/55">
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
