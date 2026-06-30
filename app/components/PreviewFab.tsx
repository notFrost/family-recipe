import Link from "next/link";
import { Palette } from "lucide-react";

/**
 * Floating shortcut to the design-preview harness (/preview). Rendered only on
 * non-production deployments (gated by the caller) so real users never see it —
 * it's a visual-testing convenience for dev/preview builds.
 */
export default function PreviewFab() {
  return (
    <Link
      href="/preview"
      title="Open the design preview"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-card/95 px-4 py-2.5 text-sm font-bold text-foreground shadow-lg backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Palette className="h-4 w-4 text-primary" />
      Preview
    </Link>
  );
}
