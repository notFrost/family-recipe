import { recipeRepository } from "@/app/lib/recipe-repository";
import RecipeCard from "@/app/components/RecipeCard";
import { Search } from "lucide-react";

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q: rawQ } = await searchParams;
  // Normalise: `q` can be `string | string[] | undefined`.
  const q = Array.isArray(rawQ) ? rawQ[0] : rawQ;
  const recipes = await recipeRepository.getPublicRecipes({ query: q });
  const hasQuery = typeof q === "string" && q.trim().length > 0;

  return (
    <div className="flex flex-col">
      <div className="mb-7 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
          From our kitchen to yours
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Gather round the table
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          Tried-and-true dishes passed down through family kitchens — the kind
          that fill the house with warmth and bring everyone back for seconds.
        </p>
      </div>

      <form
        action="/discover"
        method="get"
        className="mx-auto flex w-full max-w-lg items-center gap-2 rounded-full border border-border bg-card p-1.5 shadow-sm"
      >
        <label htmlFor="q" className="sr-only">
          Search recipes
        </label>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search recipes…"
            className="h-11 w-full rounded-full border-0 bg-transparent pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
          />
        </div>
        <button
          type="submit"
          className="h-11 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:scale-105"
        >
          Search
        </button>
      </form>

      {recipes.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <p className="text-lg font-bold text-foreground">
            {hasQuery ? "No recipes found" : "No public recipes yet"}
          </p>
          <p className="text-sm text-muted-foreground">
            {hasQuery
              ? `No public recipes match "${q}". Try a different search.`
              : "Be the first to share a public recipe!"}
          </p>
        </div>
      ) : (
        <>
          <p className="mb-9 mt-6 text-center text-sm font-semibold text-muted-foreground">
            {hasQuery
              ? `${recipes.length} ${recipes.length === 1 ? "result" : "results"} for "${q}"`
              : `${recipes.length} ${recipes.length === 1 ? "recipe" : "recipes"} from home cooks`}
          </p>
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
