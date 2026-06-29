import "dotenv/config";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@libsql/client";

/**
 * Idempotent migration runner for libSQL / Turso — the data-preserving way to
 * push schema changes to prod.
 *
 * Prisma 7's `migrate deploy` cannot talk to a `libsql://` URL (the migrate
 * engine rejects the scheme: P1013), and @prisma/config 7.8 has no migrate
 * driver-adapter hook. So this script plays the role of `prisma migrate deploy`
 * for Turso: it applies every `prisma/migrations/<timestamp>_name/migration.sql`
 * in order, exactly once, recording each in a `_turso_migrations` table. Already
 * applied migrations are skipped, so existing data is never touched.
 *
 * Going forward, the prod-push flow is:
 *   1. Edit the schema, then `npx prisma migrate dev --name <change>` locally
 *      (against the local file DB) to author the migration SQL + update local.db.
 *   2. Commit the new `prisma/migrations/...` folder.
 *   3. Run this script against Turso to apply only the new migration(s):
 *        npx tsx scripts/migrate-turso.mts          # targets .env's DATABASE_URL
 *      It loads `.env` via dotenv (NOT `.env.local`), so by default it targets
 *      the production Turso DB. Override DATABASE_URL/DATABASE_AUTH_TOKEN inline
 *      to point elsewhere.
 *
 * Safe to re-run. Reports what it applied and the resulting table list.
 */
const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const client = createClient({ url, authToken });
const MIGRATIONS_DIR = join(process.cwd(), "prisma", "migrations");

async function main() {
  console.log(`Target: ${url.replace(/\?.*$/, "")}`);

  await client.execute(
    `CREATE TABLE IF NOT EXISTS "_turso_migrations" (
       "name" TEXT NOT NULL PRIMARY KEY,
       "applied_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
     )`,
  );

  const appliedRows = await client.execute(
    `SELECT name FROM "_turso_migrations"`,
  );
  const applied = new Set(appliedRows.rows.map((r) => String(r.name)));

  const dirs = readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort(); // timestamp-prefixed → lexical sort is chronological

  let count = 0;
  for (const dir of dirs) {
    if (applied.has(dir)) continue;

    const sql = readFileSync(join(MIGRATIONS_DIR, dir, "migration.sql"), "utf8");
    process.stdout.write(`Applying ${dir} ... `);
    // executeMultiple runs the migration as a script (multiple statements,
    // including the PRAGMA/RedefineTables dance Prisma emits for SQLite).
    await client.executeMultiple(sql);
    await client.execute({
      sql: `INSERT INTO "_turso_migrations" (name) VALUES (?)`,
      args: [dir],
    });
    console.log("done");
    count++;
  }

  console.log(
    count === 0
      ? "No pending migrations — database is up to date."
      : `Applied ${count} migration(s).`,
  );

  const tables = await client.execute(
    `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`,
  );
  console.log("Tables:", tables.rows.map((r) => r.name).join(", "));
}

main()
  .catch((err) => {
    console.error("\nMigration failed:", err);
    process.exitCode = 1;
  })
  .finally(() => {
    client.close();
  });
