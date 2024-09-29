import { apiUrl, API_KEY } from './api.config';

export const getSimilar = async (mediaType, id, getBy = 'byFetch') => {
  const url = `${apiUrl}${mediaType}/${id}/similar?api_key=${API_KEY}`;

  const fetchNormal = async () => {
    const data = await fetch(url);
    const json = await data.json();

    const responseClone = new Response(JSON.stringify(json), {
      headers: { 'Content-Type': 'application/json' },
    });

    const cache = await caches.open('my-cache');
    await cache.put(url, responseClone);

    return json;
  };

  if (getBy == 'byCache') {
    try {
      const response = await caches.match(url);

      if (response) {
        const json = await response.json();

        return json;
      } else {
        return fetchNormal();
      }
    } catch (e) {
      return [];
    }
  } else {
    return fetchNormal();
  }
};
