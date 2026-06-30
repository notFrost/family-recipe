import Image from "next/image";
import {
  Users,
  BookOpen,
  Link2,
  Copy,
  UserPlus,
  Crown,
  Settings2,
} from "lucide-react";
import { PreviewRecipeCard } from "../../PreviewRecipeCard";
import { mockFamily } from "../../mock-data";

/**
 * Homestead — Family page.
 *
 * Same front-loaded, image-led grammar as the recipe and profile pages: a wide
 * rounded-3xl banner sets the table, the family's name + blurb sit on the page
 * surface below it, and an overlapping row of member avatars anchors "who's at
 * this table". The owner's invite link gets a warm featured panel (the same
 * primary-tinted card the recipe page uses for the cook's story), then the
 * family's recipes spill into the shared PreviewRecipeCard grid. One warm
 * column, read top to bottom.
 */
export default function HomesteadFamily() {
  const family = mockFamily;
  const memberCount = family.members.length;
  const inviteUrl = `family-recipe.app/join/${family.inviteToken}`;
  // Show a few faces inline; collapse the rest into a "+N" chip.
  const shownMembers = family.members.slice(0, 5);
  const overflow = family.members.length - shownMembers.length;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      {/* Banner + overlapping member avatars — the image leads. */}
      <div className="relative">
        <div className="relative aspect-[5/2] w-full overflow-hidden rounded-3xl border border-border bg-muted shadow-md sm:aspect-[16/6]">
          <Image
            src={family.coverImageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          {/* On-image label: the family name reads big against the photo. */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-6 sm:p-8">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-stone-900 backdrop-blur-md">
              <Users className="h-3.5 w-3.5" /> Family kitchen
            </span>
            <h1 className="text-3xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-sm sm:text-5xl">
              {family.name}
            </h1>
          </div>
        </div>

        {/* Member avatars overlap the banner's lower edge, mirroring the
            profile page's single-avatar overlap. */}
        <div className="absolute -bottom-7 left-6 flex items-center sm:left-8">
          {shownMembers.map((m, i) => (
            <Image
              key={m.id}
              src={m.avatarUrl}
              alt={m.name}
              width={96}
              height={96}
              title={m.name}
              className="h-14 w-14 rounded-full object-cover ring-4 ring-background sm:h-16 sm:w-16"
              style={{
                marginLeft: i === 0 ? 0 : "-0.85rem",
                zIndex: shownMembers.length - i,
              }}
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

      {/* Identity row: blurb on the left, manage on the right. */}
      <div className="flex flex-col gap-5 pt-9 sm:flex-row sm:items-end sm:justify-between sm:pt-10">
        <div className="flex flex-col gap-2">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-extrabold text-foreground">
              {memberCount}
            </span>{" "}
            / {family.memberLimit} members
            <span aria-hidden>·</span>
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="font-extrabold text-foreground">
              {family.recipes.length}
            </span>{" "}
            recipes
          </span>
          <p className="max-w-2xl text-lg italic leading-relaxed text-foreground">
            {family.blurb}
          </p>
        </div>
        {family.isOwner ? (
          <button
            type="button"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Settings2 className="h-4 w-4" />
            Manage family
          </button>
        ) : null}
      </div>

      {/* Members — named, with the owner badged. */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          At this table
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {family.members.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-sm"
            >
              <Image
                src={m.avatarUrl}
                alt={m.name}
                width={88}
                height={88}
                className="h-11 w-11 shrink-0 rounded-full object-cover"
              />
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-sm font-bold text-foreground">
                  {m.name}
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
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Invite — the warm featured panel, the family page's signature device
          (the same primary-tinted rounded-3xl card the recipe story uses). */}
      {family.isOwner ? (
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
              Share this link and anyone who opens it can join {family.name} —
              you have room for {family.memberLimit - memberCount} more.
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-sm">
              <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate font-mono text-sm text-foreground">
                {inviteUrl}
              </span>
            </div>
            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Copy className="h-4 w-4" />
              Copy invite link
            </button>
          </div>
        </section>
      ) : null}

      {/* Recipes — the shared grid, same as the profile page. */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          The family table
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {family.recipes.map((r) => (
            <PreviewRecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      </section>
    </div>
  );
}
