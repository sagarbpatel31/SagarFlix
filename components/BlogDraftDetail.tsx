"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Copy,
  Download,
  Pin,
  Trash2,
  Sparkles,
} from "lucide-react";
import {
  clearSelectedBlogDraftId,
  loadSavedBlogDrafts,
  removeSavedBlogDraft,
  toggleArchivedBlogDraft,
  togglePinnedBlogDraft,
  setSelectedBlogDraftId,
  type SavedBlogDraft,
} from "@/lib/blog-drafts";

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function BlogDraftDetail({ draftId }: { draftId: string }) {
  const [drafts, setDrafts] = useState<SavedBlogDraft[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setDrafts(loadSavedBlogDrafts());
  }, []);

  const draft = useMemo(
    () => drafts.find((item) => item.id === draftId),
    [draftId, drafts],
  );

  const handleCopy = async (value: string, label: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setFeedback("Clipboard unavailable.");
      return;
    }

    await navigator.clipboard.writeText(value);
    setFeedback(`${label} copied.`);
  };

  const handleLoadInGenerator = () => {
    if (!draft) {
      return;
    }

    setSelectedBlogDraftId(draft.id);
    window.location.href = "/blog/generate";
  };

  const handleDelete = () => {
    if (!draft) {
      return;
    }

    const nextDrafts = removeSavedBlogDraft(draft.id);
    setDrafts(nextDrafts);
    clearSelectedBlogDraftId();
    setFeedback("Draft deleted.");
  };

  const handleTogglePinned = () => {
    if (!draft) {
      return;
    }

    setDrafts(togglePinnedBlogDraft(draft.id));
    setFeedback(draft.pinned ? "Draft unpinned." : "Draft pinned.");
  };

  const handleToggleArchived = () => {
    if (!draft) {
      return;
    }

    setDrafts(toggleArchivedBlogDraft(draft.id));
    setFeedback(draft.archived ? "Draft unarchived." : "Draft archived.");
  };

  if (!draft) {
    return (
      <section className="rounded-3xl border border-white/10 bg-black/50 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-netflix-red">Blog Draft</p>
        <h1 className="mt-4 text-3xl font-black text-white">Draft not found</h1>
        <p className="mt-4 text-base leading-7 text-white/65">
          This draft is not saved in the current browser. Go back to the library or generate a new draft.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/blog/drafts"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to library
          </Link>
          <Link
            href="/blog/generate"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
          >
            <Sparkles className="h-4 w-4" />
            Open generator
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-black/50 p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-netflix-red">Blog Draft</p>
          <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">
            {draft.result.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/65">
            <span className="rounded-full bg-white/8 px-3 py-1">{draft.request.tone}</span>
            <span className="rounded-full bg-white/8 px-3 py-1">{draft.request.format}</span>
            <span className="rounded-full bg-white/8 px-3 py-1">{formatDate(draft.createdAt)}</span>
            {draft.pinned ? (
              <span className="rounded-full border border-netflix-red/30 bg-netflix-red/10 px-3 py-1">
                Pinned
              </span>
            ) : null}
            {draft.archived ? (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Archived
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/blog/drafts"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <button
            type="button"
            onClick={handleLoadInGenerator}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
          >
            <Download className="h-4 w-4" />
            Load in Generator
          </button>
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
            onClick={handleTogglePinned}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75"
          >
            <Pin className="h-4 w-4" />
            {draft.pinned ? "Unpin" : "Pin"}
          </button>
          <button
            type="button"
            onClick={handleToggleArchived}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75"
          >
            {draft.archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
            {draft.archived ? "Unarchive" : "Archive"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-100"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {feedback ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          {feedback}
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-white/10 bg-panel p-5">
          <h2 className="text-xl font-semibold text-white">Summary</h2>
          <p className="mt-3 text-sm leading-7 text-white/70">{draft.result.summary}</p>

          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
              Tags
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {draft.result.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs text-white/75">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
            <h2 className="text-xl font-semibold text-white">Social Post</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/70">
              {draft.result.socialPost}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
            <h2 className="text-xl font-semibold text-white">Raw Draft</h2>
            <pre className="mt-3 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-2xl border border-white/8 bg-black/40 p-4 text-sm leading-7 text-white/80">
{draft.result.fullContent}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
