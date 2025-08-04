import { Context } from "@/context/Context";
import { fetchInitialData } from "@/helpers/fetchInitialData";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import { IMediaData } from "@/Types";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

function useInitialMediaData() {
  const { setInitialDataIsLoading, setInitialDataError } = useContext(Context);
  const [moviesApiData, setMoviesApiData] = useState<IMediaData[]>([]);
  const [tvApiData, setTvApiData] = useState<IMediaData[]>([]);
  const [moviesHeroApiData, setMoviesHeroApiData] = useState<IMediaData[]>([]);

  const fetchAndSetData = (
    mediaTypeObj: { mediaType: string; searchCategory: string[]; limit: number[]; route: string },
    MethodThatSavesInMovies?: Dispatch<SetStateAction<IMediaData[]>>,
    MethodThatSavesInTV?: Dispatch<SetStateAction<IMediaData[]>>,
    categoryForMovie?: string
  ) => {
    fetchInitialData(mediaTypeObj, null, null, categoryForMovie)
      .then((data: [IMediaData[], number]) => {
        mediaTypeObj.route == mediaProperties.movie.route ? MethodThatSavesInMovies && MethodThatSavesInMovies(data[0]) : MethodThatSavesInTV && MethodThatSavesInTV(data[0]);
      })
      .catch((e) => {
        setInitialDataError(true);
      })
      .finally(() => {
        setInitialDataIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAndSetData(mediaProperties.movie, setMoviesHeroApiData, undefined, mediaProperties.movie.searchCategory[0]);
    fetchAndSetData(mediaProperties.movie, setMoviesApiData, undefined, mediaProperties.movie.searchCategory[0]);
    fetchAndSetData(mediaProperties.tv, undefined, setTvApiData);
  }, []);

  return { moviesHeroApiData, moviesApiData, tvApiData };
}

export default useInitialMediaData;
