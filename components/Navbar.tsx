"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, PlayCircle, X, ChevronDown, LogOut, User, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/blog/drafts", label: "Drafts" },
  { href: "/jobs", label: "Jobs" },
  { href: "/signalforge", label: "SignalForge" },
  { href: "/sagar-os", label: "Sagar OS" },
  { href: "/resume", label: "Resume" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    setOpen(false);
    setAccountOpen(false);
  };

  return (
    <header
      className={cn(
        // Transparent over the billboard, solid once you start scrolling. The
        // hero pulls itself up by exactly this height (-mt-20) to sit beneath.
        "sticky top-0 z-50 h-20 transition-colors duration-500",
        scrolled
          ? "border-b border-white/10 bg-[#050505]/95 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-black/80 to-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl font-black uppercase tracking-tight text-netflix-red drop-shadow-[0_2px_12px_rgba(229,9,20,0.55)]">
            SagarFlix
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/75 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <Link
            href="/blog/generate"
            className="inline-flex items-center gap-2 rounded-full border border-netflix-red/30 bg-netflix-red/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-netflix-red hover:shadow-glow"
          >
            <PlayCircle className="h-4 w-4" />
            Generate
          </Link>

          {status === "loading" ? (
            <div className="h-11 w-11 animate-pulse rounded-full bg-white/10" />
          ) : session?.user ? (
            <div ref={accountMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{session.user.name || session.user.email}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div
                className={cn(
                  "absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-panel p-2 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition duration-200",
                  accountOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
                )}
              >
                <Link
                  href="/jobs"
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/5"
                >
                  <Settings className="h-4 w-4" />
                  Job Tracker
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-300 hover:bg-white/5"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 rounded-full border border-netflix-red/30 bg-netflix-red/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-netflix-red hover:shadow-glow"
            >
              <User className="h-4 w-4" />
              Sign In
            </Link>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white xl:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-white/10 bg-black/90 px-4 pb-4 pt-2 xl:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/blog/generate"
            onClick={() => setOpen(false)}
            className="rounded-xl border border-netflix-red/20 bg-netflix-red/15 px-4 py-3 text-sm font-medium text-white"
          >
            Generate Blog
          </Link>
          {session?.user ? (
            <div className="pt-2 border-t border-white/10">
              <Link
                href="/jobs"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-white/80 hover:bg-white/5"
              >
                <Settings className="h-4 w-4" />
                Job Tracker
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-red-300 hover:bg-white/5"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-netflix-red/20 bg-netflix-red/15 px-4 py-3 text-sm font-medium text-white text-center"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
