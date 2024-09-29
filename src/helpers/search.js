import { apiUrl, API_KEY } from './api.config';

export const search = async (query) => {
  const url = `${apiUrl}search/multi?api_key=${API_KEY}&query=${query}`;
  const cache = await caches.open('my-cache');
  const validTime = Date.now() + 432000000; //5 days

  const fetchNormal = async () => {
    const data = await fetch(url);
    const json = await data.json();

    const responseClone = new Response(JSON.stringify(json), {
      headers: { 'Content-Type': 'application/json' },
    });

    await cache.put(url, responseClone);
    await cache.put(`${query}-search-expiration`, new Response(JSON.stringify({ headers: { 'Content-Type': 'application/json' }, validTime })));

    return json;
  };

  try {
    const response = await caches.match(url);
    const expirationResponse = await caches.match(`${query}-search-expiration`);

    if (response) {
      const expirationDate = await expirationResponse.json();
      if (Date.now() > expirationDate.validTime) {
        const cache = await caches.open('my-cache');
        await cache.delete(url);
        await cache.delete(`${query}-search-expiration`);
        return fetchNormal();
      }

      const json = await response.json();

      return json;
    } else {
      return fetchNormal();
    }
  } catch (e) {
    return e;
  }
};
