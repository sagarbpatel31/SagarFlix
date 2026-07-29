import { ExternalLink, Play, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { Billboard, BillboardAction } from "@/components/Billboard";
import { TitleCard } from "@/components/TitleCard";
import { projects } from "@/data/projects";

const features = [
  {
    title: "Portfolio framing for technical depth",
    body: "Positions the work so the engineering substance lands before the visual polish does.",
    icon: Sparkles,
  },
  {
    title: "Trusted surface for technical storytelling",
    body: "A public face that stays credible to engineers while remaining legible to recruiters.",
    icon: ShieldCheck,
  },
  {
    title: "The public layer of the career OS",
    body: "Connects outward to the live site while SagarFlix holds the deeper portfolio system.",
    icon: Workflow,
  },
];

const related = projects
  .filter((project) => project.tags.some((tag) => ["Systems", "Developer Tools"].includes(tag)))
  .slice(0, 4);

export default function SignalForgePage() {
  return (
    <div className="pb-20">
      <Billboard
        eyebrow="SignalForge"
        title="The technical brand surface."
        meta={[
          <span key="site">frontendsf.vercel.app</span>,
          <span key="role">Public brand layer</span>,
          <span key="live" className="text-emerald-400">
            Live
          </span>,
        ]}
        description="SignalForge is the outward-facing brand layer of the ecosystem — storytelling and clarity, pointed at the live site, without adding backend complexity to SagarFlix itself."
      >
        <BillboardAction href={"https://frontendsf.vercel.app"} external>
          <Play className="h-5 w-5 fill-black" />
          Open live site
        </BillboardAction>
        <BillboardAction href="/portfolio" variant="secondary">
          View related projects
        </BillboardAction>
      </Billboard>

      <div className="relative z-10 mx-auto -mt-8 max-w-7xl space-y-14 px-4 sm:px-6 lg:px-8">
        <section>
          <div className="flex items-center gap-3">
            <span className="h-7 w-1 rounded-full bg-netflix-red shadow-[0_0_30px_rgba(229,9,20,0.6)]" />
            <h2 className="text-2xl font-bold text-white">What it does</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-lg border border-white/10 bg-panel/70 p-6 transition hover:border-netflix-red/35"
                >
                  <Icon className="h-5 w-5 text-netflix-red" />
                  <h3 className="mt-4 text-lg font-bold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">{feature.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="h-7 w-1 rounded-full bg-netflix-red shadow-[0_0_30px_rgba(229,9,20,0.6)]" />
              <h2 className="text-2xl font-bold text-white">Related Work</h2>
            </div>
            <a
              href="https://frontendsf.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/50 transition hover:text-white"
            >
              Visit SignalForge
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((project) => (
              <TitleCard key={project.slug} project={project} expanded />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
