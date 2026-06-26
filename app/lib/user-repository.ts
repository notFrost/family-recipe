import { prisma } from "./prisma";
import type { UserModel as UserRow } from "../generated/prisma/models";

/**
 * Minimal user data access for authentication.
 *
 * Kept separate from the recipe repository because users are an
 * authentication concern, not recipe content. Only the helpers actually
 * needed right now are exposed:
 *
 *  - `getUserByEmail` — used by the NextAuth Credentials provider to look up a
 *    user (and their `passwordHash`) for verification.
 *  - `createUser` — used by signup (wired up in a later sub-milestone). Hashing
 *    is the caller's responsibility; this stores the already-hashed value.
 *
 * Rows are returned as the raw Prisma `User` model. There is intentionally no
 * separate app-level User type yet (none is needed in 5a); callers that must
 * not leak `passwordHash` should select the fields they need.
 */
export interface CreateUserInput {
  email: string;
  passwordHash: string;
  name?: string | null;
}

/** Look up a user by their (unique) email. Returns `null` if not found. */
export async function getUserByEmail(email: string): Promise<UserRow | null> {
  return prisma.user.findUnique({ where: { email } });
}

/** Create a new user with an already-hashed password. */
export async function createUser(input: CreateUserInput): Promise<UserRow> {
  return prisma.user.create({
    data: {
      email: input.email,
      passwordHash: input.passwordHash,
      name: input.name ?? null,
    },
  });
}
