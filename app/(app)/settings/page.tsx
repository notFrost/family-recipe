import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Crown,
  Mail,
  Users,
} from "lucide-react";
import { getSession } from "@/app/lib/auth";
import { userRepository } from "@/app/lib/user-repository";
import Avatar from "@/app/components/Avatar";
import SignOutButton from "@/app/components/SignOutButton";

function joinedLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

/**
 * Settings in the Homestead language — the signed-in cook's own account,
 * read top to bottom: profile, account, your kitchen, your families, sign
 * out. Read-only by design for now: profile/account MUTATIONS (rename,
 * avatar, password, delete account) are an ask-first surface and land as
 * their own reviewed slice — no dead buttons in the meantime.
 */
export default async function SettingsPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/settings");
  }

  const account = await userRepository.getViewerAccount(session.user.id);
  if (!account) {
    // Session references a user that no longer exists — treat as signed out.
    redirect("/login?callbackUrl=/settings");
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
          Your account
        </span>
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          Settings
        </h1>
      </div>

      {/* Profile. */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Profile
          </h2>
          <p className="text-sm text-muted-foreground">
            How you appear across Kitchen Heirloom.
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <Avatar
            name={account.name}
            src={account.image}
            size={112}
            className="h-20 w-20 shrink-0 text-2xl ring-2 ring-primary/25"
          />
          <div className="flex min-w-0 flex-col gap-0.5 leading-tight">
            <span className="truncate text-lg font-extrabold tracking-tight text-foreground">
              {account.name ?? "Unnamed cook"}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" /> Joined{" "}
              {joinedLabel(account.createdAt)}
            </span>
          </div>
        </div>
      </section>

      {/* Account. */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Account
          </h2>
          <p className="text-sm text-muted-foreground">
            Sign-in details — these stay private.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
            <Mail className="h-4 w-4 text-muted-foreground" />
          </span>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Email
            </span>
            <span className="truncate text-sm font-semibold text-foreground">
              {account.email}
            </span>
          </div>
        </div>
      </section>

      {/* Your kitchen. */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Your kitchen
          </h2>
          <p className="text-sm text-muted-foreground">
            What you&apos;ve written down so far.
          </p>
        </div>
        <div className="flex items-center gap-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-extrabold tracking-tight text-foreground">
              {account.recipeCount}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <BookOpen className="h-4 w-4" />{" "}
              {account.recipeCount === 1 ? "Recipe" : "Recipes"}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-extrabold tracking-tight text-foreground">
              {account.families.length}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Users className="h-4 w-4" />{" "}
              {account.families.length === 1 ? "Family" : "Families"}
            </span>
          </div>
        </div>
      </section>

      {/* Families. */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Your families
          </h2>
          <p className="text-sm text-muted-foreground">
            The kitchens you cook in.
          </p>
        </div>
        {account.families.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-card py-14 text-center">
            <p className="text-lg font-bold text-foreground">
              No families yet
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Start one and invite the people whose cooking you grew up with.
            </p>
            <Link
              href="/families/new"
              className="mt-1 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Start a family
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {account.families.map((f) => (
              <li key={f.id}>
                <Link
                  href={`/families/${f.id}`}
                  className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <Users className="h-5 w-5" />
                  </span>
                  <div className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate text-sm font-bold text-foreground">
                      {f.name}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                      {f.role === "OWNER" ? (
                        <>
                          <Crown className="h-3.5 w-3.5 text-primary" /> Owner
                        </>
                      ) : (
                        "Member"
                      )}
                    </span>
                  </div>
                  <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Session. */}
      <section className="flex flex-col gap-4 border-t border-border pt-6">
        <SignOutButton />
      </section>
    </div>
  );
}
