"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { createBlogDraftStore, type BlogDraftStore } from "@/lib/blog-draft-store";
import type { SavedBlogDraft } from "@/lib/blog-drafts";

/**
 * Resolves the draft store for the current session and loads its contents.
 *
 * The session guard belongs here rather than in each component. While NextAuth
 * resolves, `useSession` reports signed-out, so choosing a store from that would
 * pick browser storage for a signed-in user and read the wrong list — and
 * `createBlogDraftStore` takes a plain boolean, a type that cannot express "not
 * known yet". Owning it at this seam makes the guard impossible to forget:
 * previously two of four consumers had it and two did not.
 */
export function useBlogDraftStore(): {
  store: BlogDraftStore;
  drafts: SavedBlogDraft[];
  setDrafts: (drafts: SavedBlogDraft[]) => void;
  ready: boolean;
  error: string | null;
} {
  const { data: session, status } = useSession();
  const signedIn = Boolean(session?.user?.id);
  const sessionLoading = status === "loading";

  const store = useMemo(() => createBlogDraftStore({ signedIn }), [signedIn]);
  const [drafts, setDrafts] = useState<SavedBlogDraft[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionLoading) {
      return;
    }

    let cancelled = false;

    store
      .list()
      .then((next) => {
        if (!cancelled) {
          setDrafts(next);
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Unable to load saved drafts right now.");
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [store, sessionLoading]);

  const replace = useCallback((next: SavedBlogDraft[]) => setDrafts(next), []);

  return { store, drafts, setDrafts: replace, ready, error };
}
