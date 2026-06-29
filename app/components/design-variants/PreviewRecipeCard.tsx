import Image from "next/image";
import { ChefHat, ListOrdered, Clock } from "lucide-react";
import type { VariantRecipe } from "./mock-data";

/**
 * Card used in the user-page variants' recipe grids. Mirrors the real
 * RecipeCard's glassy-pill treatment but reads from the variant mock shape, so
 * the grids look like production without importing the live data layer.
 */
export function PreviewRecipeCard({ recipe }: { recipe: VariantRecipe }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-muted">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/45 to-transparent dark:from-black/60" />
        <div className="absolute inset-x-3 bottom-3 flex flex-nowrap items-center gap-1.5">
          <Pill icon={<ChefHat className="h-3 w-3" />}>{recipe.ingredients.length}</Pill>
          <Pill icon={<ListOrdered className="h-3 w-3" />}>{recipe.steps.length}</Pill>
          <Pill icon={<Clock className="h-3 w-3" />}>{recipe.totalMinutes}m</Pill>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug tracking-tight text-foreground">
          {recipe.title}
        </h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary">
          {recipe.cuisine}
        </p>
      </div>
    </div>
  );
}

function Pill({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-bold leading-none text-stone-900 backdrop-blur-md dark:bg-black/40 dark:text-white">
      <span className="shrink-0">{icon}</span>
      <span>{children}</span>
    </span>
  );
}
