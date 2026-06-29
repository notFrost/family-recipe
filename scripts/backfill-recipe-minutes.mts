import "dotenv/config";
import { mockRecipes } from "../app/lib/mock-data";
import { prisma } from "../app/lib/prisma";

/**
 * One-off backfill: set `minutes` on the seeded demo recipes that predate the
 * column.
 *
 * The prod Turso DB was first populated before the `minutes` field existed, so
 * its 8 demo recipes (recipe-1 … recipe-8) have `minutes = NULL` and render no
 * time pill — even though `app/lib/mock-data.ts` (the canonical source) carries
 * the correct values. This copies those values onto any matching row whose
 * `minutes` is still NULL.
 *
 * Idempotent and non-destructive: only fills NULLs, never overwrites a time a
 * user has already set. Loads `.env` via dotenv (NOT `.env.local`), so by
 * default it targets the production DB.
 *
 *   npx tsx scripts/backfill-recipe-minutes.mts
 */
async function main() {
  let updated = 0;
  let skipped = 0;

  for (const recipe of mockRecipes) {
    if (recipe.minutes == null) continue;

    // Only fill rows that still have no time (don't clobber user edits).
    const result = await prisma.recipe.updateMany({
      where: { id: recipe.id, minutes: null },
      data: { minutes: recipe.minutes },
    });

    if (result.count > 0) {
      updated += result.count;
      console.log(`  ${recipe.id} (${recipe.title}) → ${recipe.minutes}m`);
    } else {
      skipped++;
    }
  }

  console.log(
    `\nBackfill complete: ${updated} recipe(s) updated, ${skipped} already had a time or weren't present.`,
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
