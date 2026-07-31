import { Play, Sparkles } from "lucide-react";
import { Billboard, BillboardAction } from "@/components/Billboard";
import { JobsPortal } from "@/components/JobsPortal";
import { fetchJobsFromSheet } from "@/lib/jobs-sheet";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const { jobs, source } = await fetchJobsFromSheet();
  const liveFromSheet = source === "sheet";

  return (
    <div className="pb-20">
      <Billboard
        size="sm"
        eyebrow="Jobs"
        title="Application portal and company tracker."
        meta={[
          <span key="count">{jobs.length} companies</span>,
          // The portal already explains the fallback in detail; the billboard
          // only needs to say which source the numbers above came from.
          liveFromSheet ? (
            <span key="source" className="text-emerald-400">
              Live from Google Sheets
            </span>
          ) : (
            <span key="source" className="text-amber-300">
              Local fallback data
            </span>
          ),
        ]}
        description="Companies are imported from the public Google Sheets CSV and mapped into the same card layout as the rest of the site. Sign in to track status, priority, and notes against your account."
      >
        <BillboardAction href="#tracker">
          <Play className="h-5 w-5 fill-black" />
          Open tracker
        </BillboardAction>
        <BillboardAction href="/sagar-os" variant="secondary">
          <Sparkles className="h-5 w-5" />
          About Sagar OS
        </BillboardAction>
      </Billboard>

      <div id="tracker" className="relative z-10 mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <JobsPortal jobs={jobs} source={source} />
      </div>
    </div>
  );
}
