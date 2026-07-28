import { projects } from "@/data/projects";
import { TitleCardStatic } from "@/components/TitleCard";

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-netflix-red">
          Portfolio
        </p>
        <h1 className="mt-4 text-4xl font-black leading-[0.95] text-white sm:text-6xl">
          Projects with technical range and narrative weight.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
          This page surfaces the work that should matter most in a recruiting conversation:
          robotics, embedded systems, AI tooling, and the two live platforms that anchor the brand.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <TitleCardStatic key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
