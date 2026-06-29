import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/app/lib/auth";
import { createFamilyAction } from "@/app/lib/actions";

const inputClasses =
  "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring";

const labelClasses = "text-sm font-medium text-foreground";

export default async function NewFamilyPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/families/new");
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          New family
        </h1>
        <p className="text-base text-muted-foreground">
          Create a shared recipe collection for your family.
        </p>
      </div>

      <form action={createFamilyAction} className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelClasses}>
            Family name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="e.g. The Smiths"
            className={inputClasses}
            autoFocus
          />
        </div>

        <div className="flex items-center gap-3 border-t border-border pt-6">
          <button
            type="submit"
            className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Create family
          </button>
          <Link
            href="/families"
            className="inline-flex items-center rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
