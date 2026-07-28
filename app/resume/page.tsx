import Link from "next/link";
import { ExternalLink, Github, Linkedin, Mail, MapPin, Play, Radar, Zap } from "lucide-react";
import { projects } from "@/data/projects";
import { Billboard } from "@/components/Billboard";
import { TitleCard } from "@/components/TitleCard";

const contactItems = [
  {
    label: "Email",
    value: "hello@sagarpatel.dev",
    href: "mailto:hello@sagarpatel.dev",
    icon: Mail,
  },
  {
    label: "GitHub",
    value: "github.com/sagarbpatel31",
    href: "https://github.com/sagarbpatel31",
    icon: Github,
  },
  {
    label: "LinkedIn",
    value: "Add your profile link",
    href: "https://www.linkedin.com",
    icon: Linkedin,
  },
];

const focusAreas = [
  {
    title: "Embedded Linux & Systems",
    body: "Kernel-facing workflows, edge devices, OTA delivery, and the tooling that keeps fleets healthy.",
  },
  {
    title: "Robotics & Simulation",
    body: "Autonomy tooling, digital twins, and simulation-first workflows for hardware that is expensive to break.",
  },
  {
    title: "AI-Assisted Engineering",
    body: "Agent systems, retrieval pipelines, and productivity tooling that turns technical work into shipped output.",
  },
];

const highlights = [
  { label: "Primary region", value: "California / Remote", icon: MapPin },
  { label: "Working style", value: "Systems-first, product-aware", icon: Radar },
  { label: "Delivery mode", value: "Fast iteration, clear comms", icon: Zap },
];

const featured = projects.filter((project) => project.status === "Featured").slice(0, 4);

export default function ResumePage() {
  return (
    <div className="pb-20">
      <Billboard
        eyebrow="Resume / Contact"
        title="Sagar Patel"
        meta={[
          <span key="embedded">Embedded Linux</span>,
          <span key="robotics">Robotics</span>,
          <span key="ai">AI Tooling</span>,
          <span key="open" className="text-emerald-400">
            Open to opportunities
          </span>,
        ]}
        description="A systems-oriented engineer who moves between low-level debugging, software architecture, and product-facing execution — and can explain the whole path."
      >
        <a
          href="mailto:hello@sagarpatel.dev"
          className="inline-flex items-center gap-2 rounded bg-white px-7 py-3 text-base font-bold text-black transition hover:bg-white/80"
        >
          <Play className="h-5 w-5 fill-black" />
          Get in touch
        </a>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 rounded bg-white/20 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
        >
          View the work
        </Link>
      </Billboard>

      <div className="relative z-10 mx-auto -mt-10 max-w-7xl space-y-14 px-4 sm:px-6 lg:px-8">
        <section className="grid gap-3 sm:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-lg border border-white/10 bg-panel/70 p-5 transition hover:border-netflix-red/35"
              >
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">
                  <Icon className="h-3.5 w-3.5 text-netflix-red" />
                  {item.label}
                </div>
                <p className="mt-3 text-base font-semibold text-white">{item.value}</p>
              </div>
            );
          })}
        </section>

        <section>
          <div className="flex items-center gap-3">
            <span className="h-7 w-1 rounded-full bg-netflix-red shadow-[0_0_30px_rgba(229,9,20,0.6)]" />
            <h2 className="text-2xl font-bold text-white">Focus Areas</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {focusAreas.map((area) => (
              <div
                key={area.title}
                className="group rounded-lg border border-white/10 bg-panel/70 p-6 transition hover:border-netflix-red/35"
              >
                <div className="h-1 w-10 rounded-full bg-netflix-red/60 transition group-hover:w-16" />
                <h3 className="mt-4 text-lg font-bold text-white">{area.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">{area.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3">
            <span className="h-7 w-1 rounded-full bg-netflix-red shadow-[0_0_30px_rgba(229,9,20,0.6)]" />
            <h2 className="text-2xl font-bold text-white">Selected Work</h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featured.map((project) => (
              <TitleCard key={project.slug} project={project} expanded />
            ))}
          </div>
        </section>

        <section id="contact">
          <div className="flex items-center gap-3">
            <span className="h-7 w-1 rounded-full bg-netflix-red shadow-[0_0_30px_rgba(229,9,20,0.6)]" />
            <h2 className="text-2xl font-bold text-white">Contact</h2>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {contactItems.map((item) => {
              const Icon = item.icon;
              const external = item.href.startsWith("http");
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className="group flex items-center gap-4 rounded-lg border border-white/10 bg-panel/70 p-5 transition hover:border-netflix-red/40 hover:bg-white/[0.04]"
                >
                  <span className="rounded-full bg-netflix-red/15 p-3 text-netflix-red">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="truncate text-sm text-white/50">{item.value}</p>
                  </div>
                  <ExternalLink className="ml-auto h-4 w-4 shrink-0 text-white/25 transition group-hover:text-white/60" />
                </a>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
