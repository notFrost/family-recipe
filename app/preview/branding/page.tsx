"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

/**
 * Brand exploration — name candidates + logo marks, presented as a tasting
 * flight of recipe cards. Everything runs on the shipped Amber token system;
 * the one deliberate accent is a handwritten script for taglines, because
 * that's what real recipe cards sound like.
 *
 * The signature device is the TRY-ON strip: tap a name card (or any mark in
 * the tray) and the strip re-renders the pick at real sizes — navbar lockup,
 * OS app icon, favicon — so the decision is made in context, never from a
 * lonely 200px tile. Pure exploration: no real rename happens here.
 */

/* ----------------------------- Logo marks ------------------------------ */
/* 24×24 viewBox, stroke-2 round caps (lucide-compatible), currentColor —
   every mark works single-color on any surface, light or dark. */

type MarkProps = { className?: string };

/** The stained index card — the artifact every family actually has. */
function RecipeCardMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="M7 9.5h7" />
      <path d="M7 13h3.5" />
      <path
        d="M16.6 12.6c-.72-.72-1.9-.72-2.62 0l-.18.18-.18-.18c-.72-.72-1.9-.72-2.62 0-.72.72-.72 1.9 0 2.62l2.8 2.8 2.8-2.8c.72-.72.72-1.9 0-2.62z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

/** The same card, holding a secret — keyhole punched through the middle. */
function KeyholeMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="12" cy="10.2" r="2.1" fill="currentColor" stroke="none" />
      <path
        d="M12 11.5l-1.7 5h3.4z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

/** A locket — precious, kept close, opened for the people you love. */
function LocketMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="2.6" r="1.4" />
      <ellipse cx="12" cy="13.5" rx="7.5" ry="8" />
      <ellipse cx="12" cy="10.8" rx="1.7" ry="2.1" />
      <path d="M12 12.9v4.6" />
    </svg>
  );
}

/** Three cards, cascading — a recipe on its third owner. */
function CardStackMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M9.5 3.5h8a2 2 0 0 1 2 2V14" />
      <path d="M6 6.5h9.5a2 2 0 0 1 2 2V17" />
      <rect x="2.5" y="9.5" width="12" height="11" rx="2" />
      <path d="M5.5 14h6" />
    </svg>
  );
}

/** The family pot — three wisps of steam, three generations deep. */
function PotSteamMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M4 13h16" />
      <path d="M5 13v1.5a5 5 0 0 0 5 5h4a5 5 0 0 0 5-5V13" />
      <path d="M8 9.8c1.2-1.2 1.2-3 0-4.2" />
      <path d="M12.2 9.8c1-1 1-2.4 0-3.4" />
      <path d="M16.2 9.8c.8-.8.8-1.8 0-2.6" />
    </svg>
  );
}

/** Big spoon, little spoon — someone taught you how to stir. */
function SpoonsMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <ellipse cx="7" cy="7.2" rx="2.7" ry="3.3" transform="rotate(-45 7 7.2)" />
      <path d="M9.1 9.3L18 18.2" />
      <ellipse cx="16" cy="5.6" rx="1.7" ry="2.1" transform="rotate(-45 16 5.6)" />
      <path d="M17.3 6.9l4.2 4.2" />
    </svg>
  );
}

/* ------------------------------- Data ---------------------------------- */

const MARKS = [
  { id: "card", label: "Recipe card", note: "the stained index card", Mark: RecipeCardMark },
  { id: "keyhole", label: "Keyhole", note: "a secret worth keeping", Mark: KeyholeMark },
  { id: "locket", label: "Locket", note: "precious, kept close", Mark: LocketMark },
  { id: "stack", label: "Card stack", note: "a recipe on its third owner", Mark: CardStackMark },
  { id: "pot", label: "Pot & steam", note: "three wisps, three generations", Mark: PotSteamMark },
  { id: "spoons", label: "Spoons", note: "big spoon, little spoon", Mark: SpoonsMark },
] as const;

type MarkId = (typeof MARKS)[number]["id"];

