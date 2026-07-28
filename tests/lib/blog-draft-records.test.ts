import { describe, expect, it } from "vitest";
import {
  deserializeBlogDraft,
  fromDbFormat,
  serializeBlogDraft,
  serializeBlogDraftUpdate,
  toDbFormat,
  type BlogDraftRecord,
} from "@/lib/blog-draft-records";

const payload = {
  request: { topic: "Kernel tracing", tone: "Technical" as const, format: "X Thread" as const },
  result: {
    title: "Kernel Tracing",
    summary: "A summary.",
    fullContent: "# Body",
    tags: ["Embedded", "Linux"],
    socialPost: "A social post.",
  },
};

const record: BlogDraftRecord = {
  id: "draft-1",
  topic: "Kernel tracing",
  tone: "Technical",
  format: "X_Thread",
  title: "Kernel Tracing",
  summary: "A summary.",
  fullContent: "# Body",
  tags: JSON.stringify(["Embedded", "Linux"]),
  socialPost: "A social post.",
  pinned: true,
  archived: false,
  userId: "user-1",
  createdAt: new Date("2026-07-01T10:00:00.000Z"),
  updatedAt: new Date("2026-07-02T10:00:00.000Z"),
};

describe("blog draft format mapping", () => {
  it("round-trips every format through the database labels", () => {
    for (const format of ["Blog", "LinkedIn Post", "X Thread"] as const) {
      expect(fromDbFormat(toDbFormat(format))).toBe(format);
    }
  });

  it("maps multi-word formats to underscore-safe enum labels", () => {
    expect(toDbFormat("LinkedIn Post")).toBe("LinkedIn_Post");
    expect(toDbFormat("X Thread")).toBe("X_Thread");
  });
});

describe("serializeBlogDraft", () => {
  it("stores tags as JSON and attaches the owner", () => {
    const serialized = serializeBlogDraft(payload, "user-1");

    expect(serialized).toMatchObject({
      topic: "Kernel tracing",
      tone: "Technical",
      format: "X_Thread",
      userId: "user-1",
      pinned: false,
      archived: false,
    });
    expect(JSON.parse(serialized.tags)).toEqual(["Embedded", "Linux"]);
  });
});

describe("serializeBlogDraftUpdate", () => {
  it("only includes the fields that were provided", () => {
    expect(serializeBlogDraftUpdate({ pinned: true })).toEqual({ pinned: true });
  });

  it("expands a request or result into its stored columns", () => {
    const update = serializeBlogDraftUpdate(payload);

    expect(update).toMatchObject({
      topic: "Kernel tracing",
      format: "X_Thread",
      title: "Kernel Tracing",
      socialPost: "A social post.",
    });
  });

  it("treats archived: false as a real change rather than an omission", () => {
    expect(serializeBlogDraftUpdate({ archived: false })).toEqual({ archived: false });
  });
});

describe("deserializeBlogDraft", () => {
  it("rebuilds the saved draft shape the UI already renders", () => {
    expect(deserializeBlogDraft(record)).toEqual({
      id: "draft-1",
      createdAt: "2026-07-01T10:00:00.000Z",
      updatedAt: "2026-07-02T10:00:00.000Z",
      pinned: true,
      archived: false,
      request: { topic: "Kernel tracing", tone: "Technical", format: "X Thread" },
      result: {
        title: "Kernel Tracing",
        summary: "A summary.",
        fullContent: "# Body",
        tags: ["Embedded", "Linux"],
        socialPost: "A social post.",
      },
    });
  });

  it("falls back to comma-separated tags for non-JSON values", () => {
    const draft = deserializeBlogDraft({ ...record, tags: "Embedded, Linux" });

    expect(draft.result.tags).toEqual(["Embedded", "Linux"]);
  });
});
