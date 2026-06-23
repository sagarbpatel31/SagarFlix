import Link from "next/link";
import { ArrowRight, FileText, Github, Linkedin, Mail, MapPin, Radar, Zap } from "lucide-react";

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
  "Embedded Linux and kernel-facing workflows",
  "Robotics simulation and autonomy tooling",
  "AI-assisted productivity and technical storytelling",
];

const highlights = [
  { label: "Primary region", value: "California / Remote", icon: MapPin },
  { label: "Working style", value: "Systems-first and product-aware", icon: Radar },
  { label: "Delivery mode", value: "Fast iteration, clear communication", icon: Zap },
];

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/45 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(229,9,20,0.22),_transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_40%,rgba(0,0,0,0.24))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-netflix-red/80 to-transparent" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-netflix-red">Resume / Contact</p>
            <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl lg:text-6xl">
              Sagar Patel
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
              Embedded Linux, robotics, AI tooling, and software engineering. This page is the
              contact hub for SagarFlix until the final PDF, references, and real social links are wired in.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:min-w-[24rem] lg:flex-col">
            <a
              href="mailto:hello@sagarpatel.dev"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-netflix-red px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]"
            >
              <Mail className="h-4 w-4" />
              Contact me
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <FileText className="h-4 w-4" />
              View contact details
            </a>
          </div>
        </div>

        <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/45">
                  <Icon className="h-4 w-4 text-netflix-red" />
                  {item.label}
                </div>
                <p className="mt-3 text-base font-semibold text-white">{item.value}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-white">Focus areas</h2>
          <p className="mt-2 text-sm text-white/55">
            The kinds of work this profile is meant to surface in a recruiting conversation.
          </p>
          <ul className="mt-6 space-y-3">
            {focusAreas.map((item) => (
              <li key={item} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-white/75">
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
              <h3 className="text-lg font-semibold text-white">Positioning</h3>
              <p className="mt-4 text-sm leading-7 text-white/70">
                A systems-oriented engineer who can move between low-level debugging,
                software architecture, and product-facing execution.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
              <h3 className="text-lg font-semibold text-white">Use this page for</h3>
              <p className="mt-4 text-sm leading-7 text-white/70">
                Quick outreach, portfolio context, and future resume/PDF handoff once you are ready to publish it.
              </p>
            </div>
          </div>
        </section>

        <aside id="contact" className="rounded-[2rem] border border-white/10 bg-black/50 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-white/50">
            <Radar className="h-4 w-4 text-netflix-red" />
            Contact
          </div>

          <div className="mt-5 space-y-4">
            {contactItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="block rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-netflix-red/30 hover:bg-white/8"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-netflix-red/15 p-3 text-netflix-red">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="truncate text-sm text-white/55">{item.value}</p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-white/35" />
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/65">
            Next step: swap this contact hub with the final resume PDF and live social profile links.
          </div>
        </aside>
      </div>
    </div>
  );
}
