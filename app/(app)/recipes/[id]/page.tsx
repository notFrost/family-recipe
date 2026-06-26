import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { recipeRepository } from "@/app/lib/recipe-repository";
import { familyRepository } from "@/app/lib/family-repository";
import { auth } from "@/app/lib/auth";
import DeleteRecipeButton from "@/app/components/DeleteRecipeButton";

const VISIBILITY_BADGES: Record<
  string,
  { label: string; className: string }
> = {
  PRIVATE: {
    label: "Private",
    className:
      "bg-zinc-100 text-zinc-700 border-zinc-300",
  },
  UNLISTED: {
    label: "Unlisted",
    className:
      "bg-amber-50 text-amber-800 border-amber-300",
  },
  PUBLIC: {
    label: "Public",
    className:
      "bg-green-50 text-green-800 border-green-300",
  },
  FAMILY: {
    label: "Family",
    className:
      "bg-indigo-100 text-indigo-700 border-indigo-300",
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

  const session = await auth();
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

  return (
    <article className="flex flex-col gap-8">
      <Link
        href={backHref}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded"
      >
        <span aria-hidden>&larr;</span>
        {backLabel}
      </Link>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm">
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
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
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
                  className="text-xs font-medium text-zinc-500 underline-offset-2 hover:text-indigo-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
                >
                  in {familyName}
                </Link>
              ) : null}
            </div>
          </div>
          {isOwner ? (
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/recipes/${recipe.id}/edit`}
                className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                Edit
              </Link>
              <DeleteRecipeButton id={recipe.id} />
            </div>
          ) : null}
        </div>

        {recipe.description ? (
          <p className="max-w-2xl text-base leading-relaxed text-zinc-600">
            {recipe.description}
          </p>
        ) : null}

        {recipe.authorName ? (
          <p className="text-sm text-zinc-500">
            by{" "}
            <Link
              href={`/u/${recipe.authorId}`}
              className="font-medium text-zinc-700 underline-offset-2 hover:text-zinc-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
            >
              {recipe.authorName}
            </Link>
          </p>
        ) : null}

        <div className="flex items-center gap-3 text-xs font-medium text-zinc-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {recipe.ingredients.length}{" "}
            {recipe.ingredients.length === 1 ? "ingredient" : "ingredients"}
          </span>
          <span aria-hidden className="text-zinc-300">
            &bull;
          </span>
          <span>
            {recipe.steps.length} {recipe.steps.length === 1 ? "step" : "steps"}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            Ingredients
          </h2>
          <ul className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            {recipe.ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm leading-relaxed text-zinc-700"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                {ingredient}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            Steps
          </h2>
          <ol className="flex flex-col gap-4">
            {recipe.steps.map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm leading-relaxed text-zinc-700">
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
