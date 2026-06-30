"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Heart,
  Share2,
  FolderPlus,
  Pencil,
  Trash2,
  Check,
  Copy,
  X,
  Link2,
  AlertTriangle,
} from "lucide-react";
import {
  toggleFavoriteAction,
  saveRecipeCopyAction,
  addRecipeToFamilyAction,
  createShareLinkAction,
  revokeShareLinkAction,
  deleteRecipeAction,
} from "../lib/actions";

interface Props {
  recipeId: string;
  isOwner: boolean;
  isLoggedIn: boolean;
  initialFavorited: boolean;
  /** Families the viewer belongs to (for "Add to a family"). */
  families: { id: string; name: string }[];
  /** Existing share links (owner only). */
  shareLinks: { id: string; token: string }[];
  editHref: string;
}

const pill =
  "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const primary = `${pill} bg-primary text-primary-foreground shadow-md hover:-translate-y-0.5 hover:shadow-lg`;
const secondary = `${pill} border border-border bg-card text-foreground hover:bg-accent`;
const danger = `${pill} border border-destructive/40 bg-card text-destructive hover:bg-destructive/10`;

export default function RecipePageActions({
  recipeId,
  isOwner,
  isLoggedIn,
  initialFavorited,
  families,
  shareLinks,
  editHref,
}: Props) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [familyId, setFamilyId] = useState(families[0]?.id ?? "");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function favorite() {
    setFavorited((v) => !v); // optimistic
    startTransition(async () => {
      const res = await toggleFavoriteAction(recipeId);
      setFavorited(res.favorited);
    });
  }

  function copy(token: string) {
    const url = `${window.location.origin}/r/${token}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedToken(token);
    setTimeout(() => setCopiedToken((t) => (t === token ? null : t)), 1800);
  }

  if (!isLoggedIn) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-sm">
        <Link
          href={`/login?callbackUrl=/recipes/${recipeId}`}
          className="font-semibold text-primary hover:text-primary/80"
        >
          Sign in
        </Link>{" "}
        to favorite this recipe or save it to your own box.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={favorite}
          aria-pressed={favorited}
          className={favorited ? `${pill} border border-primary/40 bg-primary/10 text-primary` : secondary}
        >
          <Heart className={`h-4 w-4 ${favorited ? "fill-current" : ""}`} />
          {favorited ? "Favorited" : "Favorite"}
        </button>

        {isOwner ? (
          <>
            <Link href={editHref} className={primary}>
              <Pencil className="h-4 w-4" /> Edit
            </Link>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className={danger}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(() => saveRecipeCopyAction(recipeId))
              }
              className={primary}
            >
              <FolderPlus className="h-4 w-4" /> Save to my recipes
            </button>
            {families.length > 0 ? (
              <div className="flex items-center gap-2">
                <select
                  value={familyId}
                  onChange={(e) => setFamilyId(e.target.value)}
                  aria-label="Choose a family"
                  className="rounded-full border border-border bg-card px-3 py-2.5 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {families.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={pending || !familyId}
                  onClick={() =>
                    startTransition(() =>
                      addRecipeToFamilyAction(recipeId, familyId),
                    )
                  }
                  className={secondary}
                >
                  Add to family
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>

      {/* Owner share links — the "friends" sharing circle. */}
      {isOwner ? (
        <div className="flex flex-col gap-3 border-t border-border pt-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Share2 className="h-4 w-4 text-primary" /> Share by link
            </h3>
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(() => createShareLinkAction(recipeId))}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <Link2 className="h-3.5 w-3.5" /> Create link
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Anyone with a link can view this recipe, even if it&apos;s private.
          </p>
          {shareLinks.length === 0 ? (
            <p className="text-xs italic text-muted-foreground">No links yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {shareLinks.map((link) => (
                <li
                  key={link.id}
                  className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2"
                >
                  <code className="flex-1 truncate text-xs text-muted-foreground">
                    /r/{link.token}
                  </code>
                  <button
                    type="button"
                    onClick={() => copy(link.token)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80"
                  >
                    {copiedToken === link.token ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() =>
                      startTransition(() =>
                        revokeShareLinkAction(link.id, recipeId),
                      )
                    }
                    aria-label="Revoke link"
                    className="text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {/* Delete confirmation dialog. */}
      {confirmingDelete ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setConfirmingDelete(false)}
            aria-hidden
          />
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  Delete this recipe?
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  This permanently removes the recipe and its ingredients,
                  steps, and photo. This can&apos;t be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className={secondary}
              >
                Keep recipe
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => startTransition(() => deleteRecipeAction(recipeId))}
                className={`${pill} bg-destructive text-white shadow-sm hover:bg-destructive/90`}
              >
                <Trash2 className="h-4 w-4" /> Delete recipe
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
