"use client";
import { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../../src/context/Context";
import { handleTrailerClick } from "../../src/helpers/getTrailer";
import { useRouter } from "next/navigation";
import { Tooltip, CircularProgress } from "@mui/material";
import { handle_new_custom_lists, handle_favs_watchlists, get_custom_lists, handle_adding_to_custom_lists } from "../firebase/handle_favs_watchlists";
import { Snackbar, Alert } from "@mui/material";
import { DBLists } from "@/firebase/firebase.config";
import Modal from "./Modal";
import { mediaProperties } from "@/helpers/mediaProperties.config";

export const MediaInfo = ({ state, loadingFavs, loadingWatchlist }) => {
  const { currentId, setOpenTrailer, setTrailerKey, currentMediaType, setAuthModalActive, userLogged, addedToFavs, setAddedToFavs, addedtoWatchList, setAddedtoWatchList, firebaseActiveUser } =
    useContext(Context);

  const router = useRouter();
  const mediaTypeRef = useRef(null);
  const mediaTypeRef2 = useRef(null);

  const [message, setMessage] = useState({ message: null, severity: null, open: false });
  const [listModalActive, setListModalActive] = useState(false);
  const [addToListModalActive, setAddToListModalActive] = useState(false);
  const [newListModalActive, setNewListModalActive] = useState(true);
  const [customList, setCustomList] = useState();
  const [existingLists, setExistingLists] = useState([]);
  const [activeSelectedElement, setActiveSelectedElement] = useState("");

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

  const handleCustomLists = async (e) => {
    e.preventDefault();
    if (!customList || customList == "") {
      return;
    }

    try {
      await handle_new_custom_lists(firebaseActiveUser.uid, mediaTypeRef, state, customList, currentId);
      setMessage({ message: "List created successfully!", severity: "success", open: true });
      setListModalActive(false);
    } catch (error) {
      setMessage({ message: ` Error executing action on ${customList}: ${error}`, severity: "error", open: true });
    }
  };

  const handleAddToCustomList = async (e) => {
    e.preventDefault();

    try {
      await handle_adding_to_custom_lists(firebaseActiveUser.uid, mediaTypeRef, state, activeSelectedElement, currentId);
      setMessage({ message: `Element saved in ${activeSelectedElement} list successfully!`, severity: "success", open: true });
      setListModalActive(false);
    } catch (error) {
      setMessage({ message: ` Error executing action on ${activeSelectedElement} list: ${error}`, severity: "error", open: true });
    }

    setActiveSelectedElement("");
  };

  useEffect(() => {
    setShowReadMoreButton(ref.current.scrollHeight !== ref.current.clientHeight);
  }, []);

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

      <div className="media-details__initial-content  sm:px-10 sm:w-[80%] lg:w-[60%] xl:w-[45%] m-auto">
        <div className="media-details__info-container flex flex-col items-center justify-center gap-4 mt-5 sm:mt-20">
          <img src={state.poster} alt="" id="poster" />

          <div className="info-container-text flex justify-center items-center flex-col gap-2 ">
            <h1 className="title">{state.title}</h1>
            <div className="info flex gap-2 md:text-[70%] lg:text-[80%]">
              <span>{state.releaseDate}</span>
              {currentMediaType == mediaProperties.movie.route && <span>{state.runtime}</span>}

              {currentMediaType == mediaProperties.tv.route && (
                <span>
                  {state.genres &&
                    state.genres.slice(0, 1).join(", ", (genre) => {
                      return <span>{genre}</span>;
                    })}
                </span>
              )}
              <span>
                <i className="bi bi-star-fill" style={{ color: "goldenrod" }}></i>
                {` ${state.vote}`}
              </span>
            </div>
          </div>

          <div className="main-btns flex flex-col justify-center items-center w-full gap-4  sm:w-[300px] md:flex-row text-[80%]">
            <button
              className="rounded-full py-1.5 w-full bg-gray-800 hover:bg-gray-700 "
              data-id={currentId}
              onClick={() => {
                handleTrailerClick(setOpenTrailer, currentId, currentMediaType, setTrailerKey);
              }}
            >
              <i className="bi bi-play-fill "></i> Play trailer
            </button>
            <button
              className="rounded-full py-1.5 w-full bg-gray-700/60"
              type="button "
              onClick={async () => {
                if (userLogged) {
                  setListModalActive(!listModalActive);
                  const list = await get_custom_lists(firebaseActiveUser.uid);
                  setExistingLists(list);
                } else {
                  setAuthModalActive(true);
                }
              }}
            >
              <i className="bi bi-plus-lg"></i> Add to
            </button>
          </div>

          <div className="ovrview text-[70%] lg:text-[80%]">
            <p style={isOpen ? null : truncatedTextStyle} className="review-text text-gray-300" ref={ref}>
              {state.overview}
            </p>
            {showReadMoreButton && (
              <p
                className="show-more-btn text-[goldenrod]/70 cursor-pointer underline"
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
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress color="inherit" size={30} />
                </div>
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
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress color="inherit" size={30} />
                </div>
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

      {listModalActive && (
        <Modal modalActive={listModalActive} setModalActive={setListModalActive}>
          <div className="flex flex-col items-center justify-center gap-4 w-full">
            <h2 className="text-2xl ">Add to</h2>

            <div className="flex w-full items-center justify-center gap-6">
              <button
                className={`rounded-full bg-gray-800 hover:bg-gray-700 px-4 bg-transparent border-0 ${
                  newListModalActive ? "text-[var(--primary)]" : "text-gray-600"
                } hover:text-[var(--primary)] hover:bg-transparent `}
                onClick={() => {
                  setNewListModalActive(true);
                  setAddToListModalActive(false);
                }}
              >
                New list
              </button>
              <p className="">|</p>
              <button
                className={`rounded-full bg-gray-800 hover:bg-gray-700 px-4 bg-transparent border-0 ${
                  addToListModalActive ? "text-[var(--primary)]" : "text-gray-600"
                } hover:text-[var(--primary)] hover:bg-transparent`}
                onClick={() => {
                  setAddToListModalActive(true);
                  setNewListModalActive(false);
                }}
              >
                Your lists
              </button>
            </div>

            {newListModalActive && (
              <form
                className="flex flex-col gap-4 items-center  self-center sm:w-[195px] mt-6"
                onSubmit={(e) => {
                  handleCustomLists(e);
                }}
              >
                <label htmlFor="" className="w-full text-sm text-white flex flex-col gap-4">
                  Type the list name
                  <input
                    className="text-black px-2  w-full py-[2.5px] text-sm rounded-full"
                    type="text"
                    value={customList}
                    onChange={(evt) => {
                      setCustomList(evt.target.value);
                    }}
                    placeholder="ex. Science fiction"
                    required
                  />
                </label>
                <button type="submit" className="w-full rounded-full bg-gray-800 hover:bg-gray-700">
                  Add
                </button>
              </form>
            )}

            {addToListModalActive && (
              <form
                class="flex flex-col gap-4 items-center  self-center  sm:w-[195px] mt-6"
                onSubmit={(e) => {
                  handleAddToCustomList(e);
                }}
              >
                <label className="w-full text-sm text-white flex flex-col gap-4">
                  Select your list
                  <select
                    className="w-full   cursor-pointer hover:border-[goldenrod] outline-[goldenrod] px-2 py-1 transition-all text-white invalid:text-[white]/70  rounded-full   border border-gray-400 valid:bg-black "
                    onClick={async () => {
                      const list = await get_custom_lists(firebaseActiveUser.uid);
                      setExistingLists(list);
                    }}
                    onChange={(e) => {
                      setActiveSelectedElement(e.target.value);
                    }}
                    value={activeSelectedElement}
                  >
                    <option value={""} className="text-gray-500" selected>
                      Select...
                    </option>

                    {existingLists &&
                      existingLists.length > 0 &&
                      existingLists.map((element, index) => {
                        return (
                          <option value={element} key={index}>
                            {element}
                          </option>
                        );
                      })}
                  </select>
                </label>
                {activeSelectedElement != "" && (
                  <button type="submit" className="w-full rounded-full  bg-gray-800 hover:bg-gray-700">
                    Add
                  </button>
                )}
              </form>
            )}
          </div>
        </Modal>
      )}

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
