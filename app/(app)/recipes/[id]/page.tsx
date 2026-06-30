import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { recipeRepository } from "@/app/lib/recipe-repository";
import { familyRepository } from "@/app/lib/family-repository";
import { favoriteRepository } from "@/app/lib/favorite-repository";
import { shareRepository } from "@/app/lib/share-repository";
import { getSession } from "@/app/lib/auth";
import RecipePageActions from "@/app/components/RecipePageActions";

const VISIBILITY_BADGES: Record<
  string,
  { label: string; className: string }
> = {
  PRIVATE: {
    label: "Private",
    className:
      "bg-muted text-muted-foreground border-border",
  },
  UNLISTED: {
    label: "Unlisted",
    className:
      "bg-primary/10 text-primary border-primary/30",
  },
  PUBLIC: {
    label: "Public",
    className:
      "bg-green-50 text-green-800 border-green-300 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30",
  },
  FAMILY: {
    label: "Family",
    className:
      "bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30",
  },
};

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
  const badge = VISIBILITY_BADGES[recipe.visibility] ?? VISIBILITY_BADGES.PRIVATE;

  // Data for the Actions section.
  const viewerId = session?.user?.id;
  const isLoggedIn = !!viewerId;
  const [isFavorited, viewerFamilies, shareLinks] = await Promise.all([
    viewerId ? favoriteRepository.isFavorited(viewerId, recipe.id) : Promise.resolve(false),
    viewerId ? familyRepository.getFamiliesForUser(viewerId) : Promise.resolve([]),
    isOwner ? shareRepository.listByRecipe(recipe.id) : Promise.resolve([]),
  ]);
  const viewerFamiliesForPicker = viewerFamilies.map((f) => ({
    id: f.id,
    name: f.name,
  }));

  return (
    <article className="flex flex-col gap-8">
      <Link
        href={backHref}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
      >
        <span aria-hidden>&larr;</span>
        {backLabel}
      </Link>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          preload
          sizes="(max-width: 1024px) 100vw, 64rem"
          className="object-cover"
        />
      </div>

      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {recipe.title}
              </h1>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
              >
                {badge.label}
              </span>
              {recipe.visibility === "FAMILY" && recipe.familyId && familyName ? (
                <Link
                  href={`/families/${recipe.familyId}`}
                  className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  in {familyName}
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        {recipe.description ? (
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            {recipe.description}
          </p>
        ) : null}

        {recipe.authorName ? (
          <p className="text-sm text-muted-foreground">
            by{" "}
            <Link
              href={`/u/${recipe.authorId}`}
              className="font-medium text-foreground underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              {recipe.authorName}
            </Link>
            {recipe.sourceName ? (
              <>
                {" "}
                · originally from{" "}
                <span className="font-medium text-foreground">
                  {recipe.sourceName}
                </span>
              </>
            ) : null}
          </p>
        ) : null}

        <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {recipe.ingredients.length}{" "}
            {recipe.ingredients.length === 1 ? "ingredient" : "ingredients"}
          </span>
          <span aria-hidden className="text-muted-foreground">
            &bull;
          </span>
          <span>
            {recipe.steps.length} {recipe.steps.length === 1 ? "step" : "steps"}
          </span>
        </div>
      </header>

      <RecipePageActions
        recipeId={recipe.id}
        isOwner={isOwner}
        isLoggedIn={isLoggedIn}
        initialFavorited={isFavorited}
        families={viewerFamiliesForPicker}
        shareLinks={shareLinks.map((l) => ({ id: l.id, token: l.token }))}
        editHref={`/recipes/${recipe.id}/edit`}
      />

      {recipe.story ? (
        <section className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <h2 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            The story
          </h2>
          <p className="whitespace-pre-line text-base leading-relaxed text-foreground">
            {recipe.story}
          </p>
        </section>
      ) : null}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Ingredients
          </h2>
          <ul className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 shadow-sm">
            {recipe.ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm leading-relaxed text-foreground"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {ingredient}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Steps
          </h2>
          <ol className="flex flex-col gap-4">
            {recipe.steps.map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
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
