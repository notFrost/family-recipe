import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { getSession } from "../lib/auth";
import Avatar from "./Avatar";
import NavLinks from "./NavLinks";
import SignOutButton from "./SignOutButton";
import ThemeToggle from "./ThemeToggle";

export default async function Navbar() {
  const session = await getSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
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
          <NavLinks
            links={
              user
                ? [
                    { href: "/discover", label: "Discover" },
                    { href: "/families", label: "Families" },
                  ]
                : [{ href: "/discover", label: "Discover" }]
            }
          />
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          {user ? (
            <>
              {/* Avatar + name are the door to /settings — the avatar stays
                  visible on mobile so the page is reachable at every width. */}
              <Link
                href="/settings"
                className="flex items-center gap-2 rounded-full p-1 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:py-1 sm:pl-1 sm:pr-3"
                title={user.email ?? undefined}
              >
                <Avatar
                  name={user.name}
                  src={user.image}
                  size={32}
                  className="h-8 w-8 text-sm"
                />
                <span className="hidden sm:inline">
                  {user.name ?? user.email}
                </span>
              </Link>
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
