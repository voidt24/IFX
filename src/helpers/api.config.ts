import { mediaProperties } from "./mediaProperties.config";

export const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
export const VIEW_KEY = process.env.NEXT_PUBLIC_VIM_VIEW_KEY;

export const apiUrl = `https://api.themoviedb.org/3/`;
export const image = `https://image.tmdb.org/t/p/original`;
export const imageWithSize = (size: string) => `https://image.tmdb.org/t/p/w${size}`;
export const CACHENAME = "ifx-cache-v2.0";
export const APP_NAME = "IFX";

export const srcOptions = [
  { src: "vim" },
  { src: "https://vsembed.ru/embed" },
  // { src: "https://ythd.org/embed" },
  { src: "https://vidfast.pro", IdSource: "IMDB" },
  { src: "https://cinesrc.st/embed" },
  { src: "https://vidrock.to" },
  { src: "https://vidlink.pro" },
  { src: "https://mapple.fun" },
  { src: "https://2embed.cc" },
];

export const MEDIA_URL_RESOLVER = (index: number, mediaId: number, mediaType: "movie" | "tv", season: number | null = null, episode: number | null = null) => {
  const srcOptions = [
    {
      movieSrc: `https://vimeus.com/e/${mediaProperties.movie.mediaType}?tmdb=${mediaId}&view_key=${VIEW_KEY}&title=iFX&theme=blue&font=v3&selector=v2&epanel=v2&splash=v3`,
      tvSrc: `https://vimeus.com/e/serie?tmdb=${mediaId}&view_key=${VIEW_KEY}&se=${season}&ep=${episode}&title=iFX&theme=blue&font=v3&selector=v2&epanel=v2&splash=v3`,
    },

    {
      movieSrc: `https://vsembed.ru/embed/${mediaProperties.movie.mediaType}/${mediaId}`,
      tvSrc: `https://vsembed.ru/embed/${mediaProperties.tv.mediaType}/${mediaId}/${season}/${episode}`,
    },
    // {
    //   movieSrc: `https://ythd.org/embed/${mediaId}`,
    //   tvSrc: `https://ythd.org/embed/${mediaId}/${season}-${episode}`, //same as the one above, so can eventually work as a fallback if it fails
    // },
    {
      movieSrc: `https://vidfast.pro/${mediaProperties.movie.mediaType}/${mediaId}`, //only IMDB id
      tvSrc: `https://vidfast.pro/${mediaProperties.tv.mediaType}/${mediaId}/${season}/${episode}`, //only IMDB id
    },
    {
      movieSrc: `https://cinesrc.st/embed/${mediaProperties.movie.mediaType}/${mediaId}`,
      tvSrc: `https://cinesrc.st/embed/${mediaProperties.tv.mediaType}/${mediaId}/${season}/${episode}`,
    },
    {
      movieSrc: `https://vidlink.pro/${mediaProperties.movie.mediaType}/${mediaId}`,
      tvSrc: `https://vidlink.pro/${mediaProperties.tv.mediaType}/${mediaId}/${season}/${episode}`,
    },

    {
      movieSrc: `https://vidrock.to/${mediaProperties.movie.mediaType}/${mediaId}`,
      tvSrc: `https://vidrock.to/${mediaProperties.tv.mediaType}/${mediaId}/${season}/${episode}`,
    },

    {
      movieSrc: `https://mapple.fun/watch/${mediaProperties.movie.mediaType}/${mediaId}?autoPlay=true`,
      tvSrc: `https://mapple.fun/watch/${mediaProperties.tv.mediaType}/${mediaId}/${season}/${episode}?autoPlay=true`,
    },
    {
      movieSrc: `https://2embed.cc/embed/${mediaId}`,
      tvSrc: `https://www.2embed.cc/embedtv/${mediaId}&tmdb=1&s=${season}&e=${episode}`,
    },
  ];

  return srcOptions[index][`${mediaType}Src`];
};
