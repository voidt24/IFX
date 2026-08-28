import { getBaseUrl } from "@/lib/env";

/**
 * Movie/TV details (byId, images, cast/credits, reviews) now live behind
 * /api/tmdb/details, which reads/writes a shared Redis cache on the server —
 * mirrors the fetchGeneralData/fetchFilteredData pattern in fetchInitialData.ts.
 *
 * When the browser reports no connection, the request is flagged as cache-only:
 * the server skips TMDB entirely and returns whatever is already in Redis (or
 * signals nothing is cached), instead of attempting a call that would just fail.
 */
export const fetchDetailsData = async (typeOfSearch, mediaType, id) => {
  if (!id) throw new Error("id undefined");

  const isOffline = typeof navigator !== "undefined" && "onLine" in navigator && navigator.onLine === false;

  const params = new URLSearchParams({ mediaType, id: String(id), type: typeOfSearch });
  if (isOffline) params.set("cacheOnly", "true");

  const res = await fetch(`${getBaseUrl()}/api/tmdb/details?${params.toString()}`);
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

  const { data, cached } = await res.json();

  if (isOffline && !cached) {
    // Nothing shared in Redis for this title — surface a clear rejection instead
    // of an empty payload, so callers (Promise.allSettled, try/catch) treat it
    // the same way they treat any other failed fetch.
    throw new Error("offline-no-cache");
  }

  return data;
};
