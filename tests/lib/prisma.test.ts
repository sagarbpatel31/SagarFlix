import { afterEach, beforeEach, describe, expect, it } from "vitest";

const originalDatabaseUrl = process.env.DATABASE_URL;

beforeEach(() => {
  delete process.env.DATABASE_URL;
});

afterEach(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

describe("prisma client", () => {
  // `next build` imports every route module to collect page data. If importing
  // the client reads DATABASE_URL eagerly, every credential-free build fails.
  it("imports without DATABASE_URL configured", async () => {
    await expect(import("@/lib/prisma")).resolves.toHaveProperty("prisma");
  });

  it("reports the missing credential only when the client is actually used", async () => {
    const { getPrismaClient } = await import("@/lib/prisma");

    expect(() => getPrismaClient()).toThrow("DATABASE_URL is not configured.");
  });
});
