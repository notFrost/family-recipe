"use client";

import Image from "next/image";
import Link from "next/link";
import { Archivo } from "next/font/google";
import { Search, Flame, ArrowUpRight } from "lucide-react";
import type { Theme } from "./theme";
import { recipes } from "./mock-recipes";

// V9 — "Spread": an energetic food-magazine cover. Image-forward with type set
// over photography, a full-bleed featured story, oversized condensed headlines,
// and a punchy asymmetric grid. A completely new, louder direction.

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

function buildPalette(theme: Theme, isDark: boolean) {
  return isDark ? theme.dark : theme.light;
}
type Palette = ReturnType<typeof buildPalette>;

function Logo({ palette }: { palette: Palette }) {
  return (
    <Link
      href="/"
      className="text-xl font-black uppercase tracking-tight"
      style={{ fontFamily: "var(--font-archivo), sans-serif", color: palette.foreground }}
    >
      Family<span style={{ color: palette.primary }}>Recipe</span>
    </Link>
  );
}

function OverlayCard({
  recipe,
  palette,
  big,
  index,
}: {
  recipe: (typeof recipes)[number];
  palette: Palette;
  big?: boolean;
  index: number;
}) {
  return (
    <Link
      href="/discover"
      className="v9-card group relative flex overflow-hidden rounded-3xl"
      style={{ minHeight: big ? 360 : 240, animationDelay: `${index * 70}ms` }}
    >
      <Image
        src={recipe.imageUrl}
        alt={recipe.title}
        fill
        sizes={big ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 100vw, 33vw"}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.05) 100%)" }} />
      <span
        className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
        style={{ backgroundColor: palette.primary, color: palette.buttonText }}
      >
        {recipe.category}
      </span>
      <div className="relative z-10 mt-auto p-5">
        <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white/80" style={{ fontFamily: "var(--font-archivo), sans-serif" }}>
          <Flame className="h-3.5 w-3.5" /> {recipe.minutes} min · {recipe.ingredients.length} ingredients
        </div>
        <h2
          className={`font-black uppercase leading-[0.95] text-white ${big ? "text-4xl sm:text-5xl" : "text-2xl"}`}
          style={{ fontFamily: "var(--font-archivo), sans-serif" }}
        >
          {recipe.title}
        </h2>
        {big && (
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">{recipe.description}</p>
        )}
      </div>
      <span
        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100"
        style={{ backgroundColor: palette.background, color: palette.foreground }}
      >
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

export default function DiscoverV9({
  isDark,
  theme,
}: {
  isDark?: boolean;
  theme: Theme;
}) {
  const palette = buildPalette(theme, isDark ?? false);
  const [hero, ...others] = recipes;
  const sideTwo = others.slice(0, 2);
  const gridRest = others.slice(2);

  return (
    <div
      className={`${archivo.variable} flex min-h-screen flex-col transition-colors duration-300`}
      style={{
        fontFamily: "var(--font-archivo), system-ui, sans-serif",
        backgroundColor: palette.background,
        color: palette.foreground,
      }}
    >
      <style jsx global>{`
        @keyframes v9-pop { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .v9-card { animation: v9-pop 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .v9-card { transition: transform 0.3s ease; }
        .v9-card:hover { transform: translateY(-4px); }
      `}</style>

      <header
        className="sticky top-0 z-50 backdrop-blur transition-colors duration-300"
        style={{ backgroundColor: `${palette.background}E6`, borderBottom: `2px solid ${palette.foreground}` }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Logo palette={palette} />
          <nav className="hidden items-center gap-7 text-sm font-bold uppercase tracking-wide md:flex">
            <Link href="/discover" style={{ color: palette.foreground }}>Discover</Link>
            <Link href="/families" style={{ color: palette.muted }}>Families</Link>
          </nav>
          <Link
            href="/signup"
            className="rounded-full px-5 py-2 text-sm font-bold uppercase tracking-wide transition-transform duration-300 hover:scale-105"
            style={{ backgroundColor: palette.primary, color: palette.buttonText }}
          >
            Join
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Masthead */}
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: palette.primary }}>
                Issue 27 · This week&apos;s table
              </p>
              <h1 className="text-6xl font-black uppercase leading-[0.85] tracking-tighter sm:text-8xl" style={{ color: palette.foreground }}>
                Discover
              </h1>
            </div>
            <form
              action="/discover"
              method="get"
              className="flex w-full max-w-sm items-center gap-2 rounded-full px-4 py-2"
              style={{ border: `2px solid ${palette.foreground}` }}
            >
              <Search className="h-4 w-4" style={{ color: palette.primary }} />
              <input
                name="q"
                type="search"
                placeholder="WHAT'S COOKING?"
                aria-label="Search recipes"
                className="h-9 w-full bg-transparent text-sm font-semibold uppercase tracking-wide focus-visible:outline-none placeholder:opacity-60"
                style={{ color: palette.foreground }}
              />
            </form>
          </div>

          {/* Hero + side two */}
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <OverlayCard recipe={hero} palette={palette} big index={0} />
            </div>
            <div className="grid gap-5">
              {sideTwo.map((r, i) => (
                <OverlayCard key={r.id} recipe={r} palette={palette} index={i + 1} />
              ))}
            </div>
          </div>

          {/* Rule */}
          <div className="my-10 flex items-center gap-4">
            <span className="text-sm font-black uppercase tracking-[0.2em]" style={{ color: palette.foreground }}>More to cook</span>
            <span className="h-0.5 flex-1" style={{ backgroundColor: palette.foreground }} />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gridRest.map((r, i) => (
              <OverlayCard key={r.id} recipe={r} palette={palette} index={i + 3} />
            ))}
          </div>
        </div>
      </main>

      <footer className="py-10 transition-colors duration-300" style={{ borderTop: `2px solid ${palette.foreground}` }}>
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <Logo palette={palette} />
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: palette.muted }}>
            © {new Date().getFullYear()} Family Recipe — printed fresh daily
          </p>
        </div>
      </footer>
    </div>
  );
}
