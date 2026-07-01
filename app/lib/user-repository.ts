import type { FamilyRole, UserProfile, ViewerAccount } from "./types";
import { prisma } from "./prisma";

/**
 * Repository abstraction for user-facing reads of the User model.
 *
 * Mirrors the style of `recipe-repository.ts` / `family-repository.ts`:
 * an interface + Prisma implementation + exported singleton. Auth writes stay
 * with Better Auth (app/lib/auth.ts) — this repository is read-only on
 * purpose: profile/settings MUTATIONS are an ask-first surface.
 */
export interface UserRepository {
  /** Public profile for /u/[id] — safe to show any visitor. */
  getUserProfile(id: string): Promise<UserProfile | null>;
  /**
   * The signed-in user's own account for /settings. Contains private fields
   * (email) — only ever call it with the SESSION user's id.
   */
  getViewerAccount(id: string): Promise<ViewerAccount | null>;
}

class PrismaUserRepository implements UserRepository {
  async getUserProfile(id: string): Promise<UserProfile | null> {
    const row = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        // Filtered relation count: only PUBLIC recipes are part of the
        // public face — private/family/unlisted counts must not leak.
        _count: {
          select: { recipes: { where: { visibility: "PUBLIC" } } },
        },
      },
    });
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      image: row.image,
      createdAt: row.createdAt.toISOString(),
      publicRecipeCount: row._count.recipes,
    };
  }

  async getViewerAccount(id: string): Promise<ViewerAccount | null> {
    const row = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        _count: { select: { recipes: true } },
        families: {
          select: {
            role: true,
            family: { select: { id: true, name: true } },
          },
          orderBy: { joinedAt: "desc" },
        },
      },
    });
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      image: row.image,
      createdAt: row.createdAt.toISOString(),
      recipeCount: row._count.recipes,
      families: row.families.map((m) => ({
        id: m.family.id,
        name: m.family.name,
        // SQLite has no enums — role is TEXT, cast at the type boundary.
        role: m.role as FamilyRole,
      })),
    };
  }
}

export const userRepository: UserRepository = new PrismaUserRepository();
