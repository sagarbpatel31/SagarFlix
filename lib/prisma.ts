import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { getEnv } from "@/lib/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

let client: PrismaClient | undefined;

function createPrismaClient() {
  const pool = globalForPrisma.pool ?? new Pool({ connectionString: getEnv("DATABASE_URL") });

  const created = new PrismaClient({
    adapter: new PrismaPg(pool),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = created;
    globalForPrisma.pool = pool;
  }

  return created;
}

export function getPrismaClient(): PrismaClient {
  client ??= globalForPrisma.prisma ?? createPrismaClient();
  return client;
}

/**
 * Lazily constructed Prisma client.
 *
 * `next build` imports every route module to collect page data, so constructing
 * the client (and reading `DATABASE_URL`) at module scope fails any build that
 * runs without database credentials — including CI. Connecting on first real
 * property access keeps imports side-effect free while preserving the single
 * shared client per process.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const instance = getPrismaClient();
    const value = Reflect.get(instance, property);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
