export const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const apiUrl = `https://api.themoviedb.org/3/`;
export const image = `https://image.tmdb.org/t/p/original`
export const imageWithSize =  (size) => `https://image.tmdb.org/t/p/w${size}`
export const CACHENAME = "prods-cache-v3";
