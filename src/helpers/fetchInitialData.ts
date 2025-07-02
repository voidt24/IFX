import { IMediaData } from "@/Types";
import { apiUrl, API_KEY, CACHENAME } from "./api.config";
import { movieGenresCode, tvGenresCode, INITIAL_DATA_EXPIRATION_TIME, providersNetworkCode, providersWatchCode } from "./constants";
const validTime = INITIAL_DATA_EXPIRATION_TIME; //2 days

function getProviderNetworkId(providerName: string | null) {
  return providerName && providersNetworkCode[providerName];
}
function getProviderWatchId(providerName: string | null) {
  return providerName && providersWatchCode[providerName];
}
function getGenreCode(genreName: string | null, media_type: string | null) {
  return media_type == "tv" ? genreName && tvGenresCode[genreName] : genreName && movieGenresCode[genreName];
}

export const fetchInitialData = async (
  obj: { mediaType: string; searchCategory: string[]; limit: number[]; route: string },
  provider: string | null = null,
  genreCode: string | null = null,
  categoryForMovie?: string,
  pageNumber?: number
) => {
  const { mediaType, searchCategory } = obj;
  const TRENDING_CATEGORY = searchCategory[0];

  let url = "";
  let NAME_TO_SAVE_ON_CACHE = "";
  const validProvider = provider && provider !== "Platform" && provider !== "All";
  const validGenre = genreCode && genreCode !== "All";

  function createDiscoverURL(params: string) {
    return `${apiUrl}discover/${mediaType}?api_key=${API_KEY}&page=${pageNumber || 1}${validProvider ? params : ``}${validGenre ? `&with_genres=${getGenreCode(genreCode, mediaType)}` : ``}`;
  }

  if (mediaType == "tv") {
    if (validProvider || validGenre) {
      if (provider == "Crunchyroll") {
        url = createDiscoverURL(`&watch_region=US&with_watch_providers=${getProviderWatchId(provider)}`);
        NAME_TO_SAVE_ON_CACHE = `discover/${mediaType}${validProvider ? `&with_watch_providers=${getProviderWatchId(provider)}` : ""}${
          validGenre ? `&with_genres=${getGenreCode(genreCode, mediaType)}` : ""
        }&page=${pageNumber}`;
      } else {
        url = createDiscoverURL(`&with_networks=${getProviderNetworkId(provider)}`);
        NAME_TO_SAVE_ON_CACHE = `discover/${mediaType}${validProvider ? `&with_networks=${getProviderNetworkId(provider)}` : ""}${
          validGenre ? `&with_genres=${getGenreCode(genreCode, mediaType)}` : ""
        }&page=${pageNumber}`;
      }
    } else {
      NAME_TO_SAVE_ON_CACHE = `${mediaType}-${TRENDING_CATEGORY}-initial-search-${pageNumber ? pageNumber : ""}`;
      url = `${apiUrl}${TRENDING_CATEGORY}/${mediaType}/day?api_key=${API_KEY}&page=${pageNumber || 1}`;
    }
  }
  if (mediaType == "movie") {
    if (validProvider || validGenre) {
      url = createDiscoverURL(`&watch_region=US&with_watch_providers=${getProviderWatchId(provider)}`);
      NAME_TO_SAVE_ON_CACHE = `discover/${mediaType}-${validProvider ? `&with_watch_providers=${getProviderWatchId(provider)}` : ""}${
        validGenre ? `&with_genres=${getGenreCode(genreCode, mediaType)}` : ""
      }&page=${pageNumber}`;
    } else {
      url = `${apiUrl}${categoryForMovie === "trending" ? `trending/${mediaType}/day` : `${mediaType}/${categoryForMovie}`}?api_key=${API_KEY}&page=${pageNumber || 1}`;
      NAME_TO_SAVE_ON_CACHE = `${mediaType}-${categoryForMovie}-initial-search-${pageNumber ? pageNumber : ""}`;
    }
  }
  const getFromApi = async (): Promise<IMediaData[]> => {
    try {
      const data = await fetch(url);

      const jsonDataRequest = await data.json();

      if (data.ok) {
        // const jsonDataResults = jsonDataRequest.results.slice(0, limit[1]); //12 results
        const jsonDataResults = jsonDataRequest.results; //12 results
        // const jsonDataResults = jsonDataRequest.results.slice(0, limit[1]); //ONLY USED IN MOVIES SECTION...

        //for tv, we show trending results for both hero and slider bc "popular" list is not the best (has a bunch of not popular tvshows)
        //that's why we save 20 trending results for tv (limit[2] = 20) so we show the first 4 in hero and the other 15 in slider :)
        //for movies, both list are fine so we save 4 trending for hero (limit[0] = 4) and 15 popular for slider (limit[1] = 15)

        const result: IMediaData[] = [];

        jsonDataResults.forEach((element: IMediaData) => {
          const resultObject: IMediaData = {
            backdrop_path: element.backdrop_path || undefined, //both
            id: element.id, //both
            title: element.title || undefined,
            original_title: element.original_title || undefined,
            name: element.name || undefined, //este sale en movie
            original_name: element.original_name || undefined, //movie
            overview: element.overview || undefined, //both
            poster_path: element.poster_path || undefined, //both
            media_type: element.media_type || undefined, //movie
            release_date: element.release_date || undefined,
            first_air_date: element.first_air_date || undefined, //movie
            vote_average: element.vote_average || undefined, //both
          };
          result.push(resultObject);
        });

        return [result, jsonDataRequest.total_pages];
      } else {
        return Promise.reject();
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };

  try {
    return await getFromCache(validTime, getFromApi, NAME_TO_SAVE_ON_CACHE);
  } catch (e) {
    const dataFromApi = await getFromApi();
    saveToCache(dataFromApi, validTime, NAME_TO_SAVE_ON_CACHE);
    return dataFromApi;
  }
};

async function getFromCache(validTime: number, getFromApi: () => Promise<IMediaData[]>, NAME_TO_SAVE_ON_CACHE: string) {
  try {
    const response = await caches.match(NAME_TO_SAVE_ON_CACHE);
    const expirationResponse = await caches.match(`${NAME_TO_SAVE_ON_CACHE}-expiration`);

    if (response) {
      const expirationDate = await expirationResponse?.json();
      if (Date.now() > expirationDate.validTime) {
        //if date expired

        //delete whats on cache
        const cache = await caches.open(CACHENAME);
        await cache.delete(NAME_TO_SAVE_ON_CACHE);
        await cache.delete(`${NAME_TO_SAVE_ON_CACHE}-expiration`);

        // and get new fetch...
        const dataFromFetch = await getFromApi();
        saveToCache(dataFromFetch, validTime, NAME_TO_SAVE_ON_CACHE);
        return dataFromFetch;
      }
      const json = await response.json();

      return json;
    } else {
      throw new Error();
    }
  } catch (e) {
    throw e;
  }
}

async function saveToCache(jsonDataResults: IMediaData[], validTime: number, NAME_TO_SAVE_ON_CACHE: string) {
  try {
    const responseClone = new Response(JSON.stringify(jsonDataResults), {
      headers: { "Content-Type": "application/json" },
    });

    const cache = await caches.open(CACHENAME);
    await cache.put(NAME_TO_SAVE_ON_CACHE, responseClone);
    await cache.put(`${NAME_TO_SAVE_ON_CACHE}-expiration`, new Response(JSON.stringify({ headers: { "Content-Type": "application/json" }, validTime })));
  } catch (e) {
    //no actions on this exception
  }
}
