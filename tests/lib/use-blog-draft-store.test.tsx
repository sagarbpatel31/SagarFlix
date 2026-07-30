// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { useBlogDraftStore } from "@/lib/use-blog-draft-store";
import type { SavedBlogDraft } from "@/lib/blog-drafts";

const useSession = vi.hoisted(() => vi.fn());
vi.mock("next-auth/react", () => ({ useSession }));

const createBlogDraftStore = vi.hoisted(() => vi.fn());
vi.mock("@/lib/blog-draft-store", () => ({ createBlogDraftStore }));

function draft(id: string): SavedBlogDraft {
  return {
    id,
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
    pinned: false,
    archived: false,
    request: { topic: "t", tone: "Technical", format: "Blog" },
    result: { title: id, summary: "s", fullContent: "c", tags: [], socialPost: "p" },
  };
}

function Probe() {
  const { drafts, ready, error, store } = useBlogDraftStore();
  return (
    <div>
      <span data-testid="ready">{String(ready)}</span>
      <span data-testid="remote">{String(store.isRemote)}</span>
      <span data-testid="ids">{drafts.map((d) => d.id).join(",")}</span>
      <span data-testid="error">{error ?? ""}</span>
    </div>
  );
}

/** A store whose list() resolves only when the test releases it. */
function deferredStore(isRemote: boolean, value: SavedBlogDraft[]) {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const list = vi.fn(async () => {
    await gate;
    return value;
  });
  return { store: { isRemote, list }, release, list };
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("useBlogDraftStore", () => {
  it("does not read any store while the session is still resolving", async () => {
    useSession.mockReturnValue({ data: undefined, status: "loading" });
    const local = deferredStore(false, []);
    createBlogDraftStore.mockReturnValue(local.store);

    render(<Probe />);

    // This is the regression: acting on the loading state would pick the local
    // store, resolve it immediately, and let the caller conclude the list is
    // empty before the authenticated store ever loads.
    expect(local.list).not.toHaveBeenCalled();
    expect(screen.getByTestId("ready").textContent).toBe("false");
  });

  it("reads the remote store once the session resolves signed-in", async () => {
    const remote = deferredStore(true, [draft("remote-1")]);
    useSession.mockReturnValue({ data: { user: { id: "user-1" } }, status: "authenticated" });
    createBlogDraftStore.mockReturnValue(remote.store);

    render(<Probe />);
    remote.release();

    await waitFor(() => expect(screen.getByTestId("ready").textContent).toBe("true"));
    expect(createBlogDraftStore).toHaveBeenCalledWith({ signedIn: true });
    expect(screen.getByTestId("ids").textContent).toBe("remote-1");
    expect(screen.getByTestId("remote").textContent).toBe("true");
  });

  it("falls back to browser storage for an anonymous visitor", async () => {
    const local = deferredStore(false, [draft("local-1")]);
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });
    createBlogDraftStore.mockReturnValue(local.store);

    render(<Probe />);
    local.release();

    await waitFor(() => expect(screen.getByTestId("ready").textContent).toBe("true"));
    expect(createBlogDraftStore).toHaveBeenCalledWith({ signedIn: false });
    expect(screen.getByTestId("ids").textContent).toBe("local-1");
  });

  it("surfaces an error and still reports ready so callers stop waiting", async () => {
    useSession.mockReturnValue({ data: { user: { id: "user-1" } }, status: "authenticated" });
    createBlogDraftStore.mockReturnValue({
      isRemote: true,
      list: vi.fn().mockRejectedValue(new Error("boom")),
    });

    render(<Probe />);

    await waitFor(() => expect(screen.getByTestId("ready").textContent).toBe("true"));
    expect(screen.getByTestId("error").textContent).toMatch(/Unable to load/);
  });

  it("ignores a slow in-flight read after the session changes stores", async () => {
    const local = deferredStore(false, [draft("stale-local")]);
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });
    createBlogDraftStore.mockReturnValue(local.store);

    const view = render(<Probe />);

    // Session resolves signed-in and the store swaps before the local read
    // settles; the late result must not overwrite the remote list.
    const remote = deferredStore(true, [draft("remote-1")]);
    useSession.mockReturnValue({ data: { user: { id: "user-1" } }, status: "authenticated" });
    createBlogDraftStore.mockReturnValue(remote.store);
    view.rerender(<Probe />);

    remote.release();
    await waitFor(() => expect(screen.getByTestId("ids").textContent).toBe("remote-1"));

    local.release();
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(screen.getByTestId("ids").textContent).toBe("remote-1");
  });
});
