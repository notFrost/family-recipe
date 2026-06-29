"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { loginAction, type AuthFormState } from "../lib/actions";
import SocialButtons from "./SocialButtons";

const inputClasses =
  "w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring";

const labelClasses = "text-sm font-medium text-foreground";

interface LoginFormProps {
  /** Where to redirect after a successful sign-in. */
  callbackUrl?: string;
  /**
   * Error to show on first render — used to surface an OAuth callback failure
   * passed back via `?error=` (e.g. the email is already registered another
   * way). A subsequent email/password submit overrides it with its own result.
   */
  initialError?: string;
}

export default function LoginForm({
  callbackUrl = "/",
  initialError,
}: LoginFormProps) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    loginAction,
    {},
  );

  const error = state.error ?? initialError;

  return (
    <div className="flex flex-col gap-6">
      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      <SocialButtons callbackUrl={callbackUrl} />

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          or with email
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={action} className="flex flex-col gap-5">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClasses}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className={labelClasses}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className={inputClasses}
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
