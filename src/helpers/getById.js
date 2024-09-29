import { apiUrl, API_KEY } from './api.config';

export const getById = async (mediaType, id) => {
  const url = `${apiUrl}${mediaType}/${id}?api_key=${API_KEY}`;
  const validTime = Date.now() + 2629800000; //1month

  const fetchNormal = async () => {
    if(id == undefined) return
    try {
      const data = await fetch(url);
      const json = await data.json();

      const responseClone = new Response(JSON.stringify(json), {
        headers: { 'Content-Type': 'application/json' },
      });

      const cache = await caches.open('my-cache');
      await cache.put(url, responseClone);
      await cache.put(`${url}-expiration`, new Response(JSON.stringify({ headers: { 'Content-Type': 'application/json' }, validTime })));
      return [json, 'byFetch'];
    } catch (e) {
      return e;
    }
  };

  try {
    const response = await caches.match(url);
    const expirationResponse = await caches.match(`${url}-expiration`);

    if (response) {
      const expirationDate = await expirationResponse.json();
      if (Date.now() > expirationDate.validTime) {
        console.log('El caché ha expirado.');
        const cache = await caches.open('my-cache');
        await cache.delete(url); 
        await cache.delete(`${url}-expiration`);
        return fetchNormal();
      }

      const json = await response.json();

      return [json, 'byCache'];
    } else {
      return fetchNormal();
    }
  } catch (e) {
    return e;
  }
};
