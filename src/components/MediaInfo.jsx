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

export const MediaInfo = ({ state, loadingFavs, loadingWatchlist }) => {
  const { currentId, setOpenTrailer, setTrailerKey, currentMediaType, setAuthModalActive, userLogged, addedToFavs, setAddedToFavs, addedtoWatchList, setAddedtoWatchList, firebaseActiveUser } =
    useContext(Context);

  const router = useRouter();
  const mediaTypeRef = useRef(null);
  const mediaTypeRef2 = useRef(null);

  const [message, setMessage] = useState({ message: null, severity: null, open: false });
  const [listModalActive, setListModalActive] = useState(false);
  const [newListModalActive, setNewListModalActive] = useState(false);
  const [customList, setCustomList] = useState();
  const [existingLists, setExistingLists] = useState([]);
  const [activeSelectedElement, setActiveSelectedElement] = useState("");

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
    } catch (error) {
      setMessage({ message: ` Error executing action on ${customList}: ${error}`, severity: "error", open: true });
    }
  };

  const handleAddToCustomList = async (e) => {
    e.preventDefault();

    try {
      await handle_adding_to_custom_lists(firebaseActiveUser.uid, mediaTypeRef, state, activeSelectedElement, currentId);
      setMessage({ message: `Element saved in ${activeSelectedElement} list successfully!`, severity: "success", open: true });
    } catch (error) {
      setMessage({ message: ` Error executing action on ${activeSelectedElement} list: ${error}`, severity: "error", open: true });
    }

    setActiveSelectedElement("");
  };

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
                {state.genres &&
                  state.genres.slice(0, 1).join(", ", (genre) => {
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
            <div className="options flex-wrap">
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
                      onClick={async () => {
                        handleLists(DBLists.favs);
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
                        handleLists(DBLists.watchs);
                      }}
                    ></i>
                  </Tooltip>
                )}
              </>

              <button
                className="rounded-full "
                type="button "
                onClick={async () => {
                  setListModalActive(!listModalActive);
                  const list = await get_custom_lists(firebaseActiveUser.uid);
                  setExistingLists(list);
                }}
              >
                Add to <i className="bi bi-arrow-right"></i>
              </button>
            </div>
            <button
              className="rounded-3xl w-[95px] sm:self-center sm:w-[120px]"
              data-id={currentId}
              onClick={() => {
                handleTrailerClick(setOpenTrailer, currentId, currentMediaType, setTrailerKey);
              }}
            >
              <i className="bi bi-play-circle-fill "></i> Trailer
            </button>
          </div>
        </div>
      </div>

      {listModalActive && (
        <Modal modalActive={listModalActive} setModalActive={setListModalActive}>
          <h2 className="text-2xl">Add to</h2>
          <div className={`p-4  rounded-xl flex flex-col gap-4   bg-black ${listModalActive ? "block" : "hidden"} `}>
            <button
              className="rounded-full bg-gray-800 hover:bg-gray-700 "
              onClick={() => {
                setListModalActive(false);
                setNewListModalActive(true);
              }}
            >
              New list <i className="bi bi-plus"></i>
            </button>
            or
            <label class=" text-sm  text-white">To existing lists</label>
            <form
              class="relative flex flex-col items-center gap-2 m-auto flex-wrap w-full"
              onSubmit={(e) => {
                handleAddToCustomList(e);
              }}
            >
              <select
                className=" m-auto cursor-pointer hover:border-[goldenrod] outline-[goldenrod] px-3 transition-all text-white invalid:text-[white]/70  rounded-xl  text-sm  border border-gray-400 valid:bg-black "
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

              {activeSelectedElement != "" && (
                <button type="submit" className="px-6 rounded-full mt-2 text-sm bg-gray-800 hover:bg-gray-700">
                  Add
                </button>
              )}
            </form>
          </div>
        </Modal>
      )}

      {newListModalActive && (
        <Modal modalActive={newListModalActive} setModalActive={setNewListModalActive}>
          <i
            className="bi bi-arrow-left"
            onClick={() => {
              setListModalActive(true);
              setNewListModalActive(false);
            }}
          ></i>

          <h2 className="lg:text-2xl">Add to new list </h2>

          <form
            onSubmit={(e) => {
              handleCustomLists(e);
            }}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              value={customList}
              onChange={(evt) => {
                setCustomList(evt.target.value);
              }}
              className="text-black px-2 text-sm rounded-full"
              placeholder="List name..."
              required
            />
            <button type="submit" className="rounded-full bg-gray-800 hover:bg-gray-700">
              Add
            </button>
          </form>
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
