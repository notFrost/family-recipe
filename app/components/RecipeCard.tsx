import Image from "next/image";
import Link from "next/link";
import type { Recipe } from "../lib/types";

interface RecipeCardProps {
  recipe: Recipe;
  authorIsFormerMember?: boolean;
}

export default function RecipeCard({
  recipe,
  authorIsFormerMember,
}: RecipeCardProps) {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h2 className="text-lg font-semibold leading-snug tracking-tight text-zinc-900">
          {recipe.title}
        </h2>

        {recipe.description ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-zinc-600">
            {recipe.description}
          </p>
        ) : null}

        <div className="mt-auto flex flex-col items-center gap-1.5 pt-3 text-xs font-medium text-zinc-500">
          {/* Row 1: recipe stats — centered */}
          <div className="flex items-center gap-2.5">
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

          {/* Row 2: author — centered, full width for clean truncation */}
          {recipe.authorName ? (
            <div className="flex w-full items-center justify-center gap-1 truncate">
              <span className="text-zinc-400">by</span>
              <span className="truncate">{recipe.authorName}</span>
              {authorIsFormerMember ? (
                <span className="whitespace-nowrap text-zinc-400">
                  (former)
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
