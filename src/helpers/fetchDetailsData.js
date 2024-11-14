import { API_KEY, apiUrl } from "./api.config";
import { getFromCache, saveToCache } from "./cache/cache";
import { ONE_MONTH, THREE_DAYS } from "./constants";

export const fetchDetailsData = async (typeOfSearch, mediaType, id) => {
  if (!id) throw new Error("id undefined");

  const CACHEURL = `${mediaType}-${typeOfSearch}-${id}`;
  let url;
  let validTime = ONE_MONTH;

  switch (typeOfSearch) {
    case "byId":
      url = `${apiUrl}${mediaType}/${id}?api_key=${API_KEY}`;
      break;
    case "similar":
      url = `${apiUrl}${mediaType}/${id}/similar?api_key=${API_KEY}`;
      break;
    case "cast":
      url = `${apiUrl}${mediaType}/${id}/credits?api_key=${API_KEY}&language=en-US&page=1`;
      break;
    case "reviews":
      url = `${apiUrl}${mediaType}/${id}/reviews?api_key=${API_KEY}`;
      validTime = THREE_DAYS;
      break;
    default:
      break;
  }

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
