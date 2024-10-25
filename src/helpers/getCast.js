import { API_KEY, CACHENAME } from "./api.config";

export const getCast = async (mediaType, id) => {
  if (!id) throw new Error("id undefined");
  const url = `https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=${API_KEY}&language=en-US&page=1`;
  const validTime = Date.now() + 2629800000; //1month

  const fetchNormal = async () => {
    try {
      const data = await fetch(url);
      const json = await data.json();

      const responseClone = new Response(JSON.stringify(json), {
        headers: { "Content-Type": "application/json" },
      });

      const cache = await caches.open(CACHENAME);
      await cache.put(`cast-${id}`, responseClone);
      await cache.put(`cast-${id}-expiration`, new Response(JSON.stringify({ headers: { "Content-Type": "application/json" }, validTime })));

      return json.cast;
    } catch (e) {
      return Promise.reject(e);
    }
  };

  try {
    const response = await caches.match(`cast-${id}`);
    const expirationResponse = await caches.match(`cast-${id}-expiration`);

    if (response) {
      const json = await response.json();
      const expirationDate = await expirationResponse.json();

      if (Date.now() > expirationDate.validTime) {
        const cache = await caches.open(CACHENAME);
        await cache.delete(`cast-${id}`);
        await cache.delete(`cast-${id}-expiration`);
        return fetchNormal();
      }
            console.log("desde cache: cast ", json);

      return json.cast;
    } else {
      return fetchNormal();
    }
  } catch (e) {
    return fetchNormal();
  }
};
