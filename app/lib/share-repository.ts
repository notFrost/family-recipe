import { randomBytes } from "node:crypto";
import type { ShareLink } from "./types";
import { prisma } from "./prisma";

/**
 * Share-link data access (the "friends" sharing circle). A share link lets
 * anyone with the URL view a recipe via /r/<token>, regardless of its
 * visibility. Revoking deletes the row.
 */
export interface ShareRepository {
  create(recipeId: string, createdById: string): Promise<ShareLink>;
  getByToken(token: string): Promise<ShareLink | null>;
  listByRecipe(recipeId: string): Promise<ShareLink[]>;
  /** Revoke a link by id, but only if it belongs to `recipeId` (ownership guard). */
  revoke(id: string, recipeId: string): Promise<boolean>;
}

function toShareLink(row: {
  id: string;
  token: string;
  recipeId: string;
  createdAt: Date;
}): ShareLink {
  return {
    id: row.id,
    token: row.token,
    recipeId: row.recipeId,
    createdAt: row.createdAt.toISOString(),
  };
}

/** URL-safe, unguessable token. */
function newToken(): string {
  return randomBytes(18).toString("base64url");
}

class PrismaShareRepository implements ShareRepository {
  async create(recipeId: string, createdById: string): Promise<ShareLink> {
    const row = await prisma.shareLink.create({
      data: { token: newToken(), recipeId, createdById },
    });
    return toShareLink(row);
  }

  async getByToken(token: string): Promise<ShareLink | null> {
    const row = await prisma.shareLink.findUnique({ where: { token } });
    return row ? toShareLink(row) : null;
  }

  async listByRecipe(recipeId: string): Promise<ShareLink[]> {
    const rows = await prisma.shareLink.findMany({
      where: { recipeId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toShareLink);
  }

  async revoke(id: string, recipeId: string): Promise<boolean> {
    const result = await prisma.shareLink.deleteMany({
      where: { id, recipeId },
    });
    return result.count > 0;
  }
}

export const shareRepository: ShareRepository = new PrismaShareRepository();
