import Link from "next/link";
import { ArrowRight, Github, Mail, PlayCircle } from "lucide-react";

const quickLinks = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/jobs", label: "Jobs" },
  { href: "/blog", label: "Blog" },
  { href: "/resume", label: "Resume" },
];

const liveLinks = [
  { href: "https://frontendsf.vercel.app", label: "SignalForge" },
  { href: "https://sagar-os.vercel.app", label: "Sagar OS" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/70">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr_0.85fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
              SagarFlix
            </p>
            <p className="max-w-xl text-sm leading-7 text-white/55">
              A cinematic career OS for portfolio stories, technical writing, job tracking, and
              the external brand surfaces that support the whole system.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog/generate"
                className="inline-flex items-center gap-2 rounded-full bg-netflix-red px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]"
              >
                <PlayCircle className="h-4 w-4" />
                Generate Blog
              </Link>
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10"
              >
                <Mail className="h-4 w-4" />
                Contact
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Navigate</p>
            <div className="mt-4 grid gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white/75 transition hover:border-netflix-red/30 hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                  <ArrowRight className="h-4 w-4 text-white/35" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Live Surfaces</p>
            <div className="mt-4 grid gap-2">
              {liveLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white/75 transition hover:border-netflix-red/30 hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                  <ArrowRight className="h-4 w-4 text-white/35" />
                </a>
              ))}
            </div>

            <a
              href="https://github.com/sagarbpatel31/SagarFlix"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white/75 transition hover:border-netflix-red/30 hover:bg-white/10 hover:text-white"
            >
              <Github className="h-4 w-4" />
              GitHub repository
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
