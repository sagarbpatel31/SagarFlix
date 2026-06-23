export type ProjectLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  summary: string;
  year: string;
  status: "Featured" | "In Progress" | "Archived";
  stack: string[];
  tags: string[];
  metrics: string[];
  highlights: string[];
  accent: string;
  hero: string;
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: "offline-ota",
    title: "Offline OTA Update System",
    category: "Embedded Systems",
    description:
      "An offline-first OTA update system for Linux edge devices delivering signed bundles over USB or local HTTP, with integrity verification, staged installs, health-check promotion, and automatic rollback — all without cloud dependency.",
    summary:
      "Local-first OTA for Linux edge devices — signed bundles, staged installs, health-check promotion, automatic rollback. Zero cloud required.",
    year: "2026",
    status: "Featured",
    stack: ["Python", "Embedded Linux", "OTA", "Cryptography", "Raspberry Pi", "systemd"],
    tags: ["Embedded", "Systems", "Security", "Edge Computing"],
    metrics: ["Signed bundle verification", "Atomic symlink switching", "Health-check promotion", "Auto rollback on failure"],
    highlights: [
      "Signed bundle verification — version, target, hashes, and signature checked before any install",
      "Staged releases with atomic symlink switching — previous release stays intact on disk",
      "Health-check based promotion: bad updates trigger automatic rollback to last known-good",
      "Offline delivery over USB or local HTTP — zero cloud dependency",
      "Local dashboard with full update history and audit trail",
      "Device updater daemon + state machine, signing tool, and systemd integration units",
    ],
    accent: "from-green-500/35 via-emerald-500/20 to-transparent",
    hero:
      "Offline-first OTA for field-deployed edge hardware — cryptographically safe updates with automatic rollback, entirely offline.",
    links: [
      { label: "GitHub", href: "https://github.com/sagarbpatel31/offline-ota-update-system", external: true },
      { label: "View Detail", href: "/projects/offline-ota" },
    ],
  },
  {
    slug: "embodipedia",
    title: "Embodipedia",
    category: "AI & Multi-Agent Systems",
    description:
      "A self-maintaining encyclopedia for humanoid robotics where autonomous agents ingest tweets, papers, and news; extract typed claims with confidence scores; route each claim into canonical/bull/bear perspective lanes via HydraDB; and synthesize Wikipedia-style prose with inline citations and [unverified] badges.",
    summary:
      "The first self-maintaining encyclopedia for humanoid robotics — AI agents read, extract, route, and synthesize with zero human editors.",
    year: "2026",
    status: "Featured",
    stack: ["Next.js", "TypeScript", "Python", "HydraDB", "GPT-4o", "Multi-Agent AI", "RAG"],
    tags: ["AI/ML", "Multi-Agent", "RAG", "Knowledge Graph", "Robotics"],
    metrics: ["3 perspective sub-tenants", "Per-claim routing", "Time-travel slider", "⌘K palette + entity graphs"],
    highlights: [
      "Self-maintaining encyclopedia — autonomous agents read, extract, route, and synthesize with zero human editors",
      "Three perspective sub-tenants (canonical / bull / bear) in HydraDB — Talk pages render real agent debates",
      "Per-claim routing: one source can feed multiple perspective lanes simultaneously",
      "[unverified] badges instead of hallucination when evidence is too thin",
      "Time-travel slider re-renders articles using only claims published by a chosen past date",
      "⌘K palette synthesizes cited answers + draws SVG entity graphs; live-ingest turns pasted text into claims",
    ],
    accent: "from-purple-500/35 via-violet-500/20 to-transparent",
    hero:
      "An encyclopedia that writes and maintains itself — AI agents curate the knowledge graph of humanoid robotics in real time.",
    links: [
      { label: "GitHub", href: "https://github.com/sagarbpatel31/EMBODIPEDIA", external: true },
      { label: "WikiThon", href: "https://luma.com/6pybuh79?tk=5RGaoS", external: true },
      { label: "View Detail", href: "/projects/embodipedia" },
    ],
  },
  {
    slug: "codebaseos",
    title: "CodebaseOS",
    category: "AI & Developer Tools",
    description:
      "A VS Code extension that explains the origin story of any line of code — surfacing commits, PRs, issues, and decisions behind it in ~200ms with clickable links to real sources. Backed by a HydraDB temporal context graph with Merkle-chain verified ingestion.",
    summary:
      "Right-click any line. Ask why. Get the full origin story across commits, PRs, issues, and decisions — in 200ms.",
    year: "2026",
    status: "Featured",
    stack: ["TypeScript", "Python", "VS Code Extension", "HydraDB", "FastAPI", "OpenAI"],
    tags: ["AI/ML", "Developer Tools", "VS Code", "Code Intelligence", "RAG"],
    metrics: ["~200ms query latency", "Merkle-chain verified", "Honest coverage reporting", "Published to VS Marketplace"],
    highlights: [
      "Right-click any line → full origin story across commits, PRs, issues, and decisions in ~200ms",
      "Graph-grounded answers with clickable links to the real PR / commit / issue",
      "Merkle-chain verified ingestion — prove the context graph matches source history",
      "Honest coverage: small repos ingested completely, large repos sampled and flagged",
      "Editor commands: Why?, Explain this file, What changed, Bus factor — copy any answer as Markdown",
      "VS Code extension + FastAPI backend + force-graph dashboard, published to the Marketplace",
    ],
    accent: "from-blue-500/35 via-indigo-500/20 to-transparent",
    hero:
      "Every line of code has a story. CodebaseOS reconstructs it on demand — commits, PRs, issues, decisions — in 200ms.",
    links: [
      { label: "GitHub", href: "https://github.com/sagarbpatel31/CodeBaseOS", external: true },
      { label: "VS Marketplace", href: "https://marketplace.visualstudio.com/items?itemName=CodeBaseOS.codebaseos", external: true },
      { label: "View Detail", href: "/projects/codebaseos" },
    ],
  },
  {
    slug: "stepahead",
    title: "StepAhead",
    category: "AI & Health Tech",
    description:
      "An AI-powered infant motor development tracker that analyzes baby movements in real time via smartphone camera, tracking milestones, detecting potential delays early, and enabling shareable reports for medical professionals.",
    summary:
      "Peace of mind every step of the way — AI-powered infant motor milestone tracking with real-time movement analysis.",
    year: "2026",
    status: "Featured",
    stack: ["Mobile App", "Computer Vision", "AI", "React Native", "Healthcare"],
    tags: ["AI/ML", "Computer Vision", "Healthcare", "Mobile", "Edge AI"],
    metrics: ["Real-time smartphone analysis", "Age-calibrated benchmarks", "Progress tracking dashboard", "Shareable medical reports"],
    highlights: [
      "Real-time AI movement analysis using smartphone camera — no specialized equipment required",
      "Developmental milestone benchmarks calibrated by age for accurate motor delay detection",
      "Progress tracking dashboard with trend visualization over weeks and months",
      "Shareable reports for pediatricians and specialists with full movement timeline",
      "Flags asymmetric limb usage, delayed reflexes, and atypical muscle tone patterns",
    ],
    accent: "from-pink-500/35 via-rose-500/20 to-transparent",
    hero:
      "Continuous AI-powered visibility into infant motor development between pediatric visits — accessible, collaborative, and early.",
    links: [
      { label: "Live Demo", href: "https://step-ahead-website.vercel.app", external: true },
      { label: "View Detail", href: "/projects/stepahead" },
    ],
  },
  {
    slug: "voiceledger",
    title: "VoiceLedger",
    category: "AI Productivity",
    description:
      "A voice-first capture system that turns spontaneous notes into structured follow-ups and summaries.",
    summary:
      "Designed for fast capture during build sessions, commutes, and meetings without breaking flow.",
    year: "2025",
    status: "Featured",
    stack: ["Next.js", "TypeScript", "Speech-to-text", "LLM UX"],
    tags: ["AI/ML", "Career Intelligence"],
    metrics: ["Voice-first input", "Structured summaries", "Action-item extraction"],
    highlights: [
      "Turns raw voice notes into task lists and short memos.",
      "Optimized for low-friction mobile capture.",
      "Supports topic tagging for later retrieval.",
    ],
    accent: "from-orange-500/35 via-red-500/20 to-transparent",
    hero:
      "Capture ideas by speaking, then convert them into brief, actionable records that are easy to review later.",
    links: [{ label: "View Detail", href: "/projects/voiceledger" }],
  },
  {
    slug: "signalforge",
    title: "SignalForge",
    category: "Systems Design",
    description:
      "Full-stack AI-powered portfolio & blog platform with automated content ingestion, RAG-based search, and multi-LLM orchestration.",
    summary:
      "Production system combining FastAPI backend, Anthropic Claude for reasoning, Upstash Redis for caching/vectors, and Next.js 16 frontend with Tailwind 4. Features 12-hour automated ingestion pipeline via APScheduler/Vercel Cron.",
    year: "Live",
    status: "Featured",
    stack: ["FastAPI", "Anthropic Claude", "Upstash Redis", "Next.js 16", "React 19", "Tailwind 4", "APScheduler"],
    tags: ["Systems Design", "AI/ML", "RAG", "Portfolio", "Full-Stack"],
    metrics: ["~12h automated ingestion", "Multi-LLM routing (Claude/GPT-4o)", "Vector search + keyword hybrid", "Edge-cached responses"],
    highlights: [
      "FastAPI backend with structured Pydantic models and dependency injection",
      "Anthropic Claude 3.5 Sonnet for synthesis + OpenAI GPT-4o fallback routing",
      "Upstash Redis for vector embeddings (1536-dim) + KV caching + rate limiting",
      "Automated ingestion pipeline: GitHub → markdown → chunking → embeddings → Redis",
      "APScheduler (local dev) / Vercel Cron (prod) running every 12 hours",
      "Hybrid search: semantic vectors + BM25 keyword scoring with RRF fusion",
      "Next.js 16 App Router with React 19 Server Components + streaming",
      "Tailwind 4 with CSS-first config, OKLCH colors, container queries",
      "Type-safe end-to-end: Zod schemas shared between FastAPI and Next.js",
      "Observability: structured logging, request tracing, error boundaries",
    ],
    accent: "from-rose-600/35 via-red-500/20 to-transparent",
    hero:
      "SignalForge is an AI-native portfolio system that ingests, indexes, and serves your technical work through intelligent search and generative summaries.",
    links: [
      { label: "Open Live Site", href: "https://frontendsf.vercel.app", external: true },
      { label: "View Detail", href: "/projects/signalforge" },
      { label: "Architecture Docs", href: "https://github.com/your-repo/signalforge", external: true },
    ],
  },
  {
    slug: "marine-plastic-debris-detection",
    title: "Marine Plastic Debris Detection",
    category: "AI Vision",
    description:
      "A computer vision concept for identifying debris in water surfaces from aerial or shoreline footage.",
    summary:
      "Focuses on environmental monitoring, detection reliability, and practical field conditions.",
    year: "2024",
    status: "Featured",
    stack: ["Computer Vision", "Python", "Model Evaluation"],
    tags: ["AI/ML", "Robotics"],
    metrics: ["Environmental focus", "Detection pipeline", "Field-ready framing"],
    highlights: [
      "Detection pipeline tuned for cluttered water backgrounds.",
      "Structured dataset notes for evaluation consistency.",
      "Suitable for drone or shoreline analysis workflows.",
    ],
    accent: "from-cyan-500/35 via-red-500/10 to-transparent",
    hero:
      "A vision-led environmental monitoring concept that explores debris detection in marine settings.",
    links: [{ label: "View Detail", href: "/projects/marine-plastic-debris-detection" }],
  },
  {
    slug: "gps-less-drone-inspection",
    title: "GPS-less Drone Inspection",
    category: "Autonomy",
    description:
      "A mock autonomy stack for drone inspection in locations where GPS is unavailable or unreliable.",
    summary:
      "Combines navigation assumptions, visual anchoring, and operator workflows for constrained environments.",
    year: "2024",
    status: "In Progress",
    stack: ["Robotics", "Perception", "Controls"],
    tags: ["Robotics", "Embedded", "AI/ML"],
    metrics: ["No GPS", "Inspection route planning", "Visual localization"],
    highlights: [
      "Designed for indoor or obstructed inspection paths.",
      "Emphasizes fallback behaviors and operator safety.",
      "Can evolve into a field-testing playbook.",
    ],
    accent: "from-yellow-500/30 via-red-500/10 to-transparent",
    hero:
      "Drone inspection workflows that assume the signal disappears and still need to finish the job.",
    links: [{ label: "View Detail", href: "/projects/gps-less-drone-inspection" }],
  },
  {
    slug: "humanoid-robotics-research",
    title: "Humanoid Robotics Research",
    category: "Research",
    description:
      "A research-oriented project page for humanoid motion, planning, and system integration notes.",
    summary:
      "Frames research ideas into concise technical narratives and experiment logs.",
    year: "2024",
    status: "Archived",
    stack: ["Robotics Research", "Systems Thinking", "Notes"],
    tags: ["Robotics", "Embedded"],
    metrics: ["Research notes", "Experiment log", "Future roadmap"],
    highlights: [
      "Tracks motion and control questions worth revisiting.",
      "Maps open problems to practical implementation areas.",
      "Useful landing page for research summaries and references.",
    ],
    accent: "from-neutral-300/20 via-red-500/10 to-transparent",
    hero:
      "A research notebook for humanoid robotics topics that need to stay organized and searchable.",
    links: [{ label: "View Detail", href: "/projects/humanoid-robotics-research" }],
  },
  {
    slug: "embedded-linux-kernel-work",
    title: "Embedded Linux Kernel Work",
    category: "Embedded Systems",
    description:
      "Kernel-facing notes and project evidence around boot, drivers, interfaces, and debugging.",
    summary:
      "Built to show depth in low-level systems work and the debugging discipline that comes with it.",
    year: "2023",
    status: "Featured",
    stack: ["Linux", "Kernel Debugging", "C", "Bash"],
    tags: ["Embedded", "Career Intelligence"],
    metrics: ["Boot path analysis", "Driver notes", "Debug traces"],
    highlights: [
      "Captures problem/solution pairs from low-level debugging.",
      "Creates a clean narrative for systems-heavy interviews.",
      "Supports links to evidence, patches, and notes.",
    ],
    accent: "from-slate-400/25 via-red-500/10 to-transparent",
    hero:
      "Evidence-driven embedded Linux work presented as a structured technical story.",
    links: [{ label: "View Detail", href: "/projects/embedded-linux-kernel-work" }],
  },
  {
    slug: "ros2-gazebo-simulation",
    title: "ROS2 + Gazebo Simulation",
    category: "Robotics Stack",
    description:
      "A simulation-first robotics environment for validating perception, motion, and orchestration ideas.",
    summary:
      "Useful as a foundation project for autonomy demos, testing, and robotics portfolio depth.",
    year: "2024",
    status: "In Progress",
    stack: ["ROS2", "Gazebo", "C++", "Python"],
    tags: ["Robotics", "Simulation"],
    metrics: ["Simulation-first", "Modular nodes", "Debuggable runs"],
    highlights: [
      "Robotics base layer for future multi-agent and autonomy work.",
      "Keeps experimentation reproducible in simulation.",
      "Good bridge between software engineering and robotics systems.",
    ],
    accent: "from-red-500/25 via-orange-500/10 to-transparent",
    hero:
      "A practical simulation stack for robotics work that needs repeatable tests before hardware.",
    links: [{ label: "View Detail", href: "/projects/ros2-gazebo-simulation" }],
  },
  {
    slug: "sagar-os",
    title: "Sagar OS",
    category: "Career Platform",
    description:
      "Your existing Sagar OS site, framed as the command center for career and operational tracking.",
    summary:
      "Acts as the operational layer for notes, systems, and structured personal workflows.",
    year: "Live",
    status: "Featured",
    stack: ["Next.js", "Workflow UI", "Portfolio"],
    tags: ["Career Intelligence", "Embedded"],
    metrics: ["Live site", "Personal OS", "Workflow framing"],
    highlights: [
      "Provides a systems-first representation of your work.",
      "Pairs naturally with the Netflix-style SagarFlix shell.",
      "Can later host richer workflow tools and data integrations.",
    ],
    accent: "from-red-500/35 via-fuchsia-500/10 to-transparent",
    hero:
      "Sagar OS is the operational backbone, organized for tracking work, priorities, and next actions.",
    links: [
      { label: "Open Live Site", href: "https://sagar-os.vercel.app", external: true },
      { label: "View Detail", href: "/projects/sagar-os" },
    ],
  },
  {
    slug: "watchpoint",
    title: "Watchpoint",
    category: "Robotics & AI",
    description:
      "A robotics observability platform with a lightweight Go edge agent for Linux/Jetson hardware, Python ROS2 collector, and AI-assisted root cause analysis. Captures incidents (node crashes, topic starvation, thermal throttling) and generates portable replay bundles with correlated telemetry.",
    summary:
      "Stop guessing why your robot failed — Watchpoint captures incidents, correlates telemetry, and generates replayable failure bundles with AI root-cause analysis.",
    year: "2026",
    status: "Featured",
    stack: ["Go", "Python", "FastAPI", "Next.js", "PostgreSQL", "ROS2", "Docker"],
    tags: ["Robotics", "Observability", "AI/ML", "Edge Computing", "Systems"],
    metrics: ["10K+ incidents captured", "73% MTTR reduction", "5+ edge platforms", "Portable replay bundles"],
    highlights: [
      "Lightweight Go edge agent — CPU, memory, GPU, disk metrics with local ring buffer for pre-incident context",
      "Python ROS2 collector: topic publish rate monitoring, node health, message lag detection",
      "Auto-incident capture on node crash, topic starvation, thermal throttling, or process failure",
      "Portable replay bundles (.zip) with all incident evidence — shareable across teams",
      "Rules-based + AI-assisted RCA: identifies resource contention, version regressions, failure chains",
      "73% MTTR reduction and 10K+ incidents captured in production testing",
    ],
    accent: "from-amber-500/35 via-orange-500/20 to-transparent",
    hero:
      "Robot failures as first-class incidents — automatic capture, correlation, and AI-assisted root cause in a single timeline.",
    links: [
      { label: "Live Demo", href: "https://watchpoint-gray.vercel.app", external: true },
      { label: "GitHub", href: "https://github.com/sagarbpatel31/watchpoint", external: true },
      { label: "View Detail", href: "/projects/watchpoint" },
    ],
  },
  {
    slug: "xg1",
    title: "XG1",
    category: "Physical AI & Robotics",
    description:
      "A rapid-iteration humanoid robot learning pipeline for the Unitree G1 built in 36 hours. Combines Meta Quest 3 teleoperation with MuJoCo/NVIDIA Sonic, DeepLake tensor storage for demonstration data, NVIDIA GR00T policy fine-tuning, and Nomadic AI diagnostics. Won 2 tracks at Intelligence at the Frontier Hackathon.",
    summary:
      "2-day humanoid robot pipeline for the Unitree G1 — Meta Quest 3 teleop, DeepLake data, GR00T fine-tuning, Nomadic diagnostics. Won 2 tracks.",
    year: "2026",
    status: "Featured",
    stack: ["Robotics", "Unitree G1", "Meta Quest 3", "MuJoCo", "NVIDIA Sonic", "DeepLake", "NVIDIA GR00T", "Nomadic AI"],
    tags: ["Robotics", "Physical AI", "Humanoid", "Imitation Learning", "Hackathon"],
    metrics: ["36-hour build", "45 min demo data", "135K timesteps", "2 hackathon tracks won"],
    highlights: [
      "Meta Quest 3 + MuJoCo teleoperation with NVIDIA Sonic for low-latency control",
      "DeepLake tensor storage for high-throughput streaming of G1 demonstration data",
      "NVIDIA GR00T policy fine-tuning on 45 min of collected demonstrations (135K timesteps)",
      "Nomadic AI diagnostics layer pinpointing fine-tuned agent failure modes",
      "Successful execution: walking to tables, beverage and apple pick-and-place",
      "Built in 36 hours from blank slate to autonomous policy testing",
    ],
    accent: "from-red-500/35 via-rose-500/20 to-transparent",
    hero:
      "From manual demonstration to autonomous humanoid policy in 36 hours — immersive teleop, tensor data, and foundation model fine-tuning.",
    links: [
      { label: "Hackathon", href: "https://intelligence-at-the-frontier-hackathon.devspot.app/?activeTab=challenges&challenge=484", external: true },
      { label: "View Detail", href: "/projects/xg1" },
    ],
  },
  {
    slug: "hydraswarm",
    title: "HydraSwarm",
    category: "AI & Multi-Agent Systems",
    description:
      "A 7-agent software engineering company simulation where every agent queries HydraDB before acting and stores lessons back after. Demonstrates provable institutional learning: run 1 scores 7/10, run 2 recalls mistakes and scores 8/10, run 3 reaches 9/10. Uses 7 distinct HydraDB capabilities including knowledge ingestion, sub-tenants per agent, shared org memory, hybrid recall, graph relations, and inference.",
    summary:
      "A 7-agent AI software company with institutional memory — provable improvement across runs (7/10 → 9/10) via HydraDB recall-generate-store loop.",
    year: "2026",
    status: "Featured",
    stack: ["Next.js", "TypeScript", "DeepLake", "HydraDB", "SSE", "Multi-Agent AI", "RAG"],
    tags: ["AI/ML", "Multi-Agent", "RAG", "Memory Systems", "Hackathon"],
    metrics: ["Hackathon Winner", "325 unit tests across 21 suites", "7/10 → 9/10 score improvement", "7 HydraDB capabilities"],
    highlights: [
      "7 specialized agents (PM, Architect, Developer, Reviewer, QA, SRE, CTO) with recall-generate-store loop",
      "Provable improvement across runs: 7/10 → 8/10 → 9/10 as lessons accumulate",
      "7 distinct HydraDB capabilities: ingestion, sub-tenants, shared memory, hybrid recall, graph relations, inference, explorer",
      "Live agent thinking log with SSE streaming showing real-time HydraDB ops",
      "Run comparison view with score deltas, recalled context diffs, improvement badges",
      "325 unit tests across 21 suites — backend, frontend, API, streaming all covered",
    ],
    accent: "from-indigo-500/35 via-purple-500/20 to-transparent",
    hero:
      "Multi-agent AI with real institutional memory — every agent recalls, generates, and stores lessons. Provable learning across runs.",
    links: [
      { label: "GitHub", href: "https://github.com/sagarbpatel31/HydraSwarm", external: true },
      { label: "Hackathon", href: "https://luma.com/uv13n64x?tk=wjHDI0", external: true },
      { label: "View Detail", href: "/projects/hydraswarm" },
    ],
  },
  {
    slug: "portfolio-nextjs16",
    title: "Portfolio v2 (Next.js 16 + React 19 + Tailwind 4)",
    category: "Frontend Architecture",
    description:
      "Modern portfolio rewrite leveraging Next.js 16 App Router, React 19 Server Components, and Tailwind 4 CSS-first architecture.",
    summary:
      "Zero-JS interactive islands with selective hydration, streaming SSR, and CSS-native theming. Case studies rendered as MDX with component composition.",
    year: "2025",
    status: "Featured",
    stack: ["Next.js 16", "React 19", "Tailwind 4", "TypeScript", "MDX", "Framer Motion"],
    tags: ["Frontend", "Architecture", "Performance", "Design Systems"],
    metrics: ["~0KB JS for static case studies", "Streaming SSR with Suspense", "OKLCH color space", "Container queries"],
    highlights: [
      "Next.js 16 App Router with nested layouts and parallel routes",
      "React 19 Server Components by default, 'use client' only for interactivity",
      "Tailwind 4 CSS-first config: @theme directive, OKLCH colors, registerCustomProperties",
      "MDX case studies with custom components (MetricCard, TechStack, ArchitectureDiagram)",
      "Framer Motion layout animations with reduced-motion respect",
      "Streaming responses with Suspense boundaries for progressive enhancement",
      "Edge runtime for auth/middleware, Node.js for dynamic content",
      "Type-safe content layer with contentlayer or velocity for MDX",
      "ISR for case studies (revalidate: 3600) with on-demand revalidation",
      "Bundle analysis: <50KB initial JS, 95+ Lighthouse scores",
    ],
    accent: "from-cyan-500/35 via-blue-500/20 to-transparent",
    hero:
      "A bleeding-edge portfolio demonstrating React 19 streaming, Tailwind 4 CSS-native theming, and zero-JS content rendering.",
    links: [
      { label: "View Detail", href: "/projects/portfolio-nextjs16" },
      { label: "Source", href: "https://github.com/your-repo/portfolio", external: true },
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
