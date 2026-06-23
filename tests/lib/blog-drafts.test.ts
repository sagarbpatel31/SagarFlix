import { afterEach, describe, expect, it, vi } from "vitest";
import type { BlogGenerationRequest, BlogGenerationResult } from "@/lib/blog-generator";
import {
  addSavedBlogDraft,
  clearSavedBlogDrafts,
  clearSelectedBlogDraftId,
  getSelectedBlogDraftId,
  loadSavedBlogDrafts,
  removeSavedBlogDraft,
  setSelectedBlogDraftId,
  toggleArchivedBlogDraft,
  togglePinnedBlogDraft,
} from "@/lib/blog-drafts";

function createStorage(seed?: Record<string, string>) {
  const store = new Map<string, string>(Object.entries(seed ?? {}));

  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    snapshot: () => Object.fromEntries(store.entries()),
  };
}

function sampleRequest(): BlogGenerationRequest {
  return {
    topic: "Simulation-first robotics workflows",
    tone: "Technical",
    format: "Blog",
  };
}

function sampleResult(): BlogGenerationResult {
  return {
    title: "Simulation-first robotics workflows",
    summary: "summary",
    fullContent: "content",
    tags: ["Robotics", "Simulation"],
    socialPost: "social",
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("blog draft storage", () => {
  it("adds, loads, and removes drafts in local storage", () => {
    const storage = createStorage();
    vi.stubGlobal("window", { localStorage: storage });
    vi.stubGlobal("crypto", { randomUUID: () => "draft-1" });
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-23T12:00:00.000Z"));

    const created = addSavedBlogDraft(sampleRequest(), sampleResult());
    expect(created).toHaveLength(1);
    expect(created[0]).toMatchObject({
      id: "draft-1",
      pinned: false,
      archived: false,
      request: sampleRequest(),
      result: sampleResult(),
    });

    expect(loadSavedBlogDrafts()).toHaveLength(1);
    expect(removeSavedBlogDraft("draft-1")).toEqual([]);
    expect(loadSavedBlogDrafts()).toEqual([]);
  });

  it("toggles pinned and archived state for stored drafts", () => {
    const storage = createStorage({
      "sagarflix.blog-drafts.v1": JSON.stringify([
        {
          id: "draft-1",
          createdAt: "2026-06-23T12:00:00.000Z",
          updatedAt: "2026-06-23T12:00:00.000Z",
          pinned: false,
          archived: false,
          request: sampleRequest(),
          result: sampleResult(),
        },
      ]),
    });
    vi.stubGlobal("window", { localStorage: storage });
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-23T12:05:00.000Z"));

    const pinned = togglePinnedBlogDraft("draft-1");
    expect(pinned[0]).toMatchObject({ pinned: true });

    const archived = toggleArchivedBlogDraft("draft-1");
    expect(archived[0]).toMatchObject({ archived: true });
  });

  it("tracks the selected draft id in local storage", () => {
    const storage = createStorage();
    vi.stubGlobal("window", { localStorage: storage });

    setSelectedBlogDraftId("draft-1");
    expect(getSelectedBlogDraftId()).toBe("draft-1");

    clearSelectedBlogDraftId();
    expect(getSelectedBlogDraftId()).toBeNull();

    clearSavedBlogDrafts();
    expect(storage.snapshot()).toEqual({});
  });
});

