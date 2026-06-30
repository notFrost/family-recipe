import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import RecipeForm from "@/app/components/RecipeForm";
import { createRecipeAction } from "@/app/lib/actions";
import { getSession } from "@/app/lib/auth";
import { familyRepository } from "@/app/lib/family-repository";
import { recipeRepository } from "@/app/lib/recipe-repository";
import {
  getUserPlan,
  authoredRecipeLimit,
  FREE_AUTHORED_RECIPE_LIMIT,
} from "@/app/lib/entitlements";

export default async function NewRecipePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Route protection: must be signed in to create a recipe.
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/recipes/new");
  }
  const userId = session.user.id;

  const sp = await searchParams;
  const familyIdFromQuery =
    typeof sp.familyId === "string" ? sp.familyId : undefined;

  // GATE: show an upgrade screen rather than the form once a free user has
  // hit the authored-recipe cap. (Recipes shared with you don't count.)
  const [plan, authored, families] = await Promise.all([
    getUserPlan(userId),
    recipeRepository.countByAuthor(userId),
    familyRepository.getFamiliesForUser(userId),
  ]);
  const atCap = authored >= authoredRecipeLimit(plan);

  if (atCap) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5 rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-6 w-6" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          You&apos;ve filled your recipe box
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          The free plan holds {FREE_AUTHORED_RECIPE_LIMIT} of your own recipes —
          and you&apos;ve written all {authored}. Recipes shared with you or in
          your families don&apos;t count and stay unlimited. Premium lifts the
          cap and keeps this little project alive.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/upgrade?reason=recipe-limit"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Sparkles className="h-4 w-4" /> See Premium
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Back to my recipes
          </Link>
        </div>
      </div>
    );
  }

  const familiesForPicker = families.map((f) => ({ id: f.id, name: f.name }));

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          New recipe
        </h1>
        <p className="text-base text-muted-foreground">
          Add a dish to your box — and the story behind it.
        </p>
      </div>

      <RecipeForm
        action={createRecipeAction}
        submitLabel="Create recipe"
        cancelHref="/"
        families={familiesForPicker}
        initialFamilyId={familyIdFromQuery}
      />
    </div>
  );
}
