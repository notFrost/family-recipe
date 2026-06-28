import Link from "next/link";
import { getSession } from "../lib/auth";
import SignOutButton from "./SignOutButton";

export default async function Navbar() {
  const session = await getSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-zinc-900"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-base font-bold text-white">
              🍽️
            </span>
            Family Recipe
          </Link>

          <Link
            href="/discover"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded"
          >
            Discover
          </Link>

          {user ? (
            <Link
              href="/families"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded"
            >
              Families
            </Link>
          ) : null}
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <span
              className="hidden text-sm text-zinc-500 sm:inline"
              title={user.email ?? undefined}
            >
              {user.name ?? user.email}
            </span>
            <Link
              href="/recipes/new"
              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
            >
              <span aria-hidden className="text-base leading-none">
                +
              </span>
              Add Recipe
            </Link>
            <SignOutButton />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
