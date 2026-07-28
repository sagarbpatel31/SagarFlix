import { beforeEach, describe, expect, it, vi } from "vitest";

const getServerSession = vi.hoisted(() => vi.fn());
const blogDraft = vi.hoisted(() => ({
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  deleteMany: vi.fn(),
}));

vi.mock("next-auth", () => ({ getServerSession }));
vi.mock("@/lib/auth", () => ({ authOptions: {} }));
vi.mock("@/lib/prisma", () => ({ prisma: { blogDraft } }));

const { GET, POST, DELETE: DELETE_ALL } = await import("@/app/api/blog/drafts/route");
const { PUT, DELETE } = await import("@/app/api/blog/drafts/[id]/route");

const validBody = {
  request: { topic: "Kernel tracing", tone: "Technical", format: "LinkedIn Post" },
  result: {
    title: "Kernel Tracing",
    summary: "A summary.",
    fullContent: "# Body",
    tags: ["Embedded"],
    socialPost: "A social post.",
  },
};

function record(overrides: Record<string, unknown> = {}) {
  return {
    id: "draft-1",
    topic: "Kernel tracing",
    tone: "Technical",
    format: "LinkedIn_Post",
    title: "Kernel Tracing",
    summary: "A summary.",
    fullContent: "# Body",
    tags: JSON.stringify(["Embedded"]),
    socialPost: "A social post.",
    pinned: false,
    archived: false,
    userId: "user-1",
    createdAt: new Date("2026-07-01T10:00:00.000Z"),
    updatedAt: new Date("2026-07-01T10:00:00.000Z"),
    ...overrides,
  };
}

function jsonRequest(body: unknown, method = "POST") {
  return new Request("http://localhost/api/blog/drafts", {
    method,
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const params = (id: string) => ({ params: Promise.resolve({ id }) });

function signIn(userId = "user-1") {
  getServerSession.mockResolvedValue({ user: { id: userId } });
}

beforeEach(() => {
  vi.clearAllMocks();
  getServerSession.mockResolvedValue(null);
});

describe("blog draft routes require a session", () => {
  it("rejects every method for anonymous callers", async () => {
    const responses = await Promise.all([
      GET(),
      POST(jsonRequest(validBody)),
      DELETE_ALL(),
      PUT(jsonRequest({ pinned: true }, "PUT"), params("draft-1")),
      DELETE(jsonRequest({}, "DELETE"), params("draft-1")),
    ]);

    expect(responses.map((response) => response.status)).toEqual([401, 401, 401, 401, 401]);
    expect(blogDraft.findMany).not.toHaveBeenCalled();
    expect(blogDraft.create).not.toHaveBeenCalled();
    expect(blogDraft.deleteMany).not.toHaveBeenCalled();
  });
});

describe("GET /api/blog/drafts", () => {
  it("returns only the caller's drafts, pinned first", async () => {
    signIn();
    blogDraft.findMany.mockResolvedValue([record()]);

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject([
      { id: "draft-1", request: { format: "LinkedIn Post" } },
    ]);
    expect(blogDraft.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-1" },
        orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
      }),
    );
  });
});

describe("POST /api/blog/drafts", () => {
  it("creates a draft owned by the caller", async () => {
    signIn();
    blogDraft.create.mockResolvedValue(record());

    const response = await POST(jsonRequest(validBody));

    expect(response.status).toBe(201);
    expect(blogDraft.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ userId: "user-1", format: "LinkedIn_Post" }),
    });
  });

  it("rejects an invalid payload", async () => {
    signIn();

    const response = await POST(jsonRequest({ request: { topic: "" }, result: {} }));

    expect(response.status).toBe(400);
    expect(blogDraft.create).not.toHaveBeenCalled();
  });

  it("rejects a non-JSON body", async () => {
    signIn();

    const response = await POST(jsonRequest("not json"));

    expect(response.status).toBe(400);
    expect(blogDraft.create).not.toHaveBeenCalled();
  });
});

describe("DELETE /api/blog/drafts", () => {
  it("scopes the bulk delete to the caller", async () => {
    signIn();
    blogDraft.deleteMany.mockResolvedValue({ count: 2 });

    const response = await DELETE_ALL();

    expect(response.status).toBe(200);
    expect(blogDraft.deleteMany).toHaveBeenCalledWith({ where: { userId: "user-1" } });
  });
});

describe("per-draft routes enforce ownership", () => {
  it("returns 404 instead of updating another user's draft", async () => {
    signIn("user-1");
    blogDraft.findUnique.mockResolvedValue(record({ userId: "someone-else" }));

    const response = await PUT(jsonRequest({ pinned: true }, "PUT"), params("draft-1"));

    expect(response.status).toBe(404);
    expect(blogDraft.update).not.toHaveBeenCalled();
  });

  it("returns 404 instead of deleting another user's draft", async () => {
    signIn("user-1");
    blogDraft.findUnique.mockResolvedValue(record({ userId: "someone-else" }));

    const response = await DELETE(jsonRequest({}, "DELETE"), params("draft-1"));

    expect(response.status).toBe(404);
    expect(blogDraft.delete).not.toHaveBeenCalled();
  });

  it("returns 404 for a draft that does not exist", async () => {
    signIn();
    blogDraft.findUnique.mockResolvedValue(null);

    const response = await PUT(jsonRequest({ pinned: true }, "PUT"), params("missing"));

    expect(response.status).toBe(404);
  });

  it("updates a draft the caller owns", async () => {
    signIn();
    blogDraft.findUnique.mockResolvedValue(record());
    blogDraft.update.mockResolvedValue(record({ pinned: true }));

    const response = await PUT(jsonRequest({ pinned: true }, "PUT"), params("draft-1"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ pinned: true });
    expect(blogDraft.update).toHaveBeenCalledWith({
      where: { id: "draft-1" },
      data: { pinned: true },
    });
  });

  it("deletes a draft the caller owns", async () => {
    signIn();
    blogDraft.findUnique.mockResolvedValue(record());

    const response = await DELETE(jsonRequest({}, "DELETE"), params("draft-1"));

    expect(response.status).toBe(200);
    expect(blogDraft.delete).toHaveBeenCalledWith({ where: { id: "draft-1" } });
  });

  it("rejects an empty update body before touching the database", async () => {
    signIn();

    const response = await PUT(jsonRequest({}, "PUT"), params("draft-1"));

    expect(response.status).toBe(400);
    expect(blogDraft.findUnique).not.toHaveBeenCalled();
  });
});
