import { apiUrl, API_KEY, CACHENAME, ISliderData } from "./api.config";
import { INITIAL_DATA_EXPIRATION_TIME } from "./constants";
const validTime = INITIAL_DATA_EXPIRATION_TIME; //2 days

export const fetchInitialData = async (obj: { mediaType: string; searchCategory: string[]; limit: number[]; route: string }, categoryForMovie?: string, pageNumber?: number) => {
  const { mediaType, searchCategory } = obj;
  const TRENDING_CATEGORY = searchCategory[0];

  let url = "";
  let NAME_TO_SAVE_ON_CACHE = "";
  if (mediaType == "tv") {
    url = `${apiUrl}${TRENDING_CATEGORY}/${mediaType}/day?api_key=${API_KEY}&page=${pageNumber || 1}`;
    NAME_TO_SAVE_ON_CACHE = `${mediaType}-${TRENDING_CATEGORY}-initial-search-${pageNumber}`;
  } else {
    NAME_TO_SAVE_ON_CACHE = `${mediaType}-${categoryForMovie}-initial-search-${pageNumber}`;
    if (categoryForMovie == "trending") {
      url = `${apiUrl}${categoryForMovie}/${mediaType}/day?api_key=${API_KEY}&page=${pageNumber || 1}`;
    } else {
      url = `${apiUrl}${mediaType}/${categoryForMovie}?api_key=${API_KEY}&page=${pageNumber || 1}`;
    }
  }

  const getFromApi = async (): Promise<ISliderData[]> => {
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

        const result: ISliderData[] = [];

        jsonDataResults.forEach((element: ISliderData) => {
          let resultObject: ISliderData ;

            resultObject = {
              backdrop_path: element.backdrop_path || undefined, //both
              id: element.id || undefined, //both
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

        return result;
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

async function getFromCache(validTime: number, getFromApi: () => Promise<ISliderData[]>, NAME_TO_SAVE_ON_CACHE: string) {
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

async function saveToCache(jsonDataResults:  ISliderData[], validTime: number, NAME_TO_SAVE_ON_CACHE: string) {
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
