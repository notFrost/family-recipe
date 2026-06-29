import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { prisma } from "./prisma";
import { hashPassword, verifyPassword } from "./password";

/**
 * Better Auth configuration (replaces the previous Auth.js v5 setup).
 *
 * - Email + password only (no OAuth yet). Passwords use bcrypt via the custom
 *   hash/verify hooks in `./password`, so existing Auth.js-era hashes keep
 *   working with no rehash.
 * - Sessions are database-backed (the `Session` table) with a short-lived
 *   signed cookie cache, so most requests resolve the session from the cookie
 *   without a DB round-trip — close to the old stateless-JWT feel, but now
 *   revocable. This is the deliberate reversal of the old "no session table"
 *   decision (see prisma/schema.prisma).
 * - `nextCookies()` MUST be the last plugin: it lets server actions set the
 *   session cookie when calling `auth.api.signInEmail` / `signUpEmail`.
 *
 * Secret resolution falls back to the old `AUTH_SECRET` so the same value works
 * locally during the migration; production sets `BETTER_AUTH_SECRET`.
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  secret: process.env.BETTER_AUTH_SECRET ?? process.env.AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    password: { hash: hashPassword, verify: verifyPassword },
  },
  // Social login (Google + Facebook). Each provider is only registered when its
  // OAuth credentials are present, so the app boots fine without them. To enable
  // the buttons, set per-environment: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET and
  // FACEBOOK_CLIENT_ID / FACEBOOK_CLIENT_SECRET, and add the redirect URI
  // <BETTER_AUTH_URL>/api/auth/callback/{google|facebook} in each provider's console.
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
          },
        }
      : {}),
    ...(process.env.FACEBOOK_CLIENT_ID
      ? {
          facebook: {
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
          },
        }
      : {}),
  },
  session: {
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  plugins: [nextCookies()],
});

/**
 * Back-compat session helper. Mirrors the old NextAuth `auth()` return shape
 * ({ user, session } | null) so server components keep doing
 * `const session = await getSession(); session?.user?.id`.
 */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}
