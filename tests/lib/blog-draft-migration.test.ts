import { afterEach, describe, expect, it, vi } from "vitest";
import { migrateLocalDraftsToAccount } from "@/lib/blog-draft-migration";
import type { BlogDraftStore } from "@/lib/blog-draft-store";
import type { SavedBlogDraft } from "@/lib/blog-drafts";

function draft(id: string, topic: string): SavedBlogDraft {
  return {
    id,
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
    pinned: false,
    archived: false,
    request: { topic, tone: "Technical", format: "Blog" },
    result: { title: topic, summary: "s", fullContent: "c", tags: [], socialPost: "p" },
  };
}

function createStorage(seed: SavedBlogDraft[]) {
  const store = new Map<string, string>([
    ["sagarflix.blog-drafts.v1", JSON.stringify(seed)],
  ]);
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
    read: () => JSON.parse(store.get("sagarflix.blog-drafts.v1") ?? "[]") as SavedBlogDraft[],
  };
}

function remoteStore(overrides: Partial<BlogDraftStore> = {}): BlogDraftStore {
  return {
    isRemote: true,
    list: vi.fn().mockResolvedValue([]),
    add: vi.fn().mockResolvedValue([]),
    remove: vi.fn().mockResolvedValue([]),
    setPinned: vi.fn().mockResolvedValue([]),
    setArchived: vi.fn().mockResolvedValue([]),
    clear: vi.fn().mockResolvedValue([]),
    ...overrides,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("migrateLocalDraftsToAccount", () => {
  it("moves every local draft and clears them once the server has them", async () => {
    const storage = createStorage([draft("a", "first"), draft("b", "second")]);
    vi.stubGlobal("window", { localStorage: storage });
    const store = remoteStore();

    const result = await migrateLocalDraftsToAccount(store);

    expect(result).toEqual({ migrated: 2, remaining: 0 });
    expect(store.add).toHaveBeenCalledTimes(2);
    expect(storage.read()).toHaveLength(0);
  });

  it("sends oldest first so account order matches the browser's", async () => {
    // loadSavedBlogDrafts returns newest-first; migration reverses that.
    const newest = draft("new", "newest");
    newest.updatedAt = "2026-08-01T00:00:00.000Z";
    const oldest = draft("old", "oldest");

    const storage = createStorage([newest, oldest]);
    vi.stubGlobal("window", { localStorage: storage });
    const store = remoteStore();

    await migrateLocalDraftsToAccount(store);

    const topics = (store.add as ReturnType<typeof vi.fn>).mock.calls.map((call) => call[0].topic);
    expect(topics).toEqual(["oldest", "newest"]);
  });

  // The safety property: a partial failure must never lose a draft.
  it("keeps un-migrated drafts in the browser when the server rejects one", async () => {
    const storage = createStorage([draft("a", "first"), draft("b", "second")]);
    vi.stubGlobal("window", { localStorage: storage });

    const add = vi
      .fn()
      .mockResolvedValueOnce([])
      .mockRejectedValueOnce(new Error("Draft limit reached (200)."));
    const store = remoteStore({ add });

    const result = await migrateLocalDraftsToAccount(store);

    expect(result.migrated).toBe(1);
    expect(result.remaining).toBe(1);
    expect(result.error).toMatch(/Draft limit reached/);
    // The one that failed is still on disk, so retrying is safe.
    expect(storage.read()).toHaveLength(1);
  });

  it("refuses when the active store is browser storage", async () => {
    const storage = createStorage([draft("a", "first")]);
    vi.stubGlobal("window", { localStorage: storage });

    const result = await migrateLocalDraftsToAccount(remoteStore({ isRemote: false }));

    expect(result).toMatchObject({ migrated: 0, remaining: 1 });
    expect(result.error).toMatch(/Sign in/);
    expect(storage.read()).toHaveLength(1);
  });

  it("is a no-op when there is nothing stored locally", async () => {
    vi.stubGlobal("window", { localStorage: createStorage([]) });
    const store = remoteStore();

    expect(await migrateLocalDraftsToAccount(store)).toEqual({ migrated: 0, remaining: 0 });
    expect(store.add).not.toHaveBeenCalled();
  });
});
