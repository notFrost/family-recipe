import Image from "next/image";
import { MapPin, CalendarDays, Share2, BookOpen, Users, Heart } from "lucide-react";
import { PreviewRecipeCard } from "../PreviewRecipeCard";
import { joinedLabel, type VariantProfile } from "../mock-data";

/**
 * Centered Hero — a quiet, symmetric masthead with NO cover photo.
 *
 * The deliberate opposite of Cover Banner: instead of a wide photo and an
 * off-center overlapping avatar, everything stacks down a single centered
 * column — avatar, name, the location/joined line, bio, stat pills, specialty
 * tags, the Share button. The header introduces the cook and then steps back;
 * a labelled hairline divider hands off to the recipe grid, which is the real
 * hero of the page. Calm, content-first, nothing competing for attention.
 */
export default function CenteredHero({ profile }: { profile: VariantProfile }) {
  return (
    <div className="flex flex-col gap-12">
      {/* Centered masthead — single column, no cover image. */}
      <header className="flex flex-col items-center text-center">
        {/* Avatar: the only image in the header, so it carries identity alone. */}
        <div className="relative">
          <span
            aria-hidden
            className="absolute -inset-2 rounded-full bg-primary/10 blur-md"
          />
          <Image
            src={profile.avatarUrl}
            alt={profile.name}
            width={160}
            height={160}
            priority
            className="relative h-28 w-28 rounded-full object-cover shadow-md ring-4 ring-card sm:h-32 sm:w-32"
          />
        </div>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {profile.name}
        </h1>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> {profile.location}
          </span>
          <span aria-hidden className="text-border">·</span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" /> Joined {joinedLabel(profile.joinedAt)}
          </span>
        </div>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-foreground">
          {profile.bio}
        </p>

        {/* Stat pills — one centered row, dot-separated chips. */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          <StatPill icon={<BookOpen className="h-4 w-4" />} value={profile.recipeCount} label="recipes" />
          <StatPill icon={<Users className="h-4 w-4" />} value={profile.familyCount} label="families" />
          <StatPill
            icon={<Heart className="h-4 w-4" />}
            value={profile.favoritesReceived.toLocaleString()}
            label="favorites"
          />
        </div>

        {/* Specialty tags. */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {profile.specialties.map((s) => (
            <span
              key={s}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Single, centered primary action. */}
        <button
          type="button"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Share2 className="h-4 w-4" />
          Share profile
        </button>
      </header>

      {/* Labelled divider — encodes the handoff from the cook to her recipes. */}
      <div className="flex items-center gap-4" aria-hidden>
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Public recipes
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* Recipes — the real hero of the page. */}
      <section className="flex flex-col gap-6">
        <h2 className="sr-only">Public recipes</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profile.recipes.map((r) => (
            <PreviewRecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      </section>
    </div>
  );
}

function StatPill({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-sm font-extrabold tracking-tight text-foreground">{value}</span>
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
    </span>
  );
}
