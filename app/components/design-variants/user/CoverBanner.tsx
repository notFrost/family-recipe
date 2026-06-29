import Image from "next/image";
import { MapPin, CalendarDays, Share2, BookOpen, Users, Heart } from "lucide-react";
import { PreviewRecipeCard } from "../PreviewRecipeCard";
import { joinedLabel, type VariantProfile } from "../mock-data";

/**
 * Cover Banner — the familiar social-profile masthead, done in the warm system.
 *
 * A wide cover photo sets the mood, the circular avatar overlaps its lower edge
 * to anchor identity, and the name/bio/stats sit on the page surface below. It's
 * the most recognizable profile shape, so it asks nothing of the visitor before
 * showing them the cook and their recipes.
 */
export default function CoverBanner({ profile }: { profile: VariantProfile }) {
  return (
    <div className="flex flex-col gap-8">
      {/* Cover + overlapping avatar. */}
      <div className="relative">
        <div className="relative aspect-[5/2] w-full overflow-hidden rounded-3xl border border-border bg-muted shadow-md sm:aspect-[4/1]">
          <Image
            src={profile.coverImageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="absolute -bottom-10 left-6 sm:left-8">
          <Image
            src={profile.avatarUrl}
            alt={profile.name}
            width={120}
            height={120}
            className="h-24 w-24 rounded-full object-cover ring-4 ring-background sm:h-28 sm:w-28"
          />
        </div>
      </div>

      {/* Identity + actions. */}
      <div className="flex flex-col gap-5 pt-8 sm:flex-row sm:items-end sm:justify-between sm:pt-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {profile.name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {profile.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> Joined {joinedLabel(profile.joinedAt)}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent"
        >
          <Share2 className="h-4 w-4" />
          Share profile
        </button>
      </div>

      <p className="max-w-2xl text-base leading-relaxed text-foreground">
        {profile.bio}
      </p>

      {/* Stats + specialties. */}
      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-8">
          <ProfileStat icon={<BookOpen className="h-4 w-4" />} value={profile.recipeCount} label="Recipes" />
          <ProfileStat icon={<Users className="h-4 w-4" />} value={profile.familyCount} label="Families" />
          <ProfileStat icon={<Heart className="h-4 w-4" />} value={profile.favoritesReceived.toLocaleString()} label="Favorites" />
        </div>
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

      {/* Recipes. */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Public recipes
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profile.recipes.map((r) => (
            <PreviewRecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ProfileStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="flex items-center gap-1.5 text-2xl font-extrabold tracking-tight text-foreground">
        {value}
      </span>
      <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        {icon} {label}
      </span>
    </div>
  );
}
