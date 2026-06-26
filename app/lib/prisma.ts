import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import type { Config } from "@libsql/client";

/**
 * Prisma client singleton.
 *
 * Prisma 7 no longer reads the datasource URL from the schema at runtime;
 * the connection is provided via a driver adapter passed to the client
 * constructor. For SQLite we use `@prisma/adapter-libsql` (libSQL / Turso
 * driver adapter), pointed at the same `DATABASE_URL` the CLI uses.
 *
 * - Local development: `file:./local.db` (no auth token required)
 * - Remote (Turso):     `libsql://<db>-<org>.turso.io` + `DATABASE_AUTH_TOKEN`
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
  const url = process.env.DATABASE_URL ?? "file:./local.db";

  const config: Config = { url };
  // Only attach the auth token if present — local file DBs don't need one.
  if (process.env.DATABASE_AUTH_TOKEN) {
    config.authToken = process.env.DATABASE_AUTH_TOKEN;
  }

  const adapter = new PrismaLibSql(config);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
