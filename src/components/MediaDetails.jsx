"use client";
import { useState, useEffect, useContext } from "react";
import { Context } from "../context/Context";
import NotFound from "./common/NotFound";
import Similar from "@/components/Similar";
import Cast from "@/components/Cast";
import { Reviews } from "@/components/Reviews";
import MediaInfo from "@/components/MediaInfo";
import { getRunTime } from "@/helpers/getRunTime";
import { fetchDetailsData } from "@/helpers/fetchDetailsData";
import MediaDetailsSkeleton from "./common/Skeletons/MediaDetailsSkeleton";
import { auth } from "@/firebase/firebase.config";
import { getFromDB } from "@/firebase/getFromDB";
import { image, imageWithSize } from "@/helpers/api.config";
import Notification from "./common/Notification";
import formatReleaseDate from "@/helpers/formatReleaseDate";

export const MediaDetails = ({ mediaType }) => {
  const {
    currentId,
    firebaseActiveUser,
    initialDataError,
    setinitialDataError,
    setAddedToFavs,
    setAddedtoWatchList,
    setCastError,
    setReviewsError,
    setSimilarError,
    mediaDetailsData,
    setMediaDetailsData,
  } = useContext(Context);

  const [similar, setSimilar] = useState([]);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);
  const [loadingAllData, setLoadingAllData] = useState(true);

  const [message, setMessage] = useState({ message: "", severity: "info", open: false });

  useEffect(() => {
    if (currentId != undefined) {
      Promise.allSettled([
        fetchDetailsData("byId", mediaType, currentId),
        fetchDetailsData("similar", mediaType, currentId),
        fetchDetailsData("cast", mediaType, currentId),
        fetchDetailsData("reviews", mediaType, currentId),
      ]).then((result) => {
        const [byIdPromise, similarPromise, castPromise, reviewsPromise] = result;
        const { title, name, overview, release_date, first_air_date, genres, vote_average, backdrop_path, poster_path, runtime, number_of_seasons, seasons } = byIdPromise.value;
        byIdPromise.status == "fulfilled"
          ? setMediaDetailsData({
              results: [byIdPromise[0]],
              heroBackground: window.innerWidth >= 640 ? `${image}${backdrop_path}` : `${image}${poster_path}`,
              title: title || name,
              poster: `${imageWithSize("500")}${poster_path}` || "",
              overview,
              releaseDate: release_date ? formatReleaseDate(release_date) : formatReleaseDate(first_air_date),
              vote: String(vote_average).slice(0, 3),
              genres: (genres && genres.map((genre) => genre.name)) || "",
              loadingAllData: false,
              runtime: runtime ? getRunTime(runtime) : "",
              seasons: number_of_seasons ? (number_of_seasons == 1 ? number_of_seasons + " Season" : number_of_seasons + " Seasons") : "",
              seasonsArray: seasons,
            })
          : setinitialDataError(true);

        similarPromise.status == "fulfilled" ? setSimilar(similarPromise.value.results) : setSimilarError(true);
        castPromise.status == "fulfilled" ? setCast(castPromise.value.cast) : setCastError(true);
        reviewsPromise.status == "fulfilled" ? setReviews(reviewsPromise.value.results) : setReviewsError(true);
        setLoadingAllData(false);
      });
    }

    async function isElementSaved() {
      if (auth.currentUser?.uid) {
        try {
          const isInFavs = await getFromDB(auth.currentUser.uid, "favorites", currentId);
          const isInWatchlist = await getFromDB(auth.currentUser.uid, "watchlist", currentId);

          isInFavs ? setAddedToFavs(true) : setAddedToFavs(false);
          isInWatchlist ? setAddedtoWatchList(true) : setAddedtoWatchList(false);
        } catch (er) {
          setMessage({ message: "Error finding is this element was saved", severity: "error", open: true });
        } finally {
          setLoadingFavs(false);
          setLoadingWatchlist(false);
        }
      } else {
        setLoadingFavs(false);
        setLoadingWatchlist(false);
      }
    }

    isElementSaved();
  }, [currentId, firebaseActiveUser]);

  return loadingAllData ? (
    <MediaDetailsSkeleton />
  ) : mediaDetailsData.results[0] && mediaDetailsData.results[0].success == false ? (
    <NotFound />
  ) : (
    <div style={{ paddingBlockEnd: "7rem" }}>
      {initialDataError ? <p className="text-center p-20">Error loading media information </p> : <MediaInfo state={mediaDetailsData} loadingFavs={loadingFavs} loadingWatchlist={loadingWatchlist} />}

      <div className="extra-data">
        <Similar similar={similar} />
        <Cast cast={cast} />
        <Reviews reviews={reviews} />
      </div>

      <Notification message={message} setMessage={setMessage} />
    </div>
  );
};

export default MediaDetails;
