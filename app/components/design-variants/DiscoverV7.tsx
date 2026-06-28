"use client";

import Image from "next/image";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";
import { ArrowUpRight, Search } from "lucide-react";
import type { Theme } from "./theme";
import { recipes } from "./mock-recipes";

// V7 — "Atelier": a crisp, modern editorial. Asymmetric layout, oversized index
// numbers, hairline rules, and a horizontal featured rail. Confident whitespace
// instead of glass and blur. My take on "Modern".

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500", "600"] });

function buildPalette(theme: Theme, isDark: boolean) {
  return isDark ? theme.dark : theme.light;
}
type Palette = ReturnType<typeof buildPalette>;

function Logo({ palette }: { palette: Palette }) {
  return (
    <Link
      href="/"
      className="text-lg font-bold tracking-tight"
      style={{ fontFamily: "var(--font-grotesk), sans-serif", color: palette.foreground }}
    >
      Family<span style={{ color: palette.primary }}>·</span>Recipe
    </Link>
  );
}

export default function DiscoverV7({
  isDark,
  theme,
}: {
  isDark?: boolean;
  theme: Theme;
}) {
  const palette = buildPalette(theme, isDark ?? false);
  const featured = recipes.slice(0, 3);
  const grid = recipes.slice(3);

  return (
    <div
      className={`${grotesk.variable} ${inter.variable} flex min-h-screen flex-col transition-colors duration-300`}
      style={{
        fontFamily: "var(--font-inter), system-ui, sans-serif",
        backgroundColor: palette.background,
        color: palette.foreground,
      }}
    >
      <style jsx global>{`
        @keyframes v7-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .v7-in { animation: v7-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .v7-link { background-image: linear-gradient(currentColor, currentColor); background-size: 0% 1.5px; background-position: 0 100%; background-repeat: no-repeat; transition: background-size 0.3s ease; }
        .v7-link:hover { background-size: 100% 1.5px; }
      `}</style>

      <header
        className="sticky top-0 z-50 backdrop-blur transition-colors duration-300"
        style={{ backgroundColor: `${palette.background}D9`, borderBottom: `1px solid ${palette.border}` }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Logo palette={palette} />
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex" style={{ fontFamily: "var(--font-grotesk), sans-serif" }}>
            <Link href="/discover" className="v7-link" style={{ color: palette.foreground }}>Discover</Link>
            <Link href="/families" className="v7-link" style={{ color: palette.muted }}>Families</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden text-sm font-medium sm:inline" style={{ color: palette.muted }}>Log in</Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1 rounded-none px-4 py-2 text-sm font-semibold transition-transform duration-300 hover:translate-x-0.5"
              style={{ backgroundColor: palette.primary, color: palette.buttonText, fontFamily: "var(--font-grotesk), sans-serif" }}
            >
              Sign up <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <section className="v7-in grid gap-6 py-16 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: palette.primary, fontFamily: "var(--font-grotesk), sans-serif" }}>
                The Discover Edit
              </p>
              <h1
                className="text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl"
                style={{ fontFamily: "var(--font-grotesk), sans-serif", color: palette.foreground }}
              >
                Good food,<br />well indexed.
              </h1>
            </div>
            <div className="md:col-span-4 md:pb-2">
              <p className="text-sm leading-relaxed" style={{ color: palette.muted }}>
                A curated index of public recipes from family kitchens — browse the edit, then make it yours.
              </p>
              <form action="/discover" method="get" className="mt-5 flex items-center gap-3" style={{ borderBottom: `1.5px solid ${palette.foreground}` }}>
                <Search className="h-4 w-4" style={{ color: palette.primary }} />
                <input
                  name="q"
                  type="search"
                  placeholder="Search…"
                  aria-label="Search recipes"
                  className="h-10 w-full bg-transparent text-sm focus-visible:outline-none"
                  style={{ color: palette.foreground }}
                />
              </form>
            </div>
          </section>

          {/* Featured rail */}
          <section className="v7-in border-t py-12" style={{ borderColor: palette.border, animationDelay: "80ms" }}>
            <div className="grid gap-px overflow-hidden md:grid-cols-3" style={{ backgroundColor: palette.border }}>
              {featured.map((recipe, i) => (
                <Link
                  key={recipe.id}
                  href="/discover"
                  className="group flex flex-col p-6 transition-colors duration-300"
                  style={{ backgroundColor: palette.background }}
                >
                  <div className="mb-5 flex items-start justify-between">
                    <span className="text-5xl font-bold leading-none" style={{ fontFamily: "var(--font-grotesk), sans-serif", color: palette.border }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: palette.primary }} />
                  </div>
                  <div className="relative mb-4 aspect-[3/2] w-full overflow-hidden">
                    <Image src={recipe.imageUrl} alt={recipe.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: palette.primary, fontFamily: "var(--font-grotesk), sans-serif" }}>
                    {recipe.category} · {recipe.minutes} min
                  </span>
                  <h2 className="mt-1.5 text-xl font-semibold leading-snug" style={{ fontFamily: "var(--font-grotesk), sans-serif", color: palette.foreground }}>
                    {recipe.title}
                  </h2>
                </Link>
              ))}
            </div>
          </section>

          {/* Index grid */}
          <section className="v7-in border-t pb-20 pt-12" style={{ borderColor: palette.border, animationDelay: "140ms" }}>
            <div className="mb-8 flex items-baseline justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: palette.muted, fontFamily: "var(--font-grotesk), sans-serif" }}>
                All recipes
              </h3>
              <span className="text-sm" style={{ color: palette.muted }}>{recipes.length} total</span>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {grid.map((recipe, index) => (
                <article key={recipe.id} className="group">
                  <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden">
                    <Image src={recipe.imageUrl} alt={recipe.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                    <span className="absolute right-3 top-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: palette.background, color: palette.foreground }}>
                      {recipe.minutes}′
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3" style={{ borderTop: `1.5px solid ${palette.foreground}`, paddingTop: "0.75rem" }}>
                    <span className="text-xs font-bold tabular-nums" style={{ fontFamily: "var(--font-grotesk), sans-serif", color: palette.primary }}>
                      {String(index + 4).padStart(2, "0")}
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold leading-snug" style={{ fontFamily: "var(--font-grotesk), sans-serif", color: palette.foreground }}>
                        {recipe.title}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed" style={{ color: palette.muted }}>
                        {recipe.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="py-10 transition-colors duration-300" style={{ borderTop: `1px solid ${palette.border}` }}>
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <Logo palette={palette} />
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: palette.muted, fontFamily: "var(--font-grotesk), sans-serif" }}>
            © {new Date().getFullYear()} Family Recipe
          </p>
        </div>
      </footer>
    </div>
  );
}
