import { redirect } from "next/navigation";
import { recipeRepository } from "@/app/lib/recipe-repository";
import { getSession } from "@/app/lib/auth";
import RecipeCard from "@/app/components/RecipeCard";

export default async function Home() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/discover");
  }

  const recipes = await recipeRepository.getRecipesByAuthor(session.user.id);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          My recipes
        </h1>
        <p className="text-base text-muted-foreground">
          You have {recipes.length}{" "}
          {recipes.length === 1 ? "recipe" : "recipes"}.
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <p className="text-lg font-medium text-foreground">No recipes yet</p>
          <p className="text-sm text-muted-foreground">
            Add your first recipe to get started.
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
