import { Hammer } from "lucide-react";

/**
 * Stand-in shown for a (style, page) pair that's still being designed, so the
 * harness always renders while styles fill in page-by-page.
 */
export default function Placeholder({
  page,
  style,
}: {
  page: string;
  style: string;
}) {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-card/60 p-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Hammer className="h-6 w-6" />
      </span>
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        {page} — in the {style} style
      </h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        This page is being designed. The {style} style is built one page at a
        time so the whole set stays consistent.
      </p>
    </div>
  );
}
