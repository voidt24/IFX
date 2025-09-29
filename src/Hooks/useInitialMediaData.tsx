import { fetchGeneralData } from "@/helpers/fetchInitialData";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import { IMediaData, MediaTypeApi } from "@/Types";
import { useEffect, useState } from "react";

function useInitialMediaData() {
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(false);

  const [data, setData] = useState<{ moviesHero: IMediaData[]; tv: IMediaData[]; movies: IMediaData[] }>({
    moviesHero: [],
    tv: [],
    movies: [],
  });

  const fetchAndSetData = async (mediaTypeObj: { mediaType: MediaTypeApi; searchCategory: string[]; limit: number[]; route: string }, categoryForMovie?: string) => {
    const { mediaType, searchCategory, limit, route } = mediaTypeObj;
    try {
      const results = await fetchGeneralData({ mediaType: mediaType, searchCategory: searchCategory, limit: limit, route: route }, categoryForMovie);
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
