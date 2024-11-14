import { apiUrl, API_KEY } from "./api.config";
import { getFromCache, saveToCache } from "./cache/cache";
import { ONE_MONTH } from "./constants";
export interface Isearch {
  id: number;
  name: string;
  poster_path: string;
  media_type: string;
  vote_average: number;
}

export interface IdataResults {
  page: number;
  results: Isearch[];
  total_pages: number;
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

      results.forEach((result: { id: number; name: string; title: string; poster_path: string; media_type: string; vote_average: number }) => {
        if (result.media_type !== "person" && result.media_type) {
          const searchDataObj: Isearch = {
            id: result.id,
            name: result.name ?? result.title,
            poster_path: result.poster_path,
            media_type: result.media_type,
            vote_average: result.vote_average,
          };

          searchDataResults.results.push(searchDataObj);
        }
      });
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
