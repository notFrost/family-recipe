import { prisma } from "./prisma";

/**
 * Feature entitlements (the free vs. premium gates).
 *
 * Philosophy: the *soul* of the app — keeping, viewing, and sharing your
 * family's recipes — is never gated. We only cap two things that scale with a
 * power user's ambition, and we cap them generously:
 *
 *  1. **Authored** recipes — only recipes you CREATE count. Recipes shared with
 *     you or in your families are unlimited to view/favorite/save, so joining a
 *     family never hits a wall (virality stays intact).
 *  2. Members in a family you OWN — gated by the *owner's* plan, so one premium
 *     organizer lifts the cap for the whole table.
 *
 * No payment processor yet: `User.plan` is flipped by a beta "Upgrade" action.
 */
export type Plan = "FREE" | "PREMIUM";

export const FREE_AUTHORED_RECIPE_LIMIT = 30;
export const FREE_FAMILY_MEMBER_LIMIT = 5;
export const PREMIUM_FAMILY_MEMBER_LIMIT = 50;

export function isPremium(plan: string | null | undefined): boolean {
  return plan === "PREMIUM";
}

/** Read a user's plan from the DB (the session doesn't carry custom fields). */
export async function getUserPlan(userId: string): Promise<Plan> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });
  return user?.plan === "PREMIUM" ? "PREMIUM" : "FREE";
}

/** Max recipes a user may author. `Infinity` for premium. */
export function authoredRecipeLimit(plan: string | null | undefined): number {
  return isPremium(plan) ? Infinity : FREE_AUTHORED_RECIPE_LIMIT;
}

/** Max members in a family, gated by the owner's plan. */
export function familyMemberLimit(plan: string | null | undefined): number {
  return isPremium(plan)
    ? PREMIUM_FAMILY_MEMBER_LIMIT
    : FREE_FAMILY_MEMBER_LIMIT;
}
