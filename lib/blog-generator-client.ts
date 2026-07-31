import type { BlogGenerationRequest, BlogGenerationResult } from "@/lib/blog-generator";
import { readErrorMessage } from "@/lib/http";

export type BlogGenerationResponse = {
  result: BlogGenerationResult;
  provider: "mock" | "openai";
  isFallback: boolean;
};

function isBlogGenerationResponse(value: unknown): value is BlogGenerationResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<BlogGenerationResponse>;
  return (
    typeof candidate.result === "object" &&
    candidate.result !== null &&
    typeof candidate.result.title === "string" &&
    typeof candidate.result.fullContent === "string" &&
    (candidate.provider === "mock" || candidate.provider === "openai")
  );
}

/**
 * Requests a draft from the server-side generator.
 *
 * Generation runs in the route handler so provider credentials such as
 * `OPENAI_API_KEY` stay on the server and never reach the client bundle.
 */
export async function requestBlogDraft(
  input: BlogGenerationRequest,
  fetchImpl: typeof fetch = fetch,
): Promise<BlogGenerationResponse> {
  const response = await fetchImpl("/api/blog/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Blog generation failed"));
  }

  const payload: unknown = await response.json();

  if (!isBlogGenerationResponse(payload)) {
    throw new Error("The generator returned an unexpected response.");
  }

  return payload;
}
