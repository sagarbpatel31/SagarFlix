"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Download, Trash2, Sparkles, Save, WandSparkles, Tag } from "lucide-react";
import type { BlogFormat, BlogTone } from "@/data/blogs";
import type { BlogGenerationResult } from "@/lib/blog-generator";
import { generateBlogDraft } from "@/lib/blog-generator";
import { resolveBlogGeneratorProvider } from "@/lib/blog-providers";
import {
  addSavedBlogDraft,
  clearSavedBlogDrafts,
  clearSelectedBlogDraftId,
  getSelectedBlogDraftId,
  loadSavedBlogDrafts,
  removeSavedBlogDraft,
  type SavedBlogDraft,
} from "@/lib/blog-drafts";

const tones: BlogTone[] = ["Technical", "Reflective", "Direct", "Founder"];
const formats: BlogFormat[] = ["Blog", "LinkedIn Post", "X Thread"];

export function BlogGenerator() {
  const [topic, setTopic] = useState("Simulation-first robotics workflows");
  const [tone, setTone] = useState<BlogTone>("Technical");
  const [format, setFormat] = useState<BlogFormat>("Blog");
  const [result, setResult] = useState<BlogGenerationResult | null>(null);
  const [savedDrafts, setSavedDrafts] = useState<SavedBlogDraft[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const providerResolution = resolveBlogGeneratorProvider(process.env.NEXT_PUBLIC_BLOG_PROVIDER);
  const provider = providerResolution.provider;
  const providerName = providerResolution.name;

  useEffect(() => {
    const drafts = loadSavedBlogDrafts();
    setSavedDrafts(drafts);

    const selectedId = getSelectedBlogDraftId();
    if (!selectedId) {
      return;
    }

    const selectedDraft = drafts.find((draft) => draft.id === selectedId);
    if (!selectedDraft) {
      clearSelectedBlogDraftId();
      return;
    }

    setTopic(selectedDraft.request.topic);
    setTone(selectedDraft.request.tone);
    setFormat(selectedDraft.request.format);
    setResult(selectedDraft.result);
    setFeedback(`Loaded "${selectedDraft.result.title}" from the blog dashboard.`);
    clearSelectedBlogDraftId();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setFeedback(null);
    try {
      const request = { topic: topic.trim() || "Untitled topic", tone, format };
      const nextResult = await generateBlogDraft(request, provider);
      setResult(nextResult);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Blog generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = () => {
    if (!result) {
      setFeedback("Generate a draft before saving it.");
      return;
    }

    const request = { topic: topic.trim() || "Untitled topic", tone, format };
    const nextDrafts = addSavedBlogDraft(request, result);
    setSavedDrafts(nextDrafts);
    setFeedback("Draft saved locally.");
  };

  const handleLoadDraft = (draft: SavedBlogDraft) => {
    setTopic(draft.request.topic);
    setTone(draft.request.tone);
    setFormat(draft.request.format);
    setResult(draft.result);
    setFeedback(`Loaded "${draft.result.title}".`);
  };

  const handleDeleteDraft = (id: string) => {
    const nextDrafts = removeSavedBlogDraft(id);
    setSavedDrafts(nextDrafts);
    setFeedback("Draft removed.");
  };

  const handleCopy = async (value: string, label: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setFeedback("Clipboard is not available in this environment.");
      return;
    }

    await navigator.clipboard.writeText(value);
    setFeedback(`${label} copied.`);
  };

  const handleClearAll = () => {
    clearSavedBlogDrafts();
    setSavedDrafts([]);
    setFeedback("All saved drafts cleared.");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-panel p-6 shadow-[0_20px_50px_rgba(0,0,0,0.28)]"
      >
        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-white/55">
          <WandSparkles className="h-4 w-4 text-netflix-red" />
          Blog Generator UI
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/65">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            Provider: {providerName}
          </span>
          {providerResolution.isFallback ? (
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-amber-100">
              OpenAI unavailable, using mock fallback
            </span>
          ) : null}
        </div>
        <h2 className="mt-3 text-2xl font-bold text-white">Draft content without leaving the dashboard</h2>
        <p className="mt-2 text-sm leading-6 text-white/60">
          The editor flow, content controls, local persistence, and preview surface are all in
          place so a real generation backend can slot in later without redesigning the experience.
        </p>

        <div className="mt-6 grid gap-4">
          {error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}
          {feedback ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
              {feedback}
            </div>
          ) : null}

          <label className="grid gap-2">
            <span className="text-sm text-white/70">Topic</span>
            <input
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none ring-0 placeholder:text-white/30 focus:border-netflix-red/50"
              placeholder="Enter a topic"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm text-white/70">Tone</span>
              <select
                value={tone}
                onChange={(event) => setTone(event.target.value as BlogTone)}
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
              >
                {tones.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-white/70">Output format</span>
              <select
                value={format}
                onChange={(event) => setFormat(event.target.value as BlogFormat)}
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
              >
                {formats.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 rounded-full bg-netflix-red px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate"}
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </button>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-black/50 p-6"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-white">Preview</h3>
            <p className="mt-1 text-sm text-white/55">
              Provider output and saved draft preview live here.
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/70">
            Saved drafts: {savedDrafts.length}
          </span>
        </div>

        <div className="mt-5 rounded-3xl border border-white/10 bg-panel2 p-5">
          <p className="text-sm uppercase tracking-[0.25em] text-netflix-red">
            {format}
          </p>
          <h4 className="mt-3 text-2xl font-bold text-white">
            {result?.title ?? topic}
          </h4>
          <p className="mt-2 text-sm text-white/60">
            Tone: {tone} {result ? "• Generated" : "• Ready to generate"}
          </p>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-white/8 bg-black/40 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-white/45">Summary</p>
              <p className="mt-2 text-sm leading-7 text-white/80">
                {result?.summary ?? "Generate a draft to preview the summary here."}
              </p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-black/40 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-white/45">Full content</p>
              <div className="mt-3 max-h-[340px] whitespace-pre-line overflow-auto rounded-xl border border-white/5 bg-black/30 p-4 text-sm leading-7 text-white/80">
                {result?.fullContent ?? "The full generated draft will appear here."}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-black/40 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/45">
                  <Tag className="h-4 w-4 text-netflix-red" />
                  Tags
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(result?.tags ?? [tone, format]).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/45">Social post</p>
                  {result ? (
                    <button
                      type="button"
                      onClick={() => handleCopy(result.socialPost, "Social post")}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </button>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-7 text-white/80">
                  {result?.socialPost ?? "A social post version will appear here after generation."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-black/35 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-lg font-semibold text-white">Saved Drafts</h4>
              <p className="mt-1 text-sm text-white/55">
                Stored locally in this browser until you clear them.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearAll}
              disabled={savedDrafts.length === 0}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          </div>

          <div className="mt-4 grid gap-3">
            {savedDrafts.length > 0 ? (
              savedDrafts.map((draft) => (
                <div
                  key={draft.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <h5 className="truncate text-base font-semibold text-white">
                        {draft.result.title}
                      </h5>
                      <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/45">
                        {draft.request.tone} • {draft.request.format} •{" "}
                        {new Date(draft.createdAt).toLocaleDateString()}
                      </p>
                      <p className="mt-2 max-h-12 overflow-hidden text-sm text-white/65">
                        {draft.result.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadDraft(draft)}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
                      >
                        <Download className="h-4 w-4" />
                        Load
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
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-white/60">
                No saved drafts yet. Generate one and click Save Draft.
              </div>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
