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
  media_type: MediaTypeApi;
  release_date?: string | undefined;
  first_air_date?: string | undefined;
  vote_average: number | undefined;
}
