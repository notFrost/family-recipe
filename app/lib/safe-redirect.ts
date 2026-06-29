/**
 * Coerce an untrusted post-auth redirect target to a safe, same-origin path.
 *
 * `callbackUrl` reaches us from the query string and from a hidden form field,
 * both attacker-controllable. Passing it straight to `redirect()` (or to an
 * OAuth `callbackURL`) is an open-redirect: `?callbackUrl=https://evil.com`
 * would bounce a freshly-authenticated user to a phishing site.
 *
 * A safe value is a path on THIS site: it must start with a single "/" and not
 * be protocol-relative ("//evil.com") or a back-slash trick ("/\\evil.com",
 * which some browsers normalize to "//"). Anything else falls back to "/".
 */
export function internalPath(
  value: string | null | undefined,
  fallback = "/",
): string {
  if (typeof value !== "string" || !value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
