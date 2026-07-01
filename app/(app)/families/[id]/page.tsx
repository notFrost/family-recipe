import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Crown,
  Link2,
  Plus,
  UserPlus,
  Users,
} from "lucide-react";
import { familyRepository } from "@/app/lib/family-repository";
import { recipeRepository } from "@/app/lib/recipe-repository";
import { getSession } from "@/app/lib/auth";
import Avatar from "@/app/components/Avatar";
import RecipeCard from "@/app/components/RecipeCard";
import LeaveFamilyButton from "@/app/components/LeaveFamilyButton";
import DeleteFamilyButton from "@/app/components/DeleteFamilyButton";
import RemoveMemberButton from "@/app/components/RemoveMemberButton";
import TransferOwnershipButton from "@/app/components/TransferOwnershipButton";
import CopyLinkButton from "@/app/components/CopyLinkButton";

/**
 * Family page in the Homestead language: a warm banner leads (token gradient —
 * Family.coverImageUrl is a parked field) with the family name set large on
 * it, member avatars overlap the banner's lower edge, then "At this table"
 * member cards (with the owner's manage controls inline), the owner's invite
 * panel as the signature primary-tinted card, and the family recipe grid.
 * Member cap ("x / y") is parked until plan gates land.
 */
export default async function FamilyDetailPage({
  params,
}: PageProps<"/families/[id]">) {
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

  const [members, recipes] = await Promise.all([
    familyRepository.getFamilyMembers(id),
    recipeRepository.getRecipesByFamily(id),
  ]);

  const invitePath = `/families/${id}/join`;
  const memberIds = new Set(members.map((m) => m.userId));

  // Show a few faces on the banner; collapse the rest into a "+N" chip.
  const shownMembers = members.slice(0, 5);
  const overflow = members.length - shownMembers.length;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <Link
        href="/families"
        className="inline-flex w-fit items-center gap-1.5 rounded text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to families
      </Link>

      {/* Banner + overlapping member avatars. */}
      <div className="relative">
        <div className="relative aspect-[5/2] w-full overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/30 via-primary/10 to-secondary shadow-md sm:aspect-[16/6]">
          {/* On-banner label: the family name reads big on the warm surface. */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-6 sm:p-8">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-card/85 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-foreground backdrop-blur-md">
              <Users className="h-3.5 w-3.5" /> Family kitchen
            </span>
            <h1 className="text-3xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
              {family.name}
            </h1>
          </div>
        </div>

        {/* Member avatars overlap the banner's lower edge. */}
        <div className="absolute -bottom-7 left-6 flex items-center sm:left-8">
          {shownMembers.map((m, i) => (
            <Avatar
              key={m.id}
              name={m.userName}
              src={m.userImage}
              size={96}
              className={`h-14 w-14 text-xl ring-4 ring-background sm:h-16 sm:w-16 ${i === 0 ? "" : "-ml-3.5"}`}
            />
          ))}
          {overflow > 0 ? (
            <span
              className="-ml-3.5 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-sm font-extrabold text-secondary-foreground ring-4 ring-background sm:h-16 sm:w-16"
              title={`${overflow} more`}
            >
              +{overflow}
            </span>
          ) : null}
        </div>
      </div>

      {/* Identity row: counts on the left, the destructive control on the right. */}
      <div className="flex flex-col gap-5 pt-9 sm:flex-row sm:items-end sm:justify-between sm:pt-10">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Users className="h-4 w-4 text-primary" />
          <span className="font-extrabold text-foreground">
            {members.length}
          </span>{" "}
          {members.length === 1 ? "member" : "members"}
          <span aria-hidden>·</span>
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="font-extrabold text-foreground">
            {recipes.length}
          </span>{" "}
          {recipes.length === 1 ? "recipe" : "recipes"}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          {isOwner ? (
            <DeleteFamilyButton familyId={family.id} />
          ) : (
            <LeaveFamilyButton familyId={family.id} />
          )}
        </div>
      </div>

      {/* Members — named, owner badged, manage controls inline for the owner. */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          At this table
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {members.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-sm"
            >
              <Avatar
                name={m.userName}
                src={m.userImage}
                size={88}
                className="h-11 w-11 shrink-0 text-base"
              />
              <div className="flex min-w-0 flex-col gap-0.5 leading-tight">
                <span className="truncate text-sm font-bold text-foreground">
                  {m.userName ?? "Unknown"}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                  {m.role === "OWNER" ? (
                    <>
                      <Crown className="h-3.5 w-3.5 text-primary" /> Owner
                    </>
                  ) : (
                    "Member"
                  )}
                </span>
                {isOwner && m.role === "MEMBER" ? (
                  <span className="mt-1 inline-flex flex-wrap items-center gap-1.5">
                    <TransferOwnershipButton
                      familyId={family.id}
                      newOwnerId={m.userId}
                      memberName={m.userName}
                    />
                    <RemoveMemberButton
                      familyId={family.id}
                      userId={m.userId}
                    />
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Invite — the warm featured panel, the family page's signature device. */}
      {isOwner ? (
        <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-primary/5 p-6 sm:p-8">
          <Link2
            className="pointer-events-none absolute -right-2 top-2 h-24 w-24 -rotate-12 text-primary/10"
            aria-hidden
          />
          <div className="flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
              <UserPlus className="h-4 w-4 text-primary" />
              Invite the family
            </span>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Share this link and anyone who opens it can join {family.name}.
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-sm">
              <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate font-mono text-sm text-foreground">
                {invitePath}
              </span>
            </div>
            <CopyLinkButton link={invitePath} variant="pill" />
          </div>
        </section>
      ) : null}

      {/* Recipes — the shared grid. */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            The family table
          </h2>
          <Link
            href={`/recipes/new?familyId=${family.id}`}
            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Plus className="h-4 w-4" />
            Add recipe to this family
          </Link>
        </div>

        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-border bg-card py-20 text-center">
            <p className="text-lg font-bold text-foreground">No recipes yet</p>
            <p className="text-sm text-muted-foreground">
              Add a recipe to share with your family.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
