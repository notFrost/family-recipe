"use client";

import { useTransition } from "react";
import { signOutAction } from "../lib/actions";

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => signOutAction())}
      className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}
