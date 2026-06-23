import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveBlogGeneratorProvider } from "@/lib/blog-providers";

function snapshotEnv() {
  return {
    blogProvider: process.env.NEXT_PUBLIC_BLOG_PROVIDER,
    openAiKey: process.env.OPENAI_API_KEY,
  };
}

function restoreEnv(snapshot: ReturnType<typeof snapshotEnv>) {
  if (snapshot.blogProvider === undefined) {
    delete process.env.NEXT_PUBLIC_BLOG_PROVIDER;
  } else {
    process.env.NEXT_PUBLIC_BLOG_PROVIDER = snapshot.blogProvider;
  }

  if (snapshot.openAiKey === undefined) {
    delete process.env.OPENAI_API_KEY;
  } else {
    process.env.OPENAI_API_KEY = snapshot.openAiKey;
  }
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("resolveBlogGeneratorProvider", () => {
  it("falls back to the mock generator when OpenAI is requested without a key", () => {
    const snapshot = snapshotEnv();
    delete process.env.OPENAI_API_KEY;
    process.env.NEXT_PUBLIC_BLOG_PROVIDER = "openai";

    const result = resolveBlogGeneratorProvider();

    expect(result).toMatchObject({
      name: "mock",
      isFallback: true,
    });

    restoreEnv(snapshot);
  });

  it("returns the OpenAI provider when configured", () => {
    const snapshot = snapshotEnv();
    process.env.NEXT_PUBLIC_BLOG_PROVIDER = "openai";
    process.env.OPENAI_API_KEY = "test-key";

    const result = resolveBlogGeneratorProvider();

    expect(result).toMatchObject({
      name: "openai",
      isFallback: false,
    });

    restoreEnv(snapshot);
  });
});
