"use client";

import { useState, useTransition } from "react";
import { deleteRecipeAction } from "../lib/actions";

interface DeleteRecipeButtonProps {
  id: string;
}

export default function DeleteRecipeButton({ id }: DeleteRecipeButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteRecipeAction(id);
    });
  }

  if (confirming) {
    return (
      <div className="inline-flex items-center gap-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="inline-flex items-center rounded-full bg-destructive px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-destructive/90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {isPending ? "Deleting…" : "Confirm delete"}
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
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="inline-flex items-center rounded-full border border-destructive/40 bg-card px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      Delete
    </button>
  );
}
