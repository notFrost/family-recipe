"use client";

import { useState, useTransition } from "react";
import { leaveFamilyAction } from "../lib/actions";

interface LeaveFamilyButtonProps {
  familyId: string;
}

export default function LeaveFamilyButton({ familyId }: LeaveFamilyButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleLeave() {
    startTransition(async () => {
      await leaveFamilyAction(familyId);
    });
  }

  if (confirming) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={handleLeave}
            disabled={isPending}
            className="inline-flex items-center rounded-full bg-destructive px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-destructive/90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {isPending ? "Leaving…" : "Confirm leave"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={isPending}
            className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Cancel
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Your recipes will stay in the family.
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="inline-flex items-center rounded-full border border-destructive/40 bg-card px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      Leave family
    </button>
  );
}
