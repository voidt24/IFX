import { MediaTypeApi } from "./mediaType";

export interface IMediaData {
  backdrop_path?: string | undefined;
  id: number;
  title?: string | undefined; //show 1st for movies
  original_title?: string | undefined;
  name?: string | undefined; //show 1st for TV
  original_name?: string | undefined;
  overview?: string | undefined;
  poster_path: string | undefined;
  noTextPoster_path: string | undefined;
  media_type: MediaTypeApi;
  release_date?: string | undefined;
  first_air_date?: string | undefined;
  vote_average: number | undefined;
  logoBackdrop?: string | null;
  originalProvider?: string | null; // e.g. "Netflix" — set when this title is that platform's Original content
  // Permanent facts from TMDB's release_dates — safe to cache/store. The actual
  // "is it in theaters right now" verdict is derived from these at render time via
  // isInTheaters(), never stored, so it can't go stale. See helpers/isInTheaters.ts.
  hadTheatricalRelease?: boolean;
  digitalReleaseDate?: string | null;
}
