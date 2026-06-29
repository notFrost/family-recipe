import "dotenv/config";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@libsql/client";

/**
 * Snapshot a libSQL / Turso database to a local JSON file — run this BEFORE any
 * prod migration so a botched change is always recoverable.
 *
 * Dumps every user table's `CREATE TABLE` DDL plus all rows. Loads `.env` via
 * dotenv (NOT `.env.local`), so by default it targets the production Turso DB;
 * override DATABASE_URL/DATABASE_AUTH_TOKEN inline to back up a different DB.
 *
 * Output: `backups/backup-<db>-<ISO timestamp>.json` (the `backups/` dir is
 * gitignored — the dump contains user rows and password hashes; never commit).
 *
 *   npx tsx scripts/backup-turso.mts
 */
const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const client = createClient({ url, authToken });

async function main() {
  const tableRows = await client.execute(
    `SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`,
  );

  const dump: {
    capturedAt: string;
    database: string;
    tables: { name: string; ddl: string; rows: unknown[] }[];
  } = {
    capturedAt: new Date().toISOString(),
    database: url!.replace(/\?.*$/, ""),
    tables: [],
  };

  for (const t of tableRows.rows) {
    const name = String(t.name);
    const data = await client.execute(`SELECT * FROM "${name}"`);
    dump.tables.push({
      name,
      ddl: String(t.sql),
      rows: data.rows.map((r) => ({ ...r })),
    });
    console.log(`  ${name}: ${data.rows.length} rows`);
  }

  const dir = join(process.cwd(), "backups");
  mkdirSync(dir, { recursive: true });
  const dbSlug =
    dump.database.replace(/^.*\/\//, "").replace(/[^a-z0-9]+/gi, "-") || "db";
  const stamp = dump.capturedAt.replace(/[:.]/g, "-");
  const file = join(dir, `backup-${dbSlug}-${stamp}.json`);
  writeFileSync(file, JSON.stringify(dump, null, 2), "utf8");
  console.log(`\nBackup written: ${file}`);
  console.log(
    `(${dump.tables.length} tables, ${dump.tables.reduce((n, t) => n + t.rows.length, 0)} rows total)`,
  );
}

main()
  .catch((err) => {
    console.error("Backup failed:", err);
    process.exitCode = 1;
  })
  .finally(() => {
    client.close();
  });
