"use client";
import { useContext, useEffect } from "react";
import { Context } from "../context/Context";
import { fetchData } from "../helpers/fetchData";
import { mediaProperties } from "../helpers/mediaProperties.config.js";

export const MediaData = () => {
  const { currentMediaType, setApiData, setinitialDataError, setInitialDataIsLoading } = useContext(Context);
  const fetchAndSetData = (mediaType) => {
    fetchData(mediaType)
      .then((data) => {
        setApiData([data]);
      })
      .catch(() => {
        setinitialDataError(true);
      })
      .finally(() => {
        setInitialDataIsLoading(false);
      });
  };

  useEffect(() => {
    if (currentMediaType == mediaProperties.movie.route) {
      fetchAndSetData(mediaProperties.movie);
    } else if (currentMediaType == mediaProperties.tv.route) {
      fetchAndSetData(mediaProperties.tv);
    }
  }, [currentMediaType]);

  return null;
};

export default MediaData;
