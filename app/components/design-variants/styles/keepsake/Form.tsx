import {
  ImagePlus,
  Clock,
  Plus,
  GripVertical,
  Globe,
  Users,
  Lock,
  Check,
  PenLine,
} from "lucide-react";
import { Eyebrow, Fold } from "./_kit";

/**
 * Keepsake · Form — writing a new recipe onto a fresh card.
 *
 * The "new recipe" page styled as filling out a recipe card by hand: one
 * centered, framed sheet, fields introduced by the same accent eyebrow used as
 * section labels everywhere else, and the optional "story" field given warm,
 * inviting presence (it's the soul, but never required). Static visual only —
 * inputs carry placeholder hints, not wiring.
 */
export default function KeepsakeForm() {
  return (
    <form className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 pb-8">
      <header className="flex flex-col items-center gap-2 text-center">
        <Eyebrow>A new card for the book</Eyebrow>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Write a recipe
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Fill it in the way you&apos;d hand it to family — the measurements, the
          method, and the memory behind it.
        </p>
      </header>

      {/* The card. */}
      <div className="flex w-full flex-col gap-7 rounded-[1.75rem] border border-border bg-card p-6 shadow-sm sm:p-9">
        {/* Photo well. */}
        <Field label="Photo">
          <button
            type="button"
            className="flex aspect-[5/2] w-full flex-col items-center justify-center gap-2 rounded-[1.25rem] border-2 border-dashed border-input bg-secondary/40 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ImagePlus className="h-7 w-7 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Add a photo of the finished dish
            </span>
            <span className="text-xs">JPG or PNG, up to 8&nbsp;MB</span>
          </button>
        </Field>

        <Field label="Title">
          <Input placeholder="e.g. Grandma's Sunday stew" defaultValue="Chicken Tikka Masala" />
        </Field>

        <Field label="Description">
          <Textarea
            rows={3}
            placeholder="A line or two about what makes it special."
            defaultValue="Charred, yogurt-marinated chicken folded into a glossy tomato-cream sauce — weeknight-friendly, but it tastes like a celebration."
          />
        </Field>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
          <Field label="Total time">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="50"
              defaultValue="50"
              icon={<Clock className="h-4 w-4" />}
              suffix="minutes"
            />
          </Field>
          <Field label="Originally from" optional>
            <Input placeholder="Who handed it down?" defaultValue="Grandma Nkechi" />
          </Field>
        </div>

        {/* The story — the soul, gently optional. */}
        <Field
          label="The story"
          optional
          hint="The memory behind the dish — who made it, when, why it stuck. This is what turns a recipe into a keepsake."
        >
          <div className="relative">
            <PenLine className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-primary" aria-hidden />
            <textarea
              rows={4}
              defaultValue="She made this whenever someone came home from a long trip — the smell of it at the door was how you knew you'd been missed."
              placeholder="She never measured a thing…"
              className="w-full resize-none rounded-[1.25rem] border border-primary/30 bg-primary/[0.06] py-3.5 pl-11 pr-4 text-base italic leading-relaxed text-foreground placeholder:not-italic placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          </div>
        </Field>

        <Fold />

        {/* Ingredients. */}
        <Field label="Ingredients">
          <div className="flex flex-col gap-2.5">
            {[
              { amount: "600 g", item: "chicken thighs, bite-size" },
              { amount: "200 g", item: "plain whole-milk yogurt" },
              { amount: "2 tbsp", item: "tikka masala spice blend" },
            ].map((ing, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <input
                  defaultValue={ing.amount}
                  placeholder="amt"
                  className="w-24 shrink-0 rounded-2xl border border-input bg-secondary/40 px-3 py-2.5 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                />
                <input
                  defaultValue={ing.item}
                  placeholder="ingredient"
                  className="flex-1 rounded-2xl border border-input bg-secondary/40 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                />
              </div>
            ))}
            <AddRow>Add ingredient</AddRow>
          </div>
        </Field>

        {/* Steps. */}
        <Field label="Method">
          <div className="flex flex-col gap-2.5">
            {[
              "Marinate the chicken in yogurt and half the spice blend; rest at least an hour.",
              "Sear in batches over high heat until charred at the edges.",
            ].map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-input bg-secondary/40 p-3"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <textarea
                  rows={2}
                  defaultValue={step}
                  className="flex-1 resize-none border-0 bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-0"
                />
                <GripVertical className="mt-1.5 h-4 w-4 shrink-0 text-muted-foreground/60" aria-hidden />
              </div>
            ))}
            <AddRow>Add step</AddRow>
          </div>
        </Field>

        <Fold />

        {/* Visibility. */}
        <Field label="Who can see it">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <Visibility icon={<Globe className="h-4 w-4" />} title="Public" sub="Anyone can find it" />
            <Visibility icon={<Users className="h-4 w-4" />} title="Family" sub="Only your families" selected />
            <Visibility icon={<Lock className="h-4 w-4" />} title="Private" sub="Just you" />
          </div>
        </Field>
      </div>

      {/* Save. */}
      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-base font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Check className="h-5 w-5" />
        Create recipe
      </button>
      <p className="-mt-3 text-xs text-muted-foreground">
        You can keep editing after it&apos;s saved.
      </p>
    </form>
  );
}

/* Form-specific field primitives, built on the shared Keepsake vocabulary
 * (the Eyebrow label, the soft secondary fills, the framed radii). */

function Field({
  label,
  optional = false,
  hint,
  children,
}: {
  label: string;
  optional?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <Eyebrow>{label}</Eyebrow>
        {optional ? (
          <span className="text-[0.7rem] font-medium italic text-muted-foreground">
            optional
          </span>
        ) : null}
      </div>
      {hint ? (
        <p className="-mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {children}
    </div>
  );
}

function Input({
  icon,
  suffix,
  ...props
}: {
  icon?: React.ReactNode;
  suffix?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative flex items-center">
      {icon ? (
        <span className="pointer-events-none absolute left-4 text-primary">
          {icon}
        </span>
      ) : null}
      <input
        {...props}
        className={`w-full rounded-2xl border border-input bg-secondary/40 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${icon ? "pl-11" : "pl-4"} ${suffix ? "pr-20" : "pr-4"}`}
      />
      {suffix ? (
        <span className="pointer-events-none absolute right-4 text-xs font-semibold text-muted-foreground">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full resize-none rounded-2xl border border-input bg-secondary/40 px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    />
  );
}

function AddRow({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex w-fit items-center gap-1.5 rounded-full border border-dashed border-input px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Plus className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}

function Visibility({
  icon,
  title,
  sub,
  selected = false,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`flex flex-col items-center gap-1 rounded-2xl border px-3 py-3 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        selected
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-input bg-secondary/40 text-foreground hover:bg-secondary/70"
      }`}
    >
      <span className={selected ? "text-primary" : "text-muted-foreground"}>
        {icon}
      </span>
      <span className="text-sm font-bold">{title}</span>
      <span className="text-[0.7rem] text-muted-foreground">{sub}</span>
    </button>
  );
}
