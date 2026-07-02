"use client";

import { Printer } from "lucide-react";

/**
 * "Print" pill — opens the browser's print dialog. The page's print
 * stylesheet (chrome hidden, ink-friendly light tokens) turns the recipe
 * into a clean card fit for the physical tin.
 */
export default function PrintRecipeButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Printer className="h-4 w-4" />
      Print
    </button>
  );
}
