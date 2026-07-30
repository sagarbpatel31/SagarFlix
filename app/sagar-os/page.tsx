import { ExternalLink, Layers3, Play, Radar, Sparkles } from "lucide-react";
import { Billboard, BillboardAction } from "@/components/Billboard";
import { TitleCard } from "@/components/TitleCard";
import { projects } from "@/data/projects";

const modules = [
  {
    title: "Career tracking and priority surfacing",
    body: "Keeps the pipeline visible so the next move is obvious rather than reconstructed each week.",
    icon: Radar,
  },
  {
    title: "Operational notes for embedded and robotics work",
    body: "The working memory behind the systems — decisions, failures, and what actually fixed them.",
    icon: Layers3,
  },
  {
    title: "Structured evidence and narrative planning",
    body: "Turns raw engineering output into the specific evidence a hiring conversation needs.",
    icon: Sparkles,
  },
];

const related = projects
  .filter((project) => project.tags.some((tag) => ["Systems", "AI/ML", "Career"].includes(tag)))
  .slice(0, 4);

export default function SagarOsPage() {
  return (
    <div className="pb-20">
      <Billboard
        eyebrow="Sagar OS"
        title="The operational backbone."
        meta={[
          <span key="site">sagar-os.vercel.app</span>,
          <span key="role">Operating layer</span>,
          <span key="live" className="text-emerald-400">
            Live
          </span>,
        ]}
        description="Where SignalForge is the public face, Sagar OS is the operating layer underneath — tracking, notes, and structured evidence that keep the career system running on something more durable than memory."
      >
        <BillboardAction href={"https://sagar-os.vercel.app"} external>
          <Play className="h-5 w-5 fill-black" />
          Open live site
        </BillboardAction>
        <BillboardAction href="/jobs" variant="secondary">
          Open job tracker
        </BillboardAction>
      </Billboard>

      <div className="relative z-10 mx-auto -mt-8 max-w-7xl space-y-14 px-4 sm:px-6 lg:px-8">
        <section>
          <div className="flex items-center gap-3">
            <span className="h-7 w-1 rounded-full bg-netflix-red shadow-[0_0_30px_rgba(229,9,20,0.6)]" />
            <h2 className="text-2xl font-bold text-white">Modules</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <div
                  key={module.title}
                  className="group rounded-lg border border-white/10 bg-panel/70 p-6 transition hover:border-netflix-red/35"
                >
                  <Icon className="h-5 w-5 text-netflix-redSoft" />
                  <h3 className="mt-4 text-lg font-bold text-white">{module.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">{module.body}</p>
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
              href="https://sagar-os.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/50 transition hover:text-white"
            >
              Visit Sagar OS
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
