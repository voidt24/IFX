import { IMediaData, MediaTypeApi } from "@/Types";
import { getBaseUrl } from "@/lib/env";

/**
 * Popular/trending data now lives behind /api/tmdb/general and /api/tmdb/filtered,
 * which read/write a shared Redis cache on the server. The browser no longer
 * talks to TMDB directly, so there's no client-side cache to manage here anymore.
 */

export const fetchGeneralData = async (
  obj: { mediaType: MediaTypeApi; searchCategory: string[]; limit: number[]; route: string },
  categoryForMovie?: string,
  pageNumber?: number,
): Promise<[IMediaData[], number]> => {
  const { mediaType, searchCategory } = obj;
  const trendingCategory = searchCategory[0];

  const params = new URLSearchParams({ mediaType, trendingCategory });
  if (categoryForMovie) params.set("categoryForMovie", categoryForMovie);
  if (pageNumber) params.set("page", String(pageNumber));

  const res = await fetch(`${getBaseUrl()}/api/tmdb/general?${params.toString()}`);
  if (!res.ok) return Promise.reject(new Error(`Request failed with status ${res.status}`));

  const { results, total_pages } = await res.json();
  return [results, total_pages];
};

export const fetchFilteredData = async (
  obj: { mediaType: MediaTypeApi; searchCategory: string[]; limit: number[]; route: string },
  provider: string | null = null,
  genreCode: string | null = null,
  pageNumber?: number,
): Promise<[IMediaData[], number]> => {
  const { mediaType } = obj;

  const params = new URLSearchParams({ mediaType });
  if (provider) params.set("provider", provider);
  if (genreCode) params.set("genre", genreCode);
  if (pageNumber) params.set("page", String(pageNumber));

  const res = await fetch(`${getBaseUrl()}/api/tmdb/filtered?${params.toString()}`);
  if (!res.ok) return Promise.reject(new Error(`Request failed with status ${res.status}`));

  const { results, total_pages } = await res.json();
  return [results, total_pages];
};
