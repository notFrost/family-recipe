import Image from "next/image";
import Link from "next/link";
import { ChefHat, ListOrdered, Heart, Clock } from "lucide-react";
import type { Recipe } from "../lib/types";

interface RecipeCardProps {
  recipe: Recipe;
  authorIsFormerMember?: boolean;
}

// Compact glassy stat pill laid over the card photo (legible on any image via
// the scrim + backdrop blur).
function StatPill({
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

export default function RecipeCard({
  recipe,
  authorIsFormerMember,
}: RecipeCardProps) {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-muted">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Decorative "save" affordance (the card itself is the link). */}
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-card text-primary shadow-sm">
          <Heart className="h-4 w-4" />
        </span>
        {/* Soft bottom scrim keeps the glassy pills legible over any photo. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/45 to-transparent dark:from-black/60" />
        <div className="absolute inset-x-3 bottom-3 flex flex-nowrap items-center gap-1.5">
          <StatPill icon={<ChefHat className="h-3 w-3" />}>
            {recipe.ingredients.length}
          </StatPill>
          <StatPill icon={<ListOrdered className="h-3 w-3" />}>
            {recipe.steps.length}
          </StatPill>
          {recipe.minutes != null ? (
            <StatPill icon={<Clock className="h-3 w-3" />}>
              {recipe.minutes}m
            </StatPill>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-lg font-bold leading-snug tracking-tight text-foreground">
          {recipe.title}
        </h2>
        {recipe.description ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {recipe.description}
          </p>
        ) : null}
        {recipe.authorName ? (
          <p className="mt-3 truncate text-xs font-semibold text-muted-foreground">
            by {recipe.authorName}
            {authorIsFormerMember ? " (former)" : ""}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
