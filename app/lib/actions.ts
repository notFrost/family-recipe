"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { recipeRepository } from "./recipe-repository";
import { familyRepository } from "./family-repository";
import { auth, getSession } from "./auth";
import { loginRateLimit, signupRateLimit, checkRateLimit } from "./rate-limit";
import type { Recipe, RecipeVisibility } from "./types";

const VALID_VISIBILITIES = new Set<string>([
  "PRIVATE",
  "PUBLIC",
  "UNLISTED",
  "FAMILY",
]);

/**
 * Parse a FormData payload into the shape the repository expects.
 *
 * Ingredients and steps are submitted as repeated fields named
 * `ingredients` / `steps`. We trim each entry and drop empties so the
 * stored arrays stay clean regardless of how the client serialized them.
 *
 * The `authorId` is NOT taken from the form — it is supplied by the caller
 * from the authenticated session so it can never be spoofed by the client.
 *
 * `authorName` is intentionally NOT returned — the repository fills it from
 * the joined User row so it can never be spoofed by the client.
 *
 * `visibility` is read from the form and validated against the allowed set;
 * if missing or invalid it defaults to `"PRIVATE"`.
 */
function parseRecipeFormData(
  formData: FormData,
  authorId: string,
): Omit<Recipe, "id" | "createdAt" | "authorName"> {
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const imageUrl = (formData.get("imageUrl") as string | null)?.trim() ?? "";
  const description =
    (formData.get("description") as string | null)?.trim() ?? "";

  const ingredients = formData
    .getAll("ingredients")
    .map((value) => String(value).trim())
    .filter((value) => value.length > 0);

  const steps = formData
    .getAll("steps")
    .map((value) => String(value).trim())
    .filter((value) => value.length > 0);

  const rawVisibility = (formData.get("visibility") as string | null)?.trim();
  const visibility: RecipeVisibility = VALID_VISIBILITIES.has(
    rawVisibility ?? "",
  )
    ? (rawVisibility as RecipeVisibility)
    : "PRIVATE";

  const familyId =
    (formData.get("familyId") as string | null)?.trim() || null;

  return {
    title,
    imageUrl,
    description: description.length > 0 ? description : undefined,
    ingredients,
    steps,
    authorId,
    visibility,
    familyId,
  };
}

/**
 * Resolve the current user id from the session, or redirect to /login.
 * Centralizes the "must be signed in" gate used by every mutating action.
 */
async function requireUserId(): Promise<string> {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }
  return userId;
}

export async function createRecipeAction(formData: FormData): Promise<void> {
  // SECURITY: require a session; authorId is the session user, never the form.
  const userId = await requireUserId();

  const input = parseRecipeFormData(formData, userId);

  // SECURITY: if scoping to a family, the user must be a member of that family.
  if (input.visibility === "FAMILY") {
    if (!input.familyId) {
      throw new Error("A family must be selected for family recipes.");
    }
    const isMember = await familyRepository.isMember(
      input.familyId,
      userId,
    );
    if (!isMember) {
      throw new Error("You are not a member of this family.");
    }
  }

  const created = await recipeRepository.createRecipe(input);

  revalidatePath("/");
  revalidatePath(`/recipes/${created.id}`);
  redirect(`/recipes/${created.id}`);
}

export async function updateRecipeAction(
  id: string,
  formData: FormData,
): Promise<void> {
  // SECURITY: require a session AND verify ownership of the target recipe
  // before performing the mutation.
  const userId = await requireUserId();

  const existing = await recipeRepository.getRecipeById(id);
  if (!existing || existing.authorId !== userId) {
    // Not found or not the owner: reject without mutating.
    redirect("/login");
  }

  const input = parseRecipeFormData(formData, userId);

  // SECURITY: if scoping to a family, the user must be a member of that family.
  if (input.visibility === "FAMILY" && input.familyId) {
    const isMember = await familyRepository.isMember(
      input.familyId,
      userId,
    );
    if (!isMember) {
      throw new Error("You are not a member of this family.");
    }
  }

  await recipeRepository.updateRecipe(id, input);

  revalidatePath("/");
  revalidatePath(`/recipes/${id}`);
  revalidatePath(`/recipes/${id}/edit`);
  redirect(`/recipes/${id}`);
}

export async function deleteRecipeAction(id: string): Promise<void> {
  // SECURITY: require a session AND verify ownership before deleting.
  const userId = await requireUserId();

  const existing = await recipeRepository.getRecipeById(id);
  if (!existing || existing.authorId !== userId) {
    redirect("/login");
  }

  await recipeRepository.deleteRecipe(id);

  revalidatePath("/");
  redirect("/");
}

/* -------------------------------------------------------------------------- */
/*  Authentication actions                                                    */
/* -------------------------------------------------------------------------- */

