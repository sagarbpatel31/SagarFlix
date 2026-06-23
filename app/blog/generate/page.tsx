import { BlogGenerator } from "@/components/BlogGenerator";

export const dynamic = "force-dynamic";

export default function BlogGeneratePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/45 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(229,9,20,0.22),_transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_40%,rgba(0,0,0,0.24))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-netflix-red/80 to-transparent" />

        <div className="relative max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-netflix-red">Blog Studio</p>
          <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl lg:text-6xl">
            Generate drafts from a topic, tone, and format.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
            The control surface is in place now, ready for a future generation layer without
            changing the workflow or the layout.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/55">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Provider-ready
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Local draft storage
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Ready for API swap
            </span>
          </div>
        </div>
      </section>

      <div className="mt-10">
        <BlogGenerator />
      </div>
    </div>
  );
}
