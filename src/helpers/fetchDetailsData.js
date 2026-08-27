import { getFromCache, saveToCache } from "./cache/cache";
import { ONE_MONTH, THREE_DAYS } from "./constants";
import { resolveFetchURL } from "./resolveFetchURL";

export const fetchDetailsData = async (typeOfSearch, mediaType, id) => {
  if (!id) throw new Error("id undefined");

  // byId now carries append_to_response=keywords,watch/providers (needed for the
  // Original-content cascade) — versioned so previously-cached entries (missing
  // those fields) get bypassed instead of served stale for up to a month.
  const CACHEURL = typeOfSearch === "byId" ? `${mediaType}-${typeOfSearch}-v2-${id}` : `${mediaType}-${typeOfSearch}-${id}`;
  let url = resolveFetchURL(typeOfSearch, mediaType, id);
  let validTime = typeOfSearch === "reviews" ? THREE_DAYS : ONE_MONTH;

  const getFromApi = async () => {
    try {
      const data = await fetch(url);
      const json = await data.json();

      return json;
    } catch (e) {
      return Promise.reject(e);
    }
  };

  try {
    return await getFromCache(CACHEURL, getFromApi);
  } catch (e) {
    const dataFromApi = await getFromApi();
    await saveToCache(dataFromApi, CACHEURL, validTime);

    return dataFromApi;
  }
};
