export const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const apiUrl = `https://api.themoviedb.org/3/`;
export const image = `https://image.tmdb.org/t/p/original`;
export const imageWithSize = (size: string) => `https://image.tmdb.org/t/p/w${size}`;
export const CACHENAME = "prods-cache-v4";

export interface ISliderMovieData {
  backdrop_path: string | undefined; //both
  id: number | undefined; //both
  title: string | undefined; //este sale en movie
  original_title: string | undefined; //movie
  overview: string | undefined; //both
  poster_path: string | undefined; //both
  release_date: string | undefined; //movie
  vote_average: number | undefined; //both
  media_type?: string | undefined; 
}
export interface ISliderTVData {
  backdrop_path: string | undefined; //both
  id: number | undefined; //both
  name: string | undefined; //este sale en tv y es el que en teoria deberia mostrar porque siempre esta en ingles
  original_name: string | undefined; //tv
  overview: string | undefined; //both
  poster_path: string | undefined; //both
  media_type: string | undefined; //tv
  first_air_date: string | undefined; //tv
  vote_average: number | undefined; //both
}
