import { loadSavedBlogDrafts, removeSavedBlogDraft } from "@/lib/blog-drafts";
import type { BlogDraftStore } from "@/lib/blog-draft-store";

export type DraftMigrationResult = {
  migrated: number;
  /** Local drafts still in the browser after the attempt. */
  remaining: number;
  error?: string;
};

/**
 * Moves drafts written before sign-in into the user's account.
 *
 * Without this, anything drafted anonymously is stranded: signing in swaps the
 * store to the API and the browser copies simply stop being shown.
 *
 * Each draft is only removed locally *after* the server has accepted it, so an
 * interrupted run — a failed request, or hitting the draft cap partway through
 * — leaves the un-migrated drafts exactly where they were rather than losing
 * them. That makes the operation safe to retry.
 */
export async function migrateLocalDraftsToAccount(
  store: BlogDraftStore,
): Promise<DraftMigrationResult> {
  const local = loadSavedBlogDrafts();

  if (!store.isRemote) {
    return {
      migrated: 0,
      remaining: local.length,
      error: "Sign in before moving drafts to your account.",
    };
  }

  let migrated = 0;

  // Oldest first, so the account ends up in the same order the browser had.
  for (const draft of [...local].reverse()) {
    try {
      await store.add(draft.request, draft.result);
    } catch (cause) {
      return {
        migrated,
        remaining: loadSavedBlogDrafts().length,
        error: cause instanceof Error ? cause.message : "Unable to move the remaining drafts.",
      };
    }

    removeSavedBlogDraft(draft.id);
    migrated += 1;
  }

  return { migrated, remaining: loadSavedBlogDrafts().length };
}
