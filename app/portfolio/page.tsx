import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-netflix-red">Portfolio</p>
        <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">Projects with technical range and narrative weight.</h1>
        <p className="mt-4 text-base leading-7 text-white/65">
          This page surfaces the work that should matter most in a recruiting conversation:
          robotics, embedded systems, AI tooling, and the two live platforms that anchor the brand.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
