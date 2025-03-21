import { mediaProperties } from "./mediaProperties.config";

export const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const apiUrl = `https://api.themoviedb.org/3/`;
export const image = `https://image.tmdb.org/t/p/original`;
export const imageWithSize = (size: string) => `https://image.tmdb.org/t/p/w${size}`;
export const CACHENAME = "prods-cache-v4";

export const srcOptions = [
  { src: "https://vidsrc.cc/v3/embed" },
  { src: "https://ythd.org/embed" },
  { src: "https://vidlink.pro" }, 
  { src: "https://embed.su/embed" },
  { src: "https://multiembed.mov" },
  { src: "https://moviesapi.club" },
  { src: "https://2embed.cc" }, 
  { src: "https://nontongo.win" }, 
  { src: "https://player.smashy.stream" },
];

export const MEDIA_URL_RESOLVER = (index: number, mediaId: number | undefined, mediaType: "movie" | "tvshows", season: number | null = null, episode: number | null = null) => {
  const srcOptions = [
    {
      movieSrc: `https://vidsrc.cc/v3/embed/${mediaProperties.movie.mediaType}/${mediaId}`,
      tvshowsSrc: `https://vidsrc.cc/v3/embed/${mediaProperties.tv.mediaType}/${mediaId}/${season}/${episode}`,
    },
    {
      movieSrc: `https://ythd.org/embed/${mediaId}`,
      tvshowsSrc: `https://ythd.org/embed/${mediaId}/${season}-${episode}`,
    },
    {      
      movieSrc: `https://vidlink.pro/${mediaProperties.movie.mediaType}/${mediaId}`,
      tvshowsSrc: `https://vidlink.pro/${mediaProperties.tv.mediaType}/${mediaId}/${season}/${episode}`,
    },
    {
      movieSrc: `https://embed.su/embed/${mediaProperties.movie.mediaType}/${mediaId}`,
      tvshowsSrc: `https://embed.su/embed/${mediaProperties.tv.mediaType}/${mediaId}/${season}/${episode}`,
    },

    {
      movieSrc: `https://multiembed.mov/directstream.php?video_id=${mediaId}&tmdb=1`,
      tvshowsSrc: `https://multiembed.mov/directstream.php?video_id=${mediaId}&tmdb=1&s=${season}&e=${episode}`,
    },
    {
      movieSrc: `https://moviesapi.club/${mediaProperties.movie.mediaType}/${mediaId}`,
      tvSrc: `https://moviesapi.club/${mediaProperties.tv.mediaType}/${mediaId}-${season}-${episode}`,
    },
    {      
      movieSrc: `https://2embed.cc/embed/${mediaId}`,
      tvshowsSrc: `https://www.2embed.cc/embedtv/${mediaId}&tmdb=1&s=${season}&e=${episode}`,
    },

    {      
      movieSrc: `https://nontongo.win/embed/${mediaProperties.movie.mediaType}/${mediaId}`,
      tvshowsSrc: `https://nontongo.win/embed/${mediaProperties.tv.mediaType}/${mediaId}/${season}/${episode}`,
    },

    {
      movieSrc: `https://player.smashy.stream/${mediaProperties.movie.mediaType}/${mediaId}`,
      tvshowsSrc: `https://player.smashy.stream/${mediaProperties.tv.mediaType}/${mediaId}/${season}/${episode}`,
    },
  ];

  return srcOptions[index][`${mediaType}Src`];
};

export interface ISliderData {
  backdrop_path?: string | undefined;
  id: number | undefined;
  title?: string | undefined; //show 1st for movies
  original_title?: string | undefined;
  name?: string | undefined; //show 1st for TV
  original_name?: string | undefined;
  overview?: string | undefined;
  poster_path: string | undefined;
  media_type?: string | undefined;
  release_date?: string | undefined;
  first_air_date?: string | undefined;
  vote_average: number | undefined;
}
