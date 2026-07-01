"use client";

import { useCallback, useState } from "react";
import { Share2, Check } from "lucide-react";

/**
 * "Share" pill that copies the current page URL. Purely client-side (no
 * backend share links yet — tokenized links are a separate feature), so it's
 * safe on any visibility: the copied URL only opens for people the recipe's
 * own view-gating already allows.
 */
export default function ShareLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may be unavailable (e.g. insecure context); silently fail.
    }
  }, []);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
