import Image from "next/image";
import {
  Clock,
  Flame,
  Hourglass,
  Users,
  Star,
  Heart,
  Bookmark,
  Check,
} from "lucide-react";
import { RecipeActionBar } from "../actions";
import type { VariantRecipe, ViewerRole } from "../mock-data";

/**
 * Hearth Card — a treasured physical recipe card, cozy and centered.
 *
 * Where EditorialSpread is a wide, asymmetric magazine spread, this is its
 * opposite: a narrow, symmetric single column (max-w-2xl, mx-auto) that reads
 * like a beloved index card kept in a recipe tin. A polaroid-style framed photo
 * leads, then a centered eyebrow, centered title, a centered icon action row,
 * an author chip, and a row of small meta pills. Ingredients live inside one
 * warm bordered card as a two-column checklist; the method is a left-aligned
 * sequence with circular numbered badges. Everything is contained and intimate,
 * with generous vertical rhythm — the feel of a keepsake, not a broadsheet.
 */
export default function HearthCard({
  recipe,
  role,
}: {
  recipe: VariantRecipe;
  role: ViewerRole;
}) {
  return (
    <article className="mx-auto flex max-w-2xl flex-col items-center gap-8">
      {/* Polaroid-style framed photo. */}
      <figure className="w-full">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-card p-2.5 shadow-md ring-1 ring-border sm:p-3">
          <div className="relative h-full w-full overflow-hidden rounded-2xl">
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              priority
              sizes="(max-width: 672px) 100vw, 42rem"
              className="object-cover"
            />
            {/* Glassy social counts, tucked in the corner like a sticker. */}
            <div className="absolute right-3 top-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-xs font-bold text-stone-900 backdrop-blur-md dark:bg-black/45 dark:text-white">
                <Heart className="h-3.5 w-3.5" /> {recipe.favoriteCount}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-xs font-bold text-stone-900 backdrop-blur-md dark:bg-black/45 dark:text-white">
                <Bookmark className="h-3.5 w-3.5" /> {recipe.savedCount}
              </span>
            </div>
          </div>
        </div>
      </figure>

      {/* Centered masthead. */}
      <header className="flex w-full flex-col items-center gap-4 text-center">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          <span>{recipe.cuisine}</span>
          <span aria-hidden className="text-primary/50">
            ·
          </span>
          <span>{recipe.difficulty}</span>
        </p>

        <h1 className="text-balance text-3xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-4xl">
          {recipe.title}
        </h1>

        {/* Actions: centered icon row, directly under the title. */}
        <RecipeActionBar
          recipe={recipe}
          role={role}
          layout="icons"
          className="justify-center"
        />

        {/* Author chip. */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card py-1.5 pl-1.5 pr-4 shadow-sm">
          <Image
            src={recipe.authorAvatarUrl}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover"
          />
          <span className="text-sm font-semibold text-foreground">
            {recipe.authorName}
          </span>
          {recipe.sourceName ? (
            <span className="text-sm text-muted-foreground">
              · from {recipe.sourceName}
            </span>
          ) : null}
          {recipe.familyName ? (
            <>
              <span aria-hidden className="text-border">
                |
              </span>
              <span className="text-sm text-muted-foreground">
                {recipe.familyName}
              </span>
            </>
          ) : null}
        </div>

        <p className="max-w-prose text-pretty text-base leading-relaxed text-muted-foreground">
          {recipe.description}
        </p>

        {/* Meta pills. */}
        <dl className="flex flex-wrap items-center justify-center gap-2">
          <MetaPill icon={<Clock className="h-3.5 w-3.5" />} label="Prep" value={`${recipe.prepMinutes}m`} />
          <MetaPill icon={<Flame className="h-3.5 w-3.5" />} label="Cook" value={`${recipe.cookMinutes}m`} />
          <MetaPill icon={<Hourglass className="h-3.5 w-3.5" />} label="Total" value={`${recipe.totalMinutes}m`} />
          <MetaPill icon={<Users className="h-3.5 w-3.5" />} label="Serves" value={`${recipe.servings}`} />
          <MetaPill
            icon={<Star className="h-3.5 w-3.5 fill-primary text-primary" />}
            label={`(${recipe.ratingCount})`}
            value={recipe.rating.toFixed(1)}
          />
        </dl>
      </header>

      {/* Hairline divider, like a fold in the card. */}
      <div
        aria-hidden
        className="flex w-full items-center gap-3 text-primary/40"
      >
        <span className="h-px flex-1 bg-border" />
        <span className="text-base">✦</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* The story — the heirloom memory, front and center in the keepsake. */}
      {recipe.story ? (
        <section className="w-full rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
            The story
          </h3>
          <p className="mx-auto max-w-prose text-pretty whitespace-pre-line text-sm leading-relaxed text-foreground">
            {recipe.story}
          </p>
        </section>
      ) : null}

      {/* Ingredients: one warm card, two-column checklist. */}
      <section className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
        <h2 className="mb-5 text-center text-lg font-bold tracking-tight text-foreground">
          Ingredients
        </h2>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
          {recipe.ingredients.map((ing, i) => (
            <li
              key={i}
              className="flex items-baseline gap-3 border-b border-border/50 py-2.5 text-sm last:border-0 sm:[&:nth-last-child(2)]:border-0"
            >
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              <span className="text-foreground">
                {ing.amount ? (
                  <span className="font-bold text-primary">{ing.amount} </span>
                ) : null}
                {ing.item}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Cook's note, framed like a margin scribble. */}
      <section className="w-full rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
          Cook&apos;s note
        </h3>
        <p className="mx-auto max-w-prose text-pretty text-sm leading-relaxed text-foreground">
          {recipe.cooksNote}
        </p>
      </section>

      {/* Method: centered heading, left-aligned numbered steps. */}
      <section className="w-full">
        <h2 className="mb-6 text-center text-lg font-bold tracking-tight text-foreground">
          Method
        </h2>
        <ol className="flex flex-col gap-5">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm">
                {i + 1}
              </span>
              <p className="pt-1 text-base leading-relaxed text-foreground">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Closing flourish — the bottom edge of the card. */}
      <div aria-hidden className="text-2xl text-primary/30">
        ✦
      </div>
    </article>
  );
}

function MetaPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-xs">
      <span className="text-muted-foreground">{icon}</span>
      <span className="font-bold text-foreground">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}
