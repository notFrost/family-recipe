"use client";

import { useCallback, useState } from "react";
import { Check, ImageDown } from "lucide-react";

/**
 * "Save image" — downloads the recipe's branded share card (rendered
 * server-side at /recipes/[id]/card, same view-gating as the page). The
 * PNG is sized for social (4:5) so it drops straight into a story, chat,
 * or family group.
 */
export default function ShareImageButton({
  recipeId,
  title,
}: {
  recipeId: string;
  title: string;
}) {
  const [state, setState] = useState<"idle" | "working" | "done">("idle");

  const handleSave = useCallback(async () => {
    if (state === "working") return;
    setState("working");
    try {
      const res = await fetch(`/recipes/${recipeId}/card`);
      if (!res.ok) throw new Error(`card render failed: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "recipe"}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setState("done");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("idle");
    }
  }, [recipeId, title, state]);

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={state === "working"}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {state === "done" ? (
        <Check className="h-4 w-4" />
      ) : (
        <ImageDown className="h-4 w-4" />
      )}
      {state === "working"
        ? "Rendering…"
        : state === "done"
          ? "Saved"
          : "Save image"}
    </button>
  );
}
