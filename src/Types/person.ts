import { MediaTypeApi } from "./mediaType";

export interface IPersonCredit {
  id: number;
  media_type: MediaTypeApi;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  character?: string;
  job?: string; // present on crew credits (Director, Writer, Producer...)
  department?: string; // present on crew credits
  credit_id: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  popularity?: number;
}

export interface IPersonImage {
  file_path: string;
  aspect_ratio: number;
  height: number;
  width: number;
  vote_average?: number;
}

export interface IPersonExternalIds {
  imdb_id?: string | null;
  instagram_id?: string | null;
  twitter_id?: string | null;
  facebook_id?: string | null;
}

export interface IPersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string | null;
  gender: number;
  popularity: number;
  also_known_as: string[];
  homepage: string | null;
  combined_credits?: {
    cast: IPersonCredit[];
    crew: IPersonCredit[];
  };
  images?: {
    profiles: IPersonImage[];
  };
  external_ids?: IPersonExternalIds;
}
