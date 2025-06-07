"use client";
import { useState, useEffect, useContext, useRef } from "react";
import { Context } from "../../context/Context";
import NotFound from "../common/NotFound";
import Cast from "./Cast";
import { Reviews } from "./Reviews/Reviews";
import MediaInfo from "./MediaInfo";
import { getRunTime } from "@/helpers/getRunTime";
import { fetchDetailsData } from "@/helpers/fetchDetailsData";
import MediaDetailsSkeleton from "../common/Skeletons/MediaDetailsSkeleton";
import { auth } from "@/firebase/firebase.config";
import { getFromDB } from "@/firebase/getFromDB";
import { image, imageWithSize } from "@/helpers/api.config";
import Notification from "../common/Notification";
import formatReleaseDate from "@/helpers/formatReleaseDate";
import Similar from "./Similar";
import Tabs from "../common/Tabs/Tabs";
import { Tab } from "../common/Tabs/Tab";
import { handleTrailerClick } from "@/helpers/getTrailer";

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
    openTrailer,
    setOpenTrailer,
    setTrailerKey,
    currentMediaType,
  } = useContext(Context);

  const [similar, setSimilar] = useState([]);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);
  const [loadingAllData, setLoadingAllData] = useState(true);

  const [message, setMessage] = useState({ message: "", severity: "info", open: false });

  useEffect(() => {
    return () => {
      setMediaDetailsData(null);
    };
  }, []);

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
              bigHeroBackground: `${image}${backdrop_path}`,
              title: title || name,
              poster: `${image}${poster_path}` || "",
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
          setMessage({ message: "Error finding if this element was saved", severity: "error", open: true });
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

  return loadingAllData && mediaDetailsData && mediaDetailsData.results && mediaDetailsData.results[0] && mediaDetailsData.results[0].success == false ? (
    <NotFound />
  ) : (
    !loadingAllData && (
      <div className="media-details bg-[#000005] max-lg:z-[999] z-[99] max-lg:pb-[155px] pb-4 w-full absolute top-0 ">
        {initialDataError ? <p className="text-center p-20">Error loading media information </p> : <MediaInfo state={mediaDetailsData} loadingFavs={loadingFavs} loadingWatchlist={loadingWatchlist} />}

        <div className="w-full px-[0.8rem] lg:max-w-[85%] xxl:max-w-[70%] 4k:max-w-[60%] relative  mx-auto  mt-10">
          <Tabs>
            <Tab title="Cast">
              <Cast cast={cast} />
            </Tab>
            <Tab title="Trailer">
              <div
                className="trailer-preview border border-content-third rounded-lg overflow-hidden bg-cover bg-center aspect-video bg-no-repeat w-full md:w-[40%] mx-auto relative"
                style={{ backgroundImage: `url(${mediaDetailsData.bigHeroBackground})` }}
              >
                <div className="overlay-base bg-black/70 flex-col-center ">
                  <button
                    className="px-3 py-2 bg-brand-primary/35 backdrop-blur-lg rounded-full hover:scale-125 transition-all duration-200"
                    onClick={() => {
                      handleTrailerClick(setOpenTrailer, currentId, currentMediaType, setTrailerKey);
                    }}
                  >
                    <i className="bi bi-play text-2xl  "></i>
                  </button>
                </div>
              </div>
            </Tab>
            <Tab title="Reviews">
              <Reviews reviews={reviews} />
            </Tab>
            <Tab title="Similar">
              <Similar similar={similar} />
            </Tab>
          </Tabs>
        </div>

        <Notification message={message} setMessage={setMessage} />
      </div>
    )
  );
};

export default MediaDetails;
