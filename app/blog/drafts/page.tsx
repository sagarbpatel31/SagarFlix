import Link from "next/link";
import { ArrowLeft, Sparkles, LibraryBig, WandSparkles } from "lucide-react";
import { BlogDraftsSummary } from "@/components/BlogDraftsSummary";
import { BlogDraftsRail } from "@/components/BlogDraftsRail";
import { blogIdeas } from "@/data/blogs";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function BlogDraftsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blog dashboard
      </Link>

      <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-black/45 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(229,9,20,0.22),_transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_40%,rgba(0,0,0,0.24))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-netflix-red/80 to-transparent" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-netflix-red">
              <LibraryBig className="h-4 w-4" />
              Blog Library
            </div>
            <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl lg:text-6xl">
              Saved drafts, structured for review and reuse.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
              This page is the local content library for the blog studio. It stays backend-free
              for now, but it gives you a proper place to review, load, copy, and remove drafts.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[22rem] lg:grid-cols-1">
            <Link
              href="/blog/generate"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-netflix-red px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]"
            >
              <WandSparkles className="h-4 w-4" />
              Generate New Draft
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-6">
        <BlogDraftsSummary />
        <BlogDraftsRail />

        <section className="rounded-3xl border border-white/10 bg-black/50 p-6">
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-white/55">
            <Sparkles className="h-4 w-4 text-netflix-red" />
            Prompt Queue
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Future draft prompts
          </h2>
          <p className="mt-2 text-sm text-white/55">
            These ideas can later feed a real content pipeline or a generator queue.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {blogIdeas.map((idea) => (
              <div
                key={idea}
                className="rounded-2xl border border-white/8 bg-white/5 px-4 py-4 text-sm text-white/75"
              >
                {idea}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
