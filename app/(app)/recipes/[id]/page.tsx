import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ChefHat, ListOrdered, Pencil } from "lucide-react";
import { recipeRepository } from "@/app/lib/recipe-repository";
import { familyRepository } from "@/app/lib/family-repository";
import { getSession } from "@/app/lib/auth";
import Avatar from "@/app/components/Avatar";
import DeleteRecipeButton from "@/app/components/DeleteRecipeButton";
import ShareLinkButton from "@/app/components/ShareLinkButton";

// Homestead: the eyebrow above the title carries the recipe's visibility in
// the style's uppercase-tracked voice (the mock used cuisine · difficulty —
// fields the schema doesn't have; visibility is the real datum that matters).
const VISIBILITY_EYEBROWS: Record<string, string> = {
  PRIVATE: "Private recipe",
  UNLISTED: "Unlisted recipe",
  PUBLIC: "Public recipe",
  FAMILY: "Family recipe",
};

/**
 * Recipe page in the Homestead language — "Cook's Table": lead with the
 * person, not the plate. A prominent byline (avatar + name + family lineage)
 * sits under the title, the photo follows, then one warm column of
 * ingredients and method. The story panel ships when the `story` field lands
 * (feat/mvp-sharing-families).
 */
export default async function RecipeDetailPage({
  params,
}: PageProps<"/recipes/[id]">) {
  const { id } = await params;
  const recipe = await recipeRepository.getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  const session = await getSession();
  const isOwner = session?.user?.id === recipe.authorId;

  // View-gating: PRIVATE recipes are only visible to the author.
  if (recipe.visibility === "PRIVATE" && !isOwner) {
    notFound();
  }

  // View-gating: FAMILY recipes are only visible to family members (and the owner).
  if (recipe.visibility === "FAMILY" && !isOwner) {
    if (recipe.familyId) {
      const isMember = await familyRepository.isMember(
        recipe.familyId,
        session?.user?.id ?? "",
      );
      if (!isMember) {
        notFound();
      }
    } else {
      // Orphaned FAMILY recipe — shouldn't happen, but treat as not found for non-owners.
      notFound();
    }
  }

  // Fetch family name for FAMILY recipes when there is a familyId.
  let familyName: string | null = null;
  if (recipe.visibility === "FAMILY" && recipe.familyId) {
    const family = await familyRepository.getFamilyById(recipe.familyId);
    familyName = family?.name ?? null;
  }

  const backHref = isOwner ? "/" : "/discover";
  const backLabel = isOwner ? "Back to my recipes" : "Back to discover";
  const eyebrow =
    VISIBILITY_EYEBROWS[recipe.visibility] ?? VISIBILITY_EYEBROWS.PRIVATE;

  return (
    <article className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <Link
        href={backHref}
        className="inline-flex w-fit items-center gap-1.5 rounded text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </span>
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          {recipe.title}
        </h1>

        {/* Prominent byline — the cook stays front and center. */}
        <div className="mt-1 flex items-center gap-3">
          <Avatar
            name={recipe.authorName}
            src={recipe.authorImage}
            size={52}
            className="h-12 w-12 shrink-0 text-lg ring-2 ring-primary/25"
          />
          <div className="flex flex-col leading-tight">
            <Link
              href={`/u/${recipe.authorId}`}
              className="w-fit rounded text-lg font-extrabold tracking-tight text-foreground underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {recipe.authorName ?? "A family cook"}
            </Link>
            {familyName && recipe.familyId ? (
              <span className="text-sm text-muted-foreground">
                in{" "}
                <Link
                  href={`/families/${recipe.familyId}`}
                  className="rounded font-semibold text-foreground underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {familyName}
                </Link>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border bg-muted shadow-md">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          preload
          sizes="(max-width: 1024px) 100vw, 56rem"
          className="object-cover"
        />
      </div>

      {/* Actions + quick stats. */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {isOwner ? (
            <>
              <Link
                href={`/recipes/${recipe.id}/edit`}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
              <ShareLinkButton />
              <DeleteRecipeButton id={recipe.id} />
            </>
          ) : (
            <ShareLinkButton />
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {recipe.minutes != null ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span className="font-bold text-foreground">
                {recipe.minutes}m
              </span>{" "}
              total
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <ChefHat className="h-4 w-4" />
            <span className="font-bold text-foreground">
              {recipe.ingredients.length}
            </span>{" "}
            {recipe.ingredients.length === 1 ? "ingredient" : "ingredients"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ListOrdered className="h-4 w-4" />
            <span className="font-bold text-foreground">
              {recipe.steps.length}
            </span>{" "}
            {recipe.steps.length === 1 ? "step" : "steps"}
          </span>
        </div>
      </div>

      {recipe.description ? (
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          {recipe.description}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Ingredients
          </h2>
          <ul className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
            {recipe.ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="border-b border-border/50 py-2 text-sm leading-relaxed text-foreground last:border-0"
              >
                {ingredient}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Method
          </h2>
          <ol className="flex flex-col gap-4">
            {recipe.steps.map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm leading-relaxed text-foreground">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}
