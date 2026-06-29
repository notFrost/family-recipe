import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/app/lib/auth";
import { familyRepository } from "@/app/lib/family-repository";
import FamilyCard from "@/app/components/FamilyCard";

export default async function FamiliesPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/families");
  }

  const families = await familyRepository.getFamiliesForUser(session.user.id);

  // Fetch member counts for each family
  const familiesWithCounts = await Promise.all(
    families.map(async (family) => {
      const members = await familyRepository.getFamilyMembers(family.id);
      return { family, memberCount: members.length };
    }),
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Families
          </h1>
          <p className="text-base text-muted-foreground">
            Your shared recipe collections.
          </p>
        </div>
        <Link
          href="/families/new"
          className="inline-flex items-center gap-1.5 self-start rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span aria-hidden className="text-base leading-none">
            +
          </span>
          Create a family
        </Link>
      </div>

      {familiesWithCounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <p className="text-lg font-medium text-foreground">No families yet</p>
          <p className="text-sm text-muted-foreground">
            Create a family to share recipes with your loved ones.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {familiesWithCounts.map(({ family, memberCount }) => (
            <FamilyCard
              key={family.id}
              family={family}
              memberCount={memberCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}
