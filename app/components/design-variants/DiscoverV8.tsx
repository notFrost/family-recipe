"use client";

import Image from "next/image";
import Link from "next/link";
import { Lora, IBM_Plex_Mono } from "next/font/google";
import { Search, ArrowRight } from "lucide-react";
import type { Theme } from "./theme";
import { recipes } from "./mock-recipes";

// V8 — "Larder": an archival ledger. A list, not a grid — each recipe is a row
// in a culinary index with a monospace call-number, ruled hairlines, and column
// headers. A completely different browsing paradigm, calm and reference-like.

const lora = Lora({ variable: "--font-lora", subsets: ["latin"], weight: ["400", "500", "600"] });
const mono = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500", "600"] });

function buildPalette(theme: Theme, isDark: boolean) {
  return isDark ? theme.dark : theme.light;
}
type Palette = ReturnType<typeof buildPalette>;

function Logo({ palette }: { palette: Palette }) {
  return (
    <Link href="/" className="flex items-baseline gap-2" style={{ color: palette.foreground }}>
      <span className="text-lg tracking-tight" style={{ fontFamily: "var(--font-lora), serif", fontWeight: 600 }}>
        Family Recipe
      </span>
      <span className="text-[10px] uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-mono), monospace", color: palette.muted }}>
        Index
      </span>
    </Link>
  );
}

const categories = ["All", "Italian", "Indian", "Mexican", "Thai", "Greek", "Japanese", "Breakfast"];

export default function DiscoverV8({
  isDark,
  theme,
}: {
  isDark?: boolean;
  theme: Theme;
}) {
  const palette = buildPalette(theme, isDark ?? false);

  return (
    <div
      className={`${lora.variable} ${mono.variable} flex min-h-screen flex-col transition-colors duration-300`}
      style={{
        fontFamily: "var(--font-lora), Georgia, serif",
        backgroundColor: palette.background,
        color: palette.foreground,
      }}
    >
      <style jsx global>{`
        @keyframes v8-row { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        .v8-row { animation: v8-row 0.45s ease both; }
        .v8-entry { transition: background-color 0.25s ease; }
        .v8-entry .v8-thumb { transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
        .v8-entry:hover .v8-thumb { transform: scale(1.06); }
        .v8-entry .v8-arrow { opacity: 0; transform: translateX(-4px); transition: all 0.25s ease; }
        .v8-entry:hover .v8-arrow { opacity: 1; transform: translateX(0); }
      `}</style>

      <header
        className="sticky top-0 z-50 backdrop-blur transition-colors duration-300"
        style={{ backgroundColor: `${palette.background}E6`, borderBottom: `1px solid ${palette.foreground}` }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Logo palette={palette} />
          <div className="flex items-center gap-5">
            <Link href="/login" className="hidden text-sm sm:inline" style={{ color: palette.muted, fontFamily: "var(--font-mono), monospace" }}>log in</Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-opacity duration-300 hover:opacity-90"
              style={{ backgroundColor: palette.primary, color: palette.buttonText, fontFamily: "var(--font-mono), monospace" }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Masthead */}
          <div className="v8-row mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-[0.25em]" style={{ fontFamily: "var(--font-mono), monospace", color: palette.primary }}>
                Vol. 01 — Public Collection
              </p>
              <h1 className="text-5xl leading-none tracking-tight sm:text-6xl" style={{ fontFamily: "var(--font-lora), serif", fontWeight: 600, color: palette.foreground }}>
                The Recipe Index
              </h1>
            </div>
            <form action="/discover" method="get" className="flex w-full max-w-xs items-center gap-2 px-3 py-2" style={{ border: `1px solid ${palette.foreground}` }}>
              <Search className="h-4 w-4" style={{ color: palette.primary }} />
              <input
                name="q"
                type="search"
                placeholder="search the index…"
                aria-label="Search recipes"
                className="h-7 w-full bg-transparent text-sm focus-visible:outline-none"
                style={{ color: palette.foreground, fontFamily: "var(--font-mono), monospace" }}
              />
            </form>
          </div>

          {/* Category filter row */}
          <div className="v8-row mb-6 flex flex-wrap gap-x-5 gap-y-2" style={{ animationDelay: "60ms" }}>
            {categories.map((c, i) => (
              <button
                key={c}
                type="button"
                className="text-xs uppercase tracking-[0.12em] transition-opacity hover:opacity-100"
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  color: i === 0 ? palette.primary : palette.muted,
                  opacity: i === 0 ? 1 : 0.7,
                  borderBottom: i === 0 ? `1.5px solid ${palette.primary}` : "1.5px solid transparent",
                  paddingBottom: "2px",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Column headers */}
          <div
            className="hidden grid-cols-[64px_1fr_120px_90px_40px] items-center gap-4 px-3 py-2 text-[10px] uppercase tracking-[0.18em] md:grid"
            style={{ fontFamily: "var(--font-mono), monospace", color: palette.muted, borderTop: `1.5px solid ${palette.foreground}`, borderBottom: `1px solid ${palette.border}` }}
          >
            <span>Ref.</span>
            <span>Recipe</span>
            <span>Cuisine</span>
            <span className="text-right">Time</span>
            <span />
          </div>

          {/* Ledger rows */}
          <ul>
            {recipes.map((recipe, index) => (
              <li key={recipe.id} className="v8-row" style={{ animationDelay: `${index * 45}ms` }}>
                <Link
                  href="/discover"
                  className="v8-entry grid grid-cols-[48px_1fr_40px] items-center gap-4 px-3 py-4 md:grid-cols-[64px_1fr_120px_90px_40px]"
                  style={{ borderBottom: `1px solid ${palette.border}` }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = palette.card)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <span className="text-xs tabular-nums" style={{ fontFamily: "var(--font-mono), monospace", color: palette.primary }}>
                    RC·{String(index + 1).padStart(3, "0")}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden" style={{ border: `1px solid ${palette.border}` }}>
                      <Image src={recipe.imageUrl} alt={recipe.title} fill sizes="64px" className="v8-thumb object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-lg leading-tight" style={{ fontFamily: "var(--font-lora), serif", fontWeight: 500, color: palette.foreground }}>
                        {recipe.title}
                      </h2>
                      <p className="truncate text-xs" style={{ fontFamily: "var(--font-mono), monospace", color: palette.muted }}>
                        {recipe.ingredients.length} ingredients · {recipe.steps.length} steps
                      </p>
                    </div>
                  </div>
                  <span className="hidden text-sm md:block" style={{ color: palette.muted }}>{recipe.category}</span>
                  <span className="hidden text-right text-sm tabular-nums md:block" style={{ fontFamily: "var(--font-mono), monospace", color: palette.foreground }}>
                    {recipe.minutes} min
                  </span>
                  <ArrowRight className="v8-arrow ml-auto h-4 w-4" style={{ color: palette.primary }} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer className="py-8 transition-colors duration-300" style={{ borderTop: `1.5px solid ${palette.foreground}` }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo palette={palette} />
          <p className="text-[11px] uppercase tracking-[0.18em]" style={{ fontFamily: "var(--font-mono), monospace", color: palette.muted }}>
            {recipes.length} entries · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
