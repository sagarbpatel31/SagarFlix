"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Sparkles, Trash2, Plus, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import type { JobCompany } from "@/data/jobs";
import { jobFilters } from "@/data/jobs";
import { JobCard } from "@/components/JobCard";
import type { JobsSheetSource } from "@/lib/jobs-sheet";
import { filterJobs } from "@/lib/job-filters";

type JobApplication = JobCompany & { id: string };

export function JobsPortal({ jobs, source }: { jobs: JobCompany[]; source: JobsSheetSource }) {
  const { data: session, update } = useSession();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [userJobs, setUserJobs] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserJobs();
    } else {
      setUserJobs([]);
      setIsLoading(false);
      setLoadError(null);
    }
  }, [session]);

  const fetchUserJobs = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const data = await res.json();
        setUserJobs(data);
      } else {
        setLoadError(`Unable to load saved jobs (${res.status}).`);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setLoadError("Unable to load saved jobs right now.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateOverride = async (slug: string, override: Partial<JobApplication>) => {
    const job = userJobs.find((j) => j.slug === slug);
    if (!job) return;

    setIsSaving(slug);
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(override),
      });
      if (res.ok) {
        const updated = await res.json();
        setUserJobs((prev) => prev.map((j) => (j.id === job.id ? updated : j)));
      }
    } catch (error) {
      console.error("Failed to update job:", error);
    } finally {
      setIsSaving(null);
    }
  };

  const addJobFromSheet = async (job: JobCompany) => {
    if (!session?.user?.id) return;

    setIsSaving(job.slug);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });
      if (res.ok) {
        const newJob = await res.json();
        setUserJobs((prev) => [newJob, ...prev]);
      }
    } catch (error) {
      console.error("Failed to add job:", error);
    } finally {
      setIsSaving(null);
    }
  };

  const displayedJobs = useMemo(() => {
    const sheetJobs = jobs.map((job) => {
      const userJob = userJobs.find((uj) => uj.slug === job.slug);
      return userJob ?? { ...job, id: `sheet-${job.slug}` };
    });
    return sheetJobs;
  }, [jobs, userJobs]);

  const filteredJobs = useMemo(() => {
    return filterJobs(displayedJobs, query, activeFilters);
  }, [activeFilters, displayedJobs, query]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((current) =>
      current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter]
    );
  };

  const isTracked = (slug: string) => userJobs.some((j) => j.slug === slug);
  const getUserJob = (slug: string) => userJobs.find((j) => j.slug === slug);

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full max-w-xl items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3">
          <Search className="h-4 w-4 text-white/45" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search companies, roles, notes..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-white/55">
          <Sparkles className="h-4 w-4 text-netflix-red" />
          {source === "sheet"
            ? "Live data imported from Google Sheets CSV"
            : "Local fallback data in use"}
        </div>
      </div>

      <div
        className={`mt-4 rounded-3xl border px-4 py-3 text-sm ${
          source === "sheet"
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-50"
            : "border-amber-500/20 bg-amber-500/10 text-amber-50"
        }`}
      >
        {source === "sheet" ? (
          <p>
            Companies are coming from the public Google Sheet. Update the sheet later and this
            page will reflect the new entries automatically on refresh.
          </p>
        ) : (
          <p>
            The Google Sheet could not be read, so the portal is using local fallback companies
            to keep the job tracker usable.
          </p>
        )}
      </div>

      {session?.user?.id ? (
        <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-netflix-red" />
              Loading your tracked jobs...
            </span>
          ) : loadError ? (
            <span className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>{loadError}</span>
              <button
                type="button"
                onClick={fetchUserJobs}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 transition hover:bg-white/10"
              >
                Retry
              </button>
            </span>
          ) : (
            <span>
              Your tracker is synced to the database for this signed-in session.
            </span>
          )}
        </div>
      ) : (
        <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          Sign in to save jobs to your database-backed tracker.
          <Link
            href="/auth/signin?callbackUrl=/jobs"
            className="ml-2 inline-flex items-center gap-1 text-netflix-red transition hover:opacity-80"
          >
            Sign in
          </Link>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {jobFilters.map((filter) => {
          const active = activeFilters.includes(filter);
          return (
            <button
              key={filter}
              type="button"
              onClick={() => toggleFilter(filter)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-netflix-red text-white shadow-glow"
                  : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-2 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
        <p>Showing {filteredJobs.length} of {jobs.length} companies. Tracked: {userJobs.length}</p>
        {activeFilters.length > 0 || query ? (
          <button
            type="button"
            onClick={() => {
              setActiveFilters([]);
              setQuery("");
            }}
            className="text-left text-white/70 transition hover:text-white sm:text-right"
          >
            Clear search and filters
          </button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const tracked = isTracked(job.slug);
            const userJob = getUserJob(job.slug);
            const displayJob = userJob || job;
            const isSheetJob = job.id.startsWith("sheet-");
            const saving = isSaving === job.slug;

            return (
              <JobCard
                key={job.slug}
                job={displayJob}
                hasLocalOverride={tracked}
                isSheetJob={isSheetJob}
                isSaving={saving}
                onSave={(next) => updateOverride(job.slug, next)}
                onAdd={() => addJobFromSheet(job)}
                addActionHref={session?.user?.id ? undefined : "/auth/signin?callbackUrl=/jobs"}
              />
            );
          })
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-white/60 md:col-span-2 xl:col-span-3">
            No companies match the current search and filters.
          </div>
        )}
      </div>
    </>
  );
}
