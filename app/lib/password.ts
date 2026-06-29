import bcrypt from "bcryptjs";

/**
 * Password hashing for Better Auth's email/password provider.
 *
 * We deliberately keep bcrypt (cost 12) instead of Better Auth's default
 * scrypt so that password hashes created under the previous Auth.js setup keep
 * verifying unchanged — every existing user can log in with no rehash. New
 * sign-ups are hashed with the same bcrypt parameters, so old and new accounts
 * share one scheme. Wired into `betterAuth` via `emailAndPassword.password`.
 */
const BCRYPT_COST = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

export async function verifyPassword({
  password,
  hash,
}: {
  password: string;
  hash: string;
}): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
