"use client";
import { useState, useEffect, useContext } from "react";
import { getRunTime } from "@/helpers/getRunTime";
import { fetchDetailsData } from "@/helpers/fetchDetailsData";
import { auth } from "@/firebase/firebase.config";
import { getFromDB } from "@/firebase/getFromDB";
import { image } from "@/helpers/api.config";
import formatReleaseDate from "@/helpers/formatReleaseDate";
import { handleTrailerClick } from "@/helpers/getTrailer";
import { MediaTypeApi } from "@/Types/mediaType";
import { getApiMediaType } from "@/helpers/getApiMediaType";
import { setAddedToFavs, setAddedToWatchList } from "@/store/slices/listsManagementSlice";
import { useDispatch, useSelector } from "react-redux";
import { ImediaDetailsData } from "@/Types/mediaDetails";
import { RootState } from "@/store";
import { setMediaDetailsData } from "@/store/slices/mediaDetailsSlice";
import { Context } from "@/context/Context";
import MediaInfoPWA from "@/components/PWA/MediaInfoPWA";
import MediaInfo from "@/components/MediaDetails/MediaInfo";
import Tabs from "@/components/common/Tabs/Tabs";
import { Tab } from "@/components/common/Tabs/Tab";
import { Cast } from "@/components/MediaDetails/Cast";
import { Reviews } from "@/components/MediaDetails/Reviews/Reviews";
import Notification from "@/components/common/Notification";
import NotFound from "@/components/common/NotFound";
import useHideDrawers from "@/Hooks/useHideDrawers";

export const MediaDetails = ({ mediaType, mediaId }: { mediaType: MediaTypeApi; mediaId: number }) => {
  const { setCastError, setReviewsError, setOpenTrailer, setTrailerKey, isMobilePWA, showSearchBar, setShowSearchBar } = useContext(Context);

  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);
  const [loadingAllData, setLoadingAllData] = useState(true);

  const [message, setMessage] = useState<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>({ message: "", severity: "info", open: false });

  const { mediaDetailsData, currentMediaType } = useSelector((state: RootState) => state.mediaDetails);
  const dispatch = useDispatch();

  useHideDrawers(true);

  useEffect(() => {
    return () => {
      dispatch(setMediaDetailsData(null));
      setOpenTrailer(false);
    };
  }, []);

  useEffect(() => {
    if ((!isMobilePWA && mediaId != undefined) || (isMobilePWA && mediaId != undefined)) {
      Promise.allSettled([fetchDetailsData("byId", mediaType, mediaId), fetchDetailsData("cast", mediaType, mediaId), fetchDetailsData("reviews", mediaType, mediaId)]).then((result) => {
        const [byIdPromise, castPromise, reviewsPromise] = result;
        if (byIdPromise.status == "fulfilled") {
          const { title, name, overview, release_date, first_air_date, genres, vote_average, backdrop_path, poster_path, runtime, number_of_seasons, seasons } = byIdPromise.value;

          const mediaDetails: ImediaDetailsData = {
            results: [],
            heroBackground: !isMobilePWA ? (window.innerWidth >= 640 ? `${image}${backdrop_path}` : `${image}${poster_path}`) : `${image}${backdrop_path}`,
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

          dispatch(setMediaDetailsData(mediaDetails));

          castPromise.status == "fulfilled" ? setCast(castPromise.value.cast) : setCastError(true);
          reviewsPromise.status == "fulfilled" ? setReviews(reviewsPromise.value.results) : setReviewsError(true);
          setLoadingAllData(false);
        }
      });
    }

    async function isElementSaved() {
      if (auth.currentUser?.uid) {
        try {
          const isInFavs = await getFromDB(auth.currentUser.uid, "favorites", mediaId);
          const isInWatchlist = await getFromDB(auth.currentUser.uid, "watchlist", mediaId);

          dispatch(setAddedToFavs(Boolean(isInFavs)));
          dispatch(setAddedToWatchList(Boolean(isInWatchlist)));
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
  }, [mediaId]);

  return (
    <div className="media-details bg-[#000005] max-lg:z-[999] z-[99] max-lg:pb-[155px] pb-4 w-full relative">
      {isMobilePWA ? (
        <MediaInfoPWA mediaType={mediaType} mediaId={mediaId} loadingFavs={loadingFavs} loadingWatchlist={loadingWatchlist} />
      ) : (
        <MediaInfo mediaId={mediaId} loadingFavs={loadingFavs} loadingWatchlist={loadingWatchlist} />
      )}

      <div className="w-full px-[0.8rem] lg:max-w-[85%] xxl:max-w-[70%] 4k:max-w-[60%] relative  mx-auto  mt-10">
        <Tabs>
          <Tab title="Cast">
            <Cast cast={cast} />
          </Tab>
          <Tab title="Trailer">
            <div
              className="trailer-preview border border-content-third rounded-lg overflow-hidden bg-cover bg-center aspect-video bg-no-repeat w-full md:w-[40%] mx-auto relative"
              style={{ backgroundImage: `url(${mediaDetailsData?.bigHeroBackground})` }}
            >
              <div className="overlay-base bg-black/70 flex-col-center ">
                <button
                  className="px-3 py-2 bg-brand-primary/35 backdrop-blur-lg rounded-full hover:scale-125 transition-all duration-200"
                  onClick={() => {
                    handleTrailerClick(setOpenTrailer, mediaId, isMobilePWA ? mediaType : getApiMediaType(currentMediaType), setTrailerKey);
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
