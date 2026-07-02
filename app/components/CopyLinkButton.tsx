"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

interface CopyLinkButtonProps {
  /** Absolute URL or same-origin path — paths are resolved against the origin at click time. */
  link: string;
  /**
   * "link": quiet inline text button (default, the original look).
   * "pill": Homestead primary pill, for featured panels like the family invite.
   */
  variant?: "link" | "pill";
  label?: string;
}

export default function CopyLinkButton({
  link,
  variant = "link",
  label = "Copy invite link",
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      // Resolve relative paths so the copied text is a real, shareable URL
      // (copying "/families/x/join" alone isn't pasteable anywhere useful).
      const url = new URL(link, window.location.origin).toString();
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may be unavailable (e.g. insecure context); silently fail.
    }
  }, [link]);

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied!" : label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {copied ? "Copied!" : label}
    </button>
  );
}
