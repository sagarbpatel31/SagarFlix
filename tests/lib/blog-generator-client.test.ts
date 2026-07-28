import { describe, expect, it, vi } from "vitest";
import { requestBlogDraft } from "@/lib/blog-generator-client";
import type { BlogGenerationRequest } from "@/lib/blog-generator";

const request: BlogGenerationRequest = {
  topic: "Simulation-first robotics workflows",
  tone: "Technical",
  format: "Blog",
};

const validResult = {
  title: "Simulation-First Robotics Workflows",
  summary: "A summary.",
  fullContent: "# Body",
  tags: ["Robotics"],
  socialPost: "A social post.",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("requestBlogDraft", () => {
  it("posts the request to the generation route and returns the payload", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse({ result: validResult, provider: "openai", isFallback: false }));

    const response = await requestBlogDraft(request, fetchImpl as unknown as typeof fetch);

    expect(response).toEqual({ result: validResult, provider: "openai", isFallback: false });

    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("/api/blog/generate");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual(request);
  });

  it("surfaces the server-provided error message", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse({ error: "Sign in to generate drafts." }, 401));

    await expect(requestBlogDraft(request, fetchImpl as unknown as typeof fetch)).rejects.toThrow(
      "Sign in to generate drafts.",
    );
  });

  it("falls back to a status-based message when the error body is unusable", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response("nope", { status: 502 }));

    await expect(requestBlogDraft(request, fetchImpl as unknown as typeof fetch)).rejects.toThrow(
      "Blog generation failed (502).",
    );
  });

  it("rejects a malformed success payload", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ result: { title: "Only a title" } }));

    await expect(requestBlogDraft(request, fetchImpl as unknown as typeof fetch)).rejects.toThrow(
      "unexpected response",
    );
  });
});
