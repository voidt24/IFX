import { apiUrl, API_KEY } from "./api.config";

export const getReviews = async (mediaType, id) => {
  if (!id) throw new Error("id undefined");
  const url = `${apiUrl}${mediaType}/${id}/reviews?api_key=${API_KEY}`;
  const validTime = Date.now() + 2629800000; //1month
  const CACHENAME = "prods-cache-v2";

  const fetchNormal = async () => {
    try {
      const data = await fetch(url);
      const json = await data.json();

      const responseClone = new Response(JSON.stringify(json), {
        headers: { "Content-Type": "application/json" },
      });

      const cache = await caches.open(CACHENAME);
      await cache.put(url, responseClone);
      await cache.put(`${url}-expiration`, new Response(JSON.stringify({ headers: { "Content-Type": "application/json" }, validTime })));

      return json;
    } catch (e) {
      return Promise.reject(e);
    }
  };

  try {
    const response = await caches.match(url);
    const expirationResponse = await caches.match(`${url}-expiration`);

    if (response) {
      const json = await response.json();
      const expirationDate = await expirationResponse.json();

      if (Date.now() > expirationDate.validTime) {
        const cache = await caches.open(CACHENAME);
        await cache.delete(url);
        await cache.delete(`${url}-expiration`);
        return fetchNormal();
      }
      return json;
    } else {
      return fetchNormal();
    }
  } catch (e) {
    return fetchNormal();
  }
};
