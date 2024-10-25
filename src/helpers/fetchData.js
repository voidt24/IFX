import { apiUrl, API_KEY, CACHENAME } from "./api.config";

export const fetchData = async (obj) => {
  const { mediaType, category, limit } = obj;

  const trendingUrl = `${apiUrl}${category[0]}/${mediaType}/day?api_key=${API_KEY}&page=1`;
  const popularUrl = `${apiUrl}${mediaType}/${category[1]}?api_key=${API_KEY}&page=1`;

  const validTime = Date.now() + 259200000; //3 days

  const fetchNormal = async () => {
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

        // const responseClone = new Response(JSON.stringify(jsonTrendingResults), {
        //   headers: { "Content-Type": "application/json" },
        // });
        // const responseClone2 = new Response(JSON.stringify(jsonPopularResults), {
        //   headers: { "Content-Type": "application/json" },
        // });

        // const cache = await caches.open(CACHENAME);
        // await cache.put(`${mediaType}-trending-initial-search`, responseClone);
        // await cache.put(`${mediaType}-popular-initial-search`, responseClone2);
        // await cache.put(`${mediaType}-initial-search-expiration`, new Response(JSON.stringify({ headers: { "Content-Type": "application/json" }, validTime })));

        const dataArray = [];
        dataArray.push(jsonTrendingResults, jsonPopularResults);

        // console.log(
        //   "RESULTADOS TRENDING EMPEZANDO EN 0, CON LIMITE DE ",
        //   mediaType == "movies" ? limit[0] : limit[2],
        //   jsonTrendingRequest.results.slice(0, mediaType == "movies" ? limit[0] : limit[2])
        // );
        // console.log("RESULTADOS POPULAR EMPEZANDO EN 0, CON LIMITE DE ", limit[1], jsonPopularRequest.results.slice(0, limit[1]));
        return dataArray;
      } else {
        return Promise.reject();
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };

  try {
    // console.log("intentando desde CACHE CON INTIAL SEARCH...");
    const response = await caches.match(`${mediaType}-trending-initial-search`);
    const response2 = await caches.match(`${mediaType}-popular-initial-search`);
    const expirationResponse = await caches.match(`${mediaType}-initial-search-expiration`);

    if (response && response2) {
      const expirationDate = await expirationResponse.json();
      if (Date.now() > expirationDate.validTime) {
        const cache = await caches.open(CACHENAME);
        await cache.delete(`${mediaType}-trending-initial-search`);
        await cache.delete(`${mediaType}-popular-initial-search`);
        await cache.delete(`${mediaType}-initial-search-expiration`);
        return fetchNormal();
      }
      const json = await response.json();
      const json2 = await response2.json();

      const dataArray = [];
      dataArray.push(json, json2);

      console.log("desde cache: fetchdata", dataArray);

      return dataArray;
    } else {
      // console.log("no pudimos obtener de cache initial search");
      return fetchNormal();
    }
  } catch (e) {
    // console.log("no pudimos obtener de cache initial search", e);

    return fetchNormal();
  }
};
