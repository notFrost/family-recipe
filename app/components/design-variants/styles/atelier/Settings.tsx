import Image from "next/image";
import {
  ArrowLeft,
  User,
  Mail,
  CreditCard,
  Users,
  ShieldAlert,
  MapPin,
  KeyRound,
  Crown,
  Sparkles,
  Check,
  Trash2,
} from "lucide-react";
import { mockViewer } from "../../mock-data";

/**
 * Atelier · Settings — a pinned section index beside the panels it jumps to.
 *
 * Atelier's split, applied to account settings: a sticky LEFT nav rail lists the
 * sections (Profile, Account, Plan, Families, Danger) as a labelled ledger, while
 * the RIGHT column scrolls the panels themselves. Each panel is a bordered card
 * matching the recipe/profile rails — same radius, hairline dividers, type scale.
 * The rail reuses StickyCookRail's sticky pattern (lg:sticky lg:top-20 + capped
 * scrollable height); on mobile it un-sticks and becomes a horizontal chip row
 * above the panels.
 */
export default function AtelierSettings() {
  const v = mockViewer;
  const usagePct = Math.min(
    100,
    Math.round((v.recipeCount / v.authoredRecipeLimit) * 100),
  );

  const sections = [
    { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
    { id: "account", label: "Account", icon: <Mail className="h-4 w-4" /> },
    { id: "plan", label: "Plan", icon: <CreditCard className="h-4 w-4" /> },
    { id: "families", label: "Families", icon: <Users className="h-4 w-4" /> },
    {
      id: "danger",
      label: "Danger",
      icon: <ShieldAlert className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        className="inline-flex w-fit items-center gap-1.5 rounded-full text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to profile
      </button>

      <div>
        <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Manage your account, plan, and the kitchens you belong to.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-10">
        {/* ── LEFT: the sticky section index ─────────────────────────── */}
        <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1">
          <nav
            aria-label="Settings sections"
            className="flex gap-2 overflow-x-auto rounded-3xl border border-border bg-card p-2 shadow-md lg:flex-col lg:gap-1 lg:overflow-visible lg:p-2.5"
          >
            {sections.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={i === 0 ? "true" : undefined}
                className={`inline-flex shrink-0 items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card ${
                  i === 0
                    ? "bg-primary/10 text-primary"
                    : s.id === "danger"
                      ? "text-destructive hover:bg-destructive/10"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <span className="shrink-0">{s.icon}</span>
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* ── RIGHT: the panels ──────────────────────────────────────── */}
        <div className="flex min-w-0 flex-col gap-6">
          {/* Profile */}
          <Panel id="profile" title="Profile" desc="How others see you.">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Image
                src={v.avatarUrl}
                alt=""
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover ring-4 ring-background"
              />
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="inline-flex w-fit items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                >
                  Change photo
                </button>
                <span className="text-xs text-muted-foreground">
                  JPG or PNG, up to 4&nbsp;MB.
                </span>
              </div>
            </div>

            <FormRow label="Display name">
              <input
                type="text"
                defaultValue={v.name}
                className={inputClasses}
              />
            </FormRow>

            <FormRow label="Bio">
              <textarea
                rows={3}
                defaultValue={v.bio}
                className={`${inputClasses} resize-y`}
              />
            </FormRow>

            <FormRow label="Location">
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  defaultValue={v.location}
                  className={`${inputClasses} pl-10`}
                />
              </div>
            </FormRow>

            <SaveRow />
          </Panel>

          {/* Account */}
          <Panel
            id="account"
            title="Account"
            desc="Your sign-in details."
          >
            <FormRow label="Email">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  defaultValue={v.email}
                  className={`${inputClasses} pl-10`}
                />
              </div>
            </FormRow>

            <div className="h-px w-full bg-border" />

            <div className="flex flex-col gap-1.5">
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                Change password
              </span>
              <p className="text-xs text-muted-foreground">
                Pick something you don&apos;t use anywhere else.
              </p>
            </div>
            <FormRow label="Current password">
              <input
                type="password"
                defaultValue="••••••••••"
                className={inputClasses}
              />
            </FormRow>
            <FormRow label="New password">
              <input
                type="password"
                placeholder="At least 8 characters"
                className={inputClasses}
              />
            </FormRow>

            <SaveRow label="Update password" />
          </Panel>

          {/* Plan */}
          <Panel
            id="plan"
            title="Plan"
            desc="What your kitchen can hold."
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
                {v.plan} plan
              </span>
              <span className="text-sm text-muted-foreground">
                You&apos;re on the house plan — no card on file.
              </span>
            </div>

            {/* Recipe usage — a labelled meter on the hairline-bordered base. */}
            <div className="flex flex-col gap-2.5 rounded-2xl border border-border bg-background p-4">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold text-foreground">
                  Recipes
                </span>
                <span className="text-sm font-bold text-foreground">
                  {v.recipeCount}{" "}
                  <span className="font-semibold text-muted-foreground">
                    / {v.authoredRecipeLimit}
                  </span>
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${usagePct}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {v.authoredRecipeLimit - v.recipeCount} slots left on Free.
              </span>
            </div>

            {/* Go Premium card. */}
            <div className="flex flex-col gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-extrabold tracking-tight text-foreground">
                    Go Premium
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Unlimited recipes, bigger families, and priority support.
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                <Crown className="h-4 w-4 fill-current" />
                Upgrade
              </button>
            </div>
          </Panel>

          {/* Families */}
          <Panel
            id="families"
            title="Families"
            desc="Kitchens you belong to."
          >
            <ul className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background">
              {v.families.map((f, i) => (
                <li
                  key={f.id}
                  className={`flex items-center justify-between gap-3 px-4 py-3.5 ${
                    i === v.families.length - 1 ? "" : "border-b border-border"
                  }`}
                >
                  <span className="inline-flex min-w-0 items-center gap-2.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
                      <Users className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 truncate text-sm font-semibold text-foreground">
                      {f.name}
                    </span>
                  </span>
                  {f.role === "OWNER" ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                      <Crown className="h-3 w-3 fill-current" />
                      Owner
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-secondary-foreground">
                      Member
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Panel>

          {/* Danger */}
          <section
            id="danger"
            className="flex scroll-mt-24 flex-col gap-5 rounded-3xl border border-destructive/40 bg-card p-6 shadow-md sm:p-7"
          >
            <div className="flex flex-col gap-1">
              <h2 className="inline-flex items-center gap-2 text-xl font-extrabold tracking-tight text-destructive">
                <ShieldAlert className="h-5 w-5" />
                Danger zone
              </h2>
              <p className="text-sm text-muted-foreground">
                Irreversible actions. Take a breath first.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-foreground">
                  Delete account
                </span>
                <span className="text-sm text-muted-foreground">
                  Removes your profile and every recipe you authored.
                </span>
              </div>
              <button
                type="button"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-destructive px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                <Trash2 className="h-4 w-4" />
                Delete account
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ── Shared settings primitives (Atelier vocabulary) ────────────────── */

const inputClasses =
  "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring";

function Panel({
  id,
  title,
  desc,
  children,
}: {
  id: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="flex scroll-mt-24 flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-md sm:p-7"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-extrabold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      {children}
    </section>
  );
}

function FormRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      {children}
    </div>
  );
}

function SaveRow({ label = "Save changes" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2.5 border-t border-border pt-5">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
      >
        <Check className="h-4 w-4" />
        {label}
      </button>
      <button
        type="button"
        className="inline-flex items-center rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
      >
        Cancel
      </button>
    </div>
  );
}
