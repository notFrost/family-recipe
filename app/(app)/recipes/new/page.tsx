import Link from "next/link";
import { redirect } from "next/navigation";
import { Clapperboard } from "lucide-react";
import RecipeForm from "@/app/components/RecipeForm";
import { createRecipeAction } from "@/app/lib/actions";
import { getSession } from "@/app/lib/auth";
import { familyRepository } from "@/app/lib/family-repository";

export default async function NewRecipePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Route protection: must be signed in to create a recipe.
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/recipes/new");
  }

  const sp = await searchParams;
  const familyIdFromQuery =
    typeof sp.familyId === "string" ? sp.familyId : undefined;

  // Draft prefills (from the video import). Sanitized here: plain strings,
  // capped, imageUrl must parse as http(s) — anything else is dropped.
  const str = (v: unknown, max: number) =>
    typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined;
  let draftImage = str(sp.imageUrl, 1000);
  try {
    if (draftImage) {
      const u = new URL(draftImage);
      if (u.protocol !== "https:" && u.protocol !== "http:") {
        draftImage = undefined;
      }
    }
  } catch {
    draftImage = undefined;
  }
  const initialDraft = {
    title: str(sp.title, 200),
    imageUrl: draftImage,
    description: str(sp.description, 1000),
  };

  const families = await familyRepository.getFamiliesForUser(session.user.id);
  const familiesForPicker = families.map((f) => ({ id: f.id, name: f.name }));

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
          New recipe
        </span>
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          Write it down before
          <br className="hidden sm:block" /> you forget it
        </h1>
        <Link
          href="/recipes/import"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Clapperboard className="h-4 w-4" />
          Or import from a video
        </Link>
      </div>

      <RecipeForm
        action={createRecipeAction}
        submitLabel="Create recipe"
        cancelHref="/"
        families={familiesForPicker}
        initialFamilyId={familyIdFromQuery}
        initialDraft={initialDraft}
      />
    </div>
  );
}
