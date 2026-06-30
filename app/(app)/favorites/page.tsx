import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
import { getSession } from "@/app/lib/auth";
import { favoriteRepository } from "@/app/lib/favorite-repository";
import { recipeRepository } from "@/app/lib/recipe-repository";
import RecipeCard from "@/app/components/RecipeCard";

export default async function FavoritesPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/favorites");
  }

  const ids = await favoriteRepository.listRecipeIds(session.user.id);
  const recipes = await recipeRepository.getRecipesByIds(ids);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="flex items-center gap-2.5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          <Heart className="h-7 w-7 fill-primary text-primary" />
          Favorites
        </h1>
        <p className="text-base text-muted-foreground">
          {recipes.length > 0
            ? `${recipes.length} recipe${recipes.length === 1 ? "" : "s"} you've saved`
            : "Recipes you favorite show up here."}
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <p className="text-lg font-medium text-foreground">
            No favorites yet
          </p>
          <p className="text-sm text-muted-foreground">
            Tap the heart on any recipe to keep it here.{" "}
            <Link
              href="/discover"
              className="font-semibold text-primary hover:text-primary/80"
            >
              Discover recipes
            </Link>
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
