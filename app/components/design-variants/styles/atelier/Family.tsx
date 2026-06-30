import Image from "next/image";
import {
  ArrowLeft,
  Users,
  Link2,
  Copy,
  Crown,
  UserPlus,
} from "lucide-react";
import { PreviewRecipeCard } from "../../PreviewRecipeCard";
import { mockFamily } from "../../mock-data";

/**
 * Atelier · Family — the kitchen's roster pinned beside its cookbook.
 *
 * Same structured split Atelier uses everywhere: a sticky LEFT info rail (a
 * monogram crest, the family name + blurb, a labelled member roll with roles
 * and the "x / y seats" count, and the tokenized invite link) sits beside the
 * RIGHT column, which scrolls the family recipes grid. The rail reuses
 * StickyCookRail's exact sticky pattern (lg:sticky lg:top-20 + capped, scrollable
 * height) so a long roster never traps its invite block off-screen. On mobile the
 * rail un-sticks and stacks above the grid.
 */
export default function AtelierFamily() {
  const family = mockFamily;
  const monogram = family.name
    .replace(/^The\s+/i, "")
    .trim()
    .charAt(0)
    .toUpperCase();
  const inviteUrl = `family-recipe.app/join/${family.inviteToken}`;

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        className="inline-flex w-fit items-center gap-1.5 rounded-full text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to families
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-10">
        {/* ── LEFT: the sticky family rail ───────────────────────────── */}
        <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1">
          <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-md sm:p-7">
            {/* Crest + name. A monogram stands in for a family crest. */}
            <div className="flex flex-col items-center text-center">
              <span
                aria-hidden
                className="grid h-20 w-20 place-items-center rounded-2xl border border-primary/30 bg-primary/5 text-3xl font-extrabold tracking-tight text-primary shadow-sm"
              >
                {monogram}
              </span>
              <h1 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-foreground">
                {family.name}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {family.blurb}
              </p>
            </div>

            {/* Member roll — a labelled ledger of who's in the kitchen. */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  Members
                </span>
                <span className="text-xs font-bold text-muted-foreground">
                  <span className="text-foreground">
                    {family.members.length}
                  </span>{" "}
                  / {family.memberLimit} seats
                </span>
              </div>

              <ul className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background">
                {family.members.map((m, i) => (
                  <li
                    key={m.id}
                    className={`flex items-center gap-3 px-3.5 py-3 ${
                      i === family.members.length - 1
                        ? ""
                        : "border-b border-border"
                    }`}
                  >
                    <Image
                      src={m.avatarUrl}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                      {m.name}
                    </span>
                    {m.role === "OWNER" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                        <Crown className="h-3 w-3 fill-current" />
                        Owner
                      </span>
                    ) : (
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-secondary-foreground">
                        Member
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Invite — owner-only. The tokenized link, ready to copy. */}
            {family.isOwner ? (
              <div className="flex flex-col gap-2.5 rounded-2xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  <Link2 className="h-3.5 w-3.5" />
                  Invite link
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Anyone with this link can join while seats are open.
                </p>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
                  <code className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
                    {inviteUrl}
                  </code>
                  <button
                    type="button"
                    aria-label="Copy invite link"
                    title="Copy invite link"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  className="mt-0.5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                >
                  <UserPlus className="h-4 w-4" />
                  Invite a cook
                </button>
              </div>
            ) : null}
          </div>
        </aside>

        {/* ── RIGHT: the family cookbook ─────────────────────────────── */}
        <section className="flex min-w-0 flex-col gap-5">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Shared recipes
            </h2>
            <span className="text-sm font-semibold text-muted-foreground">
              {family.recipes.length} in the kitchen
            </span>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {family.recipes.map((r) => (
              <PreviewRecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
