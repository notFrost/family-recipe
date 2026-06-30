import Image from "next/image";
import {
  ArrowLeft,
  Clock,
  Flame,
  Users,
  Star,
  Heart,
  Bookmark,
} from "lucide-react";
import { RecipeActionBar } from "../actions";
import type { VariantRecipe, ViewerRole } from "../mock-data";

/**
 * Editorial Spread — the hero is the thesis.
 *
 * A cinematic full-bleed photo carries the title, author, and classification as
 * an overlay (like a magazine opener), the Actions dock just beneath it as a
 * single contained bar, and the recipe itself reads as an asymmetric spread:
 * a narrow ingredients rail beside wide, generously-set numbered steps.
 */
export default function EditorialSpread({
  recipe,
  role,
}: {
  recipe: VariantRecipe;
  role: ViewerRole;
}) {
  return (
    <article className="flex flex-col gap-6">
      <button
        type="button"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to discover
      </button>

      {/* Cinematic hero with overlaid masthead. */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-border shadow-md sm:aspect-[2/1]">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 72rem"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

        {/* Top-right glassy social counts. */}
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-stone-900 backdrop-blur-md dark:bg-black/45 dark:text-white">
            <Heart className="h-3.5 w-3.5" /> {recipe.favoriteCount}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-stone-900 backdrop-blur-md dark:bg-black/45 dark:text-white">
            <Bookmark className="h-3.5 w-3.5" /> {recipe.savedCount}
          </span>
        </div>

        {/* Bottom-left masthead. */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
            <span>{recipe.cuisine}</span>
            <span aria-hidden>·</span>
            <span>{recipe.difficulty}</span>
            {recipe.familyName ? (
              <>
                <span aria-hidden>·</span>
                <span>{recipe.familyName}</span>
              </>
            ) : null}
          </div>
          <h1 className="max-w-3xl text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl">
            {recipe.title}
          </h1>
          <div className="flex items-center gap-2.5">
            <Image
              src={recipe.authorAvatarUrl}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-white/70"
            />
            <span className="text-sm font-semibold text-white/90">
              by {recipe.authorName}
              {recipe.sourceName ? ` · from ${recipe.sourceName}` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Actions dock + meta strip. */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <RecipeActionBar recipe={recipe} role={role} layout="dock" />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <Stat icon={<Clock className="h-4 w-4" />} label="Prep" value={`${recipe.prepMinutes}m`} />
          <Stat icon={<Flame className="h-4 w-4" />} label="Cook" value={`${recipe.cookMinutes}m`} />
          <Stat icon={<Clock className="h-4 w-4" />} label="Total" value={`${recipe.totalMinutes}m`} />
          <Stat icon={<Users className="h-4 w-4" />} label="Serves" value={`${recipe.servings}`} />
          <Stat
            icon={<Star className="h-4 w-4 fill-primary text-primary" />}
            label={`(${recipe.ratingCount})`}
            value={recipe.rating.toFixed(1)}
          />
        </div>
      </div>

      <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {recipe.description}
      </p>

      {recipe.story ? (
        <section className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <h2 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            The story
          </h2>
          <p className="max-w-3xl whitespace-pre-line text-base leading-relaxed text-foreground">
            {recipe.story}
          </p>
        </section>
      ) : null}

      {/* Asymmetric spread: narrow ingredients, wide steps. */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.7fr)]">
        <aside className="flex flex-col gap-4">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold tracking-tight text-foreground">
              Ingredients
            </h2>
            <ul className="flex flex-col">
              {recipe.ingredients.map((ing, i) => (
                <li
                  key={i}
                  className="flex items-baseline justify-between gap-3 border-b border-border/60 py-2 text-sm last:border-0"
                >
                  <span className="text-foreground">{ing.item}</span>
                  {ing.amount ? (
                    <span className="shrink-0 font-bold text-primary">
                      {ing.amount}
                    </span>
                  ) : (
                    <span className="shrink-0 text-xs italic text-muted-foreground">
                      to taste
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
            <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              Cook&apos;s note
            </h3>
            <p className="text-sm leading-relaxed text-foreground">
              {recipe.cooksNote}
            </p>
          </section>
        </aside>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Method
          </h2>
          <ol className="flex flex-col gap-5">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-5">
                <span className="text-3xl font-extrabold leading-none text-primary/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="border-b border-border/60 pb-5 text-base leading-relaxed text-foreground">
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

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      {icon}
      <span className="font-bold text-foreground">{value}</span>
      <span className="text-xs">{label}</span>
    </span>
  );
}
