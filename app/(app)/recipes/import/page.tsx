import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clapperboard,
  Link2,
  Sparkles,
} from "lucide-react";
import { getSession } from "@/app/lib/auth";
import {
  fetchVideoMetadata,
  parseVideoUrl,
  toDraftPrefill,
} from "@/app/lib/video-import";

const inputClasses =
  "w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring";

/**
 * Video → recipe import. Paste a TikTok / YouTube Short / Reel link and the
 * platform's own shared metadata (title, creator, thumbnail) prefills a
 * recipe draft. Metadata-only tonight; AI extraction of ingredients/steps is
 * the premium slot (see app/lib/video-import.ts).
 */
export default async function ImportRecipePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/recipes/import");
  }

  const sp = await searchParams;
  const rawUrl = typeof sp.url === "string" ? sp.url : "";

  const parsed = rawUrl ? parseVideoUrl(rawUrl) : null;
  const meta = parsed ? await fetchVideoMetadata(parsed) : null;
  const prefill = meta ? toDraftPrefill(meta) : null;

  const continueHref = prefill
    ? `/recipes/new?${new URLSearchParams(
        Object.fromEntries(
          Object.entries({
            title: prefill.title,
            imageUrl: prefill.imageUrl,
            description: prefill.description,
          }).filter(([, v]) => typeof v === "string" && v.length > 0),
        ) as Record<string, string>,
      ).toString()}`
    : null;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <Link
        href="/recipes/new"
        className="inline-flex w-fit items-center gap-1.5 rounded text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to new recipe
      </Link>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
          Import from a video
        </span>
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          From the feed
          <br className="hidden sm:block" /> to the family table
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Paste a TikTok, YouTube Short, or Instagram Reel. What the platform
          shares — title, creator, cover image — prefills your draft; you add
          the ingredients and method.
        </p>
      </div>

      {/* Paste form (GET — the URL is shareable and refresh-safe). */}
      <form action="/recipes/import" method="get" className="flex flex-col gap-2">
        <label htmlFor="url" className="text-sm font-bold text-foreground">
          Video link
        </label>
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="url"
              name="url"
              type="url"
              required
              defaultValue={rawUrl}
              placeholder="https://www.tiktok.com/@nonna/video/…"
              className={`${inputClasses} pl-10`}
            />
          </div>
          <button
            type="submit"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Clapperboard className="h-4 w-4" />
            Fetch it
          </button>
        </div>
      </form>

      {/* Result states. */}
      {rawUrl && !parsed ? (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          That link isn&apos;t from a supported platform. Paste a TikTok,
          YouTube, or Instagram video URL.
        </div>
      ) : null}

      {meta ? (
        <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {meta.thumbnailUrl ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-muted sm:w-56 sm:shrink-0">
                <Image
                  src={meta.thumbnailUrl}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 14rem"
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : null}
            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="w-fit rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-secondary-foreground">
                {meta.platform}
              </span>
              <span className="text-lg font-extrabold leading-snug tracking-tight text-foreground">
                {meta.title ??
                  (meta.supported
                    ? "The platform didn't share a title"
                    : "Instagram doesn't share details without a key")}
              </span>
              {meta.authorName ? (
                <span className="text-sm text-muted-foreground">
                  by {meta.authorName}
                </span>
              ) : null}
            </div>
          </div>

          {continueHref ? (
            <Link
              href={continueHref}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Continue to the recipe form
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </section>
      ) : null}

      {/* The premium slot, stated honestly. */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-primary/5 p-6 sm:p-8">
        <Sparkles
          className="pointer-events-none absolute -right-2 top-2 h-24 w-24 -rotate-12 text-primary/10"
          aria-hidden
        />
        <div className="flex flex-col gap-1.5">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Coming to Premium
          </span>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Premium will watch the video for you and write out the ingredients
            and method, ready to edit. Today the import prefills what the
            platform shares — title, creator, and cover.
          </p>
        </div>
      </section>
    </div>
  );
}
