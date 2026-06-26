import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Create a Redis client only if both Upstash env vars are set.
 * If either is missing, rate limiting is gracefully disabled — the app works
 * normally without Upstash.
 */
function createRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  try {
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

const redis = createRedisClient();

/**
 * Sliding-window rate limiter for login attempts:
 * 10 attempts per 1 minute per identifier (IP address).
 */
export const loginRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      prefix: "rl:login:",
    })
  : null;

/**
 * Sliding-window rate limiter for sign-up attempts:
 * 5 attempts per 1 minute per identifier (IP address).
 */
export const signupRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      prefix: "rl:signup:",
    })
  : null;

/**
 * Check a rate limiter against a given identifier.
 *
 * If the limiter is `null` (no Upstash configured), the check always passes.
 * Otherwise it calls `limiter.limit(identifier)` and returns the result.
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string,
): Promise<{ success: boolean }> {
  if (!limiter) {
    return { success: true };
  }

  return limiter.limit(identifier);
}
