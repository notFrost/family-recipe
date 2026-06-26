import "dotenv/config";
import bcrypt from "bcryptjs";
import { mockRecipes } from "../app/lib/mock-data";
import { prisma } from "../app/lib/prisma";

/**
 * Seed the database from the existing mock recipes.
 *
 * Idempotent:
 *  - The demo user (id "user-1") is upserted FIRST so that the Recipe ->
 *    User foreign key is always satisfied (all mock recipes have
 *    authorId "user-1").
 *  - The Recipe table is cleared and re-inserted from the mock fixtures.
 *
 * The mock data's `id` and `createdAt` are preserved so the seeded rows match
 * the original fixtures. `ingredients` / `steps` are JSON-encoded into their
 * TEXT columns, mirroring the (de)serialization done in the repository.
 */
const DEMO_USER = {
  id: "user-1",
  email: "demo@recipes.app",
  name: "Demo Cook",
  // Plaintext password for the demo account: "password123".
  password: "password123",
};

async function main() {
  const passwordHash = bcrypt.hashSync(DEMO_USER.password, 10);

  // Upsert the demo user before any recipes are created.
  await prisma.user.upsert({
    where: { id: DEMO_USER.id },
    update: {
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      passwordHash,
    },
    create: {
      id: DEMO_USER.id,
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      passwordHash,
    },
  });

  // Clear existing data in dependency order (child tables first).
  await prisma.recipe.deleteMany();
  await prisma.familyMember.deleteMany();
  await prisma.family.deleteMany();

  // Seed the demo family BEFORE recipes so the FK from Recipe.familyId
  // to Family.id is satisfied.
  await prisma.family.upsert({
    where: { id: "family-1" },
    update: {
      name: "The Demo Family",
      ownerId: "user-1",
    },
    create: {
      id: "family-1",
      name: "The Demo Family",
      ownerId: "user-1",
    },
  });

  await prisma.familyMember.upsert({
    where: {
      familyId_userId: { familyId: "family-1", userId: "user-1" },
    },
    update: { role: "OWNER" },
    create: {
      id: "member-1",
      familyId: "family-1",
      userId: "user-1",
      role: "OWNER",
    },
  });

  // Now insert recipes (family references are valid).
  for (const recipe of mockRecipes) {
    await prisma.recipe.create({
      data: {
        id: recipe.id,
        title: recipe.title,
        imageUrl: recipe.imageUrl,
        description: recipe.description ?? null,
        ingredientsJson: JSON.stringify(recipe.ingredients),
        stepsJson: JSON.stringify(recipe.steps),
        authorId: recipe.authorId,
        visibility: recipe.visibility,
        familyId: recipe.familyId ?? null,
        createdAt: new Date(recipe.createdAt),
      },
    });
  }

  const userCount = await prisma.user.count();
  const recipeCount = await prisma.recipe.count();
  const familyCount = await prisma.family.count();
  const memberCount = await prisma.familyMember.count();
  console.log(
    `Seeded ${userCount} user(s), ${recipeCount} recipes, ${familyCount} family(ies), and ${memberCount} member(s).`,
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
