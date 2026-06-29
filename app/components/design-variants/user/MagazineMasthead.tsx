import Image from "next/image";
import {
  MapPin,
  CalendarDays,
  Share2,
  BookOpen,
  Users,
  Heart,
  ChefHat,
  Clock,
  ArrowRight,
} from "lucide-react";
import { PreviewRecipeCard } from "../PreviewRecipeCard";
import { joinedLabel, type VariantProfile } from "../mock-data";

/**
 * Magazine Masthead — an editorial profile that leads with the cook's best dish.
 *
 * The page reads like a food magazine's contributor spread. A horizontal
 * masthead band (square portrait left, byline + inline stats + specialties +
 * share right) introduces the cook the way a magazine credits a writer. Then,
 * instead of a flat grid, it runs ONE recipe as the lead story — a large,
 * two-column feature with an eyebrow, oversized title, and standfirst — before
 * the rest fall in as a "More from {first name}" gallery below. Layout-only
 * differentiation: identity sits in a band, the hero is a horizontal feature,
 * and structure (eyebrow → headline → standfirst) carries the editorial voice.
 */
export default function MagazineMasthead({ profile }: { profile: VariantProfile }) {
  const firstName = profile.name.split(" ")[0];
  const [featured, ...rest] = profile.recipes;

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      {/* Masthead band: portrait left, byline + stats right. */}
      <header className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-md sm:flex-row sm:items-stretch sm:gap-8 sm:p-8">
        <Image
          src={profile.avatarUrl}
          alt={profile.name}
          width={320}
          height={320}
          priority
          className="h-32 w-32 shrink-0 rounded-2xl object-cover shadow-sm ring-1 ring-border sm:h-40 sm:w-40"
        />

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Contributing cook
            </p>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
              {profile.name}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-foreground">
              {profile.bio}
            </p>
          </div>

          {/* Byline-style inline stats with center-dot separators. */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
            <Stat icon={<BookOpen className="h-4 w-4" />} value={profile.recipeCount} label="recipes" />
            <Dot />
            <Stat icon={<Users className="h-4 w-4" />} value={profile.familyCount} label="families" />
            <Dot />
            <Stat icon={<Heart className="h-4 w-4" />} value={profile.favoritesReceived.toLocaleString()} label="favorites" />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {profile.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> Joined {joinedLabel(profile.joinedAt)}
            </span>
          </div>

          {/* Specialties + share, sharing the same baseline row on desktop. */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {profile.specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
            <button
              type="button"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Share2 className="h-4 w-4" />
              Share profile
            </button>
          </div>
        </div>
      </header>

      {/* Lead story — the cook's best dish, run large and horizontal. */}
      {featured && (
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
              The lead story
            </h2>
            <span className="h-px flex-1 bg-border" />
          </div>

          <article className="grid items-stretch gap-6 overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-md sm:p-6 lg:grid-cols-2 lg:gap-8 lg:p-8">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted lg:aspect-auto lg:min-h-[22rem]">
              <Image
                src={featured.imageUrl}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-center gap-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Featured recipe
              </p>
              <h3 className="text-3xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-4xl">
                {featured.title}
              </h3>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <ChefHat className="h-4 w-4" /> {featured.cuisine}
                </span>
                <Dot />
                <span>{featured.difficulty}</span>
                <Dot />
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {featured.totalMinutes} min
                </span>
              </div>

              <p className="max-w-prose text-base leading-relaxed text-foreground">
                {featured.description}
              </p>

              <button
                type="button"
                className="group mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                View recipe
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </article>
        </section>
      )}

      {/* The rest of the cook's recipes, as a gallery. */}
      {rest.length > 0 && (
        <section className="flex flex-col gap-5">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            More from {firstName}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((r) => (
              <PreviewRecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="inline-flex items-center gap-1.5 text-base font-extrabold tracking-tight text-foreground">
        {icon}
        {value}
      </span>
      <span className="font-medium">{label}</span>
    </span>
  );
}

function Dot() {
  return <span aria-hidden className="text-muted-foreground/60">·</span>;
}
