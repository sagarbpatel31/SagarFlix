import type { BlogGenerationRequest, BlogGenerationResult } from "@/lib/blog-generator";

const STORAGE_KEY = "sagarflix.blog-drafts.v1";
const SELECTED_STORAGE_KEY = "sagarflix.blog-drafts.selected.v1";

export type SavedBlogDraft = {
  id: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  archived: boolean;
  request: BlogGenerationRequest;
  result: BlogGenerationResult;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function readRawDrafts(): SavedBlogDraft[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as SavedBlogDraft[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.flatMap((draft) => {
      if (
        typeof draft?.id !== "string" ||
        typeof draft?.createdAt !== "string" ||
        typeof draft?.request?.topic !== "string" ||
        typeof draft?.request?.tone !== "string" ||
        typeof draft?.request?.format !== "string" ||
        typeof draft?.result?.title !== "string" ||
        typeof draft?.result?.summary !== "string" ||
        typeof draft?.result?.fullContent !== "string" ||
        !Array.isArray(draft?.result?.tags) ||
        typeof draft?.result?.socialPost !== "string"
      ) {
        return [];
      }

      return [
        {
          id: draft.id,
          createdAt: draft.createdAt,
          updatedAt: typeof draft?.updatedAt === "string" ? draft.updatedAt : draft.createdAt,
          pinned: typeof draft?.pinned === "boolean" ? draft.pinned : false,
          archived: typeof draft?.archived === "boolean" ? draft.archived : false,
          request: draft.request,
          result: draft.result,
        },
      ];
    });
  } catch {
    return [];
  }
}

function writeRawDrafts(drafts: SavedBlogDraft[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export function loadSavedBlogDrafts() {
  return readRawDrafts();
}

export function addSavedBlogDraft(
  request: BlogGenerationRequest,
  result: BlogGenerationResult,
) {
  const draft: SavedBlogDraft = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pinned: false,
    archived: false,
    request,
    result,
  };

  const nextDrafts = [draft, ...readRawDrafts()].slice(0, 20);
  writeRawDrafts(nextDrafts);
  return nextDrafts;
}

export function removeSavedBlogDraft(id: string) {
  const nextDrafts = readRawDrafts().filter((draft) => draft.id !== id);
  writeRawDrafts(nextDrafts);
  return nextDrafts;
}

export function updateSavedBlogDraft(
  id: string,
  patch: Partial<Pick<SavedBlogDraft, "pinned" | "archived" | "request" | "result">>,
) {
  const nextDrafts = readRawDrafts().map((draft) =>
    draft.id === id
      ? {
          ...draft,
          ...patch,
          updatedAt: new Date().toISOString(),
        }
      : draft,
  );
  writeRawDrafts(nextDrafts);
  return nextDrafts;
}

export function togglePinnedBlogDraft(id: string) {
  const drafts = readRawDrafts();
  const nextDrafts = drafts.map((draft) =>
    draft.id === id
      ? {
          ...draft,
          pinned: !draft.pinned,
          updatedAt: new Date().toISOString(),
        }
      : draft,
  );
  writeRawDrafts(nextDrafts);
  return nextDrafts;
}

export function toggleArchivedBlogDraft(id: string) {
  const drafts = readRawDrafts();
  const nextDrafts = drafts.map((draft) =>
    draft.id === id
      ? {
          ...draft,
          archived: !draft.archived,
          updatedAt: new Date().toISOString(),
        }
      : draft,
  );
  writeRawDrafts(nextDrafts);
  return nextDrafts;
}

export function clearSavedBlogDrafts() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function setSelectedBlogDraftId(id: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(SELECTED_STORAGE_KEY, id);
}

export function getSelectedBlogDraftId() {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(SELECTED_STORAGE_KEY);
}

export function clearSelectedBlogDraftId() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(SELECTED_STORAGE_KEY);
}
