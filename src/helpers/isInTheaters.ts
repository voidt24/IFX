// Implements TMDB's own recommended check for "is this movie still in theaters":
// look at the /movie/{id}/release_dates payload (append_to_response=release_dates),
// find the release entries for a region, and confirm there's a theatrical release
// (type 2 = limited, type 3 = general) that has already happened, with no digital
// (type 4) or physical (type 5) release logged yet for that same region.
export interface IReleaseDateEntry {
  certification?: string;
  iso_639_1?: string | null;
  release_date: string;
  type: number;
}

export interface IReleaseDatesRegion {
  iso_3166_1: string;
  release_dates: IReleaseDateEntry[];
}

export interface IReleaseDatesResponse {
  results?: IReleaseDatesRegion[];
}

const THEATRICAL_TYPES = [2, 3];
const POST_THEATRICAL_TYPES = [4, 5];

export function isInTheaters(mediaType: string | undefined, releaseDates: IReleaseDatesResponse | null | undefined, preferredRegion: string = "US"): boolean {
  if (mediaType !== "movie" || !releaseDates?.results?.length) return false;

  // Prefer the requested region (US by default), otherwise fall back to any
  // region that actually has theatrical entries, so the check still works for
  // titles with no US release logged.
  const region = releaseDates.results.find((r) => r.iso_3166_1 === preferredRegion) || releaseDates.results.find((r) => r.release_dates?.some((d) => THEATRICAL_TYPES.includes(d.type)));

  if (!region?.release_dates?.length) return false;

  const now = Date.now();

  const hasTheatricalRelease = region.release_dates.some((d) => THEATRICAL_TYPES.includes(d.type) && new Date(d.release_date).getTime() <= now);
  if (!hasTheatricalRelease) return false;

  const hasMovedPastTheaters = region.release_dates.some((d) => POST_THEATRICAL_TYPES.includes(d.type) && new Date(d.release_date).getTime() <= now);

  return !hasMovedPastTheaters;
}
