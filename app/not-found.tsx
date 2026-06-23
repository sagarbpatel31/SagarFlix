import Link from "next/link";
import { ArrowLeft, PlayCircle, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[72vh] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/45 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.35)] sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(229,9,20,0.22),_transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_40%,rgba(0,0,0,0.24))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-netflix-red/80 to-transparent" />

        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-netflix-red">
              <SearchX className="h-4 w-4" />
              Page not found
            </div>
            <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl lg:text-6xl">
              This scene is missing from the queue.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
              The route you opened does not exist in SagarFlix. Head back to the dashboard or
              open the blog generator to keep moving.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-netflix-red px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
              <Link
                href="/blog/generate"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <PlayCircle className="h-4 w-4" />
                Open generator
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/45 p-6">
            <div className="rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(229,9,20,0.45),_rgba(0,0,0,0.88)_62%)] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/65">404</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm text-white/75">
                  Home dashboard
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm text-white/75">
                  Portfolio
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm text-white/75">
                  Jobs tracker
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
