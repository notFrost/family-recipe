import Image from "next/image";
import { notFound } from "next/navigation";
import { Link2 } from "lucide-react";
import { shareRepository } from "@/app/lib/share-repository";
import { recipeRepository } from "@/app/lib/recipe-repository";
import { familyRepository } from "@/app/lib/family-repository";
import { favoriteRepository } from "@/app/lib/favorite-repository";
import { getSession } from "@/app/lib/auth";
import RecipePageActions from "@/app/components/RecipePageActions";

/**
 * Shared-link recipe view. A valid token grants read access regardless of the
 * recipe's visibility — this is the "friends" sharing circle. Logged-in viewers
 * can favorite it or save a copy to their own box.
 */
export default async function SharedRecipePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const link = await shareRepository.getByToken(token);
  if (!link) notFound();

  const recipe = await recipeRepository.getRecipeById(link.recipeId);
  if (!recipe) notFound();

  const session = await getSession();
  const viewerId = session?.user?.id;
  const isOwner = viewerId === recipe.authorId;
  const [isFavorited, viewerFamilies] = await Promise.all([
    viewerId ? favoriteRepository.isFavorited(viewerId, recipe.id) : Promise.resolve(false),
    viewerId ? familyRepository.getFamiliesForUser(viewerId) : Promise.resolve([]),
  ]);

  return (
    <article className="flex flex-col gap-8">
      <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
        <Link2 className="h-3.5 w-3.5" /> Shared with you
      </p>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          sizes="(max-width: 1024px) 100vw, 64rem"
          className="object-cover"
        />
      </div>

      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {recipe.title}
        </h1>
        {recipe.authorName ? (
          <p className="text-sm text-muted-foreground">
            by <span className="font-medium text-foreground">{recipe.authorName}</span>
            {recipe.sourceName ? (
              <> · originally from <span className="font-medium text-foreground">{recipe.sourceName}</span></>
            ) : null}
          </p>
        ) : null}
        {recipe.description ? (
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            {recipe.description}
          </p>
        ) : null}
      </header>

      <RecipePageActions
        recipeId={recipe.id}
        isOwner={isOwner}
        isLoggedIn={!!viewerId}
        initialFavorited={isFavorited}
        families={viewerFamilies.map((f) => ({ id: f.id, name: f.name }))}
        shareLinks={[]}
        editHref={`/recipes/${recipe.id}/edit`}
      />

      {recipe.story ? (
        <section className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <h2 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            The story
          </h2>
          <p className="whitespace-pre-line text-base leading-relaxed text-foreground">
            {recipe.story}
          </p>
        </section>
      ) : null}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Ingredients
          </h2>
          <ul className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 shadow-sm">
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {ingredient}
              </li>
            ))}
          </ul>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Steps</h2>
          <ol className="flex flex-col gap-4">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="pt-1 text-sm leading-relaxed text-foreground">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}
