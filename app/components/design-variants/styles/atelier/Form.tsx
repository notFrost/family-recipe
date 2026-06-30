import Image from "next/image";
import {
  ArrowLeft,
  Clock,
  ChefHat,
  ListOrdered,
  Plus,
  X,
  Globe,
  Users,
  Lock,
  Link2,
  Sparkles,
} from "lucide-react";
import { mockRecipe, mockFamily } from "../../mock-data";

/**
 * Atelier · New recipe — a structured editor with a live spec sheet beside it.
 *
 * The form is the workstation, the rail is the reference: form fields fill the
 * main LEFT column (title, description, total time, optional source + story,
 * visibility, family, then ingredients and steps), while a sticky RIGHT rail
 * shows the recipe as the card it will become — image, title, meta pills — plus
 * the "Create recipe" button, so the result stays in view as you fill the form.
 * The rail reuses StickyCookRail's sticky pattern (lg:sticky lg:top-20 + capped
 * scrollable height). Static preview: fields show representative values, not a
 * live binding. On mobile the rail un-sticks and drops below the form.
 */
export default function AtelierForm() {
  const r = mockRecipe;

  // Representative pre-filled values so the spec sheet reads as a real draft.
  const draftTitle = r.title;
  const draftMinutes = r.totalMinutes;
  const draftSource = r.sourceName ?? "";
  const draftIngredients = r.ingredients.slice(0, 4);
  const draftSteps = r.steps.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        className="inline-flex w-fit items-center gap-1.5 rounded-full text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to discover
      </button>

      <div>
        <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground">
          New recipe
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Write it down the way you&apos;d hand it to family.
        </p>
      </div>

      {/* Main editor on the left, spec-sheet rail on the right. The form is the
          wide column so generously-set fields and step rows get room. */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:gap-10">
        {/* ── LEFT: the form ─────────────────────────────────────────── */}
        <div className="flex min-w-0 flex-col gap-8">
          <Section title="The basics" hint="What it is and how long it takes.">
            <Field label="Title">
              <input
                type="text"
                defaultValue={draftTitle}
                placeholder="e.g. Roasted Tomato Soup"
                className={inputClasses}
              />
            </Field>

            <Field label="Description">
              <textarea
                rows={3}
                defaultValue={r.description}
                placeholder="A short summary of the dish."
                className={`${inputClasses} resize-y`}
              />
            </Field>

            <Field label="Total time" hint="In minutes — shown as a badge.">
              <div className="relative max-w-[12rem]">
                <Clock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="number"
                  min={0}
                  defaultValue={draftMinutes}
                  placeholder="45"
                  className={`${inputClasses} pl-10`}
                />
              </div>
            </Field>
          </Section>

          <Divider />

          <Section
            title="The story"
            hint="Optional — the part a search engine can't give you."
          >
            <Field label="Originally from" optional>
              <input
                type="text"
                defaultValue={draftSource}
                placeholder="e.g. Grandma Nkechi"
                className={inputClasses}
              />
            </Field>

            <Field label="The story behind it" optional>
              <textarea
                rows={4}
                defaultValue={r.story ?? ""}
                placeholder="When you make it, who it came from, why it matters."
                className={`${inputClasses} resize-y`}
              />
            </Field>
          </Section>

          <Divider />

          <Section
            title="Who can see it"
            hint="Choose where this recipe lives."
          >
            <Field label="Visibility">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <VisibilityChoice
                  icon={<Lock className="h-4 w-4" />}
                  name="Private"
                  desc="Only you"
                />
                <VisibilityChoice
                  icon={<Users className="h-4 w-4" />}
                  name="Family"
                  desc="A family you're in"
                  selected
                />
                <VisibilityChoice
                  icon={<Globe className="h-4 w-4" />}
                  name="Public"
                  desc="Shown on Discover"
                />
                <VisibilityChoice
                  icon={<Link2 className="h-4 w-4" />}
                  name="Unlisted"
                  desc="Viewable by link"
                />
              </div>
            </Field>

            <Field label="Family">
              <div className="relative">
                <select
                  defaultValue={mockFamily.name}
                  className={`${inputClasses} appearance-none pr-10`}
                >
                  <option>{mockFamily.name}</option>
                  <option>Sunday Supper Club</option>
                </select>
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ▾
                </span>
              </div>
            </Field>
          </Section>

          <Divider />

          {/* Ingredients — labelled rows in a bordered ledger. */}
          <Section
            title="Ingredients"
            hint={`${draftIngredients.length} so far`}
          >
            <ul className="flex flex-col gap-2">
              {draftIngredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    defaultValue={
                      ing.amount ? `${ing.amount} ${ing.item}` : ing.item
                    }
                    placeholder={`Ingredient ${i + 1}`}
                    className={inputClasses}
                  />
                  <button
                    type="button"
                    aria-label={`Remove ingredient ${i + 1}`}
                    className={iconButtonClasses}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            <AddButton>Add ingredient</AddButton>
          </Section>

          <Divider />

          {/* Steps — numbered cards, matching the recipe page's method. */}
          <Section title="Method" hint={`${draftSteps.length} steps`}>
            <ol className="flex flex-col gap-2.5">
              {draftSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground shadow-sm">
                    {i + 1}
                  </span>
                  <textarea
                    rows={2}
                    defaultValue={step}
                    placeholder={`Step ${i + 1}`}
                    className={`${inputClasses} resize-y`}
                  />
                  <button
                    type="button"
                    aria-label={`Remove step ${i + 1}`}
                    className={`${iconButtonClasses} mt-1`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ol>
            <AddButton>Add step</AddButton>
          </Section>
        </div>

        {/* ── RIGHT: the live spec sheet ─────────────────────────────── */}
        <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1">
          <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 shadow-md">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              Preview
            </span>

            {/* The card this recipe will become. */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted">
              <Image
                src={r.imageUrl}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 340px"
                className="object-cover"
              />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-stone-900 backdrop-blur-md dark:bg-black/45 dark:text-white">
                {r.cuisine}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl font-extrabold leading-tight tracking-tight text-foreground">
                {draftTitle}
              </h2>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-secondary-foreground">
                <Users className="h-3 w-3" />
                Family · {mockFamily.name}
              </span>
            </div>

            {/* At-a-glance meta, on the same hairline-divided grid the recipe
                rail uses. */}
            <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
              <SpecCell
                icon={<ChefHat className="h-4 w-4" />}
                value={`${draftIngredients.length}`}
                label="items"
              />
              <SpecCell
                icon={<ListOrdered className="h-4 w-4" />}
                value={`${draftSteps.length}`}
                label="steps"
              />
              <SpecCell
                icon={<Clock className="h-4 w-4" />}
                value={`${draftMinutes}`}
                label="min"
              />
            </dl>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              <Plus className="h-4 w-4" />
              Create recipe
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              Cancel
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ── Shared field primitives (Atelier form vocabulary) ──────────────── */

const inputClasses =
  "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring";

const iconButtonClasses =
  "grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-extrabold tracking-tight text-foreground">
          {title}
        </h2>
        {hint ? (
          <span className="text-sm font-semibold text-muted-foreground">
            {hint}
          </span>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <label className="text-sm font-semibold text-foreground">{label}</label>
        {optional ? (
          <span className="text-xs font-medium text-muted-foreground">
            optional
          </span>
        ) : null}
      </div>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-border" />;
}

function AddButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Plus className="h-4 w-4" />
      {children}
    </button>
  );
}

function VisibilityChoice({
  icon,
  name,
  desc,
  selected,
}: {
  icon: React.ReactNode;
  name: string;
  desc: string;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        selected
          ? "border-primary/40 bg-primary/10"
          : "border-border bg-background hover:bg-accent"
      }`}
    >
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        {icon}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-bold text-foreground">{name}</span>
        <span className="truncate text-xs text-muted-foreground">{desc}</span>
      </span>
    </button>
  );
}

function SpecCell({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 bg-card px-2 py-3 text-center">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-base font-extrabold leading-none text-foreground">
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
