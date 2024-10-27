"use client";
import { useContext, useEffect } from "react";
import { Context } from "../context/Context";
import { fetchInitialData } from "../helpers/fetchInitialData";
import { mediaProperties } from "../helpers/mediaProperties.config.js";

export const MediaData = () => {
  const { currentMediaType, setApiData, setinitialDataError, setInitialDataIsLoading } = useContext(Context);
  const fetchAndSetData = (mediaType) => {
    fetchInitialData(mediaType)
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
