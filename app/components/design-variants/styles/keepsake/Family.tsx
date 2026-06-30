import Image from "next/image";
import { Users, Crown, Link2, Copy } from "lucide-react";
import { mockFamily } from "../../mock-data";
import { Frame, Eyebrow, SectionHeading, Fold, Polaroid } from "./_kit";
import { KeepsakeRecipeTile } from "./Profile";

/**
 * Keepsake · Family — the family album's cover page.
 *
 * A framed cover photo crowns the page like the front of a kept album, the name
 * sits centered under a small eyebrow with its blurb beneath, members are
 * mounted as framed photo tiles (each with its role), and the shared invite
 * link is presented as a keepsake to pass along. The recipe grid reuses the same
 * framed tiles as the rest of the system.
 */
export default function KeepsakeFamily() {
  const family = mockFamily;
  const owner = family.members.find((m) => m.role === "OWNER");
  const inviteUrl = `family-recipe.app/join/${family.inviteToken}`;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-10 pb-8">
      {/* Framed cover crest. */}
      <Frame className="w-full" padding="p-2.5">
        <div className="relative aspect-[5/2] w-full overflow-hidden rounded-[1.25rem] bg-muted">
          <Image
            src={family.coverImageUrl}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 48rem"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-stone-900 backdrop-blur-md">
            Family album
          </span>
        </div>
      </Frame>

      {/* Name + blurb. */}
      <header className="flex flex-col items-center gap-3 text-center">
        <Eyebrow>
          {family.members.length} keepers · kept by {owner?.name.split(" ")[0]}
        </Eyebrow>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          {family.name}
        </h1>
        <p className="max-w-xl text-base italic leading-relaxed text-muted-foreground">
          &ldquo;{family.blurb}&rdquo;
        </p>
      </header>

      {/* Members as framed tiles. */}
      <Fold />
      <section className="flex w-full flex-col items-center gap-6">
        <SectionHeading kicker="Around the table">
          The {family.members.length} of us
        </SectionHeading>
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
          {family.members.map((m) => (
            <Polaroid
              key={m.id}
              src={m.avatarUrl}
              alt={m.name}
              caption={m.name.split(" ")[0]}
              sub={m.role === "OWNER" ? "Keeper" : "Member"}
              size={140}
            />
          ))}
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-4 w-4 text-primary" />
          <span className="font-bold text-foreground">
            {family.members.length} / {family.memberLimit}
          </span>{" "}
          seats at the table
        </span>
      </section>

      {/* Invite — a keepsake to pass along. */}
      {family.isOwner ? (
        <>
          <Fold />
          <section className="flex w-full max-w-xl flex-col items-center gap-4">
            <SectionHeading kicker="Pass it down">Invite family</SectionHeading>
            <Frame className="w-full" padding="p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <span className="flex flex-1 items-center gap-2.5 overflow-hidden rounded-2xl border border-border bg-secondary/50 px-4 py-2.5">
                  <Link2 className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate text-sm font-medium text-foreground">
                    {inviteUrl}
                  </span>
                </span>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Copy className="h-4 w-4" />
                  Copy link
                </button>
              </div>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                <Crown className="h-3.5 w-3.5 text-primary" />
                Anyone with this link can join and cook from your shelf.
              </p>
            </Frame>
          </section>
        </>
      ) : null}

      {/* Family recipes. */}
      <Fold />
      <section className="flex w-full flex-col items-center gap-6">
        <SectionHeading kicker={`${family.recipes.length} on the shelf`}>
          What we cook
        </SectionHeading>
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
          {family.recipes.map((r) => (
            <KeepsakeRecipeTile key={r.id} recipe={r} />
          ))}
        </div>
      </section>

      <Fold ornamentOnly />
    </div>
  );
}
