import Link from "next/link";
import { ArrowRight, MonitorPlay, ShieldCheck, Workflow, Sparkles } from "lucide-react";

const features = [
  "Portfolio framing for technical depth",
  "Cinematic visual system that supports storytelling",
  "Useful companion to SagarFlix and Sagar OS",
];

const stats = [
  { label: "Live site", value: "frontendsf.vercel.app" },
  { label: "Role", value: "Public brand layer" },
  { label: "Focus", value: "Storytelling + clarity" },
];

export default function SignalForgePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/45 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(229,9,20,0.22),_transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_40%,rgba(0,0,0,0.24))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-netflix-red/80 to-transparent" />

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-netflix-red">
              <Sparkles className="h-4 w-4" />
              SignalForge
            </div>
            <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl lg:text-6xl">
              The technical brand surface folded into the SagarFlix ecosystem.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
              This page visually represents SignalForge and gives a clear jump-off point for
              the live site. It keeps the branding connected without adding backend complexity.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://frontendsf.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-netflix-red px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]"
              >
                Open Live Site
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View related projects
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/45">{stat.label}</p>
                  <p className="mt-3 text-sm font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/45 p-5">
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-white/50">
              <MonitorPlay className="h-4 w-4 text-netflix-red" />
              Visual representation
            </div>
            <div className="mt-4 space-y-4">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-white/8 bg-white/5 px-4 py-4 text-sm text-white/75"
                >
                  {feature}
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <ShieldCheck className="h-5 w-5 text-netflix-red" />
                <p className="mt-3 text-sm text-white/70">
                  Trusted surface for technical storytelling.
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <Workflow className="h-5 w-5 text-netflix-red" />
                <p className="mt-3 text-sm text-white/70">
                  Works as the public layer of the career OS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
