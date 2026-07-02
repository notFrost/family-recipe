import { familyRepository } from "./family-repository";
import type { Recipe } from "./types";

/**
 * Single source of truth for who may VIEW a recipe. Used by the recipe page
 * AND every alternate representation of it (share-image route, print, future
 * exports) so the gates can never drift apart:
 *
 * - PRIVATE  → author only
 * - FAMILY   → author or a member of the recipe's family
 *              (orphaned FAMILY rows — no familyId — stay author-only)
 * - PUBLIC / UNLISTED → anyone with the id
 */
export async function canViewRecipe(
  recipe: Recipe,
  viewerId: string | null | undefined,
): Promise<boolean> {
  const isOwner = !!viewerId && viewerId === recipe.authorId;

  if (recipe.visibility === "PRIVATE") {
    return isOwner;
  }

  if (recipe.visibility === "FAMILY") {
    if (isOwner) return true;
    if (!recipe.familyId || !viewerId) return false;
    return familyRepository.isMember(recipe.familyId, viewerId);
  }

  return true;
}
