import { JobsPortal } from "@/components/JobsPortal";
import { fetchJobsFromSheet } from "@/lib/jobs-sheet";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const { jobs, source } = await fetchJobsFromSheet();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-netflix-red">Jobs</p>
        <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">
          Job application portal and saved company tracker.
        </h1>
        <p className="mt-4 text-base leading-7 text-white/65">
          Companies are imported from the public Google Sheets CSV, then mapped into
          the existing Netflix-style card layout.
        </p>
      </div>

      <JobsPortal jobs={jobs} source={source} />
    </div>
  );
}
