import Image from "next/image";
import {
  MapPin,
  CalendarDays,
  Share2,
  BookOpen,
  Users,
  Heart,
  Clock,
} from "lucide-react";
import { mockProfile, joinedLabel, type VariantRecipe } from "../../mock-data";
import {
  Frame,
  Eyebrow,
  SectionHeading,
  Fold,
  Stamp,
  Tag,
  FramedAvatar,
} from "./_kit";

/**
 * Keepsake · Profile — a cook's page in the family album.
 *
 * The same centered, framed language as the recipe card: a framed avatar anchors
 * the top, the name sits under a small eyebrow, stats are pressed as little
 * "stamps", and their recipes follow in framed tiles. Symmetric and intimate —
 * a person, not a dashboard.
 */
export default function KeepsakeProfile() {
  const profile = mockProfile;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-10 pb-8">
      {/* Identity card. */}
      <section className="flex w-full flex-col items-center gap-4 text-center">
        <FramedAvatar src={profile.avatarUrl} alt={profile.name} size={120} priority />
        <Eyebrow>Home cook</Eyebrow>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          {profile.name}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary" /> {profile.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-primary" /> Joined{" "}
            {joinedLabel(profile.joinedAt)}
          </span>
        </div>
        <p className="max-w-xl text-base leading-relaxed text-foreground">
          {profile.bio}
        </p>
        <button
          type="button"
          className="mt-1 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Share2 className="h-4 w-4" />
          Share profile
        </button>
      </section>

      {/* Stats as stamps. */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Stamp icon={<BookOpen className="h-4 w-4" />} value={profile.recipeCount} label="Recipes" />
        <Stamp icon={<Users className="h-4 w-4" />} value={profile.familyCount} label="Families" />
        <Stamp icon={<Heart className="h-4 w-4" />} value={profile.favoritesReceived.toLocaleString()} label="Favorites" />
      </div>

      {/* Specialties. */}
      <Fold />
      <section className="flex w-full flex-col items-center gap-4">
        <SectionHeading kicker="Known for">Specialties</SectionHeading>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {profile.specialties.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
      </section>

      {/* Their recipes. */}
      <Fold />
      <section className="flex w-full flex-col items-center gap-6">
        <SectionHeading kicker={`${profile.recipeCount} in the book`}>
          From {profile.name.split(" ")[0]}&apos;s kitchen
        </SectionHeading>
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
          {profile.recipes.map((r) => (
            <KeepsakeRecipeTile key={r.id} recipe={r} />
          ))}
        </div>
      </section>

      <Fold ornamentOnly />
    </div>
  );
}

/**
 * The shared recipe tile used in every Keepsake grid (Profile + Family): the
 * same paper-bordered Frame as the page, a mounted photo, and a pencilled
 * title + cuisine caption. Keeps grids unmistakably part of the album.
 */
export function KeepsakeRecipeTile({ recipe }: { recipe: VariantRecipe }) {
  return (
    <Frame className="group transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.25rem] bg-muted">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          sizes="(max-width: 640px) 100vw, 22rem"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex items-end justify-between gap-3 px-1 pb-1 pt-3">
        <div className="flex flex-col leading-tight">
          <h3 className="text-base font-bold tracking-tight text-foreground">
            {recipe.title}
          </h3>
          <span className="text-[0.7rem] font-bold uppercase tracking-wider text-primary">
            {recipe.cuisine}
          </span>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {recipe.totalMinutes}m
        </span>
      </div>
    </Frame>
  );
}
