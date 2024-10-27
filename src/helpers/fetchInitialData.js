import { apiUrl, API_KEY, CACHENAME } from "./api.config";
const validTime = Date.now() + 259200000; //3 days

export const fetchInitialData
 = async (obj) => {
  const { mediaType, category, limit } = obj;

  const trendingUrl = `${apiUrl}${category[0]}/${mediaType}/day?api_key=${API_KEY}&page=1`;
  const popularUrl = `${apiUrl}${mediaType}/${category[1]}?api_key=${API_KEY}&page=1`;

  const getFromApi = async () => {
    try {
      const trendingData = await fetch(trendingUrl);
      const popularData = await fetch(popularUrl);

      const jsonTrendingRequest = await trendingData.json();
      const jsonPopularRequest = await popularData.json();

      if (trendingData.ok && popularData.ok) {
        const jsonPopularResults = jsonPopularRequest.results.slice(0, limit[1]); //ONLY USED IN MOVIES SECTION...

        //for tv, we show trending results for both hero and slider bc "popular" list is not the best (has a bunch of not popular tvshows)
        //that's why we save 20 trending results for tv (limit[2] = 20) so we show the first 4 in hero and the other 15 in slider :)
        //for movies, both list are fine so we save 4 trending for hero (limit[0] = 4) and 15 popular for slider (limit[1] = 15)
        const jsonTrendingResults = jsonTrendingRequest.results.slice(0, mediaType == "movies" ? limit[0] : limit[2]);

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
    return await getFromCache(mediaType, validTime);
  } catch (e) {
    const dataFromApi = await getFromApi();
    const [jsonTrendingResults, jsonPopularResults] = dataFromApi;
    saveToCache(jsonTrendingResults, jsonPopularResults, mediaType, validTime);
    return dataFromApi;
  }
};

async function getFromCache(mediaType, validTime) {
  try {
    const response = await caches.match(`${mediaType}-trending-initial-search`);
    const response2 = await caches.match(`${mediaType}-popular-initial-search`);
    const expirationResponse = await caches.match(`${mediaType}-initial-search-expiration`);

    if (response && response2) {
      const expirationDate = await expirationResponse.json();
      if (Date.now() > expirationDate.validTime) {
        //if date expired

        //delete whats on cache
        const cache = await caches.open(CACHENAME);
        await cache.delete(`${mediaType}-trending-initial-search`);
        await cache.delete(`${mediaType}-popular-initial-search`);
        await cache.delete(`${mediaType}-initial-search-expiration`);

        // and get new fetch...
        const dataFromFetch = await fetchNormal();
        const [jsonTrendingResults, jsonPopularResults] = dataFromFetch;
        saveToCache(jsonTrendingResults, jsonPopularResults, mediaType, validTime);
        return dataFromFetch;
      }
      const json = await response.json();
      const json2 = await response2.json();

      const dataArray = [];
      dataArray.push(json, json2);

      return dataArray;
    } else {
      throw new Error();
    }
  } catch (e) {
    throw e;
  }
}

async function saveToCache(jsonTrendingResults, jsonPopularResults, mediaType, validTime) {
  try {
    const responseClone = new Response(JSON.stringify(jsonTrendingResults), {
      headers: { "Content-Type": "application/json" },
    });
    const responseClone2 = new Response(JSON.stringify(jsonPopularResults), {
      headers: { "Content-Type": "application/json" },
    });

    const cache = await caches.open(CACHENAME);
    await cache.put(`${mediaType}-trending-initial-search`, responseClone);
    await cache.put(`${mediaType}-popular-initial-search`, responseClone2);
    await cache.put(`${mediaType}-initial-search-expiration`, new Response(JSON.stringify({ headers: { "Content-Type": "application/json" }, validTime })));
  } catch (e) {
    //no actions on this exception
  }
}


