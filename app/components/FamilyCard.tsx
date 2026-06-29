import Link from "next/link";
import type { Family } from "../lib/types";

interface FamilyCardProps {
  family: Family;
  memberCount?: number;
}

export default function FamilyCard({ family, memberCount }: FamilyCardProps) {
  const initial = family.name.charAt(0).toUpperCase();

  return (
    <Link
      href={`/families/${family.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-card">
        <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-primary-foreground shadow-sm ring ring-primary/30">
          {initial}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold leading-snug tracking-tight text-foreground">
            {family.name}
          </h2>
          <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-300">
            Family
          </span>
        </div>

        <div className="mt-auto flex items-center gap-3 pt-3 text-xs font-medium text-muted-foreground">
          {memberCount !== undefined ? (
            <span>
              {memberCount} {memberCount === 1 ? "member" : "members"}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
