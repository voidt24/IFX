import { apiUrl, API_KEY } from "./api.config";
const CACHENAME = "prods-cache-v2";

export const search = async (query, page) => {
  const url = `${apiUrl}search/multi?api_key=${API_KEY}&query=${query}&page=${page}`;
  const cache = await caches.open(CACHENAME);
  const validTime = Date.now() + 432000000; //5 days

  const fetchNormal = async () => {
    try {
      const data = await fetch(url);
      const json = await data.json();

      const responseClone = new Response(JSON.stringify(json), {
        headers: { "Content-Type": "application/json" },
      });

      await cache.put(`search/${query}`, responseClone);
      await cache.put(`${query}-search-expiration`, new Response(JSON.stringify({ headers: { "Content-Type": "application/json" }, validTime })));

      return json;
    } catch (e) {
      return Promise.reject(e);
    }
  };

  try {
    const response = await caches.match(`search/${query}`);
    const expirationResponse = await caches.match(`${query}-search-expiration`);

    if (response) {
      const expirationDate = await expirationResponse.json();
      if (Date.now() > expirationDate.validTime) {
        const cache = await caches.open(CACHENAME);
        await cache.delete(`search/${query}`);
        await cache.delete(`${query}-search-expiration`);
        return fetchNormal();
      }

      const json = await response.json();

      return json;
    } else {
      return fetchNormal();
    }
  } catch (e) {
    return fetchNormal();
  }
};
