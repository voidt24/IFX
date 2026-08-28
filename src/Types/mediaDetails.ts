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
  overview: string | null;
  releaseDate: string | null;
  vote: string | null;
  genres: { id: number; name: string }[];
  runtime: string | null;
  seasons: string | null;
  seasonsArray: [] | null;
  logoBackdrop?: string | null;
  originalProvider?: string | null; // e.g. "Netflix" — set when this title is that platform's Original content
  director?: string | null; // movie director(s), or TV creator(s)
  directorLabel?: string | null; // "Directed by" for movies, "Created by" for TV
  productionCompanies?: string[]; // e.g. ["Marvel Studios", "Warner Bros. Pictures"]
  backdrops?: string[]; // extra gallery images (file_path only, append the image base URL to render)
  posters?: string[]; // extra gallery images (file_path only, append the image base URL to render)
  watchProvidersByRegion?: Record<string, IWatchProviderRegion> | null; // TV only — raw watch/providers.results, keyed by ISO country code
}
