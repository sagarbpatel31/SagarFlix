import type {
  BlogGenerationRequest,
  BlogGenerationResult,
  BlogGeneratorProvider,
} from "@/lib/blog-generator";
import { mockBlogGenerator } from "@/lib/blog-generator";
import { openAiBlogGenerator } from "@/lib/openai-blog-generator";
import { getOptionalEnv } from "@/lib/env";

type ProviderName = "mock" | "openai";

/**
 * Server-only. Resolution reads `OPENAI_API_KEY`, which Next.js does not expose
 * to the browser, so importing this from a client component silently downgrades
 * every request to the mock provider. Client code should call
 * `requestBlogDraft` in `@/lib/blog-generator-client` instead.
 */

export function resolveBlogGeneratorProvider(name?: string): {
  name: ProviderName;
  provider: BlogGeneratorProvider;
  isFallback: boolean;
} {
  const providerName = name?.toLowerCase() ?? getOptionalEnv("NEXT_PUBLIC_BLOG_PROVIDER") ?? "mock";

  switch (providerName as ProviderName) {
    case "openai":
      if (!getOptionalEnv("OPENAI_API_KEY")) {
        return { name: "mock", provider: mockBlogGenerator, isFallback: true };
      }
      return { name: "openai", provider: openAiBlogGenerator, isFallback: false };
    case "mock":
    default:
      return { name: "mock", provider: mockBlogGenerator, isFallback: false };
  }
}
