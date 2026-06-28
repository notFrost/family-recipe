"use client";

import Image from "next/image";
import Link from "next/link";
import { Nunito } from "next/font/google";
import { Search, ChefHat, ListOrdered, Heart, Clock } from "lucide-react";
import type { Theme } from "./theme";
import { recipes } from "./mock-recipes";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// Cuisine categories derived from the shared mock data, in first-seen order,
// with an "All" pill leading the row. Kept in render order so the filter row
// mirrors what's actually on the page.
const categories = [
  "All",
  ...Array.from(new Set(recipes.map((r) => r.category))),
];

function buildPalette(theme: Theme, isDark: boolean) {
  const t = isDark ? theme.dark : theme.light;
  return {
    bg: t.background,
    text: t.foreground,
    muted: t.muted,
    subtle: t.muted,
    card: t.card,
    header: t.card,
    border: t.border,
    navHover: t.border,
    chipBg: `${t.primary}14`,
    primary: t.primary,
    secondary: t.secondary,
    buttonText: t.buttonText,
    // Glassy pills laid over the photo, plus the gradient scrim beneath them.
    // In dark mode the scrim is darker so light type stays legible.
    pillGlass: isDark ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.78)",
    pillText: isDark ? "#ffffff" : t.foreground,
    scrim: isDark ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.42)",
  };
}

type Palette = ReturnType<typeof buildPalette>;

function Logo({ palette }: { palette: Palette }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 text-xl font-bold tracking-tight transition-colors duration-300"
      style={{ fontFamily: "var(--font-nunito), system-ui, sans-serif", color: palette.text }}
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-xl text-base transition-colors duration-300"
        style={{ backgroundColor: palette.primary, color: palette.buttonText }}
      >
        🍽️
      </span>
      Family Recipe
    </Link>
  );
}

function MediaPill({
  palette,
  icon,
  children,
}: {
  palette: Palette;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span
      className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md transition-colors duration-300"
      style={{ backgroundColor: palette.pillGlass, color: palette.pillText }}
    >
      {icon}
      {children}
    </span>
  );
}

