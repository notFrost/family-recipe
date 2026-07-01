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
  authorImage?: string | null; // denormalized author avatar URL (User.image, null if unset)
  visibility: RecipeVisibility;
  familyId?: string | null; // set when visibility === "FAMILY"
  minutes?: number | null; // total time to make, in minutes (optional)
  createdAt: string; // ISO date string
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
  userImage?: string | null; // denormalized user avatar URL (User.image, null if unset)
}

/** A user's public face: what anyone may see on /u/[id]. */
export interface UserProfile {
  id: string;
  name: string | null;
  image: string | null;
  createdAt: string; // ISO — "member since"
  publicRecipeCount: number;
}

/**
 * The signed-in user's own account, for /settings. Includes private fields
 * (email) and cross-model aggregates, so it must only ever be fetched for the
 * session user.
 */
export interface ViewerAccount {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: string; // ISO
  /** Recipes the user authored, any visibility. */
  recipeCount: number;
  families: { id: string; name: string; role: FamilyRole }[];
}
