import { createClient } from "@libsql/client";
import "dotenv/config";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function main() {
  const u = await client.execute("SELECT COUNT(*) as n FROM User");
  const r = await client.execute("SELECT COUNT(*) as n FROM Recipe");
  const f = await client.execute("SELECT COUNT(*) as n FROM Family");
  const m = await client.execute("SELECT COUNT(*) as n FROM FamilyMember");
  console.log(
    JSON.stringify({
      user: u.rows[0].n,
      recipe: r.rows[0].n,
      family: f.rows[0].n,
      member: m.rows[0].n,
    }),
  );
  client.close();
}

main().catch((err) => {
  console.error(err);
  client.close();
  process.exit(1);
});