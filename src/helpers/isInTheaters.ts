// TMDB's /movie/{id}/release_dates payload (append_to_response=release_dates) is the
// source of truth here. Two things about it are permanent historical facts and are
// safe to cache/store indefinitely:
//   - whether the movie ever had a theatrical release (type 2 = limited, type 3 = general)
//   - the date it moved past theaters, once TMDB has logged a digital/physical entry
//     (type 4 = digital, type 5 = physical) — that date itself never changes
// Whether the movie is CURRENTLY in theaters is NOT a permanent fact — it depends on
// "now" — so it must never be stored as a precomputed true/false. Doing that is what
// caused cards saved to a watchlist, "recently browsed", or a 30-day cache to keep
// showing "In Theaters" long after a movie actually left. isInTheaters() below is the
// only place that verdict is produced, and it must be called at render/display time
// with the current Date.now(), never once and persisted.
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

export interface ITheatricalInfo {
  hadTheatricalRelease: boolean; // permanent fact — safe to store/cache
  digitalReleaseDate: string | null; // permanent once known — safe to store/cache
}

const THEATRICAL_TYPES = [2, 3];
const POST_THEATRICAL_TYPES = [4, 5];

function pickRegion(releaseDates: IReleaseDatesResponse | null | undefined, preferredRegion: string): IReleaseDatesRegion | null {
  if (!releaseDates?.results?.length) return null;
  // Prefer the requested region (US by default), otherwise fall back to any region
  // that actually has theatrical entries, so this still works for titles with no
  // US release logged.
  return releaseDates.results.find((r) => r.iso_3166_1 === preferredRegion) || releaseDates.results.find((r) => r.release_dates?.some((d) => THEATRICAL_TYPES.includes(d.type))) || null;
}

// Run ONCE server-side, wherever a movie's release_dates payload gets fetched
// (general/filtered/search routes, the Details view). Only its output — the two
// permanent facts above — should ever be persisted.
export function extractTheatricalInfo(mediaType: string | undefined, releaseDates: IReleaseDatesResponse | null | undefined, preferredRegion: string = "US"): ITheatricalInfo {
  if (mediaType !== "movie") return { hadTheatricalRelease: false, digitalReleaseDate: null };

  const region = pickRegion(releaseDates, preferredRegion);
  if (!region?.release_dates?.length) return { hadTheatricalRelease: false, digitalReleaseDate: null };

  const hadTheatricalRelease = region.release_dates.some((d) => THEATRICAL_TYPES.includes(d.type));

  const earliestPostTheatrical = region.release_dates.filter((d) => POST_THEATRICAL_TYPES.includes(d.type)).sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime())[0];

  return { hadTheatricalRelease, digitalReleaseDate: earliestPostTheatrical?.release_date ?? null };
}

// Re-derived on every render from the stored permanent facts + the current time —
// never from a cached true/false. Call this in the component, not in an API route.
export function isInTheaters(mediaType: string | undefined, releaseDate: string | null | undefined, hadTheatricalRelease: boolean | undefined, digitalReleaseDate: string | null | undefined): boolean {
  if (mediaType !== "movie" || !releaseDate || !hadTheatricalRelease) return false;

  const now = Date.now();
  const releaseTime = new Date(releaseDate).getTime();
  if (Number.isNaN(releaseTime) || releaseTime > now) return false; // not released yet

  if (digitalReleaseDate) {
    const digitalTime = new Date(digitalReleaseDate).getTime();
    if (!Number.isNaN(digitalTime) && digitalTime <= now) return false; // already left theaters
  }

  return true;
}
