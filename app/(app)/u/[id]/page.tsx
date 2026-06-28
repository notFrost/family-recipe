import Link from "next/link";
import { recipeRepository } from "@/app/lib/recipe-repository";
import RecipeCard from "@/app/components/RecipeCard";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipes = await recipeRepository.getRecipesByAuthorPublic(id);

  const authorName =
    recipes.length > 0 && recipes[0].authorName
      ? recipes[0].authorName
      : null;

  const displayName = authorName ?? "This cook";

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/discover"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
      >
        <span aria-hidden>&larr;</span>
        Back to discover
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {displayName}
        </h1>
        <p className="text-base text-muted-foreground">
          {recipes.length > 0
            ? `${recipes.length} public ${recipes.length === 1 ? "recipe" : "recipes"}`
            : "Public recipes"}
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <p className="text-lg font-medium text-foreground">
            No public recipes
          </p>
          <p className="text-sm text-muted-foreground">
            {authorName
              ? `${displayName} hasn't shared any public recipes yet.`
              : "This cook hasn't shared any public recipes yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
