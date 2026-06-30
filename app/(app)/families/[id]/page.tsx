import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { familyRepository } from "@/app/lib/family-repository";
import { recipeRepository } from "@/app/lib/recipe-repository";
import { getSession } from "@/app/lib/auth";
import RecipeCard from "@/app/components/RecipeCard";
import LeaveFamilyButton from "@/app/components/LeaveFamilyButton";
import DeleteFamilyButton from "@/app/components/DeleteFamilyButton";
import RemoveMemberButton from "@/app/components/RemoveMemberButton";
import TransferOwnershipButton from "@/app/components/TransferOwnershipButton";
import FamilyInviteSection from "@/app/components/FamilyInviteSection";
import { inviteRepository } from "@/app/lib/invite-repository";
import { getUserPlan, familyMemberLimit } from "@/app/lib/entitlements";

// The new family pages haven't been registered by next dev yet, so we define
// a local PageProps-like contract inline. This mirrors the generated type.
type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FamilyDetailPage({ params }: Props) {
  const { id } = await params;

  const session = await getSession();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/families/${id}`);
  }

  const family = await familyRepository.getFamilyById(id);
  if (!family) {
    notFound();
  }

  // Families are private to members — bounce non-members.
  const role = await familyRepository.getMemberRole(id, session.user.id);
  if (!role) {
    notFound();
  }

  const isOwner = role === "OWNER";

  const [members, recipes, invites, ownerPlan] = await Promise.all([
    familyRepository.getFamilyMembers(id),
    recipeRepository.getRecipesByFamily(id),
    isOwner ? inviteRepository.listByFamily(id) : Promise.resolve([]),
    getUserPlan(family.ownerId),
  ]);

  const memberLimit = familyMemberLimit(ownerPlan);
  const atMemberCap = members.length >= memberLimit;

  const memberIds = new Set(members.map((m) => m.userId));

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/families"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
      >
        <span aria-hidden>&larr;</span>
        Back to families
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {family.name}
            </h1>
            <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-300">
              Family
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isOwner ? (
            <DeleteFamilyButton familyId={family.id} />
          ) : (
            <LeaveFamilyButton familyId={family.id} />
          )}
        </div>
      </div>

      {/* Owner-only: Invite section (tokenized, revocable links). */}
      {isOwner ? (
        <FamilyInviteSection
          familyId={family.id}
          invites={invites.map((i) => ({ id: i.id, token: i.token }))}
          atCap={atMemberCap}
        />
      ) : null}

      {/* Members section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Members
          </h2>
          <span className="text-sm text-muted-foreground">
            {members.length} / {memberLimit} members
          </span>
        </div>
        <ul className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 shadow-sm">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between gap-3 text-sm text-foreground"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {member.userName ?? "Unknown"}
                </span>
                <span
                  className={
                    member.role === "OWNER"
                      ? "inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                      : "inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                  }
                >
                  {member.role === "OWNER" ? "Owner" : "Member"}
                </span>
              </div>
              {isOwner && member.role === "MEMBER" ? (
                <span className="inline-flex flex-wrap items-center gap-2">
                  <TransferOwnershipButton
                    familyId={family.id}
                    newOwnerId={member.userId}
                    memberName={member.userName}
                  />
                  <RemoveMemberButton
                    familyId={family.id}
                    userId={member.userId}
                  />
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      {/* Add recipe CTA */}
      <div className="flex items-center gap-3">
        <Link
          href={`/recipes/new?familyId=${family.id}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span aria-hidden className="text-base leading-none">
            +
          </span>
          Add recipe to this family
        </Link>
      </div>

      {/* Recipes section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Family recipes
          </h2>
          <span className="text-sm text-muted-foreground">
            {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
          </span>
        </div>

        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card py-20 text-center">
            <p className="text-lg font-medium text-foreground">
              No recipes yet
            </p>
            <p className="text-sm text-muted-foreground">
              Add a recipe to share with your family.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                authorIsFormerMember={!memberIds.has(recipe.authorId)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
