import Image from "next/image";
import {
  ArrowLeft,
  Clock,
  Flame,
  Users,
  Heart,
  Quote,
} from "lucide-react";
import { RecipeActionBar } from "../actions";
import type { VariantRecipe, ViewerRole } from "../mock-data";

/**
 * Cook's Table — lead with the person, not the plate.
 *
 * Built from feedback that the cook's photo and name deserve more presence to
 * create familiarity and a personal bond. The page opens on a cook spotlight
 * (a large avatar + prominent name + lineage), and the recipe's story is given
 * its own featured "note from the cook" — the anecdote about where the dish
 * comes from, in their voice. The food follows the person.
 */
export default function CooksTable({
  recipe,
  role,
}: {
  recipe: VariantRecipe;
  role: ViewerRole;
}) {
  const firstName = recipe.authorName.split(" ")[0];

  return (
    <article className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <button
        type="button"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to discover
      </button>

      {/* Cook spotlight — the person is the hero. */}
      <header className="flex flex-col items-center gap-5 rounded-3xl border border-border bg-card p-6 text-center shadow-sm sm:flex-row sm:gap-6 sm:p-8 sm:text-left">
        <Image
          src={recipe.authorAvatarUrl}
          alt={recipe.authorName}
          width={112}
          height={112}
          className="h-24 w-24 shrink-0 rounded-full object-cover ring-4 ring-primary/20 sm:h-28 sm:w-28"
        />
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Shared by
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {recipe.authorName}
          </h2>
          <p className="text-sm text-muted-foreground">
            {recipe.familyName ? `in ${recipe.familyName}` : "Independent kitchen"}
            {recipe.sourceName ? (
              <>
                {" · "}
                a recipe from{" "}
                <span className="font-semibold text-foreground">
                  {recipe.sourceName}
                </span>
              </>
            ) : null}
          </p>
          <p className="mt-1 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-muted-foreground sm:justify-start">
            <Heart className="h-4 w-4 fill-primary text-primary" />
            Loved {recipe.favoriteCount} times
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
          {recipe.cuisine} · {recipe.difficulty}
        </span>
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          {recipe.title}
        </h1>
      </div>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border bg-muted shadow-md">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 56rem"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <RecipeActionBar recipe={recipe} role={role} layout="row" />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span className="font-bold text-foreground">{recipe.prepMinutes}m</span> prep
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Flame className="h-4 w-4" />
            <span className="font-bold text-foreground">{recipe.cookMinutes}m</span> cook
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span className="font-bold text-foreground">{recipe.servings}</span> serves
          </span>
        </div>
      </div>

      {/* The story — a featured note in the cook's voice. */}
      {recipe.story ? (
        <section className="relative rounded-3xl border border-primary/30 bg-primary/5 p-6 sm:p-8">
          <Quote
            className="absolute right-6 top-6 h-10 w-10 text-primary/15"
            aria-hidden
          />
          <div className="mb-4 flex items-center gap-3">
            <Image
              src={recipe.authorAvatarUrl}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-foreground">
                {firstName}&apos;s story
              </span>
              <span className="text-xs text-muted-foreground">
                why this recipe matters
              </span>
            </div>
          </div>
          <p className="max-w-2xl whitespace-pre-line text-lg italic leading-relaxed text-foreground">
            {recipe.story}
          </p>
        </section>
      ) : null}

      <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
        {recipe.description}
      </p>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Ingredients
          </h2>
          <ul className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 shadow-sm">
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex items-baseline justify-between gap-3 border-b border-border/50 py-2 text-sm last:border-0"
              >
                <span className="text-foreground">{ing.item}</span>
                {ing.amount ? (
                  <span className="shrink-0 font-bold text-primary">
                    {ing.amount}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Method
          </h2>
          <ol className="flex flex-col gap-4">
            {recipe.steps.map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="pt-1 text-sm leading-relaxed text-foreground">
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
