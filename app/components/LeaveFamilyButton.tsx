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
            className="inline-flex items-center rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            {isPending ? "Leaving…" : "Confirm leave"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={isPending}
            className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
          >
            Cancel
          </button>
        </div>
        <p className="text-xs text-zinc-400">
          Your recipes will stay in the family.
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="inline-flex items-center rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
    >
      Leave family
    </button>
  );
}
