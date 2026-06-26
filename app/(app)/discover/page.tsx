import { recipeRepository } from "@/app/lib/recipe-repository";
import RecipeCard from "@/app/components/RecipeCard";

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q: rawQ } = await searchParams;
  // Normalise: `q` can be `string | string[] | undefined`.
  const q = Array.isArray(rawQ) ? rawQ[0] : rawQ;
  const recipes = await recipeRepository.getPublicRecipes({
    query: q,
  });

  const hasQuery = typeof q === "string" && q.trim().length > 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Discover recipes
        </h1>
        <p className="text-base text-zinc-600">
          Browse public recipes shared by the community.
        </p>
      </div>

      <form
        action="/discover"
        method="get"
        className="flex w-full max-w-md gap-2"
      >
        <label htmlFor="q" className="sr-only">
          Search recipes
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Search by title…"
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:border-amber-500"
        />
        <button
          type="submit"
          className="inline-flex items-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        >
          Search
        </button>
      </form>

      {recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-300 bg-white py-20 text-center">
          <p className="text-lg font-medium text-zinc-900">
            {hasQuery ? "No recipes found" : "No public recipes yet"}
          </p>
          <p className="text-sm text-zinc-600">
            {hasQuery
              ? `No public recipes match "${q}". Try a different search.`
              : "Be the first to share a public recipe!"}
          </p>
        </div>
      ) : (
        <>
          {hasQuery ? (
            <p className="text-sm text-zinc-500">
              {recipes.length} {recipes.length === 1 ? "result" : "results"}{" "}
              for &ldquo;{q}&rdquo;
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
