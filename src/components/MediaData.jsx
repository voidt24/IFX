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
  const { currentMediaType, setApiData, setLoadingAllData } = useContext(Context);
  useEffect(() => {
    async function callFetch() {
      try {
        let movieData = null;
        let tvData = null;
        if (currentMediaType == "movies") {
          movieData = await fetchData(mediaProperties.movie);
                // console.log(movieData);

        } else {
          tvData = await fetchData(mediaProperties.tv);
        }
        if (movieData !== null || tvData !== null) {
          const tempApiData = [];
          tempApiData.push(movieData === null ? tvData : movieData);
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
        setLoadingAllData(false);
      })
      .catch(() => {
        setLoadingAllData(false);
      }); //todo: display error to user\
  }, [currentMediaType]);

  return null;
};

export default MediaData;
