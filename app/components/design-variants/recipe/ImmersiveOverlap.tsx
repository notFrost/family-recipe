import Image from "next/image";
import {
  ArrowLeft,
  Clock,
  Flame,
  Timer,
  Users,
  Gauge,
  Star,
  Lock,
  Globe,
  Home,
  EyeOff,
} from "lucide-react";
import { RecipeActionBar } from "../actions";
import type { VariantRecipe, ViewerRole } from "../mock-data";

/**
 * Immersive Overlap — an app, not an article.
 *
 * Where the Editorial Spread treats the photo as a masthead and burns the title
 * into it, this direction keeps the hero clean and cinematic (a wide 16:9 plate
 * under a soft bottom scrim) and lifts a content CARD up over its lower edge, so
 * the title, author, and classification read as a floating "sheet" the way a
 * mobile detail screen pulls content over a header image. The meta becomes a
 * horizontally-scrollable strip of stat chips you can flick through, ingredients
 * and steps sit in two even columns, and the Actions live in a floating dock that
 * stays pinned to the bottom of the viewport — always one tap away, like a phone's
 * action bar, but centered and contained so it reads as deliberate on desktop too.
 */
export default function ImmersiveOverlap({
  recipe,
  role,
}: {
  recipe: VariantRecipe;
  role: ViewerRole;
}) {
  return (
    // Bottom padding clears the floating dock so the last step is never hidden.
    <article className="flex flex-col pb-28 sm:pb-32">
      <button
        type="button"
        className="mb-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to discover
      </button>

      {/* Cinematic, uncluttered hero — the photo is the moment, nothing on it but a scrim. */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border shadow-md">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 72rem"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
      </div>

      {/* The content sheet, pulled up over the hero's lower edge. */}
      <div className="relative z-10 -mt-16 mx-3 rounded-3xl border border-border bg-card p-6 shadow-md sm:-mt-24 sm:mx-8 sm:p-9">
        <div className="flex flex-wrap items-center gap-2">
          <VisibilityBadge
            visibility={recipe.visibility}
            familyName={recipe.familyName}
          />
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
            {recipe.cuisine}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          {recipe.title}
        </h1>

        <div className="mt-4 flex items-center gap-3">
          <Image
            src={recipe.authorAvatarUrl}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/30"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-foreground">
              {recipe.authorName}
            </span>
            <span className="text-xs text-muted-foreground">
              {recipe.familyName ?? "Independent kitchen"}
            </span>
          </div>
        </div>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {recipe.description}
        </p>
      </div>

      {/* App-like, flick-through stat strip. */}
      <div className="mt-6 -mx-1 flex gap-3 overflow-x-auto px-1 pb-1 sm:mx-7 sm:px-0 [scrollbar-width:thin]">
        <StatChip
          icon={<Timer className="h-4 w-4" />}
          label="Prep"
          value={`${recipe.prepMinutes} min`}
        />
        <StatChip
          icon={<Flame className="h-4 w-4" />}
          label="Cook"
          value={`${recipe.cookMinutes} min`}
        />
        <StatChip
          icon={<Clock className="h-4 w-4" />}
          label="Total"
          value={`${recipe.totalMinutes} min`}
          highlight
        />
        <StatChip
          icon={<Users className="h-4 w-4" />}
          label="Serves"
          value={`${recipe.servings}`}
        />
        <StatChip
          icon={<Gauge className="h-4 w-4" />}
          label="Difficulty"
          value={recipe.difficulty}
        />
        <StatChip
          icon={<Star className="h-4 w-4 fill-primary text-primary" />}
          label={`${recipe.ratingCount} ratings`}
          value={recipe.rating.toFixed(1)}
        />
      </div>

      {/* Two even columns — a balanced layout distinct from the anchor's narrow/wide spread. */}
      <div className="mt-8 grid grid-cols-1 gap-8 sm:mx-7 lg:grid-cols-2 lg:gap-10">
        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Ingredients
            </h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {recipe.ingredients.length} items
            </span>
          </div>
          <ul className="rounded-2xl border border-border bg-card p-2 shadow-sm">
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex items-baseline justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-accent"
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

          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
            <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              Cook&apos;s note
            </h3>
            <p className="text-sm leading-relaxed text-foreground">
              {recipe.cooksNote}
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Method
          </h2>
          {/* Connected numbered sequence — order is real information here. */}
          <ol className="relative flex flex-col gap-3 before:absolute before:left-[1.125rem] before:top-3 before:bottom-3 before:w-px before:bg-border">
            {recipe.steps.map((step, i) => (
              <li
                key={i}
                className="relative flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <span className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground shadow-sm">
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

      {/* Floating action dock — pinned to the bottom of the viewport, centered and contained. */}
      <div className="pointer-events-none sticky bottom-4 z-40 mt-10 flex justify-center">
        <div className="pointer-events-auto w-fit max-w-[calc(100%-1rem)]">
          <RecipeActionBar recipe={recipe} role={role} layout="dock" />
        </div>
      </div>
    </article>
  );
}

function StatChip({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm ${
        highlight
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-card"
      }`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full ${
          highlight ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </span>
      <div className="flex flex-col leading-tight">
        <span className="whitespace-nowrap text-sm font-bold text-foreground">
          {value}
        </span>
        <span className="whitespace-nowrap text-xs text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}

function VisibilityBadge({
  visibility,
  familyName,
}: {
  visibility: VariantRecipe["visibility"];
  familyName: string | null;
}) {
  const map = {
    PUBLIC: { icon: <Globe className="h-3.5 w-3.5" />, label: "Public" },
    FAMILY: {
      icon: <Home className="h-3.5 w-3.5" />,
      label: familyName ?? "Family",
    },
    PRIVATE: { icon: <Lock className="h-3.5 w-3.5" />, label: "Private" },
    UNLISTED: { icon: <EyeOff className="h-3.5 w-3.5" />, label: "Unlisted" },
  } as const;
  const { icon, label } = map[visibility];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
      {icon}
      {label}
    </span>
  );
}
