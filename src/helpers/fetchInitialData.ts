import { IMediaData, MediaTypeApi } from "@/Types";
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

function buildGeneralSearchURL(mediaType: MediaTypeApi, TRENDING_CATEGORY: string, categoryForMovie?: string, pageNumber?: number) {
  return mediaType == "tv"
    ? `${apiUrl}${TRENDING_CATEGORY}/${mediaType}/day?api_key=${API_KEY}&page=${pageNumber || 1}`
    : `${apiUrl}${categoryForMovie === "trending" ? `trending/${mediaType}/day` : `${mediaType}/${categoryForMovie}`}?api_key=${API_KEY}&page=${pageNumber || 1}`;
}

function buildFilteredSearchURL(mediaType: MediaTypeApi, validProvider: boolean, validGenre: boolean, genreCode: string | null, provider: string | null, pageNumber?: number) {
  function createDiscoverURL(params: string) {
    return `${apiUrl}discover/${mediaType}?api_key=${API_KEY}&page=${pageNumber || 1}${validProvider ? params : ``}${validGenre ? `&with_genres=${getGenreCode(genreCode, mediaType)}` : ``}`;
  }

  let url = "";

  if ((mediaType == "tv" && provider == "Crunchyroll") || mediaType == "movie") {
    url = createDiscoverURL(`&watch_region=US&with_watch_providers=${getProviderWatchId(provider)}`);
  } else {
    url = createDiscoverURL(`&with_networks=${getProviderNetworkId(provider)}`);
  }
  return url;
}

function buildGeneralCacheKey(mediaType: MediaTypeApi, TRENDING_CATEGORY: string, categoryForMovie?: string, pageNumber?: number) {
  return `${mediaType}-${mediaType == "tv" ? TRENDING_CATEGORY : categoryForMovie}-initial-search-${pageNumber ? pageNumber : ""}`;
}

function buildFilteredCacheKey(mediaType: MediaTypeApi, validProvider: boolean, validGenre: boolean, genreCode: string | null, provider: string | null, pageNumber?: number) {
  let cacheKey = "";

  if ((mediaType == "tv" && provider == "Crunchyroll") || mediaType == "movie") {
    cacheKey = `discover/${mediaType}-${validProvider ? `&with_watch_providers=${getProviderWatchId(provider)}` : ""}${
      validGenre ? `&with_genres=${getGenreCode(genreCode, mediaType)}` : ""
    }&page=${pageNumber}`;
  } else {
    cacheKey = `discover/${mediaType}-${validProvider ? `&with_networks=${getProviderNetworkId(provider)}` : ""}${
      validGenre ? `&with_genres=${getGenreCode(genreCode, mediaType)}` : ""
    }&page=${pageNumber}`;
  }

  return cacheKey;
}

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

const getFromApi = async (url: string, mediaType: MediaTypeApi): Promise<IMediaData[]> => {
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
          backdrop_path: element.backdrop_path || undefined,
          id: element.id,
          title: element.title || undefined,
          original_title: element.original_title || undefined,
          name: element.name || undefined,
          original_name: element.original_name || undefined,
          overview: element.overview || undefined,
          poster_path: element.poster_path || undefined,
          media_type: element.media_type || mediaType,
          release_date: element.release_date || undefined,
          first_air_date: element.first_air_date || undefined,
          vote_average: element.vote_average || undefined,
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

export const fetchGeneralData = async (obj: { mediaType: MediaTypeApi; searchCategory: string[]; limit: number[]; route: string }, categoryForMovie?: string, pageNumber?: number) => {
  const { mediaType, searchCategory } = obj;
  const TRENDING_CATEGORY = searchCategory[0];

  const url = buildGeneralSearchURL(mediaType, TRENDING_CATEGORY, categoryForMovie, pageNumber);

  const NAME_TO_SAVE_ON_CACHE = buildGeneralCacheKey(mediaType, TRENDING_CATEGORY, categoryForMovie, pageNumber);

  try {
    return await getFromCache(validTime, () => getFromApi(url, mediaType), NAME_TO_SAVE_ON_CACHE);
  } catch (e) {
    const dataFromApi = await getFromApi(url, mediaType);
    saveToCache(dataFromApi, validTime, NAME_TO_SAVE_ON_CACHE);
    return dataFromApi;
  }
};

export const fetchFilteredData = async (
  obj: { mediaType: MediaTypeApi; searchCategory: string[]; limit: number[]; route: string },
  provider: string | null = null,
  genreCode: string | null = null,
  pageNumber?: number,
) => {
  const { mediaType } = obj;

  const validProvider = provider !== null && provider !== "Platform" && provider !== "All";
  const validGenre = genreCode !== null && genreCode !== "All";

  const url = buildFilteredSearchURL(mediaType, validProvider, validGenre, genreCode, provider, pageNumber);

  const NAME_TO_SAVE_ON_CACHE = buildFilteredCacheKey(mediaType, validProvider, validGenre, genreCode, provider, pageNumber);

  try {
    return await getFromCache(validTime, () => getFromApi(url, mediaType), NAME_TO_SAVE_ON_CACHE);
  } catch (e) {
    const dataFromApi = await getFromApi(url, mediaType);
    saveToCache(dataFromApi, validTime, NAME_TO_SAVE_ON_CACHE);
    return dataFromApi;
  }
};
