import Link from "next/link";
import { Sparkles } from "lucide-react";

/**
 * Floating "Review designs" shortcut â€” a sticky pill centered at the bottom of
 * the screen (mobile and desktop), drawing attention because its mere presence
 * signals "there are designs to review". A floating button, not a full-width
 * bar (kept off the very edge). Rendered only on app pages (not in /preview) and
 * only off production â€” the caller gates on VERCEL_ENV.
 */
export default function PreviewCta() {
  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 print:hidden">
      <Link
        href="/preview"
        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg ring-2 ring-primary/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="relative flex h-2 w-2" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground/70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-foreground" />
        </span>
        <Sparkles className="h-4 w-4" />
        Review designs
      </Link>
    </div>
  );
}
