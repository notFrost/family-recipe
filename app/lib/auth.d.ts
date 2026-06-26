import type { DefaultSession } from "next-auth";

/**
 * Module augmentation for NextAuth (Auth.js) v5.
 *
 * Adds our custom `id` claim onto the JWT and guarantees `session.user.id`
 * is typed. Pure type-level declarations — no runtime output.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
