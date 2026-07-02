import Link from "next/link";
import { Check, Crown, Heart, Sparkles } from "lucide-react";
import { getSession } from "@/app/lib/auth";
import {
  FREE_AUTHORED_RECIPE_LIMIT,
  FREE_FAMILY_MEMBER_LIMIT,
  getUserPlan,
} from "@/app/lib/entitlements";
import { checkoutAction } from "@/app/lib/payment-actions";
import { PLAN_OFFERS } from "@/app/lib/payments";

/**
 * Pricing — the funnel's front door. Public page: the free tier is presented
 * as the product (the soul is never gated), the paid tiers as support with
 * room to grow; Family is the hero (one organizer lifts the caps for the
 * whole table). Prices are Frost's decided goodwill band — see
 * app/lib/payments.ts before changing anything.
 */
export default async function PricingPage() {
  const session = await getSession();
  const plan = session?.user?.id ? await getUserPlan(session.user.id) : null;
  const isPremium = plan === "PREMIUM";

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <div className="flex flex-col gap-3 text-center">
        <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
          Plans
        </span>
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          The recipes are free.
          <br className="hidden sm:block" /> The room to grow is how you help.
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
          Keeping, cooking, and sharing your family&apos;s recipes will never
          be paywalled. Paid plans lift the two generous caps — and keep a
          one-person project alive.
        </p>
      </div>

      {/* Free — the product itself. */}
      <section className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
          <Heart className="h-4 w-4 text-primary" />
          Free — the soul, forever
        </span>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Every feature that matters: your recipe box ({FREE_AUTHORED_RECIPE_LIMIT}{" "}
          of your own recipes), families up to {FREE_FAMILY_MEMBER_LIMIT},
          stories, sharing, cooking mode, printing. Shared and family recipes
          never count against you.
        </p>
      </section>

      {/* Paid tiers — Family is the hero. */}
      <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
        {PLAN_OFFERS.map((offer) => (
          <section
            key={offer.id}
            className={`flex flex-col gap-5 rounded-3xl border bg-card p-6 shadow-sm ${
              offer.hero
                ? "border-primary/50 ring-2 ring-primary/30 md:-my-3 md:py-9"
                : "border-border"
            }`}
          >
            <div className="flex flex-col gap-1.5">
              {offer.hero ? (
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
                  <Crown className="h-3.5 w-3.5" /> Most loved
                </span>
              ) : null}
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                {offer.name}
              </h2>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold tracking-tight text-foreground">
                  {offer.price}
                </span>
                <span className="text-sm font-semibold text-muted-foreground">
                  {offer.cadence}
                </span>
              </div>
              <p className="font-serif text-sm italic text-muted-foreground">
                {offer.tagline}
              </p>
            </div>

            <ul className="flex flex-1 flex-col gap-2.5">
              {offer.perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="h-3 w-3" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>

            {isPremium ? (
              <span className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary">
                <Check className="h-4 w-4" />
                You&apos;re Premium
              </span>
            ) : session?.user?.id ? (
              <form action={checkoutAction}>
                <input type="hidden" name="offer" value={offer.id} />
                <button
                  type="submit"
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    offer.hero
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-foreground hover:bg-accent"
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  Choose {offer.name}
                </button>
              </form>
            ) : (
              <Link
                href="/signup?callbackUrl=/pricing"
                className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  offer.hero
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-foreground hover:bg-accent"
                }`}
              >
                Start free, then {offer.name}
              </Link>
            )}
          </section>
        ))}
      </div>

      <p className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
        Beta honesty: checkout isn&apos;t wired to a payment processor yet —
        choosing a plan unlocks Premium free while we test. Prices shown are
        what launch is planned around. Regional pricing comes later.
      </p>
    </div>
  );
}
