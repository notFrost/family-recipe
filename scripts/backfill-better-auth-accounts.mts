import "dotenv/config";
import { randomUUID } from "node:crypto";
import { prisma } from "../app/lib/prisma";

/**
 * One-off backfill: give every legacy user a Better Auth credential account.
 *
 * Auth.js stored the bcrypt hash on `User.passwordHash`. Better Auth verifies
 * email/password against `Account.password` (providerId "credential"). This
 * script creates that account row for each user that has a `passwordHash` but
 * no credential account yet, copying the existing bcrypt hash verbatim — so
 * every existing user keeps logging in with no rehash.
 *
 * Idempotent: safe to re-run (skips users that already have a credential
 * account). Run AFTER the schema migration that adds the Account table, and at
 * cutover. Local: `npx tsx scripts/backfill-better-auth-accounts.mts`.
 * Turso: same command with the remote DATABASE_URL / DATABASE_AUTH_TOKEN set.
 */
async function main() {
  const users = await prisma.user.findMany({
    where: { passwordHash: { not: null } },
    select: { id: true, email: true, passwordHash: true },
  });

  let created = 0;
  let skipped = 0;

  for (const user of users) {
    const existing = await prisma.account.findFirst({
      where: { userId: user.id, providerId: "credential" },
      select: { id: true },
    });
    if (existing) {
      skipped++;
      continue;
    }

    await prisma.account.create({
      data: {
        id: randomUUID(),
        // Better Auth uses the user id as the accountId for credential logins.
        accountId: user.id,
        providerId: "credential",
        userId: user.id,
        password: user.passwordHash,
      },
    });
    created++;
  }

  console.log(
    `Backfill complete: ${created} credential account(s) created, ${skipped} already present (of ${users.length} user(s) with a password).`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
