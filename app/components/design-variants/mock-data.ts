/**
 * Mock data for the recipe-page and user-page design variants.
 *
 * These variants are layout explorations only — they NEVER import the real data
 * layer (`app/lib/**`, `prisma/**`). Everything they render comes from here.
 *
 * The shapes intentionally carry MORE than the live `Recipe`/`User` models so
 * variants can explore richer presentations. Fields the live schema doesn't have
 * yet (prep/cook split, servings, difficulty, cuisine/tags, ratings, social
 * counts, cook's note, author avatar, profile cover/bio/location) are candidate
 * additions — if a chosen variant depends on one, it gets promoted to the real
 * schema at adoption time.
 */

export type Difficulty = "Easy" | "Medium" | "Hard";

/** Who is looking at the recipe — drives which Actions are shown. */
export type ViewerRole = "owner" | "visitor";

export interface VariantIngredient {
  /** e.g. "250 g", "2 tbsp", "" for "to taste" items. */
  amount: string;
  item: string;
}

export interface VariantRecipe {
  id: string;
  title: string;
  imageUrl: string;
  description: string;

  ingredients: VariantIngredient[];
  steps: string[];

  authorId: string;
  authorName: string;
  authorAvatarUrl: string;

  visibility: "PUBLIC" | "FAMILY" | "PRIVATE" | "UNLISTED";
  familyName: string | null;

  cuisine: string;
  tags: string[];
  difficulty: Difficulty;

  /** Time split — `totalMinutes` is the sum, exposed for convenience. */
  prepMinutes: number;
  cookMinutes: number;
  totalMinutes: number;
  servings: number;

  rating: number; // 0–5, one decimal
  ratingCount: number;
  favoriteCount: number;
  savedCount: number;

  /** A short personal note / tip from the cook — used by some variants. */
  cooksNote: string;
  /**
   * The "soul" fields (now real features): the memory behind the dish and who
   * it came from. `sourceName` powers "originally from …" attribution.
   */
  story: string | null;
  sourceName: string | null;
  createdAt: string; // ISO
}

export interface VariantProfile {
  id: string;
  name: string;
  avatarUrl: string;
  coverImageUrl: string;
  bio: string;
  location: string;
  joinedAt: string; // ISO
  specialties: string[];
  recipeCount: number;
  familyCount: number;
  favoritesReceived: number;
  recipes: VariantRecipe[];
}

const img = (id: string) =>
  `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=crop`;

/** The hero recipe used by every recipe-page variant. */
export const mockRecipe: VariantRecipe = {
  id: "recipe-tikka",
  title: "Chicken Tikka Masala",
  imageUrl: img("photo-1565557623262-b51c2513a641"),
  description:
    "Charred, yogurt-marinated chicken folded into a glossy tomato-cream sauce that's warm with garam masala and a little smoke. Weeknight-friendly, but it tastes like a celebration.",
  ingredients: [
    { amount: "600 g", item: "chicken thighs, cut into bite-size pieces" },
    { amount: "200 g", item: "plain whole-milk yogurt" },
    { amount: "2 tbsp", item: "tikka masala spice blend" },
    { amount: "1 tin", item: "crushed tomatoes (400 g)" },
    { amount: "150 ml", item: "heavy cream" },
    { amount: "1", item: "large onion, finely chopped" },
    { amount: "4 cloves", item: "garlic, minced" },
    { amount: "1 tbsp", item: "fresh ginger, grated" },
    { amount: "2 tbsp", item: "ghee or neutral oil" },
    { amount: "", item: "fresh cilantro and lime, to finish" },
  ],
  steps: [
    "Marinate the chicken in the yogurt with half the spice blend and a big pinch of salt. Leave it at least an hour, or overnight if you can.",
    "Sear the chicken in batches over high heat until charred at the edges but not cooked through. Set aside — those browned bits are the flavor.",
    "Soften the onion in the same pan, then add the garlic and ginger and cook until fragrant.",
    "Stir in the rest of the spice blend, then the tomatoes. Simmer 15 minutes until it darkens and thickens.",
    "Return the chicken, pour in the cream, and simmer gently until the sauce coats a spoon and the chicken is just cooked.",
    "Finish with cilantro and a squeeze of lime. Serve with rice or warm naan.",
  ],
  authorId: "user-amara",
  authorName: "Amara Okafor",
  authorAvatarUrl:
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80&auto=format&fit=crop",
  visibility: "FAMILY",
  familyName: "The Okafor Kitchen",
  cuisine: "Indian",
  tags: ["Dinner", "Comfort food", "Make-ahead"],
  difficulty: "Medium",
  prepMinutes: 20,
  cookMinutes: 30,
  totalMinutes: 50,
  servings: 4,
  rating: 4.8,
  ratingCount: 37,
  favoriteCount: 214,
  savedCount: 96,
  cooksNote:
    "Don't skip the char on the chicken — a screaming-hot pan does more for this dish than any single spice.",
  story:
    "Grandma Nkechi made this whenever someone came home from a long trip — the smell of it at the door was how you knew you'd been missed. She never measured a thing; this is the closest I've gotten to her hand.",
  sourceName: "Grandma Nkechi",
  createdAt: "2026-02-20T18:45:00.000Z",
};

