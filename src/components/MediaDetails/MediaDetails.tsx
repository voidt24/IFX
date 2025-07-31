"use client";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../context/Context";
import NotFound from "../common/NotFound";
import Cast from "./Cast";
import { Reviews } from "./Reviews/Reviews";
import MediaInfo from "./MediaInfo";
import { getRunTime } from "@/helpers/getRunTime";
import { fetchDetailsData } from "@/helpers/fetchDetailsData";
import { auth } from "@/firebase/firebase.config";
import { getFromDB } from "@/firebase/getFromDB";
import { image } from "@/helpers/api.config";
import Notification from "../common/Notification";
import formatReleaseDate from "@/helpers/formatReleaseDate";
import Tabs from "../common/Tabs/Tabs";
import { Tab } from "../common/Tabs/Tab";
import { handleTrailerClick } from "@/helpers/getTrailer";
import MediaInfoPWA from "../PWA/MediaInfoPWA";
import { MediaTypeApi } from "@/Types/mediaType";
import { getApiMediaType } from "@/helpers/getApiMediaType";
import { setAddedToFavs, setAddedToWatchList } from "@/store/slices/listsManagementSlice";
import { useDispatch } from "react-redux";
import { ImediaDetailsData } from "@/Types/mediaDetails";

export const MediaDetails = ({ mediaType, mediaId }: { mediaType: MediaTypeApi; mediaId: number }) => {
  const { currentId, setCastError, setReviewsError, mediaDetailsData, setMediaDetailsData, setOpenTrailer, setTrailerKey, currentMediaType, isMobilePWA } = useContext(Context);

  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);
  const [loadingAllData, setLoadingAllData] = useState(true);
  const [mediaDetailsPWA, setmediaDetailsPWA] = useState<ImediaDetailsData | null>(null);

  const [message, setMessage] = useState<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>({ message: "", severity: "info", open: false });

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      setMediaDetailsData(null);
      setOpenTrailer(false);
    };
  }, []);

  useEffect(() => {
    if ((!isMobilePWA && currentId != undefined) || (isMobilePWA && mediaId != undefined)) {
      Promise.allSettled([
        fetchDetailsData("byId", mediaType, isMobilePWA ? mediaId : currentId),
        fetchDetailsData("cast", mediaType, isMobilePWA ? mediaId : currentId),
        fetchDetailsData("reviews", mediaType, isMobilePWA ? mediaId : currentId),
      ]).then((result) => {
        const [byIdPromise, castPromise, reviewsPromise] = result;
        if (byIdPromise.status == "fulfilled") {
          const { title, name, overview, release_date, first_air_date, genres, vote_average, backdrop_path, poster_path, runtime, number_of_seasons, seasons } = byIdPromise.value;

          const mediaDetails: ImediaDetailsData = {
            results: [],
            heroBackground: window.innerWidth >= 640 ? `${image}${backdrop_path}` : `${image}${poster_path}`,
            bigHeroBackground: `${image}${backdrop_path}`,
            title: title || name,
            poster: `${image}${poster_path}` || "",
            overview,
            releaseDate: release_date ? formatReleaseDate(release_date) : formatReleaseDate(first_air_date),
            vote: String(vote_average).slice(0, 3),
            genres: genres?.map((genre: string) => genre) || "",
            loadingAllData: false,
            runtime: runtime ? getRunTime(runtime) : "",
            seasons: number_of_seasons ? (number_of_seasons === 1 ? "1 Season" : `${number_of_seasons} Seasons`) : "",
            seasonsArray: seasons,
          };

          (isMobilePWA ? setmediaDetailsPWA : setMediaDetailsData)(mediaDetails);

          castPromise.status == "fulfilled" ? setCast(castPromise.value.cast) : setCastError(true);
          reviewsPromise.status == "fulfilled" ? setReviews(reviewsPromise.value.results) : setReviewsError(true);
          setLoadingAllData(false);
        }
      });
    }

    async function isElementSaved() {
      if (auth.currentUser?.uid) {
        try {
          const isInFavs = await getFromDB(auth.currentUser.uid, "favorites", isMobilePWA ? mediaId : currentId);
          const isInWatchlist = await getFromDB(auth.currentUser.uid, "watchlist", isMobilePWA ? mediaId : currentId);

          dispatch(setAddedToFavs(Boolean(isInFavs)));
          dispatch(setAddedToWatchList(Boolean(isInWatchlist)));
          // isInFavs ? setAddedToFavs(true) : setAddedToFavs(false);
          // isInWatchlist ? setAddedToWatchList(true) : setAddedToWatchList(false);
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
  }, [currentId]);

  if ((!loadingAllData && !isMobilePWA && !mediaDetailsData) || (!loadingAllData && isMobilePWA && !mediaDetailsPWA)) {
    return (
      <div className="flex-col-center p-20">
        <NotFound />
      </div>
    );
  }
  return (
    <div className="media-details bg-[#000005] max-lg:z-[999] z-[99] max-lg:pb-[155px] pb-4 w-full relative">
      {isMobilePWA ? (
        <MediaInfoPWA state={mediaDetailsPWA} mediaType={mediaType} mediaId={mediaId} loadingFavs={loadingFavs} loadingWatchlist={loadingWatchlist} />
      ) : (
        <MediaInfo loadingFavs={loadingFavs} loadingWatchlist={loadingWatchlist} />
      )}

      <div className="w-full px-[0.8rem] lg:max-w-[85%] xxl:max-w-[70%] 4k:max-w-[60%] relative  mx-auto  mt-10">
        <Tabs>
          <Tab title="Cast">
            <Cast cast={cast} />
          </Tab>
          <Tab title="Trailer">
            <div
              className="trailer-preview border border-content-third rounded-lg overflow-hidden bg-cover bg-center aspect-video bg-no-repeat w-full md:w-[40%] mx-auto relative"
              style={{ backgroundImage: `url(${isMobilePWA ? mediaDetailsPWA?.bigHeroBackground : mediaDetailsData?.bigHeroBackground})` }}
            >
              <div className="overlay-base bg-black/70 flex-col-center ">
                <button
                  className="px-3 py-2 bg-brand-primary/35 backdrop-blur-lg rounded-full hover:scale-125 transition-all duration-200"
                  onClick={() => {
                    handleTrailerClick(setOpenTrailer, isMobilePWA ? mediaId : currentId, isMobilePWA ? mediaType : getApiMediaType(currentMediaType), setTrailerKey);
                  }}
                  title="trailer-button"
                >
                  <i className="bi bi-play text-2xl"></i>
                </button>
              </div>
            </div>
          </Tab>
          <Tab title={`Reviews (${reviews.length})`}>
            <Reviews reviews={reviews} />
          </Tab>
        </Tabs>
      </div>

      <Notification message={message} setMessage={setMessage} />
    </div>
  );
};

export default MediaDetails;
