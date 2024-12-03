"use client";
import { useState, useEffect, useContext, useReducer } from "react";
import { Context } from "../context/Context";
import { mediaD_Actions, mediaDetails_InitialState, reducerFunction } from "../helpers/reducerSelectedMedia";
import NotFound from "./common/NotFound";
import Similar from "@/components/Similar";
import Cast from "@/components/Cast";
import { Reviews } from "@/components/Reviews";
import MediaInfo from "@/components/MediaInfo";
import { setMediaDetails } from "../helpers/setMediaDetails";
import { Snackbar, Alert } from "@mui/material";
import { fetchDetailsData } from "@/helpers/fetchDetailsData";
import MediaDetailsSkeleton from "./common/Skeletons/MediaDetailsSkeleton";
import { auth } from "@/firebase/firebase.config";
import { getFromDB } from "@/firebase/getFromDB";

export const MediaDetails = ({ mediaType }) => {
  const { currentId, firebaseActiveUser, initialDataError, setinitialDataError, setAddedToFavs, setAddedtoWatchList, setCastError, setReviewsError, setSimilarError } = useContext(Context);

  const [state, dispatch] = useReducer(reducerFunction, mediaDetails_InitialState);

  const [similar, setSimilar] = useState([]);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);

  const [message, setMessage] = useState({ message: null, severity: null, open: false });

  useEffect(() => {
    if (currentId != undefined) {
      Promise.allSettled([
        fetchDetailsData("byId", mediaType, currentId),
        fetchDetailsData("similar", mediaType, currentId),
        fetchDetailsData("cast", mediaType, currentId),
        fetchDetailsData("reviews", mediaType, currentId),
      ]).then((result) => {
        const [byIdPromise, similarPromise, castPromise, reviewsPromise] = result;

        byIdPromise.status == "fulfilled" ? setMediaDetails(byIdPromise.value, dispatch) : setinitialDataError(true);
        similarPromise.status == "fulfilled" ? setSimilar(similarPromise.value.results) : setSimilarError(true);
        castPromise.status == "fulfilled" ? setCast(castPromise.value.cast) : setCastError(true);
        reviewsPromise.status == "fulfilled" ? setReviews(reviewsPromise.value.results) : setReviewsError(true);

        dispatch({ type: mediaD_Actions.set_All_DataLoader, payload: { loadingAllData: false } });
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

  return state.loadingAllData ? (
    <MediaDetailsSkeleton />
  ) : state.results[0] && state.results[0].success == false ? (
    <NotFound />
  ) : (
    <div style={{ paddingBlockEnd: "7rem" }}>
      {initialDataError ? <p className="text-center p-20">Error loading media information </p> : <MediaInfo state={state} loadingFavs={loadingFavs} loadingWatchlist={loadingWatchlist} />}

      <div className="extra-data">
        <Similar similar={similar} />
        <Cast cast={cast} />
        <Reviews reviews={reviews} />
      </div>

      <Snackbar
        open={message.open}
        autoHideDuration={3500}
        onClose={() => {
          setMessage({ ...message, open: false });
        }}
      >
        <Alert
          onClose={() => {
            setMessage({ ...message, open: false });
          }}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MediaDetails;
