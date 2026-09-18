export interface IWatchProviderEntry {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface IWatchProviderRegion {
  link?: string;
  flatrate?: IWatchProviderEntry[];
  rent?: IWatchProviderEntry[];
  buy?: IWatchProviderEntry[];
}

export interface ImediaDetailsData {
  imdb_id: number;
  heroBackground: string | null;
  bigHeroBackground: string | null; //to get the backdrop even in smaller size devices
  title: string | null;
  poster: string | null;
  poster_path?: string | undefined; // el poster_path crudo de TMDB (con título), igual al que usan las cards de Home/Search
  overview: string | null;
  releaseDate: string | null;
  vote: string | null;
  genres: { id: number; name: string }[];
  runtime: string | null;
  seasons: string | null;
  seasonsArray: [] | null;
  logoBackdrop?: string | null;
  originalProvider?: string | null;
  director?: string | null;
  directorLabel?: string | null;
  productionCompanies?: string[];
  backdrops?: string[];
  posters?: string[];
  watchProvidersByRegion?: Record<string, IWatchProviderRegion> | null;
  rawReleaseDate?: string | null; // unformatted ISO date, needed to recompute isInTheaters() at render time
  // Permanent facts from TMDB's release_dates — safe to cache/store. The actual
  // "is it in theaters right now" verdict is derived from these at render time via
  // isInTheaters(), never stored, so it can't go stale. See helpers/isInTheaters.ts.
  hadTheatricalRelease?: boolean;
  digitalReleaseDate?: string | null;
}
