"use client";
import { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../../src/context/Context";
import { handleTrailerClick } from "../../src/helpers/getTrailer";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Tooltip } from "@mui/material";
import { handle_favs_watchlists } from "../firebase/handle_favs_watchlists";
import { Snackbar, Alert } from "@mui/material";
import { DBLists } from "@/firebase/firebase.config";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import Loader from "./common/Loader";
import Modal from "./common/Modal";
import { API_KEY, apiUrl, image } from "@/helpers/api.config";
import { getRunTime } from "@/helpers/getRunTime";

export const MediaInfo = ({ loadingFavs, loadingWatchlist }) => {
  const {
    setCurrentId,
    currentId,
    openTrailer,
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
    mediaDetailsData,
    episodesArray,
    setEpisodesArray,
    activeSeason,
    setActiveSeason,
    seasonModal,
    setSeasonModal,
  } = useContext(Context);

  const router = useRouter();
  const params = useParams();
  const mediaTypeRef = useRef(null);
  const seasonBtnRef = useRef(null);
  const seasonBtnRef2 = useRef(null);
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
  const path = usePathname();

  const handleLists = async (list) => {
    if (userLogged) {
      const buttonToChange = list == DBLists.favs ? setAddedToFavs : setAddedtoWatchList;
      const stateOfButtonToChange = buttonToChange == setAddedToFavs ? addedToFavs : addedtoWatchList;
      try {
        buttonToChange(!stateOfButtonToChange);
        await handle_favs_watchlists(firebaseActiveUser.uid, mediaTypeRef, mediaDetailsData, list, currentId);
      } catch (e) {
        buttonToChange(stateOfButtonToChange);

        setMessage({ message: `Error executing action on ${list}, try later`, severity: "error", open: true });
      }
    } else {
      setAuthModalActive(true);
    }
  };

  async function getSeasonData() {
    try {
      const seasonResponse = await fetch(`${apiUrl}${currentMediaType === "tvshows" ? "tv" : "movie"}/${currentId}/season/${activeSeason}?api_key=${API_KEY}`);
      const json = await seasonResponse.json();
      setEpisodesArray(json);

      setTimeout(() => {
        if (seasonBtnRef.current) {
          seasonBtnRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 1);
    } catch (error) {
      console.error("Error fetching season data:", error);
    }
  }
  useEffect(() => {
    setShowReadMoreButton(ref.current.scrollHeight !== ref.current.clientHeight);

    if (activeSeason > 0 && seasonModal) {
      getSeasonData();
    }
  }, []);

  useEffect(() => {
    if (currentId != params.id) {
      setCurrentId(params.id);
    }
  }, [params.id]);

  return (
    <div className="media-details" style={{ backgroundImage: `url(${mediaDetailsData.heroBackground})` }}>
      <div className="overlay"></div>
      <i
        className="bi bi-arrow-left"
        onClick={() => {
          router.back();
        }}
      ></i>

      <div className="media-details__initial-content  sm:px-10 sm:w-[80%] lg:w-[60%] xl:w-[45%] m-auto">
        <div className="media-details__info-container flex flex-col items-center justify-center gap-4 mt-12 sm:mt-20">
          <img src={mediaDetailsData.poster} alt="" id="poster" />

          <div className="info-container-text flex justify-center items-center flex-col gap-2 ">
            <h1 className="title">{mediaDetailsData.title}</h1>
            <div className="info flex items-center justify-center flex-wrap  md:text-[70%] lg:text-[80%] gap-2 text-gray-300">
              <span>{mediaDetailsData.releaseDate}</span>•{currentMediaType == mediaProperties.movie.route && <span>{mediaDetailsData.runtime}</span>}
              {currentMediaType == mediaProperties.tv.route && <span>{mediaDetailsData.seasons}</span>}•
              <span>
                {mediaDetailsData.genres &&
                  mediaDetailsData.genres.slice(0, 1).join(", ", (genre) => {
                    return <span>{genre}</span>;
                  })}
              </span>
              •
              <span>
                <i className="bi bi-star-fill" style={{ color: "goldenrod" }}></i>
                {` ${mediaDetailsData.vote}`}
              </span>
            </div>
          </div>

          <div className="main-btns flex flex-col justify-center items-center w-full gap-4  sm:w-[300px] md:flex-row text-[80%]">
            <button
              className="btn-primary w-full"
              data-id={currentId}
              onClick={() => {
                if (currentMediaType == mediaProperties.tv.route) {
                  setSeasonModal(true);
                } else {
                  router.push(`${currentId}/watch?name=${mediaDetailsData?.title}`);
                }
                if (openTrailer) setOpenTrailer(false);
              }}
            >
              <i className="bi bi-play-fill "></i> Play
            </button>
            <button
              className="btn-primary w-full bg-neutral-800 text-gray-300 border border-zinc-700 hover:bg-gray-300 hover:text-black"
              data-id={currentId}
              onClick={() => {
                handleTrailerClick(setOpenTrailer, currentId, currentMediaType, setTrailerKey);
              }}
            >
              <i className="bi bi-play "></i> Watch trailer
            </button>
          </div>

          <div className="ovrview text-[70%] lg:text-[80%]">
            <p style={isOpen ? null : truncatedTextStyle} className="review-text text-gray-300" ref={ref}>
              {mediaDetailsData.overview}
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
      {currentMediaType == mediaProperties.tv.route && (
        <Modal modalActive={seasonModal} setModalActive={setSeasonModal} classes="max-sm:w-[100%] sm:w-[90%] lg:w-[85%] xl:w-[70%] 4k:w-[1300px] !p-2 lg:!px-4 lg:!py-8" ref={seasonBtnRef2}>
          <div className="w-full max-h-[70vh] overflow-auto flex flex-col gap-8 ">
            <h1 className="title">{mediaDetailsData.title}</h1>

            {mediaDetailsData.seasonsArray.map((season, index) => {
              const { episode_count, season_number } = season;
              if (season.name !== "Specials" && season.air_date && new Date(season.air_date).getTime() <= Date.now()) {
                return (
                  <div className="flex flex-col gap-2 w-full rounded-xl bg-zinc-950 p-2" key={index}>
                    <button
                      ref={season_number === activeSeason ? seasonBtnRef : null}
                      className={` rounded-lg p-4 w-full hover:bg-zinc-900 border hover:border-zinc-700 ${
                        activeSeason === season_number ? "text-[var(--primary)] border-[var(--primary)]" : "border-zinc-800"
                      } flex  items-center justify-center `}
                      onClick={async () => {
                        if (activeSeason === season_number) {
                          setActiveSeason(null);
                        } else {
                          setActiveSeason(season_number);
                        }

                        await getSeasonData();
                        if (seasonBtnRef.current) {
                          seasonBtnRef.current.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      <p className="">Season {season_number}</p>
                      <i className={`ml-auto ${activeSeason === season_number ? "bi bi-caret-up-fill" : "bi bi-caret-down-fill"}`}></i>
                    </button>

                    <div className={`flex items-start justify-center flex-wrap gap-4 ${activeSeason === season_number ? "h-full py-6" : "overflow-hidden h-0"}`}>
                      {Array.from({ length: episode_count ?? 0 }).map(
                        (_, index) =>
                          episodesArray?.episodes?.[index] &&
                          new Date(episodesArray?.episodes?.[index].air_date).getTime() <= Date.now() && (
                            <button
                              key={index}
                              className="bg-zinc-900 px-2 hover:bg-zinc-700 py-2 lg:py-3 rounded-lg w-full"
                              onClick={() => {
                                setSeasonModal(false);
                                router.push(`${path}/watch?name=${mediaDetailsData?.title}&season=${season_number}&episode=${index + 1}`);
                              }}
                            >
                              <div className="flex items-center justify-center gap-2 w-full">
                                <p>{index + 1}.</p>

                                <>
                                  <img src={`${image}${episodesArray.episodes[index].still_path}`} className="rounded-md object-cover w-[40%] md:w-[25%] xl:w-[20%] h-full" alt="" />
                                  <div className="flex flex-col gap-2 w-full">
                                    <div className="min-md:font-bold max-md:text-sm w-full flex items-center justify-center">
                                      <p className="w-full h-full">{episodesArray.episodes[index].name}</p>
                                      <p className="text-right text-zinc-500 !text-[75%] h-full">{episodesArray.episodes[index].runtime && getRunTime(episodesArray.episodes[index].runtime)}</p>
                                    </div>
                                    <p className="max-md:hidden text-zinc-400 xl:w-[75%] m-auto">{episodesArray.episodes[index].overview}</p>
                                  </div>
                                </>
                              </div>
                            </button>
                          )
                      )}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MediaInfo;
