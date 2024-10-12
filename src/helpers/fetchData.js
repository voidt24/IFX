import { apiUrl, API_KEY } from "./api.config";

export const fetchData = async (obj) => {
  const { mediaType, category, limit } = obj;

  const trendingUrl = `${apiUrl}${category[0]}/${mediaType}/day?api_key=${API_KEY}&page=1`;
  const popularUrl = `${apiUrl}${mediaType}/${category[1]}?api_key=${API_KEY}&page=1`;

  const validTime = Date.now() + 259200000; //3 days

  const CACHENAME = "prods-cache-v2";

  const fetchNormal = async () => {
    try {
      const trendingData = await fetch(trendingUrl);
      const popularData = await fetch(popularUrl);

      const jsonTrendingRequest = await trendingData.json();
      const jsonPopularRequest = await popularData.json();

      if (trendingData.ok && popularData.ok) {
        const jsonTrendingResults = jsonTrendingRequest.results.slice(0, mediaType == "movie" ? limit[0] : limit[2]);
        const jsonPopularResults = jsonPopularRequest.results.slice(0, limit[1]);

        const responseClone = new Response(JSON.stringify(jsonTrendingResults), {
          headers: { "Content-Type": "application/json" },
        });
        const responseClone2 = new Response(JSON.stringify(jsonPopularResults), {
          headers: { "Content-Type": "application/json" },
        });

        const cache = await caches.open(CACHENAME);
        await cache.put(trendingUrl, responseClone);
        await cache.put(popularUrl, responseClone2);
        await cache.put(`${mediaType}-expiration`, new Response(JSON.stringify({ headers: { "Content-Type": "application/json" }, validTime })));

        const dataArray = [];
        dataArray.push(jsonTrendingResults, jsonPopularResults);

        return dataArray;
      } else {
        return Promise.reject();
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };

  try {
    const response = await caches.match(trendingUrl);
    const response2 = await caches.match(popularUrl);
    const expirationResponse = await caches.match(`${trendingUrl}-expiration`);

    if (response && response2) {
      const expirationDate = await expirationResponse.json();
      if (Date.now() > expirationDate.validTime) {
        const cache = await caches.open(CACHENAME);
        await cache.delete(trendingUrl);
        await cache.delete(popularUrl);
        await cache.delete(`${mediaType}-expiration`);
        return fetchNormal();
      }
      const json = await response.json();
      const json2 = await response2.json();

      const dataArray = [];
      dataArray.push(json, json2);

      return dataArray;
    } else {
      return fetchNormal();
    }
  } catch (e) {
    return fetchNormal();
  }
};
