/**
 * Design-review flag — gates the /preview harness (styles, branding) AND the
 * floating "Review designs" CTA, so design rounds are opt-in per deployment:
 *
 * - Production: ALWAYS off, hard-coded. The harness never ships to the public
 *   app, no burn-down needed before going public.
 * - `DESIGN_REVIEW` env var (Vercel Preview scope): set to "0" to go quiet
 *   between review rounds; remove it (or set "1") when sharing the dev
 *   preview for a design round.
 * - Unset: visible on non-production, so local dev and review rounds work
 *   without ceremony.
 *
 * Server-only (read in server layouts) — no NEXT_PUBLIC exposure.
 */
export function designReviewEnabled(): boolean {
  if (process.env.VERCEL_ENV === "production") return false;
  const flag = process.env.DESIGN_REVIEW?.trim().toLowerCase();
  return flag !== "0" && flag !== "false" && flag !== "off";
}
