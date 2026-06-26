"use client";

import { useState, useTransition } from "react";
import { removeMemberAction } from "../lib/actions";

interface RemoveMemberButtonProps {
  familyId: string;
  userId: string;
}

export default function RemoveMemberButton({
  familyId,
  userId,
}: RemoveMemberButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleRemove() {
    startTransition(async () => {
      await removeMemberAction(familyId, userId);
    });
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1">
        <button
          type="button"
          onClick={handleRemove}
          disabled={isPending}
          className="text-xs font-medium text-red-600 underline-offset-2 hover:text-red-800 hover:underline disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded"
        >
          {isPending ? "Removing…" : "Confirm"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="text-xs font-medium text-zinc-400 underline-offset-2 hover:text-zinc-600 hover:underline disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded"
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
      className="text-xs font-medium text-zinc-400 underline-offset-2 hover:text-red-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded"
    >
      Remove
    </button>
  );
}