interface Candidate {
  id: string;
  name: string;
  /** Default mark pairing (any mark works with any name — the tray swaps). */
  markId: MarkId;
  /** Wordmark treatment inside lockups. */
  wordmarkClass: string;
  wordmarkStyle?: React.CSSProperties;
  /** Handwritten tagline — the card's voice. */
  tagline: string;
  /** The overheard line — how the name sounds in a real kitchen. */
  quote: string;
  works: string[];
  watchOut: string;
}

const CANDIDATES: Candidate[] = [
  {
    id: "family-recipe",
    name: "Family Recipe",
    markId: "card",
    wordmarkClass: "font-extrabold tracking-tight",
    tagline: "Every dish has a story. Keep both.",
    quote: "“Okay, but what's IN it?” — “It's a family recipe.”",
    works: [
      "The phrase people already say — zero explanation needed.",
      "You own it today: domain, deploys, no migration cost.",
    ],
    watchOut: "Descriptive, not ownable — hard to rank for, easy to forget.",
  },
  {
    id: "family-secret",
    name: "Family Secret",
    markId: "keyhole",
    wordmarkClass: "font-bold uppercase tracking-[0.14em]",
    tagline: "The best secrets are the ones you pass down.",
    quote: "“Can I get the recipe?” — “Sorry. Family secret.”",
    works: [
      "Instantly memorable, a little mischievous — great social voice.",
      "Private-by-default families literally are family secrets.",
    ],
    watchOut: "Cuts against Discover — the public half of the app is anti-secret.",
  },
  {
    id: "heirloom",
    name: "Heirloom",
    markId: "locket",
    wordmarkClass: "font-semibold tracking-tight",
    wordmarkStyle: { fontFamily: "Georgia, 'Times New Roman', serif" },
    tagline: "Some heirlooms live in the attic. Yours live in the kitchen.",
    quote: "“That pie? That's an heirloom.”",
    works: [
      "One word, premium feel — “heirloom recipe” is already how people talk.",
      "Heirloom tomatoes gave the word a food shelf of its own.",
    ],
    watchOut: "Crowded word in the artisan aisle; one-word domains cost real money.",
  },
  {
    id: "hand-me-downs",
    name: "Hand-Me-Downs",
    markId: "stack",
    wordmarkClass: "font-extrabold lowercase tracking-tight",
    tagline: "The best things you own were someone else's first.",
    quote: "“Grandma's ragù. I'm the third owner.”",
    works: [
      "The warmest read of lineage — save-a-copy IS a hand-me-down.",
      "Nobody owns the phrase in food; it's all yours.",
    ],
    watchOut: "Long; thrift-store adjacency; hyphens fight app-store search.",
  },
];

const HANDWRITTEN: React.CSSProperties = {
  fontFamily: "'Segoe Script', 'Bradley Hand', 'Comic Sans MS', cursive",
};

/* ------------------------------ Try-on ---------------------------------- */

function markById(id: MarkId) {
  return MARKS.find((m) => m.id === id) ?? MARKS[0];
}

