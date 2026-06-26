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
}
