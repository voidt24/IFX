"use client";
import { useState, useEffect, useContext, useReducer } from "react";
import { Context } from "../context/Context";
import { mediaDetails_InitialState, reducerFunction } from "../helpers/reducerSelectedMedia";
import NotFound from "@/components/NotFound";
import Similar from "@/components/Similar";
import Cast from "@/components/Cast";
import { Reviews } from "@/components/Reviews";
import MediaInfo from "@/components/MediaInfo";
import { setListsState, setMediaDetails } from "../helpers/setMediaDetails";
import { useParams } from "next/navigation";
import { CircularProgress, Snackbar, Alert } from "@mui/material";

export const MediaDetails = () => {
  const { setCurrentId, currentId, currentMediaType, setCast, userLogged, firebaseActiveUser, setAddedToFavs, setAddedtoWatchList } = useContext(Context);

  const [state, dispatch] = useReducer(reducerFunction, mediaDetails_InitialState);
  const { id: idFromUrl } = useParams();

  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingCast, setLoadingCast] = useState(true);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);

  const [similarMaximized, setSimilarMaximized] = useState(false);
  const [castMaximized, setCastMaximized] = useState(false);
  const [message, setMessage] = useState({ message: null, severity: null, open: false });
  const [routeKey, setRouteKey] = useState(0); // Agrega un estado para la clave

  useEffect(() => {
    if (idFromUrl != currentId) {
      setCurrentId(idFromUrl);
    }
  }, [idFromUrl]);

  useEffect(() => {
    setMediaDetails(currentId, dispatch, setCastMaximized, currentMediaType, setCast, setLoadingCast, setSimilar, setReviews, firebaseActiveUser, setRouteKey, setSimilarMaximized);
    setListsState(userLogged, firebaseActiveUser, setAddedToFavs, setLoadingFavs, setAddedtoWatchList, setLoadingWatchlist, currentId);
  }, [currentId, firebaseActiveUser]);

  return state.loadingAllData ? (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <CircularProgress color="inherit" size={100} style={{ marginTop: "100px" }} />
    </div>
  ) : !state.loadingAllData && state.results.length > 0 ? (
    <div style={{ paddingBlockEnd: "7rem" }}>
      <MediaInfo state={state} loadingFavs={loadingFavs} loadingWatchlist={loadingWatchlist} />

      <div className="extra-data">
        <Similar similar={similar} />
        <Cast />
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
  ) : (
    <NotFound />
  );
};

export default MediaDetails;
