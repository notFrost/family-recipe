import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { familyRepository } from "@/app/lib/family-repository";
import { getSession } from "@/app/lib/auth";
import { joinFamilyAction } from "@/app/lib/actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function JoinFamilyPage({ params }: Props) {
  const { id } = await params;

  const session = await getSession();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/families/${id}/join`);
  }

  const family = await familyRepository.getFamilyById(id);
  if (!family) {
    notFound();
  }

  // If already a member, redirect to the family page.
  const existingRole = await familyRepository.getMemberRole(
    id,
    session.user.id,
  );
  if (existingRole) {
    redirect(`/families/${id}`);
  }

  const joinAction = joinFamilyAction.bind(null, id);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Join {family.name}?
        </h1>
        <p className="text-base text-muted-foreground">
          You&apos;ve been invited to join this family. Once you join,
          you&apos;ll be able to view and contribute family recipes.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-muted p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            {family.name.charAt(0).toUpperCase()}
          </span>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">{family.name}</span>
            <span className="text-xs text-muted-foreground">Family</span>
          </div>
        </div>
      </div>

      <form action={joinAction} className="flex items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Join family
        </button>
        <Link
          href="/families"
          className="inline-flex items-center rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Cancel
        </Link>
      </form>
    </div>
  );
}
