"use client"
import { useContext, useEffect } from 'react';
import { Context } from '../context/Context';
import { fetchData } from '../helpers/fetchData';

const category = ['trending', 'popular'];
const limit = [4, 15, 20];

export const mediaProperties = {
  movie: {
    mediaType: 'movie',
    category,
    limit,
  },
  tv: {
    mediaType: 'tv',
    category,
    limit,
  },
};

export const MediaData = () => {
  const { currentMediaType, setCurrentMediaType, setApiData, setLoadingAllData } = useContext(Context);

  useEffect(() => {
    
    if (currentMediaType !== 'movies' && currentMediaType !== 'tvshows') {
      setCurrentMediaType('movies');
    }
    async function callFetch() {
      try {
        const movieData = await fetchData(mediaProperties.movie);
        const tvData = await fetchData(mediaProperties.tv);
        if (movieData && tvData) {
          const tempApiData = [];
          tempApiData.push(movieData, tvData);
          return tempApiData;
        } else {
          throw new Error();
        }
      } catch (e) {
        console.log(e);
      }
    }

    callFetch()
    .then((data) => {
      setApiData(data);
      setLoadingAllData(false)
    })
    .catch(()=>{setLoadingAllData(false)}) //todo: display error to user
  }, []);

  return null;
};

export default MediaData;