/** The pick, worn at real sizes: navbar lockup, OS app icon, favicon. */
function TryOnStrip({
  candidate,
  markId,
}: {
  candidate: Candidate;
  markId: MarkId;
}) {
  const { Mark } = markById(markId);

  return (
    <section
      aria-label="Try the pick at real sizes"
      className="flex flex-col gap-4 rounded-3xl border border-primary/30 bg-primary/5 p-5 sm:p-6"
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-bold text-foreground">
          Wearing: {candidate.name}
        </span>
        <span className="text-xs text-muted-foreground">
          mark: {markById(markId).label.toLowerCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* Navbar at real scale — matches the live Navbar's metrics. */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Navbar · real size
          </span>
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3.5 shadow-sm">
            <span className="flex items-center gap-2.5 text-xl text-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Mark className="h-5 w-5" />
              </span>
              <span
                className={candidate.wordmarkClass}
                style={candidate.wordmarkStyle}
              >
                {candidate.name}
              </span>
            </span>
            <span className="hidden items-center gap-2 sm:flex">
              <span className="rounded-full bg-primary/10 px-3.5 py-1.5 text-sm font-semibold text-primary">
                Discover
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-md">
                <Plus className="h-4 w-4" />
                Add recipe
              </span>
            </span>
          </div>
        </div>

        {/* App icon + favicon on OS-neutral surfaces (icons don't get a theme). */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            App icon · favicon
          </span>
          <div className="flex flex-1 items-center gap-3">
            {(["#f5f5f4", "#1c1917"] as const).map((surface) => (
              <span
                key={surface}
                className="flex flex-1 items-center justify-center gap-3 rounded-2xl border border-border px-3 py-2.5"
                style={{ backgroundColor: surface }}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-[22%] bg-primary text-primary-foreground shadow-md">
                  <Mark className="h-8 w-8" />
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                  <Mark className="h-4 w-4" />
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Page ----------------------------------- */

export default function BrandingPage() {
  const [pickId, setPickId] = useState(CANDIDATES[0].id);
  const [markOverride, setMarkOverride] = useState<MarkId | null>(null);

  const pick = CANDIDATES.find((c) => c.id === pickId) ?? CANDIDATES[0];
  const wornMark = markOverride ?? pick.markId;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
          Brand exploration
        </span>
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          What do we call
          <br className="hidden sm:block" /> this kitchen?
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Four names, six marks, all on the shipped Amber system. Tap a card to
          wear it in the strip below; tap any mark in the tray to mix and
          match. Flip the navbar moon for dark. Nothing here renames anything —
          it&apos;s a fitting room.
        </p>
      </div>

      <TryOnStrip candidate={pick} markId={wornMark} />

      {/* The flight — each candidate as a recipe card from the tin. */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          The candidates
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {CANDIDATES.map((c) => {
            const { Mark } = markById(c.markId);
            const active = c.id === pickId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setPickId(c.id);
                  setMarkOverride(null);
                }}
                aria-pressed={active}
                className={`group flex flex-col gap-4 rounded-3xl border bg-card p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-6 ${
                  active ? "border-primary/50 ring-1 ring-primary/30" : "border-border"
                }`}
              >
                {/* Lockup. */}
                <span className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                    <Mark className="h-7 w-7" />
                  </span>
                  <span
                    className={`text-2xl text-foreground ${c.wordmarkClass}`}
                    style={c.wordmarkStyle}
                  >
                    {c.name}
                  </span>
                </span>

                {/* Handwritten tagline on a ruled card line. */}
                <span className="flex flex-col gap-1 border-b border-dashed border-border pb-3">
                  <span
                    className="text-lg leading-snug text-foreground"
                    style={HANDWRITTEN}
                  >
                    {c.tagline}
                  </span>
                </span>

                {/* The overheard line. */}
                <span className="text-sm italic leading-relaxed text-muted-foreground">
                  {c.quote}
                </span>

                {/* Honest notes. */}
                <span className="flex flex-col gap-1.5 text-sm leading-relaxed">
                  {c.works.map((w) => (
                    <span key={w} className="flex gap-2 text-foreground">
                      <span className="font-bold text-primary" aria-hidden>
                        +
                      </span>
                      {w}
                    </span>
                  ))}
                  <span className="flex gap-2 text-muted-foreground">
                    <span className="font-bold" aria-hidden>
                      –
                    </span>
                    {c.watchOut}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* The marks tray — mix and match. */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            The marks tray
          </h2>
          <p className="text-sm text-muted-foreground">
            Any mark pairs with any name — tap one to swap it into the strip.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {MARKS.map(({ id, label, note, Mark }) => {
            const worn = id === wornMark;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setMarkOverride(id)}
                aria-pressed={worn}
                title={note}
                className={`flex flex-col items-center gap-2 rounded-2xl border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  worn ? "border-primary/50 ring-1 ring-primary/30" : "border-border"
                }`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Mark className="h-6 w-6" />
                </span>
                <span className="text-xs font-bold text-foreground">
                  {label}
                </span>
                <span className="text-center text-[11px] leading-tight text-muted-foreground">
                  {note}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <p className="text-sm leading-relaxed text-muted-foreground">
        A rename has real costs — domain, deploy URLs, store listings, the
        habit in people&apos;s thumbs. If a new name wins, it should win by enough
        to pay for all that. “Family Recipe” with a better mark is a
        legitimate outcome of this page.
      </p>
    </div>
  );
}
