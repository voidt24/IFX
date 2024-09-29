import { apiUrl, API_KEY } from "./api.config";

export const getTrailer = async (id, mediaType) => {
  const data = await fetch(`${apiUrl}${mediaType}/${id}/videos?api_key=${API_KEY}`);
  const json = await data.json();

  return json;
};



export function handleTrailerClick(setOpenTrailer,id,currentMediaType,setTrailerKey) {
  const mediaType = currentMediaType === 'movies' ? 'movie' : 'tv'
  getTrailer(id, mediaType).then((data) => {
    if (data.results.length < 1) {
      setTrailerKey(null);
    } else {
      data.results.forEach((element) => {
        if (element.type === 'Trailer') {
          setTrailerKey(element.key);
        }
      });
    }
    setOpenTrailer(true);
  });
}