export interface AuthFormState {
  error?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Log in via Better Auth's email/password provider.
 *
 * On bad credentials `signInEmail` throws, which we translate into a friendly
 * message returned via `useActionState`. On success the `nextCookies` plugin
 * sets the session cookie and we `redirect` to the callback URL.
 */
export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  // Rate limiting: check before any expensive operations (DB, bcrypt).
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  const loginCheck = await checkRateLimit(loginRateLimit, ip);
  if (!loginCheck.success) {
    return {
      error: "Too many login attempts. Please try again in a minute.",
    };
  }

  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const callbackUrl =
    (formData.get("callbackUrl") as string | null)?.trim() || "/";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    await auth.api.signInEmail({
      body: { email, password },
      headers: headersList,
    });
  } catch {
    // Better Auth throws on invalid credentials. (A successful call returns
    // normally and the nextCookies plugin sets the session cookie.)
    return { error: "Invalid email or password." };
  }

  // Success: the session cookie is set — send the user to their destination.
  redirect(callbackUrl);
}

/**
 * Register a new user via Better Auth, which also signs them in.
 *
 * Validates input, then calls `signUpEmail` (autoSignIn is on by default, so
 * the new account is logged in and its session cookie set via nextCookies).
 * Duplicate emails surface a friendly message. Password hashing is bcrypt,
 * configured on the Better Auth instance (see app/lib/password.ts).
 */
export async function signupAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  // Rate limiting: check before any expensive operations (DB, bcrypt).
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  const signupCheck = await checkRateLimit(signupRateLimit, ip);
  if (!signupCheck.success) {
    return {
      error: "Too many sign-up attempts. Please try again in a minute.",
    };
  }

  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  const displayName = name.length > 0 ? name : email.split("@")[0];

  try {
    await auth.api.signUpEmail({
      body: { name: displayName, email, password },
      headers: headersList,
    });
  } catch (error) {
    // Most commonly the email is already registered. Surface a friendly
    // message instead of the raw Better Auth error.
    const message =
      error instanceof Error &&
      /exist|already|taken|unique/i.test(error.message)
        ? "An account with that email already exists."
        : "Something went wrong creating your account.";
    return { error: message };
  }

  // signUpEmail auto-signs-in and sets the session cookie — go home.
  redirect("/");
}

/** Sign the current user out and return them to the home page. */
export async function signOutAction(): Promise<void> {
  await auth.api.signOut({ headers: await headers() });
  redirect("/");
}

/* -------------------------------------------------------------------------- */
/*  Family actions                                                            */
/* -------------------------------------------------------------------------- */

export async function createFamilyAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const name = (formData.get("name") as string | null)?.trim();

  if (!name) {
    redirect("/families/new");
  }

  const created = await familyRepository.createFamily({
    name,
    ownerId: userId,
  });

  revalidatePath("/families");
  revalidatePath(`/families/${created.id}`);
  redirect(`/families/${created.id}`);
}

export async function joinFamilyAction(familyId: string): Promise<void> {
  const userId = await requireUserId();

  const family = await familyRepository.getFamilyById(familyId);
  if (!family) {
    redirect("/families");
  }

  // Idempotent — joining when already a member is a no-op.
  await familyRepository.addMember(familyId, userId);

  revalidatePath(`/families/${familyId}`);
  redirect(`/families/${familyId}`);
}

export async function leaveFamilyAction(familyId: string): Promise<void> {
  const userId = await requireUserId();

  const role = await familyRepository.getMemberRole(familyId, userId);
  if (role === null) {
    redirect(`/families/${familyId}`);
  }

  if (role === "OWNER") {
    throw new Error(
      "Owners cannot leave directly. Transfer ownership first, then leave.",
    );
  }

  await familyRepository.removeMember(familyId, userId);

  revalidatePath("/families");
  revalidatePath(`/families/${familyId}`);
  redirect("/families");
}

export async function removeMemberAction(
  familyId: string,
  userIdToRemove: string,
): Promise<void> {
  const currentUserId = await requireUserId();

  // Only the owner can remove members.
  const currentUserRole = await familyRepository.getMemberRole(
    familyId,
    currentUserId,
  );
  if (currentUserRole !== "OWNER") {
    redirect(`/families/${familyId}`);
  }

  // The owner cannot remove themselves through this action.
  if (userIdToRemove === currentUserId) {
    redirect(`/families/${familyId}`);
  }

  await familyRepository.removeMember(familyId, userIdToRemove);

  revalidatePath(`/families/${familyId}`);
  redirect(`/families/${familyId}`);
}

export async function transferOwnershipAction(
  familyId: string,
  newOwnerId: string,
): Promise<void> {
  const currentUserId = await requireUserId();

  const family = await familyRepository.getFamilyById(familyId);
  if (!family) {
    redirect("/families");
  }

  // Only the current owner can transfer ownership.
  if (family.ownerId !== currentUserId) {
    redirect(`/families/${familyId}`);
  }

  const success = await familyRepository.transferOwnership(
    familyId,
    newOwnerId,
  );
  if (!success) {
    redirect(`/families/${familyId}`);
  }

  revalidatePath(`/families/${familyId}`);
  revalidatePath("/families");
  redirect(`/families/${familyId}`);
}

export async function deleteFamilyAction(familyId: string): Promise<void> {
  const currentUserId = await requireUserId();

  const family = await familyRepository.getFamilyById(familyId);
  if (!family || family.ownerId !== currentUserId) {
    redirect(`/families/${familyId}`);
  }

  await familyRepository.deleteFamily(familyId); // re-scopes recipes to PRIVATE

  revalidatePath("/families");
  revalidatePath("/");
  redirect("/families");
}
