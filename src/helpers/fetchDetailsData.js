import { getFromCache, saveToCache } from "./cache/cache";

export const fetchDetailsData = async (id, url, validTime, CACHEURL) => {
  if (!id) throw new Error("id undefined");

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
