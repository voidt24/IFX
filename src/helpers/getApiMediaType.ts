import { MediaTypeApi, MediaTypeUrl } from "@/Types/mediaType";

const apiMediaTypeMap: Record<MediaTypeUrl, MediaTypeApi> = {
  movies: "movie",
  tvshows: "tv"
};

export function getApiMediaType(mediaTypeFromUrl: MediaTypeUrl): MediaTypeApi {
  return apiMediaTypeMap[mediaTypeFromUrl];
}