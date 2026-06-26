import { redirect } from "next/navigation";
import RecipeForm from "@/app/components/RecipeForm";
import { createRecipeAction } from "@/app/lib/actions";
import { auth } from "@/app/lib/auth";
import { familyRepository } from "@/app/lib/family-repository";

export default async function NewRecipePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Route protection: must be signed in to create a recipe.
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/recipes/new");
  }

  const sp = await searchParams;
  const familyIdFromQuery =
    typeof sp.familyId === "string" ? sp.familyId : undefined;

  const families = await familyRepository.getFamiliesForUser(session.user.id);
  const familiesForPicker = families.map((f) => ({ id: f.id, name: f.name }));

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          New recipe
        </h1>
        <p className="text-base text-zinc-600">
          Share a dish with the community.
        </p>
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
