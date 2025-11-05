import { Iepisode } from "./episode";

// this should be named seasonArray
export interface IepisodesArray {
  air_date: string | null;
  episodes: Iepisode[] | null;
  id: number | null;
  name: string | null;
  overview: string | null;
  poster_path: string | null;
  season_number: number | null;
  vote_average: number | null;
  _id: string | null;
}
