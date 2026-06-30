import { redirect } from "next/navigation";
import { Check, Sparkles, Heart } from "lucide-react";
import { getSession } from "@/app/lib/auth";
import { getUserPlan, FREE_AUTHORED_RECIPE_LIMIT } from "@/app/lib/entitlements";
import { upgradePlanAction, downgradePlanAction } from "@/app/lib/actions";

const REASONS: Record<string, string> = {
  "recipe-limit": `You've filled your free recipe box (${FREE_AUTHORED_RECIPE_LIMIT} of your own recipes). Premium makes it unlimited.`,
  "family-limit": "This family has reached its free member limit. Premium lifts it for everyone at the table.",
};

const PERKS = [
  "Unlimited recipes in your own box",
  "Bigger families — invite the whole extended table",
  "Everything that keeps your family's recipes safe, forever",
  "You directly keep a one-person project alive",
];

export default async function UpgradePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/upgrade");
  }
  const plan = await getUserPlan(session.user.id);
  const sp = await searchParams;
  const reason = typeof sp.reason === "string" ? REASONS[sp.reason] : undefined;
  const isPremium = plan === "PREMIUM";

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        {isPremium ? <Heart className="h-7 w-7 fill-current" /> : <Sparkles className="h-7 w-7" />}
      </span>

      {isPremium ? (
        <>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            You&apos;re on Premium — thank you
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Every limit is lifted. Genuinely, thank you for supporting the
            project — this is what keeps it going.
          </p>
          <form action={downgradePlanAction}>
            <button
              type="submit"
              className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent"
            >
              Switch back to Free (testing)
            </button>
          </form>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Family Recipe Premium
          </h1>
          {reason ? (
            <p className="rounded-xl bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground">
              {reason}
            </p>
          ) : null}
          <p className="text-base leading-relaxed text-muted-foreground">
            The free plan does everything that matters — keep, cook, and share
            your family&apos;s recipes. Premium is for when you want room to
            grow, and a way to support a project built by one person.
          </p>
          <ul className="flex w-full flex-col gap-2.5 text-left">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-2.5 text-sm text-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {perk}
              </li>
            ))}
          </ul>
          <form action={upgradePlanAction} className="w-full">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Sparkles className="h-5 w-5" />
              Go Premium
            </button>
          </form>
          <p className="text-xs text-muted-foreground">
            Beta: no payment yet — this unlocks Premium so you can try it. Real
            checkout comes later.
          </p>
        </>
      )}
    </div>
  );
}
