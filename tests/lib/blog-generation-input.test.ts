import { describe, expect, it } from "vitest";
import { blogGenerationInputSchema } from "@/lib/blog-generation-input";

describe("blogGenerationInputSchema", () => {
  it("accepts a well-formed request and trims the topic", () => {
    const parsed = blogGenerationInputSchema.safeParse({
      topic: "  Simulation-first robotics workflows  ",
      tone: "Technical",
      format: "Blog",
    });

    expect(parsed.success).toBe(true);
    expect(parsed.success && parsed.data.topic).toBe("Simulation-first robotics workflows");
  });

  it("rejects an empty or whitespace-only topic", () => {
    expect(
      blogGenerationInputSchema.safeParse({ topic: "   ", tone: "Direct", format: "Blog" }).success,
    ).toBe(false);
  });

  it("rejects an unknown tone or format", () => {
    expect(
      blogGenerationInputSchema.safeParse({ topic: "Kernel tracing", tone: "Sarcastic", format: "Blog" })
        .success,
    ).toBe(false);

    expect(
      blogGenerationInputSchema.safeParse({ topic: "Kernel tracing", tone: "Direct", format: "Podcast" })
        .success,
    ).toBe(false);
  });

  it("rejects an overlong topic", () => {
    expect(
      blogGenerationInputSchema.safeParse({
        topic: "a".repeat(301),
        tone: "Direct",
        format: "Blog",
      }).success,
    ).toBe(false);
  });
});
