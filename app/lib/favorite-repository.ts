import { prisma } from "./prisma";

/**
 * Favorites data access. Favoriting is free and unlimited — it never counts
 * against any cap (only AUTHORED recipes do). Mirrors the repository style of
 * the other data modules: interface + Prisma implementation + singleton.
 */
export interface FavoriteRepository {
  /** Toggle a favorite. Returns the new state (true = now favorited). */
  toggle(userId: string, recipeId: string): Promise<boolean>;
  isFavorited(userId: string, recipeId: string): Promise<boolean>;
  /** Recipe ids the user has favorited, most-recent first. */
  listRecipeIds(userId: string): Promise<string[]>;
}

class PrismaFavoriteRepository implements FavoriteRepository {
  async toggle(userId: string, recipeId: string): Promise<boolean> {
    const existing = await prisma.favorite.findUnique({
      where: { userId_recipeId: { userId, recipeId } },
      select: { id: true },
    });
    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return false;
    }
    await prisma.favorite.create({ data: { userId, recipeId } });
    return true;
  }

  async isFavorited(userId: string, recipeId: string): Promise<boolean> {
    const count = await prisma.favorite.count({
      where: { userId, recipeId },
    });
    return count > 0;
  }

  async listRecipeIds(userId: string): Promise<string[]> {
    const rows = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { recipeId: true },
    });
    return rows.map((r) => r.recipeId);
  }
}

export const favoriteRepository: FavoriteRepository =
  new PrismaFavoriteRepository();
