import { fetchInitialData } from "@/helpers/fetchInitialData";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import { IMediaData } from "@/Types";
import { useEffect, useState } from "react";

function useInitialMediaData() {
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(false);

  const [data, setData] = useState<{ moviesHero: IMediaData[]; tv: IMediaData[]; movies: IMediaData[] }>({
    moviesHero: [],
    tv: [],
    movies: [],
  });

  const fetchAndSetData = async (mediaTypeObj: { mediaType: string; searchCategory: string[]; limit: number[]; route: string }, categoryForMovie?: string) => {
    try {
      const results = await fetchInitialData(mediaTypeObj, null, null, categoryForMovie);
      return results[0];
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    async function fetchAll() {
      const moviesHero = await fetchAndSetData(mediaProperties.movie, mediaProperties.movie.searchCategory[0]);
      const movies = await fetchAndSetData(mediaProperties.movie, mediaProperties.movie.searchCategory[0]);
      const tv = await fetchAndSetData(mediaProperties.tv);
      setData({ moviesHero, tv, movies });
      setIsLoading(false);
    }

    fetchAll();
  }, []);

  return { data, isLoading, error };
}

export default useInitialMediaData;
