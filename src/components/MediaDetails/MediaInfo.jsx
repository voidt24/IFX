"use client";
import { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../../context/Context";
import { handleTrailerClick } from "../../helpers/getTrailer";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Tooltip } from "@mui/material";
import { handle_favs_watchlists } from "../../firebase/handle_favs_watchlists";
import { DBLists } from "@/firebase/firebase.config";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import Loader from "../common/Loader";
import Modal from "../common/Modal";
import { API_KEY, apiUrl, image } from "@/helpers/api.config";
import { getRunTime } from "@/helpers/getRunTime";
import Notification from "../common/Notification";
import { saveToHistory } from "@/firebase/saveToHistory";

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
    containerMargin,
  } = useContext(Context);

  const router = useRouter();
  const params = useParams();
  const mediaTypeRef = useRef(null);
  const seasonBtnRef = useRef(null);
  const seasonBtnRef2 = useRef(null);
  const mediaTypeRef2 = useRef(null);

  const [message, setMessage] = useState({ message: "", severity: "info", open: false });

  const truncatedTextStyle = {
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    display: "-webkit-box",
  };
  const [isOpen, setIsOpen] = useState(false);
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);
  const [backdrop, setBackdrop] = useState(typeof window != undefined && window.innerWidth < 640 ? mediaDetailsData.poster : mediaDetailsData.bigHeroBackground);

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

  async function getSeasonData(season) {
    try {
      const seasonResponse = await fetch(`${apiUrl}${currentMediaType === "tvshows" ? "tv" : "movie"}/${currentId}/season/${season}?api_key=${API_KEY}`);
      const json = await seasonResponse.json();
      setEpisodesArray([json]);

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
      getSeasonData(activeSeason);
    }
  }, []);

  useEffect(() => {
    if (currentId != params.id) {
      setCurrentId(params.id);
    }
  }, [params.id]);

  useEffect(() => {
    return () => {
      setEpisodesArray(null);
      setActiveSeason(0);
    };
  }, []);

  useEffect(() => {
    if (!window) return;

    function handleResize() {
      setBackdrop(window.innerWidth < 1024 ? mediaDetailsData.poster : mediaDetailsData.bigHeroBackground);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className=" relative text-center  px-0  bg-cover bg-top bg-no-repeat overflow-hidden">
      <div
        className="some-animation w-full relative object-cover object-center bg-cover bg-center max-lg:min-h-[90vh] lg:aspect-[16/9] lg:h-[85vh] "
        style={{
          backgroundImage: `url(${backdrop})`,
          ...(window.innerWidth > 1024 ? { marginTop: containerMargin ? `${containerMargin}px` : undefined } : {}),
        }}
      >
        {/* close btn for mobile */}
        <i
          className="lg:hidden bi bi-x text-content-primary text-3xl fixed top-3 left-4 bg-brand-primary/35 backdrop-blur-lg rounded-full px-2 py-1 z-[9999]"
          onClick={() => {
            if (sessionStorage.getItem("navigatingFromApp") === "1") {
              router.back();
            } else {
              router.push("/");
            }
          }}
        ></i>
        {/* --- */}

        {/* overlay for desk */}
        <div className="max-lg:hidden side-hero-overlay"></div>
        {/* --- */}

        {/* main container */}
        <div
          className="flex flex-col items-center justify-center gap-2 z-[3] w-full mx-auto absolute bottom-0 px-4 
          lg:items-start lg:justify-center lg:gap-4 
          lg:top-1/2 lg:left-1/2 
          lg:-translate-x-1/2 lg:-translate-y-1/2 
          lg:max-w-[80%] lg:z-20 
          lg:bottom-auto "
        >
          <div className="lg:hidden h-[25px] w-full">
            <div className="to-top-gradient-bg "></div>
          </div>
          <div className="lg:hidden to-top-gradient-bg"></div>

          <div className="flex-col-center gap-2 z-[999999] lg:items-start lg:text-left  w-full ">
            <h1 className="title font-semibold text-4xl line-clamp-3 w-full lg:max-w-[80%] ">{mediaDetailsData.title}</h1>

            <div className="info flex-row-center flex-wrap max-md:text-[85%] lg:text-[90%] gap-2 text-content-secondary ">
              <span>{new Date(mediaDetailsData.releaseDate).getTime() > Date.now() ? `Available on ${mediaDetailsData.releaseDate}` : mediaDetailsData.releaseDate}</span>•
              {currentMediaType == mediaProperties.movie.route && <span>{mediaDetailsData.runtime}</span>}
              {currentMediaType == mediaProperties.tv.route && <span>{mediaDetailsData.seasons}</span>}•
              <span>
                {mediaDetailsData.genres &&
                  mediaDetailsData.genres.slice(0, 1).join(", ", (genre) => {
                    return <span>{genre}</span>;
                  })}
              </span>
              •
              <span>
                <i className="bi bi-star-fill text-[goldenrod]"></i>
                {mediaDetailsData.vote}
              </span>
            </div>
            <div className="overview ">
              <p className={`${!isOpen ? "line-clamp-3" : ""} review-text text-content-primary  lg:max-w-[90%] 2xl:max-w-[60%]`} ref={ref}>
                {mediaDetailsData.overview}
              </p>

              {showReadMoreButton && (
                <p
                  className="show-more-btn lg:text-left"
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                >
                  {isOpen ? "Less" : "More..."}
                </p>
              )}
            </div>

            <div className="main-lists-options flex-row-center gap-6 w-full lg:justify-start">
              <span className="max-lg:hidden">
                {new Date(mediaDetailsData.releaseDate).getTime() < Date.now() ? (
                  <button
                    className="btn-primary bg-brand-primary text-content-primary hover:text-black px-8 relative  z-[4] "
                    data-id={currentId}
                    onClick={() => {
                      if (currentMediaType == mediaProperties.tv.route) {
                        setSeasonModal(true);
                      } else {
                        router.push(`${currentId}/watch?name=${mediaDetailsData?.title}`);

                        let dataToSave = {
                          id: currentId,
                          media_type: currentMediaType === "tvshows" ? "tv" : "movie",
                          title: mediaDetailsData?.title,
                          vote_average: mediaDetailsData?.vote,
                          poster_path: mediaDetailsData?.poster,
                          backdrop_path: mediaDetailsData?.bigHeroBackground,
                          release_date: mediaDetailsData?.releaseDate,
                          watchedAt: Date.now(),
                        };

                        if (firebaseActiveUser && currentId && firebaseActiveUser.uid) {
                          try {
                            saveToHistory(dataToSave, currentId, firebaseActiveUser.uid);
                          } catch (error) {
                            console.log(error);
                          }
                        }
                      }
                      if (openTrailer) setOpenTrailer(false);
                    }}
                  >
                    <i className="bi bi-play-fill "></i> Play
                  </button>
                ) : (
                  <button
                    className="btn-primary hover:text-black relative px-6 z-[4]"
                    data-id={currentId}
                    onClick={() => {
                      handleTrailerClick(setOpenTrailer, currentId, currentMediaType, setTrailerKey);
                    }}
                  >
                    <i className="bi bi-play "></i> Watch trailer
                  </button>
                )}
              </span>
              <>
                {loadingFavs ? (
                  <Loader />
                ) : (
                  <Tooltip title={addedToFavs ? "Delete from favorites" : "Add to favorites"} placement="bottom">
                    <span
                      className="favs flex-col-center cursor-pointer"
                      onClick={async () => {
                        handleLists(DBLists.favs);
                      }}
                    >
                      <i
                        className={`text-[145%] transition-all duration-200 ${addedToFavs ? "bi bi-check2-all text-brand-primary" : "bi bi-check-lg"}`}
                        data-id={currentId}
                        ref={mediaTypeRef}
                        data-mediatype={currentMediaType == "movies" ? "movie" : "tv"}
                        id="favs-icon"
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
                      className="watchlist flex-col-center cursor-pointer"
                      onClick={() => {
                        handleLists(DBLists.watchs);
                      }}
                    >
                      <i
                        className={`text-[145%] transition-all duration-200 ${addedtoWatchList ? "bi bi-eye-slash text-brand-primary" : "bi bi-eye"}`}
                        data-id={currentId}
                        ref={mediaTypeRef2}
                        data-mediatype={currentMediaType == "movies" ? "movie" : "tv"}
                        id="watchlist-icon"
                      ></i>
                      <p className="text-[75%]">Watchlist</p>
                    </span>
                  </Tooltip>
                )}
              </>
            </div>
          </div>
        </div>

        {/* PLAY  */}
        <div className="lg:hidden w-full fixed bottom-0 px-6 pb-6 pt-20 left-[50%] translate-x-[-50%] z-[4]">
          <div className="to-top-gradient-bg h-full z-[2]"></div>
          {new Date(mediaDetailsData.releaseDate).getTime() < Date.now() ? (
            <button
              className="btn-primary w-full relative bg-brand-primary hover:text-black text-content-primary z-[4] "
              data-id={currentId}
              onClick={() => {
                if (currentMediaType == mediaProperties.tv.route) {
                  setSeasonModal(true);
                } else {
                  router.push(`${currentId}/watch?name=${mediaDetailsData?.title}`);

                  let dataToSave = {
                    id: currentId,
                    media_type: currentMediaType === "tvshows" ? "tv" : "movie",
                    title: mediaDetailsData?.title,
                    vote_average: mediaDetailsData?.vote,
                    poster_path: mediaDetailsData?.poster,
                    backdrop_path: mediaDetailsData?.bigHeroBackground,
                    release_date: mediaDetailsData?.releaseDate,
                    watchedAt: Date.now(),
                  };

                  if (firebaseActiveUser && currentId && firebaseActiveUser.uid) {
                    try {
                      saveToHistory(dataToSave, currentId, firebaseActiveUser.uid);
                    } catch (error) {
                      console.log(error);
                    }
                  }
                }
                if (openTrailer) setOpenTrailer(false);
              }}
            >
              <i className="bi bi-play-fill  "></i> Play
            </button>
          ) : (
            <button
              className="btn-primary w-full relative  z-[4]"
              data-id={currentId}
              onClick={() => {
                handleTrailerClick(setOpenTrailer, currentId, currentMediaType, setTrailerKey);
              }}
            >
              <i className="bi bi-play "></i> Watch trailer
            </button>
          )}
        </div>
      </div>

      <Notification message={message} setMessage={setMessage} />

      {currentMediaType == mediaProperties.tv.route && (
        <Modal
          modalActive={seasonModal}
          setModalActive={setSeasonModal}
          customClasses="max-sm:w-[100%] sm:w-[95%] lg:w-[85%] xl:w-[70%] 2xl:w-[65%] 4k:w-[1300px] !px-2 lg:!px-4 lg:!py-8"
          ref={seasonBtnRef2}
        >
          <div className="w-full max-h-[50vh] lg:max-h-[70vh] overflow-auto flex flex-col gap-8 ">
            <h1 className="title font-semibold text-xl">{mediaDetailsData.title}</h1>

            {mediaDetailsData &&
              mediaDetailsData.seasonsArray &&
              mediaDetailsData.seasonsArray.map((season, index) => {
                const { episode_count, season_number } = season;
                if (season.name !== "Specials" && season.air_date && new Date(season.air_date).getTime() <= Date.now()) {
                  return (
                    <div className={`flex flex-col gap-2 w-full rounded-xl ${season_number === activeSeason ? " bg-zinc-950" : ""} p-2`} key={index}>
                      <button
                        ref={season_number === activeSeason ? seasonBtnRef : null}
                        className={` rounded-lg p-4 w-full bg-surface-hover   border ${
                          activeSeason === season_number ? "text-brand-primary border-brand-primary" : "border-zinc-800 lg:hover:bg-zinc-950"
                        } flex  items-center justify-center `}
                        onClick={async () => {
                          if (activeSeason === season_number) {
                            setActiveSeason(null);
                          } else {
                            setEpisodesArray(null);
                            setActiveSeason(season_number);
                          }
                          await getSeasonData(season_number);
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
                            episodesArray?.[0].episodes?.[index] &&
                            new Date(episodesArray?.[0].episodes?.[index].air_date).getTime() <= Date.now() && (
                              <button
                                key={index}
                                className="bg-zinc-900 px-2 hover:bg-zinc-700 py-2 lg:py-3 rounded-lg w-full"
                                onClick={() => {
                                  setSeasonModal(false);
                                  router.push(`${path}/watch?name=${mediaDetailsData?.title}&season=${season_number}&episode=${index + 1}`);
                                  let dataToSave = {
                                    id: currentId,
                                    episodeId: episodesArray?.[0].episodes?.[index].id,
                                    media_type: currentMediaType === "tvshows" ? "tv" : "movie",
                                    title: mediaDetailsData?.title,
                                    season: season_number,
                                    episode: episodesArray?.[0].episodes[index].name,
                                    episode_number: index + 1,
                                    vote_average: episodesArray?.[0].episodes?.[index].vote_average || 0,
                                    poster_path: mediaDetailsData?.poster,
                                    backdrop_path: mediaDetailsData?.bigHeroBackground,
                                    episode_image: `${image}${episodesArray?.[0].episodes[index].still_path}`,
                                    release_date: mediaDetailsData?.releaseDate,
                                    watchedAt: Date.now(),
                                  };
                                  if (firebaseActiveUser && firebaseActiveUser.uid && dataToSave.episodeId && firebaseActiveUser.uid) {
                                    try {
                                      saveToHistory(dataToSave, episodesArray?.[0].episodes?.[index].id, firebaseActiveUser.uid);
                                    } catch (error) {
                                      console.log(error);
                                    }
                                  }
                                }}
                              >
                                <div className="flex items-center justify-center gap-2 w-full">
                                  <p>{index + 1}.</p>

                                  <>
                                    <img src={`${image}${episodesArray?.[0].episodes[index].still_path}`} className="rounded-md object-cover w-[40%] md:w-[25%] xl:w-[20%] h-full" alt="" />
                                    <div className="flex flex-col gap-2 w-full">
                                      <div className="min-md:font-bold max-md:text-sm w-full flex items-center justify-center">
                                        <p className="w-full h-full">{episodesArray?.[0].episodes[index].name}</p>
                                        <p className="text-right text-zinc-500 !text-[75%] h-full">
                                          {episodesArray?.[0].episodes[index].runtime && getRunTime(episodesArray?.[0].episodes[index].runtime)}
                                        </p>
                                      </div>
                                      <p className="max-lg:hidden text-zinc-400 xl:w-[75%] m-auto">{episodesArray?.[0].episodes[index].overview}</p>
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
