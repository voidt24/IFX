export interface IhistoryMedia {
  id?: number | null;
  title?: string | null;
  media_type?: "tv" | "movie";
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string | null;
  vote_average?: number | string | null;
  episodeId?: number | null;
  season?: number | null;
  episode?: string | null;
  episode_number?: number | null;
  episode_image?: string | null;
  watchedAt?: number | null;
}
