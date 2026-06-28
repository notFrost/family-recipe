"use client";

import Image from "next/image";
import Link from "next/link";
import { Fraunces, Nunito } from "next/font/google";
import { Search, Clock, Soup } from "lucide-react";
import type { Theme } from "./theme";
import { recipes } from "./mock-recipes";

// V6 — "Hearth": a warm home-cookbook. The signature is the recipe-box index
// card: ruled baseline lines, a dog-eared corner, and a monospace card number,
// the way a handwritten recipe is filed away. My take on "Warm & Homey".

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

function buildPalette(theme: Theme, isDark: boolean) {
  return isDark ? theme.dark : theme.light;
}
type Palette = ReturnType<typeof buildPalette>;

function Logo({ palette }: { palette: Palette }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 text-xl tracking-tight"
      style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, color: palette.foreground }}
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full text-base"
        style={{ backgroundColor: palette.primary, color: palette.buttonText }}
      >
        🍲
      </span>
      Family Recipe
    </Link>
  );
}

export default function DiscoverV6({
  isDark,
  theme,
}: {
  isDark?: boolean;
  theme: Theme;
}) {
  const palette = buildPalette(theme, isDark ?? false);
  const featured = recipes[0];
  const rest = recipes.slice(1);

  return (
    <div
      className={`${fraunces.variable} ${nunito.variable} flex min-h-screen flex-col transition-colors duration-300`}
      style={{
        fontFamily: "var(--font-nunito), system-ui, sans-serif",
        backgroundColor: palette.background,
        color: palette.foreground,
      }}
    >
      <style jsx global>{`
        @keyframes v6-rise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .v6-rise { animation: v6-rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .v6-card { transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease; }
        .v6-card:hover { transform: translateY(-5px) rotate(-0.6deg); }
      `}</style>

      <header
        className="sticky top-0 z-50 backdrop-blur transition-colors duration-300"
        style={{ backgroundColor: `${palette.card}E6`, borderBottom: `1px solid ${palette.border}` }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Logo palette={palette} />
          <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
            <Link href="/discover" style={{ color: palette.foreground }}>Discover</Link>
            <Link href="/families" style={{ color: palette.muted }}>Families</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-semibold sm:inline"
              style={{ color: palette.muted }}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full px-4 py-2 text-sm font-bold shadow-sm transition-transform duration-300 hover:scale-[1.03]"
              style={{ backgroundColor: palette.primary, color: palette.buttonText }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Hero + featured */}
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div className="v6-rise">
              <p
                className="mb-3 text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: palette.primary }}
              >
                From the family box
              </p>
              <h1
                className="text-5xl leading-[1.05] tracking-tight sm:text-6xl"
                style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, color: palette.foreground }}
              >
                Recipes worth{" "}
                <span style={{ fontStyle: "italic", color: palette.primary }}>filing away</span>.
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed" style={{ color: palette.muted }}>
                Cozy, crowd-pleasing dishes gathered from family kitchens — each one filed like the card it came from.
              </p>

              <form
                action="/discover"
                method="get"
                className="mt-7 flex max-w-md items-center gap-2 rounded-full p-1.5 shadow-sm"
                style={{ backgroundColor: palette.card, border: `1px solid ${palette.border}` }}
              >
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: palette.primary }} />
                  <input
                    name="q"
                    type="search"
                    placeholder="Search the recipe box…"
                    aria-label="Search recipes"
                    className="h-11 w-full rounded-full bg-transparent pl-11 pr-4 text-sm focus-visible:outline-none"
                    style={{ color: palette.foreground }}
                  />
                </div>
                <button
                  type="submit"
                  className="h-11 rounded-full px-6 text-sm font-bold transition-transform duration-300 hover:scale-105"
                  style={{ backgroundColor: palette.primary, color: palette.buttonText }}
                >
                  Find
                </button>
              </form>
            </div>

            {/* Featured index card */}
            <article
              className="v6-rise v6-card relative overflow-hidden rounded-2xl shadow-lg"
              style={{ backgroundColor: palette.card, border: `1px solid ${palette.border}`, animationDelay: "120ms" }}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image src={featured.imageUrl} alt={featured.title} fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
                <span
                  className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm"
                  style={{ backgroundColor: palette.card, color: palette.primary }}
                >
                  Featured
                </span>
              </div>
              <div className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: palette.muted, fontFamily: "var(--font-fraunces), serif" }}>
                    No. 01 · {featured.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: palette.muted }}>
                    <Clock className="h-3.5 w-3.5" /> {featured.minutes} min
                  </span>
                </div>
                <h2 className="text-2xl leading-tight" style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, color: palette.foreground }}>
                  {featured.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: palette.muted }}>
                  {featured.description}
                </p>
              </div>
            </article>
          </div>

          {/* Index-card grid */}
          <div className="mt-14 mb-6 flex items-baseline justify-between">
            <h3 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, color: palette.foreground }}>
              The rest of the box
            </h3>
            <span className="text-sm font-semibold" style={{ color: palette.muted }}>{rest.length} cards</span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((recipe, index) => (
              <article
                key={recipe.id}
                className="v6-rise v6-card group relative flex flex-col overflow-hidden rounded-2xl shadow-md"
                style={{ backgroundColor: palette.card, border: `1px solid ${palette.border}`, animationDelay: `${index * 55}ms` }}
              >
                {/* dog-eared corner */}
                <div
                  className="absolute right-0 top-0 z-10 h-7 w-7"
                  style={{ background: `linear-gradient(135deg, transparent 50%, ${palette.border} 50%)` }}
                  aria-hidden="true"
                />
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: palette.primary, fontFamily: "var(--font-fraunces), serif" }}>
                    No. {String(index + 2).padStart(2, "0")} · {recipe.category}
                  </span>
                  <h2 className="mt-1.5 text-xl leading-snug" style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, color: palette.foreground }}>
                    {recipe.title}
                  </h2>
                  {/* ruled lines behind the description */}
                  <p
                    className="mt-2 line-clamp-2 text-sm leading-relaxed"
                    style={{ color: palette.muted }}
                  >
                    {recipe.description}
                  </p>
                  <div
                    className="mt-auto flex items-center gap-4 pt-4 text-xs font-semibold"
                    style={{ borderTop: `1px dashed ${palette.border}`, color: palette.muted }}
                  >
                    <span className="flex items-center gap-1 pt-3"><Soup className="h-3.5 w-3.5" style={{ color: palette.primary }} /> {recipe.ingredients.length} ingredients</span>
                    <span className="flex items-center gap-1 pt-3"><Clock className="h-3.5 w-3.5" style={{ color: palette.primary }} /> {recipe.minutes} min</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <footer className="mt-8 py-12 transition-colors duration-300" style={{ backgroundColor: palette.card, borderTop: `1px solid ${palette.border}` }}>
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <Logo palette={palette} />
          <p className="text-sm" style={{ color: palette.muted }}>
            © {new Date().getFullYear()} Family Recipe — filed with love.
          </p>
        </div>
      </footer>
    </div>
  );
}
