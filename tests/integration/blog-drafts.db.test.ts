import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import {
  deserializeBlogDraft,
  serializeBlogDraft,
  serializeBlogDraftUpdate,
} from "@/lib/blog-draft-records";
import type { BlogFormat } from "@/data/blogs";

/**
 * Integration coverage against a real Postgres.
 *
 * The unit tests mock Prisma, so they can confirm the route logic but not that
 * the schema actually accepts what the serializers produce — the enum label
 * mapping and the cascade in particular are only real once a database enforces
 * them.
 *
 * Skipped unless TEST_DATABASE_URL is set, so CI (which has no database) stays
 * green and this stays opt-in:
 *   TEST_DATABASE_URL=postgresql://... npx vitest run tests/integration
 */
const connectionString = process.env.TEST_DATABASE_URL;
const describeIfDb = connectionString ? describe : describe.skip;

describeIfDb("blog drafts against a real database", () => {
  let prisma: PrismaClient;
  let pool: Pool;
  const userIds: string[] = [];

  beforeAll(async () => {
    pool = new Pool({ connectionString });
    prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

    const [a, b] = await Promise.all([
      prisma.user.create({ data: { email: `a-${Date.now()}@example.test`, name: "A" } }),
      prisma.user.create({ data: { email: `b-${Date.now()}@example.test`, name: "B" } }),
    ]);
    userIds.push(a.id, b.id);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
    await pool.end();
  });

  function payload(format: BlogFormat) {
    return {
      request: { topic: `topic ${format}`, tone: "Technical" as const, format },
      result: {
        title: `Title ${format}`,
        summary: "summary",
        fullContent: "# content",
        tags: ["Embedded", "AI/ML"],
        socialPost: "post",
      },
    };
  }

  // Postgres enum labels cannot contain spaces, so these are stored with
  // underscores. A database is the only thing that proves the mapping is
  // accepted on write and reverses on read.
  it.each(["Blog", "LinkedIn Post", "X Thread"] as const)(
    "round-trips the %s format through the Postgres enum",
    async (format) => {
      const row = await prisma.blogDraft.create({
        data: serializeBlogDraft(payload(format), userIds[0]),
      });

      expect(row.format).toBe(format.replace(" ", "_"));
      expect(deserializeBlogDraft(row).request.format).toBe(format);
      expect(deserializeBlogDraft(row).result.tags).toEqual(["Embedded", "AI/ML"]);
    },
  );

  it("scopes reads to the owning user", async () => {
    const mine = await prisma.blogDraft.findMany({ where: { userId: userIds[0] } });
    const theirs = await prisma.blogDraft.findMany({ where: { userId: userIds[1] } });

    expect(mine.length).toBeGreaterThan(0);
    expect(theirs).toHaveLength(0);
  });

  it("returns the ordering the list endpoint promises", async () => {
    const target = (await prisma.blogDraft.findMany({ where: { userId: userIds[0] } }))[0];
    await prisma.blogDraft.update({ where: { id: target.id }, data: { pinned: true } });

    const ordered = await prisma.blogDraft.findMany({
      where: { userId: userIds[0] },
      orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
    });

    expect(ordered[0].id).toBe(target.id);
  });

  it("writes only the provided columns on a partial update", async () => {
    const target = (await prisma.blogDraft.findMany({ where: { userId: userIds[0] } }))[0];

    const updated = await prisma.blogDraft.update({
      where: { id: target.id },
      data: serializeBlogDraftUpdate({ archived: true }),
    });

    expect(updated.archived).toBe(true);
    expect(updated.title).toBe(target.title);
    expect(updated.fullContent).toBe(target.fullContent);
  });

  it("cascades draft deletion when the owning user is removed", async () => {
    const doomed = await prisma.user.create({
      data: { email: `c-${Date.now()}@example.test`, name: "C" },
    });
    await prisma.blogDraft.create({ data: serializeBlogDraft(payload("Blog"), doomed.id) });

    await prisma.user.delete({ where: { id: doomed.id } });

    expect(await prisma.blogDraft.count({ where: { userId: doomed.id } })).toBe(0);
  });
});
