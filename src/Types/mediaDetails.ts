export interface ImediaDetailsData {
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
}
