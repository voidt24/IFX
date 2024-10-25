import { apiUrl, API_KEY, CACHENAME } from "./api.config";

export const getById = async (mediaType, id) => {
  if (!id) throw new Error("id undefined");
  const url = `${apiUrl}${mediaType}/${id}?api_key=${API_KEY}`;
  const validTime = Date.now() + 2629800000; //1month

  const fetchNormal = async () => {
    try {
      const data = await fetch(url);
      const json = await data.json();

      const responseClone = new Response(JSON.stringify(json), {
        headers: { "Content-Type": "application/json" },
      });

      const cache = await caches.open(CACHENAME);
      await cache.put(`byId-${id}`, responseClone);
      await cache.put(`byId-${id}-expiration`, new Response(JSON.stringify({ headers: { "Content-Type": "application/json" }, validTime })));

      return [json, "byFetch"];
    } catch (e) {
      return Promise.reject(e);
    }
  };

  try {
    const response = await caches.match(`byId-${id}`);
    const expirationResponse = await caches.match(`byId-${id}-expiration`);

    if (response) {
      const expirationDate = await expirationResponse.json();
      if (Date.now() > expirationDate.validTime) {
        const cache = await caches.open(CACHENAME);
        await cache.delete(`byId-${id}`);
        await cache.delete(`byId-${id}-expiration`);
        return fetchNormal();
      }

      const json = await response.json();
            console.log("desde cache: byid", json);

      return [json, "byCache"];
    } else {
      return fetchNormal();
    }
  } catch (e) {
    return fetchNormal();
  }
};
