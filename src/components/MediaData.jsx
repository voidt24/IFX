"use client";
import { useContext, useEffect } from "react";
import { Context } from "../context/Context";
import { fetchData } from "../helpers/fetchData";

const category = ["trending", "popular"];
const limit = [4, 15, 20];

export const mediaProperties = {
  movie: {
    mediaType: "movie",
    category,
    limit,
  },
  tv: {
    mediaType: "tv",
    category,
    limit,
  },
};

export const MediaData = () => {
  const { currentMediaType, setApiData, setinitialDataError, setInitialDataIsLoading } = useContext(Context);

  useEffect(() => {
    if (currentMediaType == "movies") {
      fetchData(mediaProperties.movie)
        .then((movieData) => {
          setApiData([movieData]);
        })
        .catch((e) => {
          setinitialDataError(true);
        })
        .finally(() => {
          setInitialDataIsLoading(false);
        });
    } else if (currentMediaType == "tvshows") {
      fetchData(mediaProperties.tv)
        .then((tvData) => {
          setApiData([tvData]);
        })
        .catch((e) => {
          setinitialDataError(true);
        })
        .finally(() => {
          setInitialDataIsLoading(false);
        });
    }
  }, [currentMediaType]);

  return null;
};

export default MediaData;
