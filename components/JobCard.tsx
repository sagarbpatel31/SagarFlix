"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CircleDot, Loader2, Plus, Radio, RotateCcw, Save, Trash2 } from "lucide-react";
import type { JobCompany, JobPriority, JobStatus } from "@/data/jobs";

const statusStyles: Record<string, string> = {
  Saved: "bg-white/8 text-white/80",
  Applied: "bg-red-500/20 text-red-200",
  Interviewing: "bg-amber-500/20 text-amber-100",
  Rejected: "bg-white/6 text-white/55",
  "Follow-up": "bg-cyan-500/20 text-cyan-100",
};

const priorityStyles: Record<string, string> = {
  High: "border-red-500/30 text-red-200",
  Medium: "border-amber-500/30 text-amber-100",
  Low: "border-white/10 text-white/60",
};

const statuses: JobStatus[] = ["Saved", "Applied", "Interviewing", "Rejected", "Follow-up"];
const priorities: JobPriority[] = ["High", "Medium", "Low"];

export function JobCard({
  job,
  onSave,
  onAdd,
  hasLocalOverride,
  isSheetJob,
  isSaving,
  addActionHref,
}: {
  job: JobCompany & { id: string };
  onSave?: (next: { status: JobStatus; priority: JobPriority; notes: string }) => void;
  onAdd?: () => void;
  hasLocalOverride?: boolean;
  isSheetJob?: boolean;
  isSaving?: boolean;
  addActionHref?: string;
}) {
  const [status, setStatus] = useState<JobStatus>(job.status);
  const [priority, setPriority] = useState<JobPriority>(job.priority);
  const [notes, setNotes] = useState(job.notes);
  const isTracked = Boolean(onSave);
  const isInteractive = Boolean(onSave && !isSheetJob);

  useEffect(() => {
    setStatus(job.status);
    setPriority(job.priority);
    setNotes(job.notes);
  }, [job.notes, job.priority, job.status]);

  return (
    <motion.article
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className="group h-full rounded-[1.8rem] border border-white/10 bg-panel2 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CircleDot className="h-4 w-4 text-netflix-red" />
            <h3 className="text-lg font-semibold text-white">{job.company}</h3>
          </div>
          <p className="mt-1 text-sm text-white/55">{job.location}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`rounded-full px-3 py-1 text-xs ${statusStyles[status]}`}>{status}</span>
          {hasLocalOverride ? (
            <span className="rounded-full border border-netflix-red/30 bg-netflix-red/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/75">
              Tracked
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.roleKeywords.map((keyword) => (
          <span key={keyword} className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs text-white/75">
            {keyword}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className={`rounded-full border px-3 py-1 ${priorityStyles[priority]}`}>
          Priority: {priority}
        </span>
        {job.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-white/65">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 p-3">
        <p className="text-xs uppercase tracking-[0.25em] text-white/45">Notes</p>
        {isInteractive ? (
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm leading-6 text-white outline-none placeholder:text-white/30 focus:border-netflix-red/50"
            placeholder="Add notes"
          />
        ) : (
          <p className="mt-2 text-sm leading-6 text-white/72">{notes}</p>
        )}
      </div>

      {isInteractive ? (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-white/45">
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as JobStatus)}
                className="rounded-2xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none"
              >
                {statuses.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-white/45">
              Priority
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value as JobPriority)}
                className="rounded-2xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none"
              >
                {priorities.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onSave?.({ status, priority, notes })}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => onSave?.({ status: "Saved", priority: "Medium", notes: "" })}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </>
      ) : isSheetJob ? (
        addActionHref ? (
          <Link
            href={addActionHref}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-netflix-red px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.01]"
          >
            <Plus className="h-4 w-4" />
            Sign in to add
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            disabled={isSaving}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-netflix-red px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {isSaving ? "Adding..." : "Add to tracker"}
          </button>
        )
      ) : (
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <span className={`rounded-full border px-3 py-1 ${priorityStyles[priority]}`}>
            Priority: {priority}
          </span>
          <span className={`rounded-full px-3 py-1 ${statusStyles[status]}`}>{status}</span>
        </div>
      )}

      <div className="mt-5 rounded-3xl border border-white/10 bg-black/30 p-4 opacity-100 transition duration-300 md:opacity-0 md:group-hover:opacity-100">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/55">
          <Radio className="h-4 w-4 text-netflix-red" />
          Quick fit note
        </div>
        <p className="mt-3 text-sm leading-6 text-white/72">
          {job.roleKeywords[0]} roles here are the strongest match for the current SagarFlix profile.
        </p>
      </div>

      <a
        href={job.careerUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition duration-300 hover:scale-[1.01]"
      >
        Open Career Site
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </motion.article>
  );
}
