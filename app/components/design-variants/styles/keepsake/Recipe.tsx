import Image from "next/image";
import {
  ArrowLeft,
  Clock,
  Flame,
  Users,
  Heart,
  Star,
  Check,
} from "lucide-react";
import { RecipeActionBar } from "../../actions";
import { mockRecipe } from "../../mock-data";
import { Frame, Eyebrow, SectionHeading, Fold } from "./_kit";

/**
 * Keepsake · Recipe — a treasured recipe card, kept in the family album.
 *
 * Centered and framed: a mounted photo (paper border), a centered title under a
 * small eyebrow, a warm byline, and the STORY featured like a handwritten note
 * slipped behind the card. Ingredients are a two-up checklist on a card surface;
 * the method reads as numbered notes. Every section is parted by the shared
 * "fold" divider (a hairline broken by a ✦), the device that ties all five
 * Keepsake pages into one system.
 */
export default function KeepsakeRecipe() {
  const recipe = mockRecipe;
  const firstName = (recipe.sourceName ?? recipe.authorName).split(" ")[0];

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col items-center gap-10 pb-8">
      <BackLink />

      {/* Title block — centered, intimate. */}
      <header className="flex flex-col items-center gap-3 text-center">
        <Eyebrow>
          {recipe.cuisine} · {recipe.difficulty}
        </Eyebrow>
        <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
          {recipe.title}
        </h1>
        <Byline
          name={recipe.authorName}
          avatar={recipe.authorAvatarUrl}
          source={recipe.sourceName}
        />
      </header>

      {/* The mounted photo — the signature frame. */}
      <Frame className="w-full">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.25rem] bg-muted">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 48rem"
            className="object-cover"
          />
        </div>
        {/* Stat chips read like a caption pencilled under the print. */}
        <div className="flex flex-wrap items-center justify-center gap-2 px-1 pb-1 pt-3">
          <CaptionStat icon={<Clock className="h-3.5 w-3.5" />} value={`${recipe.prepMinutes}m`} label="prep" />
          <CaptionStat icon={<Flame className="h-3.5 w-3.5" />} value={`${recipe.cookMinutes}m`} label="cook" />
          <CaptionStat icon={<Users className="h-3.5 w-3.5" />} value={recipe.servings} label="serves" />
          <CaptionStat icon={<Star className="h-3.5 w-3.5 fill-current" />} value={recipe.rating} label={`(${recipe.ratingCount})`} />
          <CaptionStat icon={<Heart className="h-3.5 w-3.5 fill-current" />} value={recipe.favoriteCount} label="loved" />
        </div>
      </Frame>

      {/* Actions — owner set, centered under the photo. */}
      <RecipeActionBar recipe={recipe} role="owner" layout="row" className="justify-center" />

      <p className="max-w-xl text-center text-base leading-relaxed text-muted-foreground">
        {recipe.description}
      </p>

      {/* The story — the soul. A handwritten note tucked into the album. */}
      {recipe.story ? (
        <>
          <Fold />
          <section className="relative w-full max-w-2xl">
            <div className="relative rounded-[1.75rem] border border-primary/30 bg-primary/[0.06] px-7 py-8 shadow-sm sm:px-10 sm:py-10">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-primary/30 bg-card px-3 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-primary">
                In their words
              </span>
              <p
                className="whitespace-pre-line text-center text-xl italic leading-[1.7] text-foreground sm:text-2xl"
                style={{ textWrap: "balance" } as React.CSSProperties}
              >
                &ldquo;{recipe.story}&rdquo;
              </p>
              <div className="mt-6 flex items-center justify-center gap-2.5">
                <Image
                  src={recipe.authorAvatarUrl}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-background"
                />
                <span className="text-sm text-muted-foreground">
                  — {firstName}, kept by{" "}
                  <span className="font-semibold text-foreground">
                    {recipe.authorName}
                  </span>
                </span>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {/* Ingredients — a two-up checklist on a card. */}
      <Fold />
      <section className="flex w-full flex-col items-center gap-5">
        <SectionHeading kicker="Gather">Ingredients</SectionHeading>
        <Frame className="w-full" padding="p-6 sm:p-8">
          <ul className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex items-baseline gap-3 border-b border-border/60 py-2.5 text-sm last:border-0 sm:[&:nth-last-child(2)]:border-0"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" aria-hidden />
                <span className="flex-1 text-foreground">{ing.item}</span>
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
        </Frame>
      </section>

      {/* Method — numbered notes. */}
      <Fold />
      <section className="flex w-full flex-col items-center gap-5">
        <SectionHeading kicker="Make it">Method</SectionHeading>
        <ol className="flex w-full flex-col gap-4">
          {recipe.steps.map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-4 rounded-[1.5rem] border border-border bg-card p-5 shadow-sm sm:p-6"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm">
                {i + 1}
              </span>
              <p className="pt-1 text-[0.95rem] leading-relaxed text-foreground">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <Fold ornamentOnly />
    </article>
  );
}

/* Recipe-specific helpers. The shared primitives (Frame, Eyebrow,
 * SectionHeading, Fold, …) live in ./_kit and are reused on every page. */

function Byline({
  name,
  avatar,
  source,
}: {
  name: string;
  avatar: string;
  source: string | null;
}) {
  return (
    <div className="mt-1 flex items-center gap-2.5">
      <Image
        src={avatar}
        alt={name}
        width={36}
        height={36}
        className="h-9 w-9 rounded-full object-cover ring-2 ring-border"
      />
      <span className="text-sm text-muted-foreground">
        by <span className="font-semibold text-foreground">{name}</span>
        {source ? (
          <>
            {" · from "}
            <span className="font-semibold text-foreground">{source}</span>
          </>
        ) : null}
      </span>
    </div>
  );
}

function CaptionStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
      <span className="text-primary">{icon}</span>
      <span className="font-bold">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}

function BackLink() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 self-start rounded-full text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to the album
    </button>
  );
}
