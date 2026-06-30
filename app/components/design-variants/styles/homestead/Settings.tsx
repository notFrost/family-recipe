import Image from "next/image";
import {
  Camera,
  Mail,
  Lock,
  Sparkles,
  Crown,
  Users,
  ChevronRight,
  LogOut,
  Trash2,
  MapPin,
  Check,
} from "lucide-react";
import { mockViewer } from "../../mock-data";

/**
 * Homestead — Settings page.
 *
 * The signed-in cook's own account, kept in the same single warm column as
 * every other Homestead page. Each concern is a titled section that flows top
 * to bottom — profile, account, plan, families, and a restrained danger zone —
 * so settings feel like reading down a page, not hunting across tabs. The plan
 * section reuses the warm primary-tinted panel (the family's signature device)
 * for the Premium upsell, and the danger zone stays quiet until you reach it.
 *
 * Static/visual: a styled preview of the settings in the Homestead language —
 * inputs and toggles carry no handlers.
 */

const inputClasses =
  "w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring";
const labelClasses = "text-sm font-bold text-foreground";

export default function HomesteadSettings() {
  const viewer = mockViewer;
  const usagePct = Math.min(
    100,
    Math.round((viewer.recipeCount / viewer.authoredRecipeLimit) * 100),
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
          Your account
        </span>
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          Settings
        </h1>
      </div>

      {/* Profile. */}
      <SettingsSection
        title="Profile"
        description="How you appear across Family Recipe."
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                src={viewer.avatarUrl}
                alt={viewer.name}
                width={112}
                height={112}
                className="h-20 w-20 rounded-full object-cover ring-2 ring-primary/25"
              />
              <button
                type="button"
                aria-label="Change photo"
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-extrabold tracking-tight text-foreground">
                {viewer.name}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {viewer.location}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="name" className={labelClasses}>
              Display name
            </label>
            <input
              id="name"
              type="text"
              defaultValue={viewer.name}
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="bio" className={labelClasses}>
              Bio
            </label>
            <textarea
              id="bio"
              rows={3}
              defaultValue={viewer.bio}
              className={`${inputClasses} resize-y leading-relaxed`}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="location" className={labelClasses}>
              Location
            </label>
            <input
              id="location"
              type="text"
              defaultValue={viewer.location}
              className={`${inputClasses} max-w-sm`}
            />
          </div>
          <button
            type="button"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Save profile
          </button>
        </div>
      </SettingsSection>

      {/* Account. */}
      <SettingsSection
        title="Account"
        description="Sign-in details — these stay private."
      >
        <div className="flex flex-col gap-2.5">
          <Row
            icon={<Mail className="h-4 w-4 text-muted-foreground" />}
            label="Email"
            value={viewer.email}
            action="Change"
          />
          <Row
            icon={<Lock className="h-4 w-4 text-muted-foreground" />}
            label="Password"
            value="Last changed 3 months ago"
            action="Change password"
          />
        </div>
      </SettingsSection>

      {/* Plan — FREE, with the warm upsell using the signature device. */}
      <SettingsSection
        title="Plan"
        description="What your kitchen can hold."
      >
        <div className="flex flex-col gap-5">
          {/* Usage meter — recipe count against the free limit. */}
          <div className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-baseline justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-secondary-foreground">
                  Free
                </span>
                Recipes used
              </span>
              <span className="text-sm font-bold text-foreground">
                {viewer.recipeCount} / {viewer.authoredRecipeLimit} recipes
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${usagePct}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {viewer.authoredRecipeLimit - viewer.recipeCount} recipes left on
              the free plan.
            </p>
          </div>

          {/* Go Premium — the warm primary-tinted panel. */}
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-primary/5 p-6 sm:p-8">
            <Sparkles
              className="pointer-events-none absolute -right-2 top-2 h-24 w-24 -rotate-12 text-primary/10"
              aria-hidden
            />
            <div className="flex flex-col gap-1.5">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
                <Crown className="h-4 w-4 text-primary" />
                Go Premium
              </span>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                Unlimited recipes, bigger families, and a private cookbook to
                pass down. Keep every dish, with room to spare.
              </p>
            </div>
            <ul className="mt-4 flex flex-col gap-2">
              {[
                "Unlimited recipes",
                "Up to 20 family members",
                "Export your cookbook anytime",
              ].map((perk) => (
                <li
                  key={perk}
                  className="flex items-center gap-2.5 text-sm font-semibold text-foreground"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="h-3 w-3" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-5 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Sparkles className="h-4 w-4" />
              Go Premium
            </button>
          </div>
        </div>
      </SettingsSection>

      {/* Families. */}
      <SettingsSection
        title="Your families"
        description="The kitchens you cook in."
      >
        <ul className="flex flex-col gap-2.5">
          {viewer.families.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Users className="h-5 w-5" />
                </span>
                <div className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate text-sm font-bold text-foreground">
                    {f.name}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                    {f.role === "OWNER" ? (
                      <>
                        <Crown className="h-3.5 w-3.5 text-primary" /> Owner
                      </>
                    ) : (
                      "Member"
                    )}
                  </span>
                </div>
                <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>
      </SettingsSection>

      {/* Danger zone — restrained: sign out is quiet, delete is the only red. */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Danger zone
        </h2>
        <div className="flex flex-col gap-3 rounded-2xl border border-destructive/30 bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-foreground">
              Delete account
            </span>
            <span className="text-sm text-muted-foreground">
              Permanently removes your recipes, families, and profile. This
              can&apos;t be undone.
            </span>
          </div>
          <button
            type="button"
            className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-full border border-destructive/40 bg-card px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Trash2 className="h-4 w-4" />
            Delete account
          </button>
        </div>
        <button
          type="button"
          className="inline-flex w-fit items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </section>
    </div>
  );
}

/** A titled section: a bold header + muted description, then its content. */
function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

/** A single account row: icon + label/value on the left, an action on the right. */
function Row({
  icon,
  label,
  value,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  action: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
          {icon}
        </span>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <span className="truncate text-sm font-semibold text-foreground">
            {value}
          </span>
        </div>
      </div>
      <button
        type="button"
        className="inline-flex w-fit shrink-0 items-center justify-center rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {action}
      </button>
    </div>
  );
}
