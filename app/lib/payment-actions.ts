"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "./auth";
import { activeProvider, getOffer } from "./payments";

/**
 * Start a checkout from the pricing page.
 *
 * SECURITY: the user is the SESSION user, never form data; the offer id is
 * validated against the catalog (an unknown id just returns to /pricing).
 * The provider decides where the user goes next — today the beta provider
 * fulfills instantly; a real processor will return its hosted-checkout URL.
 */
export async function checkoutAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/pricing");
  }

  // FormData.get can return a File for multipart file fields — a crafted
  // request must bounce like any other invalid offer, not 500 on .trim().
  const raw = formData.get("offer");
  const offerId = typeof raw === "string" ? raw.trim() : "";
  const offer = getOffer(offerId);
  if (!offer) {
    redirect("/pricing");
  }

  const { redirectUrl } = await activeProvider.createCheckout(
    session.user.id,
    offer,
  );

  // Plan changes affect gates rendered across the app (caps, upsells).
  revalidatePath("/", "layout");
  redirect(redirectUrl);
}
