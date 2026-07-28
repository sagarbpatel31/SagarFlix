import Link from "next/link";
import { ArrowLeft, Play, Sparkles, WandSparkles } from "lucide-react";
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
    <div className="pb-20">
      <section className="relative -mt-20 h-[58vh] min-h-[420px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_30%,rgba(229,9,20,0.34),transparent_58%),linear-gradient(150deg,#140406_0%,#080808_58%,#050505_100%)]" />
        <div className="absolute inset-0 bg-cinematic-grid bg-[size:48px_48px] opacity-[0.08]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.95)_0%,rgba(5,5,5,0.7)_40%,transparent_76%)]" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-[linear-gradient(180deg,transparent,rgba(5,5,5,0.9)_58%,#050505)]" />

        <div className="relative flex h-full items-end pb-14">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to blog dashboard
            </Link>

            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.4em] text-white/55">
              Blog Library
            </p>
            <h1 className="mt-3 max-w-3xl text-5xl font-black leading-[0.9] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] sm:text-6xl">
              Saved drafts, structured for review and reuse.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              Review, load, copy, pin, and archive drafts. Signed in, they persist to your
              account and follow you across devices; anonymous, they stay in this browser.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/blog/generate"
                className="inline-flex items-center gap-2 rounded bg-white px-7 py-3 text-base font-bold text-black transition hover:bg-white/80"
              >
                <Play className="h-5 w-5 fill-black" />
                Generate New Draft
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded bg-white/20 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
              >
                <WandSparkles className="h-5 w-5" />
                Open Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-8 max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <BlogDraftsSummary />
        <BlogDraftsRail />

        <section>
          <div className="flex items-center gap-3">
            <span className="h-7 w-1 rounded-full bg-netflix-red shadow-[0_0_30px_rgba(229,9,20,0.6)]" />
            <h2 className="text-2xl font-bold text-white">Prompt Queue</h2>
          </div>
          <p className="mt-2 pl-4 text-sm text-white/45">
            Ideas ready to feed straight into the generator.
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