export default function DiscoverV10({
  isDark,
  theme,
}: {
  isDark?: boolean;
  theme: Theme;
}) {
  const palette = buildPalette(theme, isDark ?? false);

  return (
    <div
      className={`${nunito.variable} flex min-h-screen flex-col transition-colors duration-300`}
      style={{
        fontFamily: "var(--font-nunito), system-ui, sans-serif",
        backgroundColor: palette.bg,
        color: palette.text,
      }}
    >
      <style jsx global>{`
        @keyframes v10-reveal {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .v10-fade {
          animation: v10-reveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>

      <header
        className="sticky top-0 z-50 shadow-sm backdrop-blur transition-colors duration-300"
        style={{ backgroundColor: `${palette.header}CC` }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-b-2xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Logo palette={palette} />
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/discover"
                className="rounded-full px-3 py-1.5 text-sm font-semibold transition-colors duration-300"
                style={{ color: palette.text }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = palette.navHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Discover
              </Link>
              <Link
                href="/families"
                className="rounded-full px-3 py-1.5 text-sm font-semibold transition-colors duration-300"
                style={{ color: palette.text }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = palette.navHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Families
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors duration-300 hover:brightness-95 sm:inline-flex"
              style={{ borderColor: palette.primary, color: palette.text }}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full px-4 py-2 text-sm font-semibold shadow-md transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: palette.primary, color: palette.buttonText }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="relative flex-1">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">
          <div className="v10-fade mb-7 text-center">
            <p
              className="text-sm font-bold uppercase tracking-[0.2em] transition-colors duration-300"
              style={{ color: palette.primary }}
            >
              From our kitchen to yours
            </p>
            <h1
              className="mt-3 text-4xl font-bold tracking-tight transition-colors duration-300 sm:text-5xl"
              style={{ color: palette.text }}
            >
              Gather round the table
            </h1>
            <p
              className="mx-auto mt-4 max-w-xl text-base leading-relaxed transition-colors duration-300"
              style={{ color: palette.muted }}
            >
              Tried-and-true dishes passed down through family kitchens — the
              kind that fill the house with warmth and bring everyone back for
              seconds.
            </p>
          </div>

          <form
            action="/discover"
            method="get"
            className="v10-fade mx-auto flex w-full max-w-lg items-center gap-2 rounded-full border p-1.5 shadow-sm transition-colors duration-300"
            style={{ borderColor: palette.border, backgroundColor: palette.card }}
          >
            <label htmlFor="v10-q" className="sr-only">
              Search recipes
            </label>
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-300"
                style={{ color: palette.primary }}
              />
              <input
                id="v10-q"
                name="q"
                type="search"
                placeholder="Search recipes…"
                className="h-11 w-full rounded-full border-0 bg-transparent pl-11 pr-4 text-sm transition-colors duration-300 placeholder:transition-colors placeholder:duration-300 focus-visible:outline-none"
                style={{ color: palette.text }}
              />
            </div>
            <button
              type="submit"
              className="h-11 rounded-full px-6 text-sm font-semibold transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: palette.primary, color: palette.buttonText }}
            >
              Search
            </button>
          </form>

          <div className="v10-fade mt-5 flex flex-wrap items-center justify-center gap-2">
            {categories.map((category, index) => {
              const active = index === 0;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  className="rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-300 hover:scale-105"
                  style={
                    active
                      ? { backgroundColor: palette.primary, color: palette.buttonText }
                      : { backgroundColor: palette.chipBg, color: palette.primary }
                  }
                >
                  {category}
                </button>
              );
            })}
          </div>

          <p
            className="v10-fade mb-9 mt-6 text-center text-sm font-semibold transition-colors duration-300"
            style={{ color: palette.muted }}
          >
            {recipes.length} recipes from home cooks
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((recipe, index) => (
              <article
                key={recipe.id}
                className="v10-fade group flex flex-col overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                style={{ backgroundColor: palette.card, animationDelay: `${80 + index * 60}ms` }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    aria-label={`Save ${recipe.title}`}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-all duration-300 hover:scale-110"
                    style={{ backgroundColor: palette.card, color: palette.primary }}
                  >
                    <Heart className="h-4 w-4" />
                  </button>

                  {/* Soft bottom scrim keeps the glassy pills legible over any photo. */}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
                    style={{
                      background: `linear-gradient(to top, ${palette.scrim} 0%, transparent 100%)`,
                    }}
                  />
                  <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center gap-1.5">
                    <MediaPill palette={palette} icon={<ChefHat className="h-3.5 w-3.5" />}>
                      {recipe.ingredients.length} ingredients
                    </MediaPill>
                    <MediaPill palette={palette} icon={<ListOrdered className="h-3.5 w-3.5" />}>
                      {recipe.steps.length} steps
                    </MediaPill>
                    <MediaPill palette={palette} icon={<Clock className="h-3.5 w-3.5" />}>
                      {recipe.minutes} min
                    </MediaPill>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h2
                    className="text-lg font-bold leading-snug transition-colors duration-300"
                    style={{ color: palette.text }}
                  >
                    {recipe.title}
                  </h2>
                  <p
                    className="mt-2 line-clamp-2 text-sm leading-relaxed transition-colors duration-300"
                    style={{ color: palette.muted }}
                  >
                    {recipe.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <footer
        className="py-12 transition-colors duration-300"
        style={{ backgroundColor: palette.card, color: palette.text }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
            <div>
              <Logo palette={palette} />
              <p
                className="mt-3 max-w-xs text-sm leading-relaxed transition-colors duration-300"
                style={{ color: palette.muted }}
              >
                Store your family recipes, discover new ones, and keep your
                family&apos;s cooking together.
              </p>
            </div>
            <nav
              className="flex flex-wrap gap-6 text-sm font-semibold transition-colors duration-300"
              style={{ color: palette.muted }}
            >
              <Link href="/about" className="transition-colors duration-300 hover:text-[inherit]" style={{ color: palette.muted }}>
                About
              </Link>
              <Link href="/discover" className="transition-colors duration-300 hover:text-[inherit]" style={{ color: palette.muted }}>
                Discover
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-300 hover:text-[inherit]"
                style={{ color: palette.muted }}
              >
                GitHub
              </a>
            </nav>
          </div>
          <div
            className="mt-10 border-t pt-6 text-xs transition-colors duration-300"
            style={{ borderColor: palette.border, color: palette.subtle }}
          >
            © {new Date().getFullYear()} Family Recipe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
