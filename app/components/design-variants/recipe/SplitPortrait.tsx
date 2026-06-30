import Image from "next/image";
import {
  ArrowLeft,
  Clock,
  Flame,
  Timer,
  Users,
  Star,
  Gauge,
  Heart,
  Lock,
  Globe,
  Home,
} from "lucide-react";
import { RecipeActionBar } from "../actions";
import type { VariantRecipe, ViewerRole } from "../mock-data";

/**
 * Split Portrait — the dish gets portrait presence, context sits beside it.
 *
 * Where EditorialSpread lays the dish down as a wide cinematic band with the
 * title floated *over* it, this variant stands the photo up: a tall 4/5 poster
 * on the left, and on the right a calm column carrying everything you need to
 * decide on the recipe before scrolling — classification badge, title, author,
 * description, a symmetric grid of stat tiles, and the Actions inline.
 *
 * Below the split, ingredients and steps share a balanced two-column footing
 * (no narrow rail / wide body asymmetry here) so the prep reads as two equal
 * halves of one task. On mobile the poster leads full-width and everything
 * stacks. Color and type come entirely from the Amber theme tokens.
 */

const visibilityMeta: Record<
  VariantRecipe["visibility"],
  { icon: typeof Lock; label: string }
> = {
  PUBLIC: { icon: Globe, label: "Public" },
  FAMILY: { icon: Home, label: "Family" },
  PRIVATE: { icon: Lock, label: "Private" },
  UNLISTED: { icon: Lock, label: "Unlisted" },
};

export default function SplitPortrait({
  recipe,
  role,
}: {
  recipe: VariantRecipe;
  role: ViewerRole;
}) {
  const vis = visibilityMeta[recipe.visibility];
  const VisIcon = vis.icon;

  return (
    <article className="flex flex-col gap-10">
      <button
        type="button"
        className="inline-flex w-fit items-center gap-1.5 rounded-full text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to discover
      </button>

      {/* Two-column split: tall portrait poster | all the above-the-fold context. */}
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
        {/* LEFT — portrait poster. */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border shadow-md">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 36rem"
            className="object-cover"
          />
          {/* Soft floor so the glassy pills stay legible over any photo. */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />

          {/* Cuisine flag, top-left. */}
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/85 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-stone-900 backdrop-blur-md dark:bg-black/45 dark:text-white">
            {recipe.cuisine}
          </span>

          {/* Social proof, bottom edge of the poster. */}
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-xs font-bold text-stone-900 backdrop-blur-md dark:bg-black/45 dark:text-white">
              <Heart className="h-3.5 w-3.5 fill-current" /> {recipe.favoriteCount}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-xs font-bold text-stone-900 backdrop-blur-md dark:bg-black/45 dark:text-white">
              <Star className="h-3.5 w-3.5 fill-current" /> {recipe.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* RIGHT — context column. */}
        <div className="flex flex-col gap-5">
          {/* Visibility + family badge. */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
              <VisIcon className="h-3.5 w-3.5" />
              {vis.label}
            </span>
            {recipe.familyName ? (
              <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
                {recipe.familyName}
              </span>
            ) : null}
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
            {recipe.title}
          </h1>

          {/* Author chip. */}
          <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-border bg-card py-1.5 pl-1.5 pr-4 shadow-sm">
            <Image
              src={recipe.authorAvatarUrl}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-sm font-semibold text-foreground">
              {recipe.authorName}
            </span>
            {recipe.sourceName ? (
              <span className="text-sm text-muted-foreground">
                · from {recipe.sourceName}
              </span>
            ) : null}
          </div>

          <p className="text-base leading-relaxed text-muted-foreground">
            {recipe.description}
          </p>

          {/* Compact stat grid — small tiles, symmetric. */}
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatTile
              icon={<Timer className="h-4 w-4" />}
              label="Prep"
              value={`${recipe.prepMinutes} min`}
            />
            <StatTile
              icon={<Flame className="h-4 w-4" />}
              label="Cook"
              value={`${recipe.cookMinutes} min`}
            />
            <StatTile
              icon={<Clock className="h-4 w-4" />}
              label="Total"
              value={`${recipe.totalMinutes} min`}
            />
            <StatTile
              icon={<Users className="h-4 w-4" />}
              label="Serves"
              value={`${recipe.servings}`}
            />
            <StatTile
              icon={<Gauge className="h-4 w-4" />}
              label="Difficulty"
              value={recipe.difficulty}
            />
            <StatTile
              icon={<Star className="h-4 w-4 fill-primary text-primary" />}
              label={`${recipe.ratingCount} ratings`}
              value={recipe.rating.toFixed(1)}
            />
          </dl>

          {/* Actions inline, right where the decision gets made. */}
          <div className="mt-1">
            <RecipeActionBar recipe={recipe} role={role} layout="row" />
          </div>
        </div>
      </div>

      {/* Balanced two-column prep: ingredients | steps. */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Ingredients — bordered card, amounts aligned. */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-7">
          <div className="mb-5 flex items-baseline justify-between gap-3">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Ingredients
            </h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Serves {recipe.servings}
            </span>
          </div>
          <ul className="flex flex-col">
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex items-baseline justify-between gap-4 border-b border-border/60 py-2.5 text-sm last:border-0"
              >
                <span className="text-foreground">{ing.item}</span>
                {ing.amount ? (
                  <span className="shrink-0 font-bold tabular-nums text-primary">
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

          {recipe.story ? (
            <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-4">
              <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                The story
              </h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                {recipe.story}
              </p>
            </div>
          ) : null}
        </section>

        {/* Steps — numbered, generously set. */}
        <section className="flex flex-col gap-5">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Method
          </h2>
          <ol className="flex flex-col gap-4">
            {recipe.steps.map((step, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="pt-0.5 text-sm leading-relaxed text-foreground">
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

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card px-3.5 py-3 shadow-sm">
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[0.7rem] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </span>
      <span className="text-lg font-bold leading-none tracking-tight text-foreground">
        {value}
      </span>
    </div>
  );
}
