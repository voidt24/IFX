import { apiUrl, API_KEY } from "./api.config";
import { getFromCache, saveToCache } from "./cache/cache";
import { ONE_MONTH } from "./constants";
import { IMediaData } from "@/Types/index";
import { resolveFetchURL } from "./resolveFetchURL";
import { resolveOriginalProvider } from "./getOriginalProvider";
import { extractTheatricalInfo } from "./isInTheaters";

export interface IdataResults {
  page: number;
  results: IMediaData[];
  total_pages: number;
}

// Mismo patrón de 1 llamada extra por item que usan /api/tmdb/general y /api/tmdb/filtered:
// search/multi no trae networks/production_companies/watch-providers/release_dates, así que el
// OriginalBadge y el check de "en cines" necesitan este lookup por item. Solo se extraen y
// guardan los hechos permanentes (hadTheatricalRelease / digitalReleaseDate) — nunca un booleano
// "está en cines ahora mismo" ya calculado, porque este resultado se cachea hasta ONE_MONTH y ese
// booleano quedaría congelado. isInTheaters() recalcula el veredicto en cada render.
async function fetchOriginalProviderAndTheatricalInfo(
  mediaType: "movie" | "tv",
  id: number,
): Promise<{ originalProvider: string | null; hadTheatricalRelease: boolean; digitalReleaseDate: string | null }> {
  try {
    const res = await fetch(resolveFetchURL("byId", mediaType, id));
    const data = await res.json();
    const { hadTheatricalRelease, digitalReleaseDate } = extractTheatricalInfo(mediaType, data.release_dates);
    return { originalProvider: resolveOriginalProvider(mediaType, data), hadTheatricalRelease, digitalReleaseDate };
  } catch {
    return { originalProvider: null, hadTheatricalRelease: false, digitalReleaseDate: null };
  }
}

export const search = async (query: string, page: number) => {
  const url = `${apiUrl}search/multi?api_key=${API_KEY}&query=${query}&page=${page}`;
  // v2: added hadTheatricalRelease/digitalReleaseDate (permanent facts, not the "in theaters now"
  // verdict) so search results can show an accurate, non-stale "In Theaters" badge
  const CACHEURL = `searchResultsFor-${query}-word-page(${page})-v2`;
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
          const { originalProvider, hadTheatricalRelease, digitalReleaseDate } = await fetchOriginalProviderAndTheatricalInfo(result.media_type as "movie" | "tv", result.id);

          const searchDataObj: IMediaData = {
            id: result.id,
            name: result.name ?? result.title,
            poster_path: result.poster_path,
            noTextPoster_path: undefined,
            media_type: result.media_type,
            vote_average: result.vote_average,
            release_date: result.release_date || result.first_air_date,
            originalProvider,
            hadTheatricalRelease,
            digitalReleaseDate,
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
