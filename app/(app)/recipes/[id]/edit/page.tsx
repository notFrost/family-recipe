import { notFound, redirect } from "next/navigation";
import RecipeForm from "@/app/components/RecipeForm";
import { recipeRepository } from "@/app/lib/recipe-repository";
import { updateRecipeAction } from "@/app/lib/actions";
import { getSession } from "@/app/lib/auth";
import { familyRepository } from "@/app/lib/family-repository";

export default async function EditRecipePage({
  params,
}: PageProps<"/recipes/[id]/edit">) {
  const { id } = await params;

  // Route protection: must be signed in to reach the edit form.
  const session = await getSession();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/recipes/${id}/edit`);
  }

  const recipe = await recipeRepository.getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  // Ownership: only the author may edit. Non-owners are bounced back to the
  // (public) detail page rather than shown the form.
  if (recipe.authorId !== session.user.id) {
    redirect(`/recipes/${id}`);
  }

  // Fetch the user's families for the family picker.
  const families = await familyRepository.getFamiliesForUser(session.user.id);
  const familiesForPicker = families.map((f) => ({ id: f.id, name: f.name }));

  // Bind the recipe id so the form's action keeps the (FormData) signature.
  const updateAction = updateRecipeAction.bind(null, recipe.id);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
          Edit recipe
        </span>
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          {recipe.title}
        </h1>
      </div>

      <RecipeForm
        initialRecipe={recipe}
        action={updateAction}
        submitLabel="Save changes"
        cancelHref={`/recipes/${recipe.id}`}
        families={familiesForPicker}
      />
    </div>
  );
}
