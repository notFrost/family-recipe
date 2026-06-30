import Image from "next/image";
import { Link2, Crown, Plus } from "lucide-react";
import { PreviewRecipeCard } from "../PreviewRecipeCard";
import type { VariantFamily } from "../mock-data";

/**
 * Cookbook Spine — the family as a bound cookbook.
 *
 * A sticky left "spine" holds everything about the family (a monogram crest, the
 * name, the member roll with roles, the member count vs. cap, and the invite
 * link) while the recipes fill the right like pages you flip through. The info
 * stays put as you scroll the collection — built for families with a lot of
 * recipes.
 */
export default function CookbookSpine({ family }: { family: VariantFamily }) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
      {/* The spine. */}
      <aside className="flex h-fit flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-24">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-extrabold text-primary-foreground shadow-md">
            {family.name.charAt(0)}
          </span>
          <h1 className="text-xl font-extrabold leading-tight tracking-tight text-foreground">
            {family.name}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {family.blurb}
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Members
            </h2>
            <span className="text-xs font-semibold text-muted-foreground">
              {family.members.length} / {family.memberLimit}
            </span>
          </div>
          <ul className="flex flex-col gap-2">
            {family.members.map((m) => (
              <li key={m.id} className="flex items-center gap-2.5">
                <Image
                  src={m.avatarUrl}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="flex-1 truncate text-sm font-semibold text-foreground">
                  {m.name}
                </span>
                {m.role === "OWNER" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                    <Crown className="h-3 w-3" /> Owner
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        {family.isOwner ? (
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Link2 className="h-4 w-4 text-primary" /> Invite link
            </div>
            <code className="truncate rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground">
              …/join?token={family.inviteToken.slice(0, 8)}…
            </code>
            <span className="inline-flex w-fit items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-bold text-foreground">
              Copy link
            </span>
          </div>
        ) : null}
      </aside>

      {/* The pages. */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Family recipes
          </h2>
          {family.isOwner ? (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Plus className="h-4 w-4" /> Add recipe
            </button>
          ) : null}
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {family.recipes.map((r) => (
            <PreviewRecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      </section>
    </div>
  );
}
