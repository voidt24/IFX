import { getFromCache, saveToCache } from "./cache/cache";
import { ONE_MONTH, THREE_DAYS } from "./constants";
import { resolveFetchURL } from "./resolveFetchURL";

export const fetchDetailsData = async (typeOfSearch, mediaType, id) => {
  if (!id) throw new Error("id undefined");

  const CACHEURL = `${mediaType}-${typeOfSearch}-${id}`;
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
