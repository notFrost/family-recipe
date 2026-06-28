import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/app/lib/auth";
import { createFamilyAction } from "@/app/lib/actions";

const inputClasses =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:border-amber-500";

const labelClasses = "text-sm font-medium text-zinc-900";

export default async function NewFamilyPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/families/new");
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          New family
        </h1>
        <p className="text-base text-zinc-600">
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

        <div className="flex items-center gap-3 border-t border-zinc-200 pt-6">
          <button
            type="submit"
            className="inline-flex items-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
          >
            Create family
          </button>
          <Link
            href="/families"
            className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
