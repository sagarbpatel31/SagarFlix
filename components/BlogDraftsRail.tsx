"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Trash2, Copy, Sparkles, Pin, Archive, ArchiveRestore } from "lucide-react";
import { motion } from "framer-motion";
import {
  clearSavedBlogDrafts,
  setSelectedBlogDraftId,
  loadSavedBlogDrafts,
  removeSavedBlogDraft,
  toggleArchivedBlogDraft,
  togglePinnedBlogDraft,
  type SavedBlogDraft,
} from "@/lib/blog-drafts";

export function BlogDraftsRail() {
  const [drafts, setDrafts] = useState<SavedBlogDraft[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setDrafts(loadSavedBlogDrafts());
  }, []);

  const sortedDrafts = useMemo(() => {
    return [...drafts].sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }
      if (a.archived !== b.archived) {
        return a.archived ? 1 : -1;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [drafts]);

  const refreshDrafts = () => setDrafts(loadSavedBlogDrafts());

  const handleCopy = async (value: string, label: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setFeedback("Clipboard unavailable.");
      return;
    }

    await navigator.clipboard.writeText(value);
    setFeedback(`${label} copied.`);
  };

  const handleDelete = (id: string) => {
    setDrafts(removeSavedBlogDraft(id));
    setFeedback("Draft deleted.");
  };

  const handleTogglePinned = (id: string) => {
    setDrafts(togglePinnedBlogDraft(id));
    setFeedback("Draft pin updated.");
  };

  const handleToggleArchived = (id: string) => {
    setDrafts(toggleArchivedBlogDraft(id));
    setFeedback("Draft archive status updated.");
  };

  const handleClearAll = () => {
    clearSavedBlogDrafts();
    refreshDrafts();
    setFeedback("All saved drafts cleared.");
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-black/50 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-white/55">
            <Sparkles className="h-4 w-4 text-netflix-red" />
            Saved Drafts
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Drafts you can bring back later
          </h2>
          <p className="mt-2 text-sm text-white/55">
            These are stored locally in your browser. No backend required yet.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearAll}
          disabled={drafts.length === 0}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </button>
      </div>

      {feedback ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          {feedback}
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {sortedDrafts.length > 0 ? (
          sortedDrafts.map((draft) => (
            <motion.article
              key={draft.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-4 ${
                draft.archived ? "border-white/6 bg-white/3 opacity-75" : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <Link
                    href={`/blog/drafts/${draft.id}`}
                    className="truncate text-base font-semibold text-white transition hover:text-netflix-red"
                  >
                    {draft.result.title}
                  </Link>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/45">
                    {draft.request.tone} • {draft.request.format} •{" "}
                    {new Date(draft.createdAt).toLocaleDateString()}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em]">
                    {draft.pinned ? (
                      <span className="rounded-full border border-netflix-red/30 bg-netflix-red/10 px-2.5 py-1 text-white/80">
                        Pinned
                      </span>
                    ) : null}
                    {draft.archived ? (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/60">
                        Archived
                      </span>
                    ) : null}
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/60">
                      Updated {new Date(draft.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 max-h-12 overflow-hidden text-sm text-white/65">
                    {draft.result.summary}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/blog/generate"
                    onClick={() => {
                      setSelectedBlogDraftId(draft.id);
                      setFeedback(`Loading "${draft.result.title}" in the generator.`);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
                  >
                    <Download className="h-4 w-4" />
                    Load in Generator
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleCopy(draft.result.fullContent, "Full draft")}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTogglePinned(draft.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75"
                  >
                    <Pin className="h-4 w-4" />
                    {draft.pinned ? "Unpin" : "Pin"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleArchived(draft.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75"
                  >
                    {draft.archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                    {draft.archived ? "Unarchive" : "Archive"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(draft.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.article>
          ))
        ) : (
          <div className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-white/60">
            No saved drafts yet. Generate one in the blog studio and save it locally.
          </div>
        )}
      </div>
    </section>
  );
}
