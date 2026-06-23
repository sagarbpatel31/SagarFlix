export type BlogTone = "Technical" | "Reflective" | "Direct" | "Founder";
export type BlogFormat = "Blog" | "LinkedIn Post" | "X Thread";

export type BlogDraft = {
  slug: string;
  title: string;
  topic: string;
  tone: BlogTone;
  format: BlogFormat;
  status: "Draft" | "Scheduled" | "Published";
  updatedAt: string;
  excerpt: string;
};

export const blogDrafts: BlogDraft[] = [
  {
    slug: "embedded-linux-debugging-notes",
    title: "Embedded Linux Debugging Notes",
    topic: "Kernel debugging workflow",
    tone: "Technical",
    format: "Blog",
    status: "Draft",
    updatedAt: "2026-06-10",
    excerpt: "A practical checklist for narrowing down boot issues, driver bugs, and regression sources.",
  },
  {
    slug: "why-simulation-first-robotics-matters",
    title: "Why Simulation-First Robotics Matters",
    topic: "Simulation as a development multiplier",
    tone: "Founder",
    format: "LinkedIn Post",
    status: "Scheduled",
    updatedAt: "2026-06-11",
    excerpt: "A short argument for using simulation to de-risk autonomy and speed iteration.",
  },
  {
    slug: "career-os-notes",
    title: "Designing a Personal Career OS",
    topic: "Career operations and systems thinking",
    tone: "Reflective",
    format: "X Thread",
    status: "Draft",
    updatedAt: "2026-06-12",
    excerpt: "A thread-sized narrative on turning job search and project tracking into a system.",
  },
];

export const blogIdeas = [
  "How I structure robotics projects so they stay interview-ready",
  "The debugging routine I use when embedded systems fail",
  "What a career OS should track beyond applications",
  "How simulation-first workflows improve robotics velocity",
  "Turning technical notes into publishable content quickly",
];
