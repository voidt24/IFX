import { apiUrl, API_KEY } from "./api.config";

export const search = async (query, page) => {
  const url = `${apiUrl}search/multi?api_key=${API_KEY}&query=${query}&page=${page}`;
  const fetchNormal = async () => {
    try {
      const data = await fetch(url);
      const json = await data.json();
      return json;
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return fetchNormal();
};
