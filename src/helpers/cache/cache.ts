import { CACHENAME, ISliderMovieData, ISliderTVData } from "../api.config";
import { IdataResults } from "../search";

export const getFromCache = async (url: string, getFromApi: () => Promise<unknown>) => {
  try {
    const response = await caches.match(url);
    const expirationResponse = await caches.match(`${url}-expiration`);

    if (response) {
      const expirationDate = await expirationResponse?.json();
      if (Date.now() > expirationDate.validTime) {
        const cache = await caches.open(CACHENAME);
        await cache.delete(url);
        await cache.delete(`${url}-expiration`);
        return getFromApi();
      }

      const json = await response.json();
      return json;
    } else {
      throw new Error();
    }
  } catch (e) {
    throw e;
  }
};

export const saveToCache = async (json: ISliderMovieData[] | ISliderTVData[] | IdataResults, url: string, validTime: number) => {
  try {
    const responseClone = new Response(JSON.stringify(json), {
      headers: { "Content-Type": "application/json" },
    });

    const cache = await caches.open(CACHENAME);
    await cache.put(url, responseClone);
    await cache.put(`${url}-expiration`, new Response(JSON.stringify({ headers: { "Content-Type": "application/json" }, validTime })));
  } catch (e) {
    //no actions on this exception
  }
};
