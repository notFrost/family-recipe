import Image from "next/image";
import { Users, Link2, Plus, Crown } from "lucide-react";
import { PreviewRecipeCard } from "../PreviewRecipeCard";
import type { VariantFamily } from "../mock-data";

/**
 * Hearth Table — the family as a gathering, not a folder.
 *
 * A warm header band leads with the family name and an overlapping cluster of
 * member avatars (the people, first), with the member count shown as "x / y" so
 * the plan limit is legible. The owner's tokenized invite link sits right under
 * it, then the shared recipes as a grid. Social and welcoming — the layout's job
 * is to make the family feel present before the food.
 */
export default function HearthTable({ family }: { family: VariantFamily }) {
  return (
    <div className="flex flex-col gap-8">
      {/* Header band. */}
      <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Users className="h-3.5 w-3.5" /> Family
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {family.name}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              {family.blurb}
            </p>
          </div>

          {/* Overlapping member avatars + count. */}
          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            <div className="flex -space-x-2">
              {family.members.slice(0, 5).map((m) => (
                <Image
                  key={m.id}
                  src={m.avatarUrl}
                  alt={m.name}
                  width={40}
                  height={40}
                  title={`${m.name}${m.role === "OWNER" ? " (owner)" : ""}`}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-card"
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              {family.members.length} / {family.memberLimit} members
            </span>
          </div>
        </div>

        {/* Invite + add CTA. */}
        {family.isOwner ? (
          <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <Link2 className="h-4 w-4" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">
                  Invite link
                </span>
                <code className="text-xs text-muted-foreground">
                  …/join?token={family.inviteToken.slice(0, 8)}…
                </code>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground">
                Copy link
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Plus className="h-4 w-4" /> Add a recipe
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Member roll. */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          At this table
        </h2>
        <div className="flex flex-wrap gap-2">
          {family.members.map((m) => (
            <span
              key={m.id}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-sm font-semibold text-foreground shadow-sm"
            >
              <Image
                src={m.avatarUrl}
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 rounded-full object-cover"
              />
              {m.name.split(" ")[0]}
              {m.role === "OWNER" ? (
                <Crown className="h-3.5 w-3.5 text-primary" aria-label="owner" />
              ) : null}
            </span>
          ))}
        </div>
      </section>

      {/* Recipes. */}
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Family recipes
          </h2>
          <span className="text-sm text-muted-foreground">
            {family.recipes.length} recipes
          </span>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {family.recipes.map((r) => (
            <PreviewRecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      </section>
    </div>
  );
}
