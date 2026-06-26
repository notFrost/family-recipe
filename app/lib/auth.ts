import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./user-repository";

/**
 * NextAuth (Auth.js) v5 configuration.
 *
 * Session strategy: JWT (stateless). Sessions are signed with `AUTH_SECRET`
 * and carried in the session cookie — nothing is persisted to the database,
 * so the Prisma adapter and its Account / Session / VerificationToken tables
 * are intentionally not used (see prisma/schema.prisma for the rationale).
 *
 * Provider: Credentials (email + password). On sign-in we look the user up by
 * email and verify the submitted password against the stored bcrypt hash. The
 * `id` and `email` are threaded through the JWT (`jwt` callback) onto the
 * session (`session` callback) so that `session.user.id` is available to
 * callers — this is what later sub-milestones rely on for author scoping.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string" ? credentials.email : null;
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : null;

        if (!email || !password) {
          return null;
        }

        const user = await getUserByEmail(email);
        if (!user) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          password,
          user.passwordHash,
        );
        if (!passwordMatches) {
          return null;
        }

        // Returned object becomes the `user` arg on the first `jwt` callback.
        // Never expose the password hash.
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, persist the user id onto the token.
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Surface the user id on the session for downstream author scoping.
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
