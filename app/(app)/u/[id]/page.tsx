import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, CalendarDays } from "lucide-react";
import { recipeRepository } from "@/app/lib/recipe-repository";
import { userRepository } from "@/app/lib/user-repository";
import Avatar from "@/app/components/Avatar";
import RecipeCard from "@/app/components/RecipeCard";
import ShareLinkButton from "@/app/components/ShareLinkButton";

/** "Joined June 2025" — from the User row's createdAt. */
function joinedLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

/**
 * Public profile in the Homestead language — "Cover Banner": a wide cover
 * sets the mood, the avatar overlaps its lower edge, identity and stats sit
 * on the page surface below, then the recipe grid. The cover is a warm token
 * gradient (no User.coverImageUrl in the schema — a parked field; bio/
 * location/specialties are parked with it).
 */
export default async function PublicProfilePage({
  params,
}: PageProps<"/u/[id]">) {
  const { id } = await params;
  const profile = await userRepository.getUserProfile(id);

  if (!profile) {
    notFound();
  }

  // Only PUBLIC recipes are shown — same rule the count in the repository uses.
  const recipes = await recipeRepository.getRecipesByAuthorPublic(id);
  const displayName = profile.name ?? "This cook";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <Link
        href="/discover"
        className="inline-flex w-fit items-center gap-1.5 rounded text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to discover
      </Link>

      {/* Cover + overlapping avatar. The cover is a warm gradient on tokens —
          it reads as the cook's "table runner" until cover photos exist. */}
      <div className="relative">
        <div className="relative aspect-[5/2] w-full overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/30 via-primary/10 to-secondary shadow-md sm:aspect-[4/1]" />
        <div className="absolute -bottom-10 left-6 sm:left-8">
          <Avatar
            name={profile.name}
            src={profile.image}
            size={120}
            className="h-24 w-24 text-3xl ring-4 ring-background sm:h-28 sm:w-28"
          />
        </div>
      </div>

      {/* Identity + actions. */}
      <div className="flex flex-col gap-5 pt-8 sm:flex-row sm:items-end sm:justify-between sm:pt-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {displayName}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> Joined{" "}
              {joinedLabel(profile.createdAt)}
            </span>
          </div>
        </div>
        <ShareLinkButton />
      </div>

      {/* Stats. */}
      <div className="flex items-center gap-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-0.5">
          <span className="text-2xl font-extrabold tracking-tight text-foreground">
            {profile.publicRecipeCount}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <BookOpen className="h-4 w-4" />{" "}
            {profile.publicRecipeCount === 1
              ? "Public recipe"
              : "Public recipes"}
          </span>
        </div>
      </div>

      {/* Recipes. */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Public recipes
        </h2>
        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-border bg-card py-20 text-center">
            <p className="text-lg font-bold text-foreground">
              No public recipes
            </p>
            <p className="text-sm text-muted-foreground">
              {displayName} hasn&apos;t shared any public recipes yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
