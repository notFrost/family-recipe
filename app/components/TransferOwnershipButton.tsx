"use client";

import { useState, useTransition } from "react";
import { transferOwnershipAction } from "../lib/actions";

interface TransferOwnershipButtonProps {
  familyId: string;
  newOwnerId: string;
  memberName?: string | null;
}

export default function TransferOwnershipButton({
  familyId,
  newOwnerId,
  memberName,
}: TransferOwnershipButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleTransfer() {
    startTransition(async () => {
      await transferOwnershipAction(familyId, newOwnerId);
    });
  }

  const label = memberName
    ? `Transfer ownership to ${memberName}`
    : "Transfer ownership";

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1">
        <button
          type="button"
          onClick={handleTransfer}
          disabled={isPending}
          aria-label={label}
          className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {isPending ? "Transferring…" : "Make owner?"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      aria-label={label}
      className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      Make owner?
    </button>
  );
}
