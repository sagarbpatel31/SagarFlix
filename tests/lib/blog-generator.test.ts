import { describe, expect, it } from "vitest";
import { mockBlogGenerator } from "@/lib/blog-generator";

describe("mockBlogGenerator", () => {
  it("returns the expected blog generation shape", async () => {
    const result = await mockBlogGenerator.generate({
      topic: "Embedded Linux kernel tracing",
      tone: "Technical",
      format: "Blog",
    });

    expect(result).toMatchObject({
      title: "Embedded Linux Kernel Tracing: A Practical Guide",
      summary: expect.stringContaining("Embedded Linux Kernel Tracing"),
      socialPost: expect.stringContaining("Embedded Linux Kernel Tracing"),
    });
    expect(Array.isArray(result.tags)).toBe(true);
    expect(result.fullContent).toContain("# Embedded Linux Kernel Tracing");
    expect(result.tags).toEqual(expect.arrayContaining(["Technical", "Blog", "Embedded"]));
  });
});

