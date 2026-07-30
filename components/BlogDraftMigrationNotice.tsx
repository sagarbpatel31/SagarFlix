"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CloudUpload } from "lucide-react";
import { loadSavedBlogDrafts } from "@/lib/blog-drafts";
import { migrateLocalDraftsToAccount } from "@/lib/blog-draft-migration";
import { createBlogDraftStore } from "@/lib/blog-draft-store";

/**
 * Offers to move browser-stored drafts into the account after sign-in.
 *
 * Deliberately opt-in rather than automatic: silently copying a visitor's
 * drafts into an account the moment they authenticate is a surprising thing to
 * do with their content, and the failure modes (draft cap, offline) are much
 * easier to explain when they asked for it.
 */
export function BlogDraftMigrationNotice({ onMigrated }: { onMigrated?: () => void }) {
  const { data: session, status } = useSession();
  const signedIn = Boolean(session?.user?.id);
  const [localCount, setLocalCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading" || !signedIn) {
      return;
    }
    setLocalCount(loadSavedBlogDrafts().length);
  }, [status, signedIn]);

  // Stay mounted while there is a message: a successful move drops the count to
  // zero, and unmounting on that would make the drafts appear to vanish with no
  // confirmation that they landed in the account.
  if (!signedIn || (localCount === 0 && !message)) {
    return null;
  }

  const handleMigrate = async () => {
    setBusy(true);
    setMessage(null);

    const result = await migrateLocalDraftsToAccount(createBlogDraftStore({ signedIn: true }));
    setLocalCount(result.remaining);

    if (result.error) {
      setMessage(
        result.migrated > 0
          ? `Moved ${result.migrated}, then stopped: ${result.error} The rest are still saved in this browser.`
          : result.error,
      );
    } else {
      setMessage(`Moved ${result.migrated} draft${result.migrated === 1 ? "" : "s"} to your account.`);
      onMigrated?.();
    }

    setBusy(false);
  };

  return (
    <section className="rounded-lg border border-netflix-red/30 bg-netflix-red/[0.07] p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <CloudUpload className="mt-0.5 h-5 w-5 shrink-0 text-netflix-redSoft" />
          <div>
            <p className="text-sm font-semibold text-white">
              {localCount > 0
                ? `${localCount} draft${localCount === 1 ? "" : "s"} saved in this browser`
                : "Browser drafts moved"}
            </p>
            <p className="mt-1 text-sm text-white/60">
              {localCount > 0
                ? "These were written before you signed in, so they are not in your account yet. Moving them keeps them across devices; nothing is deleted here until the server has a copy."
                : "Nothing is left in this browser — your drafts are in your account and listed below."}
            </p>
          </div>
        </div>

        {localCount > 0 ? (
          <button
            type="button"
            onClick={handleMigrate}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CloudUpload className="h-4 w-4" />
            {busy ? "Moving…" : "Move to my account"}
          </button>
        ) : null}
      </div>

      {message ? (
        <p className="mt-4 rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/75">
          {message}
        </p>
      ) : null}
    </section>
  );
}
