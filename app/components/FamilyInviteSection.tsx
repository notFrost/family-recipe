"use client";

import { useState, useTransition } from "react";
import { Link2, Copy, Check, X } from "lucide-react";
import {
  createFamilyInviteAction,
  revokeFamilyInviteAction,
} from "../lib/actions";

interface Props {
  familyId: string;
  invites: { id: string; token: string }[];
  /** When true, the family is at its member cap — invites are discouraged. */
  atCap: boolean;
}

export default function FamilyInviteSection({
  familyId,
  invites,
  atCap,
}: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function copy(token: string) {
    const url = `${window.location.origin}/families/${familyId}/join?token=${token}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(token);
    setTimeout(() => setCopied((t) => (t === token ? null : t)), 1800);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-foreground">Invite members</h2>
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => createFamilyInviteAction(familyId))}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          <Link2 className="h-3.5 w-3.5" /> Create invite link
        </button>
      </div>
      <p className="text-sm text-muted-foreground">
        Share a link with your family so they can join.
      </p>

      {invites.length === 0 ? (
        <p className="text-xs italic text-muted-foreground">
          No invite links yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {invites.map((invite) => (
            <li
              key={invite.id}
              className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2"
            >
              <code className="flex-1 truncate text-xs text-muted-foreground">
                …/join?token={invite.token.slice(0, 8)}…
              </code>
              <button
                type="button"
                onClick={() => copy(invite.token)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80"
              >
                {copied === invite.token ? (
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
                    revokeFamilyInviteAction(invite.id, familyId),
                  )
                }
                aria-label="Revoke invite"
                className="text-muted-foreground transition-colors hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {atCap ? (
        <p className="rounded-xl bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground">
          This family is at its member limit. New members can&apos;t join until
          you{" "}
          <a href="/upgrade?reason=family-limit" className="font-bold text-primary underline-offset-2 hover:underline">
            upgrade
          </a>
          .
        </p>
      ) : null}
    </div>
  );
}