const gridRecipe = (
  id: string,
  title: string,
  imageId: string,
  cuisine: string,
  totalMinutes: number,
  ingredients: number,
  steps: number,
  visibility: VariantRecipe["visibility"],
): VariantRecipe => ({
  ...mockRecipe,
  id,
  title,
  imageUrl: img(imageId),
  cuisine,
  totalMinutes,
  prepMinutes: Math.round(totalMinutes * 0.4),
  cookMinutes: totalMinutes - Math.round(totalMinutes * 0.4),
  ingredients: mockRecipe.ingredients.slice(0, ingredients),
  steps: mockRecipe.steps.slice(0, Math.min(steps, mockRecipe.steps.length)),
  visibility,
});

/** A cook's public recipes, used by the user-page variants' grids. */
const profileRecipes: VariantRecipe[] = [
  mockRecipe,
  gridRecipe("r-pizza", "Blistered Margherita", "photo-1574071318508-1cdbab80d002", "Italian", 35, 6, 6, "PUBLIC"),
  gridRecipe("r-ramen", "Weeknight Miso Ramen", "photo-1569718212165-3a8278d5f624", "Japanese", 40, 7, 4, "PUBLIC"),
  gridRecipe("r-tacos", "Charred Corn Tacos", "photo-1565299624946-b28f40a0ae38", "Mexican", 25, 6, 4, "PUBLIC"),
  gridRecipe("r-salad", "Big Greek Salad", "photo-1540420773420-3366772f4999", "Greek", 15, 7, 3, "PUBLIC"),
  gridRecipe("r-pancakes", "Sunday Pancakes", "photo-1528207776546-365bb710ee93", "American", 20, 7, 5, "PUBLIC"),
];

export const mockProfile: VariantProfile = {
  id: "user-amara",
  name: "Amara Okafor",
  avatarUrl:
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop",
  coverImageUrl: img("photo-1556910103-1c02745aae4d"),
  bio: "Home cook chasing the food I grew up with and the food I wish I'd grown up with. Big believer in a hot pan and a generous hand with herbs.",
  location: "Lisbon, Portugal",
  joinedAt: "2024-09-01T00:00:00.000Z",
  specialties: ["Indian", "West African", "Weeknight dinners"],
  recipeCount: 24,
  familyCount: 2,
  favoritesReceived: 1280,
  recipes: profileRecipes,
};

export interface VariantFamilyMember {
  id: string;
  name: string;
  avatarUrl: string;
  role: "OWNER" | "MEMBER";
}

export interface VariantFamily {
  id: string;
  name: string;
  /** Short blurb shown on some layouts. */
  blurb: string;
  members: VariantFamilyMember[];
  /** Member cap from the owner's plan (free = 5) — drives the "x / y" display. */
  memberLimit: number;
  recipes: VariantRecipe[];
  /** The tokenized invite link (the real family-invite feature). */
  inviteToken: string;
  /** Whether the viewer owns the family (shows invite + manage controls). */
  isOwner: boolean;
}

const member = (
  id: string,
  name: string,
  avatarId: string,
  role: "OWNER" | "MEMBER",
): VariantFamilyMember => ({
  id,
  name,
  avatarUrl: `https://images.unsplash.com/${avatarId}?w=200&q=80&auto=format&fit=crop`,
  role,
});

/** The family used by every family-page variant. */
export const mockFamily: VariantFamily = {
  id: "family-okafor",
  name: "The Okafor Kitchen",
  blurb: "Three generations, one pot of stew that never quite tastes the same twice.",
  members: [
    member("m-amara", "Amara Okafor", "photo-1438761681033-6461ffad8d80", "OWNER"),
    member("m-tobi", "Tobi Okafor", "photo-1500648767791-00dcc994a43e", "MEMBER"),
    member("m-zola", "Zola Okafor", "photo-1494790108377-be9c29b29330", "MEMBER"),
    member("m-deji", "Deji Okafor", "photo-1507003211169-0a1dd7228f2d", "MEMBER"),
  ],
  memberLimit: 5,
  recipes: [
    mockRecipe,
    gridRecipe("rf-jollof", "Sunday Jollof Rice", "photo-1604329760661-e71dc83f8f26", "West African", 75, 9, 6, "FAMILY"),
    gridRecipe("rf-stew", "Grandma's Pepper Stew", "photo-1455619452474-d2be8b1e70cd", "West African", 90, 8, 5, "FAMILY"),
    gridRecipe("rf-puffpuff", "Puff-Puff", "photo-1551024601-bec78aea704b", "West African", 40, 6, 4, "FAMILY"),
    gridRecipe("rf-pancakes", "Saturday Pancakes", "photo-1528207776546-365bb710ee93", "American", 20, 7, 5, "FAMILY"),
  ],
  inviteToken: "fK3pQ8vWnT2xLmR9",
  isOwner: true,
};

/** Quick-stat helpers some variants want pre-computed. */
export function joinedLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
