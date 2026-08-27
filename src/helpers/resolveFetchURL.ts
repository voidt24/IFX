import { API_KEY, apiUrl } from "./api.config";

export function resolveFetchURL(typeOfSearch: "byId" | "similar" | "cast" | "reviews" | "images", mediaType: string, mediaId: number, page?: number) {
  let url = "";
  switch (typeOfSearch) {
    case "byId":
      // append_to_response bundles keywords + watch/providers into this same call —
      // needed for the Original-content fallback cascade, zero extra requests.
      url = `${apiUrl}${mediaType}/${mediaId}?api_key=${API_KEY}&append_to_response=keywords,watch/providers`;
      break;
    case "similar":
      url = `${apiUrl}${mediaType}/${mediaId}/similar?api_key=${API_KEY}`;
      break;
    case "cast":
      url = `${apiUrl}${mediaType}/${mediaId}/credits?api_key=${API_KEY}&language=en-US&page=1`;
      break;
    case "reviews":
      url = `${apiUrl}${mediaType}/${mediaId}/reviews?api_key=${API_KEY}`;
      break;
    case "images":
      url = `${apiUrl}${mediaType}/${mediaId}/images?api_key=${API_KEY}`;
      break;
  }

  return url;
}
