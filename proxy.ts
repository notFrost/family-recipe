import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy (formerly Middleware in Next.js < 16) that sanitizes request headers
 * before they reach server-side code.
 *
 * WHY: NextAuth v5's signIn/signOut functions do `new Headers(await nextHeaders())`
 * which copies ALL request headers. The Headers API requires ByteString values
 * (characters 0-255). Vercel injects geo headers (x-vercel-ip-city, etc.) that
 * can contain characters > 255, causing a TypeError that breaks login/signup.
 *
 * This proxy strips characters > 255 from all header values before they reach
 * the app, preventing the ByteString error.
 */
export function proxy(request: NextRequest) {
  const sanitizedHeaders = new Headers();

  for (const [key, value] of request.headers.entries()) {
    // Remove any character with a code point > 255 (non-ByteString).
    // These are typically in Vercel's geo headers (x-vercel-ip-city, etc.)
    // and are informational only — removing them doesn't affect app logic.
    const sanitized = value.replace(/[^\x00-\xFF]/g, "");
    sanitizedHeaders.set(key, sanitized);
  }

  return NextResponse.next({
    request: {
      headers: sanitizedHeaders,
    },
  });
}

export const config = {
  // Run on all routes except static assets.
  // Server actions are POST requests to the page route, so they're covered.
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
