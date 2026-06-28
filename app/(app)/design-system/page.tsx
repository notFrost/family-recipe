import { ArrowRight, ChefHat, ListOrdered, Plus, Search } from "lucide-react";
import RecipeCard from "@/app/components/RecipeCard";
import type { Recipe } from "@/app/lib/types";

export const metadata = {
  title: "Design System · Family Recipe",
};

const sampleRecipe: Recipe = {
  id: "sample",
  title: "Margherita Pizza",
  imageUrl:
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80&auto=format&fit=crop",
  description:
    "A classic Neapolitan pizza with a blistered crust, San Marzano tomatoes, fresh mozzarella, and basil.",
  ingredients: ["a", "b", "c", "d", "e", "f"],
  steps: ["1", "2", "3", "4", "5"],
  authorId: "user-1",
  authorName: "Demo Cook",
  visibility: "PUBLIC",
  familyId: null,
  createdAt: "2026-01-01T00:00:00.000Z",
};

const swatches: { name: string; cls: string; ring?: boolean }[] = [
  { name: "background", cls: "bg-background", ring: true },
  { name: "foreground", cls: "bg-foreground" },
  { name: "card", cls: "bg-card", ring: true },
  { name: "primary", cls: "bg-primary" },
  { name: "secondary", cls: "bg-secondary" },
  { name: "muted", cls: "bg-muted" },
  { name: "accent", cls: "bg-accent" },
  { name: "muted-foreground", cls: "bg-muted-foreground" },
  { name: "border", cls: "bg-border" },
  { name: "destructive", cls: "bg-destructive" },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="flex flex-col gap-14">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
          Family Recipe
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Design System
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
          The warm &ldquo;Amber&rdquo; visual language — colors, type, and the
          components that build the app. Flip the theme toggle in the header to
          see everything in Mocha dark.
        </p>
      </header>

      <Section title="Colors">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {swatches.map((s) => (
            <div key={s.name} className="flex flex-col gap-2">
              <div
                className={`h-16 w-full rounded-xl ${s.cls} ${
                  s.ring ? "ring-1 ring-inset ring-border" : ""
                }`}
              />
              <span className="font-mono text-xs text-muted-foreground">
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography — Nunito">
        <div className="flex flex-col gap-4 rounded-2xl bg-card p-8 shadow-md">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Eyebrow / label
          </p>
          <p className="text-5xl font-bold tracking-tight text-foreground">
            Gather round the table
          </p>
          <p className="text-3xl font-bold tracking-tight text-foreground">
            Heading — a cozy welcome
          </p>
          <p className="text-xl font-bold text-foreground">
            Subheading for sections
          </p>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            Body copy in Nunito. Tried-and-true dishes passed down through family
            kitchens — the kind that fill the house with warmth and bring
            everyone back for seconds.
          </p>
          <p className="text-sm font-semibold text-muted-foreground">
            Small / caption text
          </p>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-card p-8 shadow-md">
          <button className="group inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            Sign up
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:scale-105">
            Search
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-md">
            <Plus className="h-4 w-4" /> Add recipe
          </button>
          <button className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            Log in (ghost)
          </button>
          <button className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            Sign out (outline)
          </button>
        </div>
      </Section>

      <Section title="Pills & badges">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-card p-8 shadow-md">
          <span className="rounded-full bg-primary px-3.5 py-1.5 text-sm font-semibold text-primary-foreground">
            Active
          </span>
          <span className="rounded-full bg-primary/10 px-3.5 py-1.5 text-sm font-semibold text-primary">
            Inactive
          </span>
          <span className="flex items-center gap-1 rounded-full bg-stone-900/80 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-md">
            <ChefHat className="h-3 w-3" /> 6
          </span>
          <span className="flex items-center gap-1 rounded-full bg-stone-900/80 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-md">
            <ListOrdered className="h-3 w-3" /> 5
          </span>
        </div>
      </Section>

      <Section title="Inputs">
        <div className="rounded-2xl bg-card p-8 shadow-md">
          <div className="flex w-full max-w-lg items-center gap-2 rounded-full border border-border bg-background p-1.5 shadow-sm">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <input
                type="search"
                placeholder="Search recipes…"
                className="h-11 w-full rounded-full border-0 bg-transparent pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
              />
            </div>
            <button className="h-11 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground">
              Search
            </button>
          </div>
        </div>
      </Section>

      <Section title="Recipe card">
        <div className="max-w-xs">
          <RecipeCard recipe={sampleRecipe} />
        </div>
      </Section>

      <Section title="Doodle wallpaper">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The faint food-doodle pattern behind this page is a single tiled SVG
          (<span className="font-mono text-xs">DoodleField</span>) that inherits
          the foreground color and dims with opacity, so it adapts to light and
          dark automatically.
        </p>
      </Section>
    </div>
  );
}
