import { apiUrl, API_KEY } from "./api.config";
import { ONE_MONTH, THREE_DAYS } from "./constants";
import { fetchDetailsData } from "./fetchDetailsData";

export const getDetailsHelper = async (typeOfSearch, mediaType, id) => {
  if (!id) throw new Error("id undefined");

  const CACHEURL = `${mediaType}-${typeOfSearch}-${id}`;
  let url;
  let validTime = ONE_MONTH;

  switch (typeOfSearch) {
    case "byId":
      url = `${apiUrl}${mediaType}/${id}?api_key=${API_KEY}`;
      break;
    case "similar":
      url = `${apiUrl}${mediaType}/${id}/similar?api_key=${API_KEY}`;
      break;
    case "cast":
      url = `${apiUrl}${mediaType}/${id}/credits?api_key=${API_KEY}&language=en-US&page=1`;
      break;
    case "reviews":
      url = `${apiUrl}${mediaType}/${id}/reviews?api_key=${API_KEY}`;
      validTime = THREE_DAYS
      break;
    default:
      break;
  }

  const data = await fetchDetailsData(id, url, validTime, CACHEURL);
  return data;
};
