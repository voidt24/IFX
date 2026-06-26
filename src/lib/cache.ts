import { redis } from "./redis";

/**
 * Reads `key` from Redis. On a miss (or any Redis error), calls `fetchFn`,
 * stores the result with a TTL of `ttlSeconds`, and returns it.
 *
 * Used server-side only (Route Handlers) so the cache is shared across
 * every visitor instead of living in each browser's own Cache Storage.
 */
export async function getOrSetCache<T>(key: string, ttlSeconds: number, fetchFn: () => Promise<T>): Promise<T> {
  try {
    const cached = await redis.get<T>(key);
    if (cached !== null && cached !== undefined) {
      return cached;
    }
  } catch (e) {
    // If Redis is down/misconfigured, don't break the page — fall through to the API call.
    console.error(`[redis] read failed for key "${key}"`, e);
  }

  const fresh = await fetchFn();

  try {
    await redis.set(key, fresh, { ex: ttlSeconds });
  } catch (e) {
    console.error(`[redis] write failed for key "${key}"`, e);
  }

  return fresh;
}
