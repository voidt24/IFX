"use client";
import { useState, useContext, useRef } from "react";
import { Context } from "../../src/context/Context";
import { handleTrailerClick } from "../../src/helpers/getTrailer";
import { useRouter } from "next/navigation";
import { Tooltip, CircularProgress } from "@mui/material";
import { handle_favs_watchlists } from "../firebase/handle_favs_watchlists";

export const MediaInfo = ({ state, loadingFavs, loadingWatchlist }) => {
  const { currentId, setOpenTrailer, setTrailerKey, currentMediaType, userLogged, setUserClicked, addedToFavs, setAddedToFavs, addedtoWatchList, setAddedtoWatchList, firebaseActiveUser } =
    useContext(Context);

  const router = useRouter();
  const mediaTypeRef = useRef(null);
  const mediaTypeRef2 = useRef(null);

  const [message, setMessage] = useState({ message: null, severity: null, open: false });

  return (
    <div className="media-details" style={{ backgroundImage: `url(${state.heroBackground})` }}>
      <div className="overlay"></div>
      <i
        className="bi bi-arrow-left"
        onClick={() => {
          router.back();
          window.scrollTo(0, 0);
        }}
      ></i>

      <div className="media-details__initial-content">
        <div className="media-details__info-container">
          <img src={state.poster} alt="" id="poster" />

          <div className="info-container-text">
            <h1 className="title">{state.title}</h1>
            <div className="info">
              <span>{state.releaseDate}</span>
              <span>
                {state.genres && state.genres.slice(0, 1).join(", ", (genre) => {
                  return <span>{genre}</span>;
                })}
              </span>
              <span>
                <i className="bi bi-star-fill" style={{ color: "yellow" }}></i>
                {` ${state.vote}`}
              </span>
            </div>

            <div className="overview">
              <div className="overview_data">
                <p>{state.overview}</p>
              </div>
            </div>
            <div className="options">
              <>
                {loadingFavs ? (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress color="inherit" size={30} />
                  </div>
                ) : (
                  <Tooltip title={addedToFavs ? "Delete from favorites" : "Add to favorites"} placement="bottom">
                    <i
                      data-id={currentId}
                      ref={mediaTypeRef}
                      data-mediatype={currentMediaType == "movies" ? "movie" : "tv"}
                      id="favs-icon"
                      className={addedToFavs ? "bi bi-check2-all" : "bi bi-check-lg"}
                      onClick={() => {
                        userLogged ? handle_favs_watchlists(firebaseActiveUser.uid, mediaTypeRef, state, "favorites", setAddedToFavs, currentId, setMessage) : setUserClicked(true);
                      }}
                    ></i>
                  </Tooltip>
                )}

                {loadingWatchlist ? (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress color="inherit" size={30} />
                  </div>
                ) : (
                  <Tooltip title={addedtoWatchList ? "Delete from watchlist" : "Add to watchlist"} placement="bottom">
                    <i
                      data-id={currentId}
                      ref={mediaTypeRef2}
                      data-mediatype={currentMediaType == "movies" ? "movie" : "tv"}
                      id="watchlist-icon"
                      className={addedtoWatchList ? "bi bi-eye-slash" : "bi bi-eye"}
                      onClick={() => {
                        userLogged ? handle_favs_watchlists(firebaseActiveUser.uid, mediaTypeRef2, state, "watchlist", setAddedtoWatchList, currentId, setMessage) : setUserClicked(true);
                      }}
                    ></i>
                  </Tooltip>
                )}
              </>
              <button
                className="rounded-3xl"
                id="play-trailer"
                data-id={currentId}
                onClick={() => {
                  handleTrailerClick(setOpenTrailer, currentId, currentMediaType, setTrailerKey);
                }}
              >
                Trailer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaInfo;
