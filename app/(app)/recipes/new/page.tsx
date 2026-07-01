import { redirect } from "next/navigation";
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
      </div>

      <RecipeForm
        action={createRecipeAction}
        submitLabel="Create recipe"
        cancelHref="/"
        families={familiesForPicker}
        initialFamilyId={familyIdFromQuery}
      />
    </div>
  );
}
