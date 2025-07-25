import { MediaTypeApi } from "@/Types";
import { apiUrl, API_KEY } from "./api.config";
import { Dispatch, SetStateAction } from "react";

export const getTrailer = async (id: number | null, mediaType: MediaTypeApi) => {
  const data = await fetch(`${apiUrl}${mediaType}/${id}/videos?api_key=${API_KEY}`);
  const json = await data.json();

  return json;
};

// TO-DO: delete react params -> separate data logic from state
export function handleTrailerClick(setOpenTrailer:Dispatch<SetStateAction<boolean>>,id:number | null, mediaType:MediaTypeApi,setTrailerKey:Dispatch<SetStateAction<number | null>>) {
  getTrailer(id, mediaType).then((data) => {
    if (data.results.length < 1) {
      setTrailerKey(null);
    } else {
      data.results.forEach((element:unknown) => {
        if (typeof element === 'object' && element !== null && 'type' in element && 'name' in element && 'key' in element) {
          if ((element as { type: string }).type === 'Trailer' ){
            setTrailerKey((element as { key: number }).key);
          }
        }
      });
    }
    setOpenTrailer(true);
  });
}