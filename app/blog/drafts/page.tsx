import Link from "next/link";
import { ArrowLeft, Play, Sparkles, WandSparkles } from "lucide-react";
import { Billboard, BillboardAction } from "@/components/Billboard";
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
      <Billboard
        size="sm"
        eyebrow="Blog Library"
        title="Saved drafts, structured for review and reuse."
        description="Review, load, copy, pin, and archive drafts. Signed in, they persist to your account and follow you across devices; anonymous, they stay in this browser."
        topSlot={
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog dashboard
          </Link>
        }
      >
        <BillboardAction href="/blog/generate">
          <Play className="h-5 w-5 fill-black" />
          Generate New Draft
        </BillboardAction>
        <BillboardAction href="/blog" variant="secondary">
          <WandSparkles className="h-5 w-5" />
          Open Dashboard
        </BillboardAction>
      </Billboard>

      <div className="relative z-10 mx-auto -mt-8 max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <BlogDraftsSummary />
        <BlogDraftsRail />

        <section>
          <div className="flex items-center gap-3">
            <span className="h-7 w-1 rounded-full bg-netflix-red shadow-[0_0_30px_rgba(229,9,20,0.6)]" />
            <h2 className="text-2xl font-bold text-white">Prompt Queue</h2>
          </div>
          <p className="mt-2 pl-4 text-sm text-white/55">
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
