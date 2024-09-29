import { API_KEY } from './api.config';

export const getCast = async (mediaType, id, getBy = 'byFetch') => {
  const url = `https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=${API_KEY}&language=en-US&page=1`;

  const fetchNormal = async () => {
    const data = await fetch(url);
    const json = await data.json();

    const responseClone = new Response(JSON.stringify(json), {
      headers: { 'Content-Type': 'application/json' },
    });

    const cache = await caches.open('my-cache');
    await cache.put(url, responseClone);

    return json.cast;
  };

  if (getBy == 'byCache') {
    try {
      const response = await caches.match(url);

      if (response) {
        const json = await response.json();

        return json.cast;
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
