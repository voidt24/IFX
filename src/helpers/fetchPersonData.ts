import { getFromCache, saveToCache } from "./cache/cache";
import { ONE_MONTH } from "./constants";
import { resolvePersonFetchURL } from "./resolvePersonFetchURL";
import { IPersonDetails } from "@/Types/person";

// Distinguishes "actor doesn't exist" (→ notFound()) from transient/network
// failures (→ error boundary) for callers of fetchPersonData.
export class PersonNotFoundError extends Error {
  constructor(id: number | string) {
    super(`Person ${id} not found`);
    this.name = "PersonNotFoundError";
  }
}

// Mirrors fetchDetailsData.js: cache-first (Cache Storage API), falls back to a
// plain fetch on the server or whenever the cache read/write is unavailable.
export const fetchPersonData = async (id: number | string): Promise<IPersonDetails> => {
  if (!id) throw new Error("id undefined");

  const CACHEURL = `person-byId-v1-${id}`;
  const url = resolvePersonFetchURL(id);

  const getFromApi = async (): Promise<IPersonDetails> => {
    const res = await fetch(url);

    if (res.status === 404) throw new PersonNotFoundError(id);
    if (!res.ok) throw new Error("Failed to fetch actor details");

    return res.json();
  };

  try {
    return (await getFromCache(CACHEURL, getFromApi)) as IPersonDetails;
  } catch {
    const dataFromApi = await getFromApi();
    await saveToCache(dataFromApi, CACHEURL, ONE_MONTH);

    return dataFromApi;
  }
};
