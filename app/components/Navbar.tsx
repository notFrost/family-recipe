import Link from "next/link";
import { ArrowRight, Plus, Sparkles } from "lucide-react";
import { getSession } from "../lib/auth";
import SignOutButton from "./SignOutButton";
import ThemeToggle from "./ThemeToggle";

export default async function Navbar() {
  const session = await getSession();
  const user = session?.user;
  // The design-preview CTA only appears off production (a "there are designs to
  // review" signal). VERCEL_ENV is "production" only on the prod deployment.
  const showPreview = process.env.VERCEL_ENV !== "production";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {showPreview ? (
          <Link
            href="/preview"
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground shadow-md ring-2 ring-primary/30 transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:inline-flex"
          >
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-foreground" />
            </span>
            <Sparkles className="h-4 w-4" />
            Review designs
          </Link>
        ) : null}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-foreground"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-base text-primary-foreground shadow-sm">
              🍳
            </span>
            Family Recipe
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/discover"
              aria-current="page"
              className="rounded-full bg-primary/10 px-3.5 py-1.5 text-sm font-semibold text-primary"
            >
              Discover
            </Link>
            {user ? (
              <Link
                href="/families"
                className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Families
              </Link>
            ) : null}
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          {user ? (
            <>
              <span
                className="hidden text-sm text-muted-foreground sm:inline"
                title={user.email ?? undefined}
              >
                {user.name ?? user.email}
              </span>
              <Link
                href="/recipes/new"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add recipe</span>
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:inline-flex"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="group inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Sign up
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
