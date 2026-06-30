export type RecipeVisibility = "PRIVATE" | "PUBLIC" | "UNLISTED" | "FAMILY";

export interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  ingredients: string[];
  steps: string[];
  authorId: string;
  authorName?: string | null; // denormalized author display name (null if user has no name)
  visibility: RecipeVisibility;
  familyId?: string | null; // set when visibility === "FAMILY"
  minutes?: number | null; // total time to make, in minutes (optional)
  // "Soul" fields — the memory behind the dish and who it came from.
  story?: string | null;
  sourceName?: string | null;
  // Lineage: the recipe id this was saved/forked from (null if original).
  parentRecipeId?: string | null;
  createdAt: string; // ISO date string
}

/** A tokenized public share link for a recipe (the "friends" sharing circle). */
export interface ShareLink {
  id: string;
  token: string;
  recipeId: string;
  createdAt: string; // ISO
}

/** A tokenized invite to join a family. */
export interface FamilyInvite {
  id: string;
  token: string;
  familyId: string;
  role: FamilyRole;
  createdAt: string; // ISO
}

export interface Family {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string; // ISO
}

export type FamilyRole = "OWNER" | "MEMBER";

export interface FamilyMember {
  id: string;
  familyId: string;
  userId: string;
  role: FamilyRole;
  joinedAt: string; // ISO
  userName?: string | null; // denormalized user name
}
