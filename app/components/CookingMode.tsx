"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Check,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  CookingPot,
  X,
} from "lucide-react";

/**
 * Cooking mode — the recipe, one step at a time, at arm's-length type sizes.
 *
 * A full-screen overlay opened from the recipe page: big step text, a warm
 * progress bar, prev/next (buttons or ← → keys), the ingredient list one tap
 * away, and a screen wake-lock while it's open so the phone doesn't sleep
 * mid-stir. Pure UI over the recipe's existing steps/ingredients — no schema,
 * no network.
 */
export default function CookingMode({
  title,
  steps,
  ingredients,
}: {
  title: string;
  steps: string[];
  ingredients: string[];
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [showIngredients, setShowIngredients] = useState(false);
  // `done` renders the finish screen after the last step.
  const [done, setDone] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setIndex(0);
    setDone(false);
    setShowIngredients(false);
    // Hand focus back to the trigger — the focused close button unmounts
    // with the portal, which would otherwise drop focus on <body>.
    triggerRef.current?.focus();
  }, []);

  const next = useCallback(() => {
    setIndex((i) => {
      if (i >= steps.length - 1) {
        setDone(true);
        return i;
      }
      return i + 1;
    });
  }, [steps.length]);

  const prev = useCallback(() => {
    // From the finish screen, ← returns TO the last step: `index` never
    // advanced when `done` was set, so only the flag clears here.
    if (done) {
      setDone(false);
      return;
    }
    setIndex((i) => Math.max(0, i - 1));
  }, [done]);

  // Keyboard: ← → navigate, Escape closes. Only while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close, next, prev]);

  // Focus the close button when the overlay opens; lock body scroll.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Screen wake-lock while cooking (best-effort: needs a secure context and
  // browser support; silently skipped otherwise). Re-acquired when the tab
  // becomes visible again — the OS releases it on tab switch.
  useEffect(() => {
    if (!open || !("wakeLock" in navigator)) return;

    let cancelled = false;
    const acquire = async () => {
      try {
        const sentinel = await navigator.wakeLock.request("screen");
        if (cancelled) {
          await sentinel.release();
        } else {
          wakeLockRef.current = sentinel;
        }
      } catch {
        // Denied (battery saver, permissions) — cooking mode works regardless.
      }
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") acquire();
    };

    acquire();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
    };
  }, [open]);

  // Defense-in-depth: the form enforces ≥1 step client-side, but a crafted
  // POST could store an empty list — no button, no broken "Step 1 of 0".
  if (steps.length === 0) return null;

  const progress = done ? 1 : (index + 1) / steps.length;

  // Portaled to <body>: the page's <main> carries its own z-index, which
  // would trap this fixed overlay under the sticky navbar. Client-only and
  // click-triggered, so document is always available when this renders.
  const overlay = (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Cooking ${title}`}
          className="fixed inset-0 z-[100] flex flex-col bg-background"
        >
          {/* Header: title, position, close. */}
          <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-6">
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-extrabold tracking-tight text-foreground">
                {title}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                {done
                  ? "All done"
                  : `Step ${index + 1} of ${steps.length}`}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setShowIngredients((v) => !v)}
                aria-pressed={showIngredients}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  showIngredients
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:bg-accent"
                }`}
              >
                <ChefHat className="h-4 w-4" />
                <span className="hidden sm:inline">Ingredients</span>
              </button>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close cooking mode"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Progress. */}
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            aria-label="Cooking progress"
            className="h-1.5 w-full bg-muted"
          >
            <div
              className="h-full bg-primary transition-[width] duration-300 motion-reduce:transition-none"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* The step (or the finish screen). Children center via m-auto —
              centering on the flex container itself would top-clip any step
              taller than the viewport and make its start unscrollable.
              aria-live announces step changes to screen readers. */}
          <div
            aria-live="polite"
            className="flex flex-1 overflow-y-auto px-6 py-10 sm:px-10"
          >
            {done ? (
              <div className="m-auto flex max-w-xl flex-col items-center gap-5 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-8 w-8" />
                </span>
                <p className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
                  Dinner is served.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {steps.length} steps, done. Somebody set the table.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-1 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Back to the recipe
                </button>
              </div>
            ) : (
              <div className="m-auto flex w-full max-w-2xl items-start gap-5">
                <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <p className="min-w-0 break-words text-2xl font-semibold leading-relaxed tracking-tight text-foreground sm:text-3xl sm:leading-relaxed">
                  {steps[index]}
                </p>
              </div>
            )}
          </div>

          {/* Ingredients drawer — slides over the step, not the controls. */}
          {showIngredients && !done ? (
            <div className="max-h-[40vh] overflow-y-auto border-t border-border bg-card px-6 py-4 sm:px-10">
              <p className="pb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Ingredients
              </p>
              <ul className="flex flex-col">
                {ingredients.map((ing, i) => (
                  <li
                    key={i}
                    className="border-b border-border/50 py-2 text-sm leading-relaxed text-foreground last:border-0"
                  >
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Controls. */}
          {!done ? (
            <footer className="flex items-center justify-between gap-3 border-t border-border px-4 py-4 sm:px-6">
              <button
                type="button"
                onClick={prev}
                disabled={index === 0}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <span className="hidden text-xs font-semibold text-muted-foreground sm:inline">
                ← → keys work too
              </span>
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {index === steps.length - 1 ? "Finish" : "Next step"}
                <ChevronRight className="h-4 w-4" />
              </button>
            </footer>
          ) : null}
        </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <CookingPot className="h-4 w-4" />
        Start cooking
      </button>

      {open ? createPortal(overlay, document.body) : null}
    </>
  );
}
