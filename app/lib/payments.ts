import { prisma } from "./prisma";

/**
 * The payment funnel's backbone: the plan catalog (Frost's DECIDED goodwill
 * band — do not change prices casually, see the decision ledger) and a
 * provider abstraction so a real processor drops in without touching the
 * pricing page or the checkout action.
 *
 * NO processor is wired tonight (hard line: no accounts, no real charging).
 * The active provider is the beta one: it flips `User.plan` exactly like the
 * existing /upgrade beta flow, so Frost can walk the whole funnel end-to-end.
 *
 * When Stripe lands (Frost's call — needs his account + keys):
 *   1. implement `StripePaymentProvider.createCheckout` → Checkout Session,
 *      return its URL; 2. add the webhook route to set `User.plan` on
 *      `checkout.session.completed`; 3. swap `activeProvider`. Offer-level
 *      billing metadata (which offer, renewal dates) needs its own table —
 *      parked in the proposed-schema-adds list.
 */

export type OfferId = "individual" | "family" | "lifetime";

export interface PlanOffer {
  id: OfferId;
  name: string;
  /** Display price — USD, decided band. */
  price: string;
  cadence: "per year" | "one-time";
  tagline: string;
  perks: string[];
  /** The hero offer gets the big card. */
  hero?: boolean;
}

// Lifetime shows the LOW end of the decided $59–79 band (most conservative
// for the goodwill positioning). Frost: change this one string to land the
// final number.
export const PLAN_OFFERS: PlanOffer[] = [
  {
    id: "individual",
    name: "Individual",
    price: "$11.99",
    cadence: "per year",
    tagline: "Room for every dish you'll ever cook.",
    perks: [
      "Unlimited recipes in your own box",
      "Everything in Free, forever",
      "You keep a one-person project alive",
    ],
  },
  {
    id: "family",
    name: "Family",
    price: "$24.99",
    cadence: "per year",
    tagline: "One supporter, the whole table eats.",
    hero: true,
    perks: [
      "Everything in Individual",
      "Families grow to 50 members",
      "Members pay nothing — the organizer lifts every cap",
      "The family archive, funded by one person",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "$59",
    cadence: "one-time",
    tagline: "Pay once. Pass it down.",
    perks: [
      "Everything in Family",
      "One payment, no renewals",
      "An heirloom of an account",
    ],
  },
];

export function getOffer(id: string): PlanOffer | null {
  return PLAN_OFFERS.find((o) => o.id === id) ?? null;
}

/** What a checkout attempt resolves to. */
export interface CheckoutResult {
  /** Where to send the user next (a processor URL, or an internal path). */
  redirectUrl: string;
}

export interface PaymentProvider {
  readonly name: string;
  /**
   * Start a checkout for `userId` buying `offer`. Implementations either
   * fulfill immediately (beta) or return a hosted-checkout URL (Stripe).
   */
  createCheckout(userId: string, offer: PlanOffer): Promise<CheckoutResult>;
}

/**
 * Beta provider — no money moves. Grants PREMIUM immediately (all current
 * offers map to the single PREMIUM entitlement tier; offer-level billing
 * distinctions become real when a processor lands).
 */
const betaProvider: PaymentProvider = {
  name: "beta",
  async createCheckout(userId, offer) {
    await prisma.user.update({
      where: { id: userId },
      data: { plan: "PREMIUM" },
    });
    return { redirectUrl: `/upgrade?welcome=${offer.id}` };
  },
};

export const activeProvider: PaymentProvider = betaProvider;
