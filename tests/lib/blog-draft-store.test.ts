import { beforeEach, describe, expect, it, vi } from "vitest";
import { createBlogDraftStore, createRemoteBlogDraftStore } from "@/lib/blog-draft-store";
import type { SavedBlogDraft } from "@/lib/blog-drafts";

const request = { topic: "Kernel tracing", tone: "Technical" as const, format: "Blog" as const };
const result = {
  title: "Kernel Tracing",
  summary: "A summary.",
  fullContent: "# Body",
  tags: ["Embedded"],
  socialPost: "A social post.",
};

function draft(overrides: Partial<SavedBlogDraft> = {}): SavedBlogDraft {
  return {
    id: "draft-1",
    createdAt: "2026-07-01T10:00:00.000Z",
    updatedAt: "2026-07-01T10:00:00.000Z",
    pinned: false,
    archived: false,
    request,
    result,
    ...overrides,
  };
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("createBlogDraftStore", () => {
  it("uses browser storage for anonymous visitors", () => {
    expect(createBlogDraftStore({ signedIn: false }).isRemote).toBe(false);
  });

  it("uses the API for signed-in visitors", () => {
    expect(createBlogDraftStore({ signedIn: true }).isRemote).toBe(true);
  });
});

describe("remote blog draft store", () => {
  let fetchImpl: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchImpl = vi.fn();
  });

  it("sorts pinned drafts first, then by most recently updated", async () => {
    fetchImpl.mockResolvedValue(
      jsonResponse([
        draft({ id: "old", updatedAt: "2026-07-01T00:00:00.000Z" }),
        draft({ id: "new", updatedAt: "2026-07-05T00:00:00.000Z" }),
        draft({ id: "pinned", pinned: true, updatedAt: "2026-06-01T00:00:00.000Z" }),
      ]),
    );

    const drafts = await createRemoteBlogDraftStore(fetchImpl as unknown as typeof fetch).list();

    expect(drafts.map((item) => item.id)).toEqual(["pinned", "new", "old"]);
  });

  it("posts the request and result when adding, then re-reads the list", async () => {
    fetchImpl
      .mockResolvedValueOnce(jsonResponse(draft(), 201))
      .mockResolvedValueOnce(jsonResponse([draft()]));

    const drafts = await createRemoteBlogDraftStore(fetchImpl as unknown as typeof fetch).add(
      request,
      result,
    );

    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("/api/blog/drafts");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ request, result });
    expect(drafts).toHaveLength(1);
  });

  it("sends the explicit next value when toggling pinned", async () => {
    fetchImpl
      .mockResolvedValueOnce(jsonResponse(draft({ pinned: true })))
      .mockResolvedValueOnce(jsonResponse([draft({ pinned: true })]));

    await createRemoteBlogDraftStore(fetchImpl as unknown as typeof fetch).setPinned("draft-1", true);

    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("/api/blog/drafts/draft-1");
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body)).toEqual({ pinned: true });
  });

  it("encodes the draft id into the path", async () => {
    fetchImpl
      .mockResolvedValueOnce(jsonResponse({ success: true }))
      .mockResolvedValueOnce(jsonResponse([]));

    await createRemoteBlogDraftStore(fetchImpl as unknown as typeof fetch).remove("a/b");

    expect(fetchImpl.mock.calls[0][0]).toBe("/api/blog/drafts/a%2Fb");
  });

  it("clears through the collection endpoint rather than one request per draft", async () => {
    fetchImpl
      .mockResolvedValueOnce(jsonResponse({ success: true, count: 3 }))
      .mockResolvedValueOnce(jsonResponse([]));

    const drafts = await createRemoteBlogDraftStore(fetchImpl as unknown as typeof fetch).clear();

    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(fetchImpl.mock.calls[0][1].method).toBe("DELETE");
    expect(drafts).toEqual([]);
  });

  it("throws when the API rejects the request", async () => {
    fetchImpl.mockResolvedValue(jsonResponse({ error: "Unauthorized" }, 401));

    await expect(
      createRemoteBlogDraftStore(fetchImpl as unknown as typeof fetch).list(),
    ).rejects.toThrow("Draft request failed (401).");
  });
});
