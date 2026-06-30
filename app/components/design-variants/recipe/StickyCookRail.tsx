import Image from "next/image";
import {
  ArrowLeft,
  Clock,
  Flame,
  Timer,
  Users,
  Star,
  Quote,
} from "lucide-react";
import { RecipeActionBar } from "../actions";
import type { VariantRecipe, ViewerRole } from "../mock-data";

/**
 * Sticky Cook-Rail — a layout built for actually cooking.
 *
 * Where EditorialSpread treats the page as a magazine opener, this one treats
 * it as a workstation. A narrow LEFT rail pins itself to the viewport
 * (`lg:sticky lg:top-24`) and holds everything you keep glancing back at while
 * you work: a thumbnail, the title, a tidy meta grid (prep / cook / total /
 * serves / difficulty / rating), the cook's note, and the FULL action set as a
 * vertical stack. The RIGHT column is the only thing that scrolls — description,
 * an ingredients *checklist*, then the method as numbered cards.
 *
 * The structure encodes the cooking workflow: reference stays put, method moves.
 * On mobile the rail simply stacks on top and the whole thing scrolls normally.
 */
export default function StickyCookRail({
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
        className="inline-flex w-fit items-center gap-1.5 rounded-full text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to discover
      </button>

      {/* Rail + scroll. The rail's width is fixed so the method column gets the
          room it needs for generously-set steps. */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-10">
        {/* ── LEFT: the sticky cook's rail ───────────────────────────── */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 shadow-md">
            {/* Compact thumbnail with a glassy classification chip. */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border">
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 360px"
                className="object-cover"
              />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-stone-900 backdrop-blur-md dark:bg-black/45 dark:text-white">
                {recipe.cuisine}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground">
                {recipe.title}
              </h1>
              <div className="flex items-center gap-2.5">
                <Image
                  src={recipe.authorAvatarUrl}
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-border"
                />
                <span className="text-sm font-semibold text-muted-foreground">
                  by{" "}
                  <span className="text-foreground">{recipe.authorName}</span>
                  {recipe.sourceName ? (
                    <span className="font-normal"> · from {recipe.sourceName}</span>
                  ) : null}
                </span>
              </div>
            </div>

            {/* Tidy meta grid — the at-a-glance numbers you check mid-cook. */}
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
              <Meta
                icon={<Timer className="h-4 w-4" />}
                label="Prep"
                value={`${recipe.prepMinutes} min`}
              />
              <Meta
                icon={<Flame className="h-4 w-4" />}
                label="Cook"
                value={`${recipe.cookMinutes} min`}
              />
              <Meta
                icon={<Clock className="h-4 w-4" />}
                label="Total"
                value={`${recipe.totalMinutes} min`}
              />
              <Meta
                icon={<Users className="h-4 w-4" />}
                label="Serves"
                value={`${recipe.servings}`}
              />
              <Meta
                icon={
                  <span className="grid h-4 w-4 place-items-center text-xs font-extrabold">
                    {recipe.difficulty[0]}
                  </span>
                }
                label="Level"
                value={recipe.difficulty}
              />
              <Meta
                icon={<Star className="h-4 w-4 fill-primary text-primary" />}
                label={`${recipe.ratingCount} ratings`}
                value={recipe.rating.toFixed(1)}
              />
            </dl>

            {/* Cook's note. */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <Quote className="h-3.5 w-3.5" />
                Cook&apos;s note
              </div>
              <p className="text-sm leading-relaxed text-foreground">
                {recipe.cooksNote}
              </p>
            </div>

            {/* The full action set, stacked vertically so every action stays in
                reach without leaving the rail. */}
            <RecipeActionBar recipe={recipe} role={role} layout="stack" />
          </div>
        </aside>

        {/* ── RIGHT: the scrolling method ────────────────────────────── */}
        <div className="flex min-w-0 flex-col gap-8">
          <p className="text-lg leading-relaxed text-muted-foreground">
            {recipe.description}
          </p>

          {/* Ingredients as a checklist. The checkbox squares are purely
              visual (no interactivity needed) — they signal "tick as you go". */}
          <section className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                Ingredients
              </h2>
              <span className="text-sm font-semibold text-muted-foreground">
                {recipe.ingredients.length} items
              </span>
            </div>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {recipe.ingredients.map((ing, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-sm"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-2 border-input bg-background"
                  />
                  <span className="flex flex-col gap-0.5 text-sm leading-snug">
                    {ing.amount ? (
                      <span className="font-bold text-primary">
                        {ing.amount}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold italic text-muted-foreground">
                        to taste
                      </span>
                    )}
                    <span className="text-foreground">{ing.item}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Method as numbered cards. */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-extrabold tracking-tight text-foreground">
              Method
            </h2>
            <ol className="flex flex-col gap-3">
              {recipe.steps.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground shadow-sm">
                    {i + 1}
                  </span>
                  <p className="self-center text-base leading-relaxed text-foreground">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </article>
  );
}

/** One cell of the rail's meta grid — icon, value, and a small label. */
function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-card p-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
        {icon}
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-extrabold leading-tight text-foreground">
          {value}
        </span>
        <span className="truncate text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
