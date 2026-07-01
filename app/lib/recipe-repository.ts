import type { Recipe, RecipeVisibility } from "./types";
import { prisma } from "./prisma";

/**
 * Shape of a Prisma Recipe row after including the author name + avatar.
 *
 * All repository queries include `author: { select: { name: true, image: true } }`
 * so that `toRecipe` can populate the denormalized `authorName` / `authorImage`
 * fields on the app-level `Recipe` type without a separate user lookup.
 */
interface RecipeRowWithAuthor {
  id: string;
  title: string;
  imageUrl: string;
  description: string | null;
  ingredientsJson: string;
  stepsJson: string;
  authorId: string;
  visibility: string;
  familyId: string | null;
  minutes: number | null;
  createdAt: Date;
  author: { name: string | null; image: string | null };
}

/**
 * Repository abstraction over the recipe data source.
 *
 * The intent is that the UI and route handlers depend only on this async
 * interface. This implementation is backed by Prisma + SQLite, but the
 * method signatures and return types are identical to the previous in-memory
 * store so that nothing upstream (pages, server actions, forms) needs to
 * change. The earlier implementation can be found in version control history.
 */
export interface RecipeRepository {
  getRecipeById(id: string): Promise<Recipe | null>;
  getRecipesByAuthor(authorId: string): Promise<Recipe[]>;
  getRecipesByAuthorPublic(authorId: string): Promise<Recipe[]>;
  getPublicRecipes(opts?: { query?: string }): Promise<Recipe[]>;
  getRecipesByFamily(familyId: string): Promise<Recipe[]>;
  createRecipe(
    input: Omit<Recipe, "id" | "createdAt" | "authorName">,
  ): Promise<Recipe>;
  updateRecipe(
    id: string,
    input: Partial<Omit<Recipe, "id" | "createdAt" | "authorName">>,
  ): Promise<Recipe | null>;
  deleteRecipe(id: string): Promise<boolean>;
}

/**
 * Map a Prisma `Recipe` row (with included author) to the `Recipe` app type.
 *
 * `ingredients` / `steps` are stored as JSON-encoded strings in TEXT columns
 * (see prisma/schema.prisma for the rationale) and are deserialized here so
 * callers always receive real `string[]`. `createdAt` is stored as a DateTime
 * and converted to an ISO string to match the app type. `description` is
 * normalized from `null` (DB) to `undefined` (optional app field).
 * `authorName` is taken from the included author relation (null if the user
 * has no name set).
 * `visibility` is stored as a plain TEXT column (SQLite has no native enum)
 * and cast to `RecipeVisibility` at the type boundary.
 */
function toRecipe(row: RecipeRowWithAuthor): Recipe {
  return {
    id: row.id,
    title: row.title,
    imageUrl: row.imageUrl,
    description: row.description ?? undefined,
    ingredients: JSON.parse(row.ingredientsJson) as string[],
    steps: JSON.parse(row.stepsJson) as string[],
    authorId: row.authorId,
    authorName: row.author.name ?? null,
    authorImage: row.author.image ?? null,
    visibility: row.visibility as RecipeVisibility,
    familyId: row.familyId ?? null,
    minutes: row.minutes ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

/** Include clause used by all queries that return Recipe domain objects. */
const authorInclude = {
  author: { select: { name: true, image: true } },
} as const;

class PrismaRecipeRepository implements RecipeRepository {
  async getRecipeById(id: string): Promise<Recipe | null> {
    const row = await prisma.recipe.findUnique({
      where: { id },
      include: authorInclude,
    });
    return row ? toRecipe(row) : null;
  }

  async getRecipesByAuthor(authorId: string): Promise<Recipe[]> {
    const rows = await prisma.recipe.findMany({
      where: { authorId },
      orderBy: { createdAt: "desc" },
      include: authorInclude,
    });
    return rows.map(toRecipe);
  }

  async getRecipesByAuthorPublic(authorId: string): Promise<Recipe[]> {
    const rows = await prisma.recipe.findMany({
      where: { authorId, visibility: "PUBLIC" },
      orderBy: { createdAt: "desc" },
      include: authorInclude,
    });
    return rows.map(toRecipe);
  }

  async getPublicRecipes(opts?: { query?: string }): Promise<Recipe[]> {
    const query = opts?.query?.trim();
    const where: Record<string, unknown> = { visibility: "PUBLIC" };
    if (query) {
      // SQLite's `contains` is case-insensitive for ASCII by default, which
      // matches the desired behaviour for title search on this provider.
      where.title = { contains: query };
    }
    const rows = await prisma.recipe.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: authorInclude,
    });
    return rows.map(toRecipe);
  }

  async getRecipesByFamily(familyId: string): Promise<Recipe[]> {
    const rows = await prisma.recipe.findMany({
      where: { familyId },
      orderBy: { createdAt: "desc" },
      include: authorInclude,
    });
    return rows.map(toRecipe);
  }

  async createRecipe(
    input: Omit<Recipe, "id" | "createdAt" | "authorName">,
  ): Promise<Recipe> {
    // Guard: FAMILY visibility requires a familyId.
    if (input.visibility === "FAMILY" && !input.familyId) {
      throw new Error("FAMILY visibility requires a familyId");
    }

    const row = await prisma.recipe.create({
      data: {
        title: input.title,
        imageUrl: input.imageUrl,
        description: input.description ?? null,
        ingredientsJson: JSON.stringify(input.ingredients),
        stepsJson: JSON.stringify(input.steps),
        authorId: input.authorId,
        visibility: input.visibility ?? "PRIVATE",
        familyId: input.familyId ?? null,
        minutes: input.minutes ?? null,
      },
      include: authorInclude,
    });
    return toRecipe(row);
  }

  async updateRecipe(
    id: string,
    input: Partial<Omit<Recipe, "id" | "createdAt" | "authorName">>,
  ): Promise<Recipe | null> {
    // Return null (rather than throw) when the recipe doesn't exist, matching
    // the previous in-memory contract relied upon by callers.
    const existing = await prisma.recipe.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }

    // Guard: if updating to FAMILY visibility, familyId must be set (either
    // already on the existing row or provided in the input).
    const resolvedVisibility =
      input.visibility !== undefined ? input.visibility : existing.visibility;
    const resolvedFamilyId =
      "familyId" in input ? input.familyId : existing.familyId;
    if (
      resolvedVisibility === "FAMILY" &&
      !resolvedFamilyId
    ) {
      throw new Error("FAMILY visibility requires a familyId");
    }

    const data: Record<string, unknown> = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl;
    if ("description" in input) data.description = input.description ?? null;
    if (input.ingredients !== undefined)
      data.ingredientsJson = JSON.stringify(input.ingredients);
    if (input.steps !== undefined)
      data.stepsJson = JSON.stringify(input.steps);
    if (input.authorId !== undefined) data.authorId = input.authorId;
    if (input.visibility !== undefined) data.visibility = input.visibility;
    if ("familyId" in input) data.familyId = input.familyId ?? null;
    if ("minutes" in input) data.minutes = input.minutes ?? null;

    const row = await prisma.recipe.update({
      where: { id },
      data,
      include: authorInclude,
    });
    return toRecipe(row);
  }

  async deleteRecipe(id: string): Promise<boolean> {
    const existing = await prisma.recipe.findUnique({ where: { id } });
    if (!existing) {
      return false;
    }
    await prisma.recipe.delete({ where: { id } });
    return true;
  }
}

export const recipeRepository: RecipeRepository = new PrismaRecipeRepository();
