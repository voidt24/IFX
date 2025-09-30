import { MediaTypeApi } from "@/Types";
import { apiUrl, API_KEY } from "./api.config";

export const getTrailer = async (id: number | null, mediaType: MediaTypeApi) => {
  const data = await fetch(`${apiUrl}${mediaType}/${id}/videos?api_key=${API_KEY}`);
  const json = await data.json();

  return json;
};

export async function handleTrailerClick(id: number | null, mediaType: MediaTypeApi) {
  const trailer = await getTrailer(id, mediaType);

  if (trailer && trailer.results && trailer.results.length < 1) {
    return null;
  }

  const trailerKey =
    trailer &&
    trailer.results &&
    trailer.results.find((element: unknown) => {
      if (typeof element === "object" && element !== null && "type" in element && "name" in element && "key" in element) {
        if ((element as { type: string }).type === "Trailer") {
          return (element as { key: string }).key;
        }
      }
    });

  return trailerKey ? trailerKey.key : null;
}
