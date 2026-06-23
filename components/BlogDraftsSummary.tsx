"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, FileText, Layers3, Pin, Sparkles } from "lucide-react";
import { loadSavedBlogDrafts, type SavedBlogDraft } from "@/lib/blog-drafts";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogDraftsSummary() {
  const [drafts, setDrafts] = useState<SavedBlogDraft[]>([]);

  useEffect(() => {
    setDrafts(loadSavedBlogDrafts());
  }, []);

  const sortedDrafts = useMemo(
    () =>
      [...drafts].sort((a, b) => {
        if (a.pinned !== b.pinned) {
          return a.pinned ? -1 : 1;
        }
        if (a.archived !== b.archived) {
          return a.archived ? 1 : -1;
        }
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }),
    [drafts],
  );

  const stats = useMemo(
    () => [
      { label: "Saved", value: drafts.length.toString(), icon: FileText },
      {
        label: "Pinned",
        value: drafts.filter((draft) => draft.pinned).length.toString(),
        icon: Pin,
      },
      {
        label: "Latest",
        value: sortedDrafts.length > 0 ? formatDate(sortedDrafts[0].updatedAt) : "None",
        icon: CalendarDays,
      },
      {
        label: "Archived",
        value: drafts.filter((draft) => draft.archived).length.toString(),
        icon: Layers3,
      },
    ],
    [drafts, sortedDrafts],
  );

  return (
    <section className="rounded-3xl border border-white/10 bg-panel p-6">
      <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-white/55">
        <Sparkles className="h-4 w-4 text-netflix-red" />
        Draft Library
      </div>
      <h2 className="mt-3 text-2xl font-semibold text-white">
        Your saved drafts at a glance
      </h2>
      <p className="mt-2 text-sm text-white/55">
        A quick summary of what is stored locally in this browser.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/45">
                <Icon className="h-4 w-4 text-netflix-red" />
                {stat.label}
              </div>
              <p className="mt-3 text-xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
