"use client";

import { useEffect, useRef, useState } from "react";
import {
  Heart,
  Share2,
  FolderPlus,
  Pencil,
  Trash2,
  Check,
  AlertTriangle,
} from "lucide-react";
import type { ViewerRole, VariantRecipe } from "./mock-data";

/**
 * Shared Actions for the recipe-page variants.
 *
 * The action *set* is fixed by the brief and depends only on who's viewing:
 *   - owner   → Edit · Share · Favorite · Delete (with a warning dialog)
 *   - visitor → Save to my family · Favorite · Share   (a "foreign" recipe you
 *               can pull into your own family's collection)
 *
 * Only the *presentation* changes between variants, so the same bar renders in
 * four arrangements via `layout`. This keeps every variant's actions consistent
 * (and the destructive delete always behind the same confirmation) while the
 * page layouts stay free to put the bar wherever they want.
 *
 * These are previews on mock data, so the mutating actions don't hit a backend —
 * Favorite/Save toggle local state, Share copies a link, and Delete demonstrates
 * the confirmation rather than removing anything.
 */
export type ActionLayout = "row" | "stack" | "icons" | "dock";

type Kind = "primary" | "secondary" | "destructive";

interface ActionDef {
  key: string;
  label: string;
  /** Short label for the compact "icons" layout's tooltip. */
  icon: React.ReactNode;
  kind: Kind;
  onClick: () => void;
  active?: boolean;
}

function buttonClasses(kind: Kind, active: boolean): string {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  if (kind === "primary")
    return `${base} bg-primary text-primary-foreground shadow-md hover:-translate-y-0.5 hover:shadow-lg`;
  if (kind === "destructive")
    return `${base} border border-destructive/40 bg-card text-destructive hover:bg-destructive/10`;
  // secondary, with an "active" (toggled-on) state for Favorite/Save
  return active
    ? `${base} border border-primary/40 bg-primary/10 text-primary`
    : `${base} border border-border bg-card text-foreground hover:bg-accent`;
}

function DeleteDialog({
  title,
  onCancel,
  onConfirm,
}: {
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-7">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div className="flex flex-col gap-1.5">
            <h2
              id="delete-dialog-title"
              className="text-lg font-bold tracking-tight text-foreground"
            >
              Delete this recipe?
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This permanently removes{" "}
              <span className="font-semibold text-foreground">{title}</span> —
              its ingredients, steps, and photo. This can&apos;t be undone.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Keep recipe
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Trash2 className="h-4 w-4" />
            Delete recipe
          </button>
        </div>
      </div>
    </div>
  );
}

export function RecipeActionBar({
  recipe,
  role,
  layout = "row",
  className = "",
}: {
  recipe: VariantRecipe;
  role: ViewerRole;
  layout?: ActionLayout;
  className?: string;
}) {
  const [favorited, setFavorited] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [justDeleted, setJustDeleted] = useState(false);

  function share() {
    const link = `https://family-recipe.app/recipes/${recipe.id}`;
    navigator.clipboard?.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const favorite: ActionDef = {
    key: "favorite",
    label: favorited ? "Favorited" : "Favorite",
    icon: <Heart className={`h-4 w-4 ${favorited ? "fill-current" : ""}`} />,
    kind: "secondary",
    active: favorited,
    onClick: () => setFavorited((v) => !v),
  };
  const shareAction: ActionDef = {
    key: "share",
    label: copied ? "Link copied" : "Share",
    icon: copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />,
    kind: "secondary",
    onClick: share,
  };

  const actions: ActionDef[] =
    role === "owner"
      ? [
          {
            key: "edit",
            label: "Edit",
            icon: <Pencil className="h-4 w-4" />,
            kind: "primary",
            onClick: () => {},
          },
          favorite,
          shareAction,
          {
            key: "delete",
            label: "Delete",
            icon: <Trash2 className="h-4 w-4" />,
            kind: "destructive",
            onClick: () => setConfirmingDelete(true),
          },
        ]
      : [
          {
            key: "save",
            label: saved ? "Saved to family" : "Save to my family",
            icon: saved ? (
              <Check className="h-4 w-4" />
            ) : (
              <FolderPlus className="h-4 w-4" />
            ),
            kind: "primary",
            active: saved,
            onClick: () => setSaved((v) => !v),
          },
          favorite,
          shareAction,
        ];

  // Layout-specific wrappers/element shapes.
  const isIcons = layout === "icons";
  const isStack = layout === "stack";

  const wrapperClass =
    layout === "stack"
      ? "flex flex-col gap-2"
      : layout === "dock"
        ? "flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-3xl border border-border bg-card/95 p-1.5 shadow-lg backdrop-blur-md"
        : "flex flex-wrap items-center gap-2";

  return (
    <>
      <div className={`${wrapperClass} ${className}`}>
        {actions.map((a) => {
          if (isIcons) {
            // Icon-only round buttons; primary keeps its fill.
            const cls =
              a.kind === "primary"
                ? "bg-primary text-primary-foreground shadow-md hover:-translate-y-0.5 hover:shadow-lg"
                : a.kind === "destructive"
                  ? "border border-destructive/40 bg-card text-destructive hover:bg-destructive/10"
                  : a.active
                    ? "border border-primary/40 bg-primary/10 text-primary"
                    : "border border-border bg-card text-foreground hover:bg-accent";
            return (
              <button
                key={a.key}
                type="button"
                onClick={a.onClick}
                title={a.label}
                aria-label={a.label}
                aria-pressed={a.active}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${cls}`}
              >
                {a.icon}
              </button>
            );
          }
          return (
            <button
              key={a.key}
              type="button"
              onClick={a.onClick}
              aria-pressed={a.kind === "secondary" ? a.active : undefined}
              className={`${buttonClasses(a.kind, !!a.active)} ${isStack ? "w-full" : ""}`}
            >
              {a.icon}
              <span>{a.label}</span>
            </button>
          );
        })}
      </div>

      {confirmingDelete ? (
        <DeleteDialog
          title={recipe.title}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={() => {
            setConfirmingDelete(false);
            setJustDeleted(true);
            setTimeout(() => setJustDeleted(false), 2200);
          }}
        />
      ) : null}

      {justDeleted ? (
        <div className="fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-lg">
          Recipe deleted (preview only)
        </div>
      ) : null}
    </>
  );
}
