import type { Prisma } from "@prisma/client";
import type { BlogFormat as DbBlogFormat, BlogTone as DbBlogTone } from "@prisma/client";
import type { BlogFormat, BlogTone } from "@/data/blogs";
import type { BlogGenerationRequest, BlogGenerationResult } from "@/lib/blog-generator";
import type { SavedBlogDraft } from "@/lib/blog-drafts";

export type BlogDraftRecord = {
  id: string;
  topic: string;
  tone: string;
  format: string;
  title: string;
  summary: string;
  fullContent: string;
  tags: string;
  socialPost: string;
  pinned: boolean;
  archived: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type BlogDraftPayload = {
  request: BlogGenerationRequest;
  result: BlogGenerationResult;
  pinned?: boolean;
  archived?: boolean;
};

// Postgres enum labels cannot contain spaces, so the two multi-word formats are
// stored with underscores and mapped back at the boundary. Same approach the
// JobApplication status uses for "Follow-up".
const formatToDb: Record<BlogFormat, DbBlogFormat> = {
  Blog: "Blog",
  "LinkedIn Post": "LinkedIn_Post",
  "X Thread": "X_Thread",
};

const formatFromDb: Record<string, BlogFormat> = {
  Blog: "Blog",
  LinkedIn_Post: "LinkedIn Post",
  X_Thread: "X Thread",
};

export function toDbFormat(format: BlogFormat): DbBlogFormat {
  return formatToDb[format];
}

export function fromDbFormat(format: string): BlogFormat {
  return formatFromDb[format] ?? "Blog";
}

function parseTags(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    // fall through to comma-separated parsing
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function serializeBlogDraft(
  input: BlogDraftPayload,
  userId: string,
): Prisma.BlogDraftUncheckedCreateInput {
  return {
    topic: input.request.topic,
    tone: input.request.tone as DbBlogTone,
    format: toDbFormat(input.request.format),
    title: input.result.title,
    summary: input.result.summary,
    fullContent: input.result.fullContent,
    tags: JSON.stringify(input.result.tags),
    socialPost: input.result.socialPost,
    pinned: input.pinned ?? false,
    archived: input.archived ?? false,
    userId,
  };
}

export function serializeBlogDraftUpdate(
  input: Partial<BlogDraftPayload>,
): Prisma.BlogDraftUpdateInput {
  const payload: Prisma.BlogDraftUpdateInput = {};

  if (input.request !== undefined) {
    payload.topic = input.request.topic;
    payload.tone = input.request.tone as DbBlogTone;
    payload.format = toDbFormat(input.request.format);
  }

  if (input.result !== undefined) {
    payload.title = input.result.title;
    payload.summary = input.result.summary;
    payload.fullContent = input.result.fullContent;
    payload.tags = JSON.stringify(input.result.tags);
    payload.socialPost = input.result.socialPost;
  }

  if (input.pinned !== undefined) payload.pinned = input.pinned;
  if (input.archived !== undefined) payload.archived = input.archived;

  return payload;
}

export function deserializeBlogDraft(record: BlogDraftRecord): SavedBlogDraft {
  return {
    id: record.id,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    pinned: record.pinned,
    archived: record.archived,
    request: {
      topic: record.topic,
      tone: record.tone as BlogTone,
      format: fromDbFormat(record.format),
    },
    result: {
      title: record.title,
      summary: record.summary,
      fullContent: record.fullContent,
      tags: parseTags(record.tags),
      socialPost: record.socialPost,
    },
  };
}
