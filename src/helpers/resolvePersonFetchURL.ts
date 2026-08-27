import { API_KEY, apiUrl } from "./api.config";

// include_image_language=null,en pulls textless + English profile images in one shot.
export function resolvePersonFetchURL(personId: number | string) {
  return `${apiUrl}person/${personId}?api_key=${API_KEY}&append_to_response=combined_credits,images,external_ids&include_image_language=null,en`;
}
