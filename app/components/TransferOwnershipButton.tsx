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
          className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        >
          {isPending ? "Transferring…" : "Make owner?"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="rounded-full border border-zinc-300 bg-white px-2.5 py-0.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
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
      className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
    >
      Make owner?
    </button>
  );
}
