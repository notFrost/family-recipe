import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

/**
 * Prisma client singleton.
 *
 * Prisma 7 no longer reads the datasource URL from the schema at runtime;
 * the connection is provided via a driver adapter passed to the client
 * constructor. For SQLite we use `@prisma/adapter-better-sqlite3`, pointed at
 * the same `DATABASE_URL` the CLI uses (e.g. `file:./dev.db`).
 *
 * In development Next.js hot-reloads modules frequently, which would
 * otherwise create a new PrismaClient (and a new connection) on every reload.
 * We cache the instance on the global object so the same client is reused
 * across reloads. In production a single instance is created per process.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
