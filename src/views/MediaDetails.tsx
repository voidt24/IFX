"use client";
import { useState, useEffect, useContext } from "react";
import { getRunTime } from "@/helpers/getRunTime";
import { fetchDetailsData } from "@/helpers/fetchDetailsData";
import { auth } from "@/firebase/firebase.config";
import { getFromDB } from "@/firebase/getFromDB";
import { APP_NAME, image } from "@/helpers/api.config";
import formatReleaseDate from "@/helpers/formatReleaseDate";
import { MediaTypeApi } from "@/Types/mediaType";
import { setAddedToFavs, setAddedToWatchList, setAddedToWatched } from "@/store/slices/listsManagementSlice";
import { useDispatch, useSelector } from "react-redux";
import { ImediaDetailsData } from "@/Types/mediaDetails";
import { RootState } from "@/store";
import { setMediaDetailsData } from "@/store/slices/mediaDetailsSlice";
import { Context } from "@/context/Context";
import MediaInfoPWA from "@/components/PWA/MediaInfoPWA";
import MediaInfo from "@/components/byRoute/MediaDetails/MediaInfo";
import Notification from "@/components/common/Notification";
import useHideDrawers from "@/Hooks/useHideDrawers";
import MediaDetailsSkeleton from "@/components/common/Skeletons/MediaDetailsSkeleton";
import { onAuthStateChanged } from "firebase/auth";
import TabsSection from "@/components/byRoute/MediaDetails/TabsSection/TabsSection";

export const MediaDetails = ({ mediaType, mediaId }: { mediaType: MediaTypeApi; mediaId: number }) => {
  const { setCastError, setReviewsError, setOpenTrailer, isMobilePWA } = useContext(Context);

  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);
  const [loadingWatched, setLoadingWatched] = useState(true);

  const [message, setMessage] = useState<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>({ message: "", severity: "info", open: false });

  const { mediaDetailsData } = useSelector((state: RootState) => state.mediaDetails);
  const { testingInitialized } = useSelector((state: RootState) => state.auth);
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
            heroBackground: !isMobilePWA ? (window.innerWidth >= 640 ? `${image}${backdrop_path}` : `${image}${poster_path}`) : `${image}${backdrop_path}`,
            bigHeroBackground: `${image}${backdrop_path}`,
            title: title || name,
            poster: `${image}${poster_path}` || "",
            overview,
            releaseDate: release_date ? formatReleaseDate(release_date) : formatReleaseDate(first_air_date),
            vote: String(vote_average).slice(0, 3),
            genres: genres?.map((genre: string) => genre) || "",
            runtime: runtime ? getRunTime(runtime) : "",
            seasons: number_of_seasons ? (number_of_seasons === 1 ? "1 Season" : `${number_of_seasons} Seasons`) : "",
            seasonsArray: seasons,
          };

          dispatch(setMediaDetailsData(mediaDetails));
          castPromise.status == "fulfilled" ? setCast(castPromise.value.cast) : setCastError(true);
          reviewsPromise.status == "fulfilled" ? setReviews(reviewsPromise.value.results) : setReviewsError(true);

          const recent = localStorage.getItem(`${APP_NAME}-recent`);
          const recentData = JSON.parse(recent || "[]");

          for (const obj of recentData) {
            if (mediaId == obj.id) {
              return;
            }
          }
          if (recentData.length > 12) {
            localStorage.setItem(
              `${APP_NAME}-recent`,
              JSON.stringify([
                {
                  backdrop_path,
                  id: mediaId,
                  media_type: mediaType,
                  title,
                  name,
                  overview,
                  poster_path,
                  release_date,
                  first_air_date,
                  vote_average,
                },
              ]),
            );
            return;
          }

          const data = [
            ...recentData,
            {
              backdrop_path,
              id: mediaId,
              media_type: mediaType,
              title,
              name,
              overview,
              poster_path,
              release_date,
              first_air_date,
              vote_average,
            },
          ];
          localStorage.setItem(`${APP_NAME}-recent`, JSON.stringify(data));
        }
      });
    }

    async function isElementSaved() {
      if (auth.currentUser?.uid) {
        try {
          const isInFavs = await getFromDB(auth.currentUser.uid, "favorites", mediaId);
          const isInWatchlist = await getFromDB(auth.currentUser.uid, "watchlist", mediaId);
          const isInWatched = await getFromDB(auth.currentUser.uid, "watched", mediaId);

          dispatch(setAddedToFavs(Boolean(isInFavs)));
          dispatch(setAddedToWatchList(Boolean(isInWatchlist)));
          dispatch(setAddedToWatched(Boolean(isInWatched)));
        } catch (er) {
          setMessage({ message: "Error finding if this element was saved", severity: "error", open: true });
        } finally {
          setLoadingFavs(false);
          setLoadingWatchlist(false);
          setLoadingWatched(false);
        }
      } else {
        setLoadingFavs(false);
        setLoadingWatchlist(false);
        setLoadingWatched(false);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      function isSavedInTest() {
        const testingData = localStorage.getItem(`${APP_NAME}-testing-app-data`);
        const testingDataParsed = JSON.parse(testingData || "[]");

        for (const obj of testingDataParsed) {
          if (mediaId == obj.id) {
            return true;
          }
        }

        return false;
      }
      if (user) {
        isElementSaved();
      } else {
        if (testingInitialized) {
          // to-do: add function to check if item is in local storage
          // and stablished following sets based on result
          setAddedToFavs(false);
          setAddedToWatchList(false);
          setAddedToWatched(false);
          setLoadingFavs(false);
          setLoadingWatchlist(false);
          setLoadingWatched(false);

          return;
        }
        setAddedToFavs(false);
        setAddedToWatchList(false);
        setAddedToWatched(false);
        setLoadingFavs(false);
        setLoadingWatchlist(false);
        setLoadingWatched(false);
      }
    });

    return () => unsubscribe();
  }, [mediaId]);

  return (
    <div className="media-details bg-[#000005] max-lg:z-[999] z-[99] max-lg:pb-[155px] pb-4 w-full relative">
      {mediaDetailsData === null ? (
        <MediaDetailsSkeleton />
      ) : (
        <>
          {isMobilePWA ? (
            <MediaInfoPWA mediaType={mediaType} mediaId={mediaId} loadingFavs={loadingFavs} loadingWatchlist={loadingWatchlist} loadingWatched={loadingWatched} />
          ) : (
            <MediaInfo mediaId={mediaId} loadingFavs={loadingFavs} loadingWatchlist={loadingWatchlist} loadingWatched={loadingWatched} />
          )}

          <TabsSection mediaType={mediaType} mediaId={mediaId} cast={cast} reviews={reviews} />

          <Notification message={message} setMessage={setMessage} />
        </>
      )}
    </div>
  );
};

export default MediaDetails;
