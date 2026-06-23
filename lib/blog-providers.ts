import type {
  BlogGenerationRequest,
  BlogGenerationResult,
  BlogGeneratorProvider,
} from "@/lib/blog-generator";
import { mockBlogGenerator } from "@/lib/blog-generator";
import { openAiBlogGenerator } from "@/lib/openai-blog-generator";
import { getOptionalEnv } from "@/lib/env";

type ProviderName = "mock" | "openai";

export function getBlogGeneratorProvider(name?: string): BlogGeneratorProvider {
  return resolveBlogGeneratorProvider(name).provider;
}

export function getBlogGeneratorProviderName(name?: string): ProviderName {
  return resolveBlogGeneratorProvider(name).name;
}

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
