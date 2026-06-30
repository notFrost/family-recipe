import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/app/lib/auth";
import { internalPath } from "@/app/lib/safe-redirect";
import LoginForm from "@/app/components/LoginForm";
import ThemeToggle from "@/app/components/ThemeToggle";
import DoodleField from "@/app/components/DoodleField";

/**
 * Map a Better Auth OAuth callback `?error=` code to a friendly message.
 *
 * The case that matters here: a user signs in with Google/Facebook but that
 * email already belongs to an account created a different way (email/password,
 * or the other provider) and Better Auth won't implicitly link it — the email
 * isn't verified on the existing account, which is the safe default that stops
 * an unverified account from being silently taken over. We tell them to sign in
 * the original way rather than dropping them on a blank/404 error page.
 */
function oauthErrorMessage(code: string): string {
  switch (code) {
    case "account_not_linked":
      return "That email is already registered. Please sign in with the method you used originally (email and password, or the other provider).";
    case "email_doesn't_match":
    case "account_already_linked_to_different_user":
      return "That account is already linked to a different user.";
    case "email_not_found":
      return "We couldn’t get an email from that provider. Try a different sign-in method.";
    default:
      return "We couldn’t sign you in with that provider. Please try again.";
  }
}

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const session = await getSession();
  if (session?.user?.id) {
    redirect("/");
  }

  const { callbackUrl, error } = await searchParams;
  // Constrain the redirect target to a same-origin path (open-redirect guard).
  const callback = internalPath(
    typeof callbackUrl === "string" ? callbackUrl : undefined,
  );
  const errorCode = typeof error === "string" ? error : undefined;
  const errorMessage = errorCode ? oauthErrorMessage(errorCode) : undefined;

  return (
    <div className="flex min-h-screen w-full">
      {/* Decorative image panel (hidden on mobile). */}
      <div className="relative hidden shrink-0 lg:block lg:w-[55%]">
        <Image
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80&auto=format&fit=crop"
          alt=""
          fill
          sizes="55vw"
          quality={80}
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#241a12]/85 via-[#3b2417]/45 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 pb-16">
          <Link href="/" className="mb-4 flex w-fit items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-lg text-primary-foreground shadow-lg">
              🍳
            </span>
            <span className="text-2xl font-bold tracking-tight text-white">
              Family Recipe
            </span>
          </Link>
          <p className="max-w-xs text-lg font-light leading-relaxed text-white/85">
            Gather round the table — cook, share, and pass down the recipes that
            bring everyone back for seconds.
          </p>
        </div>
      </div>

      {/* Form panel. */}
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-background px-6 py-12 sm:px-10">
        <DoodleField className="absolute" />
        <div className="absolute right-5 top-5 z-10">
          <ThemeToggle />
        </div>
        <div className="relative z-10 w-full max-w-[420px]">
          <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-base shadow-sm">
              🍳
            </span>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Family Recipe
            </span>
          </Link>

          <div className="mb-8 flex flex-col gap-2">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Welcome back
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Sign in to your kitchen
            </h1>
            <p className="text-base text-muted-foreground">
              Add and manage your recipes, and cook with your family.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <LoginForm callbackUrl={callback} initialError={errorMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}
