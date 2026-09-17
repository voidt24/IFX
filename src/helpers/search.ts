import { apiUrl, API_KEY } from "./api.config";
import { getFromCache, saveToCache } from "./cache/cache";
import { ONE_MONTH } from "./constants";
import { IMediaData } from "@/Types/index";
import { resolveFetchURL } from "./resolveFetchURL";
import { resolveOriginalProvider } from "./getOriginalProvider";

export interface IdataResults {
  page: number;
  results: IMediaData[];
  total_pages: number;
}

// Mismo patrón de 1 llamada extra por item que usan /api/tmdb/general y /api/tmdb/filtered:
// search/multi no trae networks/production_companies/watch-providers, así que el
// OriginalBadge necesita este lookup por item para resolver `originalProvider`.
async function fetchOriginalProvider(mediaType: "movie" | "tv", id: number): Promise<string | null> {
  try {
    const res = await fetch(resolveFetchURL("byId", mediaType, id));
    const data = await res.json();
    return resolveOriginalProvider(mediaType, data);
  } catch {
    return null;
  }
}

export const search = async (query: string, page: number) => {
  const url = `${apiUrl}search/multi?api_key=${API_KEY}&query=${query}&page=${page}`;
  const CACHEURL = `searchResultsFor-${query}-word-page(${page})`;
  const validTime = ONE_MONTH;

  const getFromApi = async () => {
    try {
      const data = await fetch(url);
      const json = await data.json();
      const { results } = json;
      const searchDataResults: IdataResults = { page: 0, results: [], total_pages: 0 };

      searchDataResults.page = json.page;
      searchDataResults.total_pages = json.total_pages;

      const validResults = results.filter((result: IMediaData) => result.media_type === "tv" || result.media_type === "movie");

      searchDataResults.results = await Promise.all(
        validResults.map(async (result: IMediaData) => {
          const originalProvider = await fetchOriginalProvider(result.media_type as "movie" | "tv", result.id);

          const searchDataObj: IMediaData = {
            id: result.id,
            name: result.name ?? result.title,
            poster_path: result.poster_path,
            noTextPoster_path: undefined,
            media_type: result.media_type,
            vote_average: result.vote_average,
            release_date: result.release_date || result.first_air_date,
            originalProvider,
          };

          return searchDataObj;
        }),
      );

      return searchDataResults;
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
