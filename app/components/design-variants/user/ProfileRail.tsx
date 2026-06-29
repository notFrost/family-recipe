import Image from "next/image";
import { MapPin, CalendarDays, Share2, BookOpen, Users, Heart } from "lucide-react";
import { PreviewRecipeCard } from "../PreviewRecipeCard";
import { joinedLabel, type VariantProfile } from "../mock-data";

/**
 * Profile Rail — the cook's identity persists beside their work as you scroll.
 *
 * A two-column split: a bordered identity card pins to the left as a sticky rail
 * (lg:sticky), while the recipe grid scrolls past on the right. The stats read as
 * a vertical ledger — labelled rows separated by hairline rules — so the eye scans
 * the rail top-to-bottom the same way it scans the recipe column beside it, making
 * the pairing of "who" and "what they cook" feel deliberate rather than stacked.
 * On mobile the rail collapses to a full-width header above the recipes.
 */
export default function ProfileRail({ profile }: { profile: VariantProfile }) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-10">
      {/* Identity rail — pinned beside the recipes on large screens. */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-md sm:p-7">
          {/* Avatar + name. */}
          <div className="flex flex-col items-center text-center">
            <Image
              src={profile.avatarUrl}
              alt={profile.name}
              width={120}
              height={120}
              priority
              className="h-24 w-24 rounded-full object-cover ring-4 ring-background sm:h-28 sm:w-28"
            />
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground">
              {profile.name}
            </h1>
            <div className="mt-2 flex flex-col items-center gap-1.5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {profile.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" /> Joined {joinedLabel(profile.joinedAt)}
              </span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-foreground">{profile.bio}</p>

          {/* Vertical stat ledger — rows the eye scans top-to-bottom. */}
          <div className="flex flex-col rounded-2xl border border-border bg-background">
            <StatRow
              icon={<BookOpen className="h-4 w-4" />}
              label="Recipes"
              value={profile.recipeCount}
            />
            <StatRow
              icon={<Users className="h-4 w-4" />}
              label="Families"
              value={profile.familyCount}
            />
            <StatRow
              icon={<Heart className="h-4 w-4" />}
              label="Favorites"
              value={profile.favoritesReceived.toLocaleString()}
              last
            />
          </div>

          {/* Specialties. */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Specialties
            </span>
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
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            <Share2 className="h-4 w-4" />
            Share profile
          </button>
        </div>
      </aside>

      {/* Recipes — the wide column that scrolls past the pinned rail. */}
      <section className="flex flex-col gap-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Public recipes
          </h2>
          <span className="text-sm font-semibold text-muted-foreground">
            {profile.recipes.length} shown
          </span>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {profile.recipes.map((r) => (
            <PreviewRecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      </section>
    </div>
  );
}

function StatRow({
  icon,
  label,
  value,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 ${
        last ? "" : "border-b border-border"
      }`}
    >
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        {icon} {label}
      </span>
      <span className="text-lg font-extrabold tracking-tight text-foreground">
        {value}
      </span>
    </div>
  );
}
