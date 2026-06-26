/**
 * Instrumentation: runs once at server startup before any request.
 *
 * Patches the global Headers constructor to strip non-ASCII characters (> 255)
 * from header values. This is required because:
 * - Vercel injects geo headers (x-vercel-ip-city, etc.) that can contain
 *   non-ASCII characters (e.g., accented city names).
 * - NextAuth v5's signIn() does `new Headers(await nextHeaders())` internally,
 *   which copies ALL request headers. The Headers API requires ByteString
 *   values (chars 0-255), so non-ASCII values throw a TypeError.
 * - The proxy.ts approach didn't work because Next.js 16's proxy header
 *   propagation doesn't reach headers() in server actions.
 *
 * By patching at the Headers constructor level, we guarantee that EVERY
 * `new Headers()` call in the app is safe, including NextAuth's internal one.
 */
export function register() {
  const PATCHED = Symbol.for("next-headers-bytestring-patch");

  // Avoid double-patching (Next.js may call register() more than once)
  if ((globalThis.Headers as unknown as Record<symbol, boolean>)[PATCHED]) return;

  const OriginalHeaders = globalThis.Headers;

  function sanitize(value: string): string {
    return String(value).replace(/[^\x00-\xFF]/g, "");
  }

  /**
   * PatchedHeaders wraps the native Headers class, sanitizing all values
   * (including constructor init values) before they reach the native API.
   */
  class PatchedHeaders extends OriginalHeaders {
    constructor(init?: HeadersInit) {
      if (init === undefined || init === null) {
        super();
        return;
      }

      if (init instanceof OriginalHeaders) {
        // init is another Headers object — iterate its entries and append
        // sanitized values to preserve duplicate header names.
        super();
        for (const [key, value] of init.entries()) {
          super.append(key, sanitize(value));
        }
        return;
      }

      if (Array.isArray(init)) {
        // init is an array of [key, value] pairs — append each sanitized value
        super();
        for (const [key, value] of init) {
          super.append(key, sanitize(value));
        }
        return;
      }

      // init is a plain object record (keys are unique, so set is fine)
      super();
      for (const key of Object.keys(init)) {
        const value = (init as Record<string, string>)[key];
        super.set(key, sanitize(value));
      }
    }

    set(name: string, value: string): void {
      super.set(name, sanitize(value));
    }

    append(name: string, value: string): void {
      super.append(name, sanitize(value));
    }
  }

  // Mark as patched so re-entrant calls are no-ops
  (PatchedHeaders as unknown as Record<symbol, boolean>)[PATCHED] = true;

  globalThis.Headers = PatchedHeaders as typeof Headers;
}
