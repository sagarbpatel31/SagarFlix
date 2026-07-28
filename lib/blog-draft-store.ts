import type { BlogGenerationRequest, BlogGenerationResult } from "@/lib/blog-generator";
import {
  addSavedBlogDraft,
  clearSavedBlogDrafts,
  loadSavedBlogDrafts,
  removeSavedBlogDraft,
  updateSavedBlogDraft,
  type SavedBlogDraft,
} from "@/lib/blog-drafts";

const DRAFTS_ENDPOINT = "/api/blog/drafts";

/**
 * Draft persistence, resolved per session.
 *
 * Signed-in visitors read and write the database through `/api/blog/drafts` so
 * drafts survive across devices. Anonymous visitors keep the original browser
 * storage behaviour, which is what makes the generator usable without an
 * account. Every mutation resolves to the full next list so callers can treat
 * both backends identically.
 */
export type BlogDraftStore = {
  isRemote: boolean;
  list(): Promise<SavedBlogDraft[]>;
  add(request: BlogGenerationRequest, result: BlogGenerationResult): Promise<SavedBlogDraft[]>;
  remove(id: string): Promise<SavedBlogDraft[]>;
  setPinned(id: string, pinned: boolean): Promise<SavedBlogDraft[]>;
  setArchived(id: string, archived: boolean): Promise<SavedBlogDraft[]>;
  clear(): Promise<SavedBlogDraft[]>;
};

function sortDrafts(drafts: SavedBlogDraft[]) {
  return [...drafts].sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

export function createLocalBlogDraftStore(): BlogDraftStore {
  return {
    isRemote: false,
    async list() {
      return loadSavedBlogDrafts();
    },
    async add(request, result) {
      return addSavedBlogDraft(request, result);
    },
    async remove(id) {
      return removeSavedBlogDraft(id);
    },
    async setPinned(id, pinned) {
      return updateSavedBlogDraft(id, { pinned });
    },
    async setArchived(id, archived) {
      return updateSavedBlogDraft(id, { archived });
    },
    async clear() {
      clearSavedBlogDrafts();
      return [];
    },
  };
}

export function createRemoteBlogDraftStore(fetchImpl: typeof fetch = fetch): BlogDraftStore {
  async function request(path: string, init?: RequestInit) {
    const response = await fetchImpl(`${DRAFTS_ENDPOINT}${path}`, init);

    if (!response.ok) {
      throw new Error(`Draft request failed (${response.status}).`);
    }

    return response;
  }

  async function list() {
    const response = await request("");
    const payload = (await response.json()) as SavedBlogDraft[];
    return Array.isArray(payload) ? sortDrafts(payload) : [];
  }

  async function mutate(path: string, init: RequestInit) {
    await request(path, init);
    // The list is re-read rather than patched locally so pinned ordering and
    // server-assigned timestamps stay authoritative.
    return list();
  }

  return {
    isRemote: true,
    list,
    async add(generationRequest, result) {
      return mutate("", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: generationRequest, result }),
      });
    },
    async remove(id) {
      return mutate(`/${encodeURIComponent(id)}`, { method: "DELETE" });
    },
    async setPinned(id, pinned) {
      return mutate(`/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned }),
      });
    },
    async setArchived(id, archived) {
      return mutate(`/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived }),
      });
    },
    async clear() {
      return mutate("", { method: "DELETE" });
    },
  };
}

export function createBlogDraftStore(options: {
  signedIn: boolean;
  fetchImpl?: typeof fetch;
}): BlogDraftStore {
  return options.signedIn
    ? createRemoteBlogDraftStore(options.fetchImpl)
    : createLocalBlogDraftStore();
}
