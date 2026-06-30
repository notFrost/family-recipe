import {
  Mail,
  KeyRound,
  Crown,
  Check,
  Users,
  ChevronRight,
  Trash2,
  AlertTriangle,
  Sparkles,
  PenLine,
} from "lucide-react";
import { mockViewer } from "../../mock-data";
import { Eyebrow, SectionHeading, Fold, FramedAvatar, Tag } from "./_kit";

/**
 * Keepsake · Settings — the inside cover of your own album.
 *
 * The signed-in user's account, kept in the same centered, framed language: a
 * framed avatar leads the profile, each section is parted by the ✦ fold, the
 * plan is a warm "keepsake" upgrade card, and the danger zone is set apart in a
 * quiet destructive frame. Static visual only.
 */
export default function KeepsakeSettings() {
  const viewer = mockViewer;
  const used = viewer.recipeCount;
  const limit = viewer.authoredRecipeLimit;
  const pct = Math.min(100, Math.round((used / limit) * 100));

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-9 pb-8">
      <header className="flex flex-col items-center gap-2 text-center">
        <Eyebrow>Your account</Eyebrow>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Settings
        </h1>
      </header>

      {/* Profile. */}
      <Section kicker="How others see you" title="Profile">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:text-left">
          <FramedAvatar src={viewer.avatarUrl} alt={viewer.name} size={88} priority />
          <div className="flex flex-1 flex-col items-center gap-1 text-center sm:items-start sm:text-left">
            <span className="text-xl font-extrabold tracking-tight text-foreground">
              {viewer.name}
            </span>
            <span className="text-sm text-muted-foreground">{viewer.location}</span>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-foreground">
              {viewer.bio}
            </p>
          </div>
          <GhostButton icon={<PenLine className="h-4 w-4" />}>Edit</GhostButton>
        </div>
      </Section>

      {/* Account. */}
      <Section kicker="Sign-in" title="Account">
        <Row icon={<Mail className="h-4 w-4" />} label="Email" value={viewer.email}>
          <GhostButton>Change</GhostButton>
        </Row>
        <Divider />
        <Row icon={<KeyRound className="h-4 w-4" />} label="Password" value="Last changed 3 months ago">
          <GhostButton>Change password</GhostButton>
        </Row>
      </Section>

      {/* Plan. */}
      <Section kicker="Your shelf" title="Plan">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Tag>Free</Tag>
              <span className="text-sm text-muted-foreground">
                You&apos;re on the free plan.
              </span>
            </div>
            <span className="text-sm font-bold text-foreground">
              {used} / {limit} recipes
            </span>
          </div>
          {/* Usage meter. */}
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Warm upgrade keepsake. */}
          <div className="relative overflow-hidden rounded-[1.5rem] border border-primary/30 bg-primary/[0.07] p-5 sm:p-6">
            <Sparkles
              className="absolute -right-3 -top-3 h-16 w-16 text-primary/10"
              aria-hidden
            />
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                <Crown className="h-4 w-4" /> Premium
              </span>
              <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                Keep more than {limit} recipes
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                Unlimited recipes, larger families, and a printable album to pass
                the whole collection down.
              </p>
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
              {["Unlimited recipes", "Up to 30 family seats", "Printable album"].map(
                (f) => (
                  <li
                    key={f}
                    className="inline-flex items-center gap-1.5 text-sm text-foreground"
                  >
                    <Check className="h-4 w-4 text-primary" />
                    {f}
                  </li>
                ),
              )}
            </ul>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Crown className="h-4 w-4" />
              Go Premium
            </button>
          </div>
        </div>
      </Section>

      {/* Families. */}
      <Section kicker="Where you cook" title="Families">
        <ul className="flex flex-col">
          {viewer.families.map((f, i) => (
            <li key={f.id}>
              {i > 0 ? <Divider /> : null}
              <button
                type="button"
                className="group flex w-full items-center gap-3 rounded-2xl py-2 text-left transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Users className="h-4 w-4" />
                </span>
                <span className="flex flex-1 flex-col leading-tight">
                  <span className="text-sm font-bold text-foreground">
                    {f.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {f.role === "OWNER" ? "You keep this one" : "Member"}
                  </span>
                </span>
                {f.role === "OWNER" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider text-primary">
                    <Crown className="h-3 w-3" /> Keeper
                  </span>
                ) : (
                  <Tag>Member</Tag>
                )}
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </button>
            </li>
          ))}
        </ul>
      </Section>

      {/* Danger zone. */}
      <Fold />
      <section className="flex w-full flex-col items-center gap-4">
        <SectionHeading kicker="Careful here">Danger zone</SectionHeading>
        <div className="w-full rounded-[1.75rem] border border-destructive/30 bg-destructive/[0.04] p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-foreground">
                  Delete your account
                </span>
                <span className="max-w-md text-xs leading-relaxed text-muted-foreground">
                  Permanently removes your recipes, families you keep, and this
                  account. This can&apos;t be undone.
                </span>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-destructive/40 bg-card px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Trash2 className="h-4 w-4" />
              Delete account
            </button>
          </div>
        </div>
      </section>

      <Fold ornamentOnly />
    </div>
  );
}

/* Settings-specific layout, on the shared Keepsake vocabulary: each block is a
 * framed card introduced by a centered SectionHeading. */

function Section({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full flex-col items-center gap-4">
      <SectionHeading kicker={kicker}>{title}</SectionHeading>
      <div className="w-full rounded-[1.75rem] border border-border bg-card p-5 shadow-sm sm:p-7">
        {children}
      </div>
    </section>
  );
}

function Row({
  icon,
  label,
  value,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
          {icon}
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <span className="text-sm font-semibold text-foreground">{value}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="my-3.5 h-px w-full bg-border" />;
}

function GhostButton({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {icon}
      {children}
    </button>
  );
}
