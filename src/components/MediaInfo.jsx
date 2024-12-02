"use client";
import { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../../src/context/Context";
import { handleTrailerClick } from "../../src/helpers/getTrailer";
import { useParams, useRouter } from "next/navigation";
import { Tooltip } from "@mui/material";
import { handle_favs_watchlists } from "../firebase/handle_favs_watchlists";
import { Snackbar, Alert } from "@mui/material";
import { DBLists } from "@/firebase/firebase.config";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import Loader from "./common/Loader";

export const MediaInfo = ({ state, loadingFavs, loadingWatchlist }) => {
  const {
    setCurrentId,
    currentId,
    setOpenTrailer,
    setTrailerKey,
    currentMediaType,
    setAuthModalActive,
    userLogged,
    addedToFavs,
    setAddedToFavs,
    addedtoWatchList,
    setAddedtoWatchList,
    firebaseActiveUser,
  } = useContext(Context);

  const router = useRouter();
  const params = useParams();
  const mediaTypeRef = useRef(null);
  const mediaTypeRef2 = useRef(null);

  const [message, setMessage] = useState({ message: null, severity: null, open: false });

  const truncatedTextStyle = {
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    display: "-webkit-box",
  };
  const [isOpen, setIsOpen] = useState(false);
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);

  const ref = useRef();

  const handleLists = async (list) => {
    if (userLogged) {
      const buttonToChange = list == DBLists.favs ? setAddedToFavs : setAddedtoWatchList;
      const stateOfButtonToChange = buttonToChange == setAddedToFavs ? addedToFavs : addedtoWatchList;
      try {
        buttonToChange(!stateOfButtonToChange);
        await handle_favs_watchlists(firebaseActiveUser.uid, mediaTypeRef, state, list, currentId);
      } catch (e) {
        buttonToChange(stateOfButtonToChange);

        setMessage({ message: `Error executing action on ${list}, try later`, severity: "error", open: true });
      }
    } else {
      setAuthModalActive(true);
    }
  };

  useEffect(() => {
    setShowReadMoreButton(ref.current.scrollHeight !== ref.current.clientHeight);
  }, []);

  useEffect(() => {
    if (currentId != params.id) {
      setCurrentId(params.id);
    }
  }, [params.id]);

  return (
    <div className="media-details" style={{ backgroundImage: `url(${state.heroBackground})` }}>
      <div className="overlay"></div>
      <i
        className="bi bi-arrow-left"
        onClick={() => {
          router.back();
        }}
      ></i>

      <div className="media-details__initial-content  sm:px-10 sm:w-[80%] lg:w-[60%] xl:w-[45%] m-auto">
        <div className="media-details__info-container flex flex-col items-center justify-center gap-4 mt-12 sm:mt-20">
          <img src={state.poster} alt="" id="poster" />

          <div className="info-container-text flex justify-center items-center flex-col gap-2 ">
            <h1 className="title">{state.title}</h1>
            <div className="info flex items-center justify-center flex-wrap  md:text-[70%] lg:text-[80%] gap-2 text-gray-300">
              <span>{state.releaseDate}</span>•{currentMediaType == mediaProperties.movie.route && <span>{state.runtime}</span>}
              {currentMediaType == mediaProperties.tv.route && <span>{state.seasons}</span>}•
              <span>
                {state.genres &&
                  state.genres.slice(0, 1).join(", ", (genre) => {
                    return <span>{genre}</span>;
                  })}
              </span>
              •
              <span>
                <i className="bi bi-star-fill" style={{ color: "goldenrod" }}></i>
                {` ${state.vote}`}
              </span>
            </div>
          </div>

          <div className="main-btns flex flex-col justify-center items-center w-full gap-4  sm:w-[300px] md:flex-row text-[80%]">
            <button
              className="btn-primary w-full"
              data-id={currentId}
              onClick={() => {
                handleTrailerClick(setOpenTrailer, currentId, currentMediaType, setTrailerKey);
              }}
            >
              <i className="bi bi-play-fill "></i> Play trailer
            </button>
          </div>

          <div className="ovrview text-[70%] lg:text-[80%]">
            <p style={isOpen ? null : truncatedTextStyle} className="review-text text-gray-300" ref={ref}>
              {state.overview}
            </p>
            {showReadMoreButton && (
              <p
                className="show-more-btn cursor-pointer underline"
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
              >
                {isOpen ? "Less" : "More..."}
              </p>
            )}
          </div>

          <div className="main-lists-options flex gap-2">
            <>
              {loadingFavs ? (
                <Loader />
              ) : (
                <Tooltip title={addedToFavs ? "Delete from favorites" : "Add to favorites"} placement="bottom">
                  <span
                    className="favs flex flex-col cursor-pointer rounded-full"
                    onClick={async () => {
                      handleLists(DBLists.favs);
                    }}
                  >
                    <i
                      data-id={currentId}
                      ref={mediaTypeRef}
                      data-mediatype={currentMediaType == "movies" ? "movie" : "tv"}
                      id="favs-icon"
                      className={addedToFavs ? "bi bi-check2-all " : "bi bi-check-lg"}
                    ></i>
                    <p className="text-[75%]">Favorites</p>
                  </span>
                </Tooltip>
              )}

              {loadingWatchlist ? (
                <Loader />
              ) : (
                <Tooltip title={addedtoWatchList ? "Delete from watchlist" : "Add to watchlist"} placement="bottom">
                  <span
                    className="watchlist flex flex-col cursor-pointer "
                    onClick={() => {
                      handleLists(DBLists.watchs);
                    }}
                  >
                    <i
                      data-id={currentId}
                      ref={mediaTypeRef2}
                      data-mediatype={currentMediaType == "movies" ? "movie" : "tv"}
                      id="watchlist-icon"
                      className={addedtoWatchList ? "bi bi-eye-slash" : "bi bi-eye"}
                    ></i>
                    <p className="text-[75%]">Watchlist</p>
                  </span>
                </Tooltip>
              )}
            </>
          </div>
        </div>
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
          severity={message.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MediaInfo;
