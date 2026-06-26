import Link from "next/link";

export default function RecipeNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-white py-20 text-center">
      <p className="text-lg font-medium text-zinc-900">Recipe not found</p>
      <p className="text-sm text-zinc-600">
        The recipe you&apos;re looking for doesn&apos;t exist or was removed.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
      >
        Back to all recipes
      </Link>
    </div>
  );
}
