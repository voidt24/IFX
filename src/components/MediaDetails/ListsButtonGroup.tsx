import React, { useContext, useRef, useState } from "react";
import Loader from "../common/Loader";
import AddToListButton from "../common/AddToListButton/AddToListButton";
import { Context, ImediaDetailsData } from "@/context/Context";
import { DBLists } from "@/firebase/firebase.config";
import { handle_favs_watchlists } from "@/firebase/handle_favs_watchlists";
import { MediaTypeApi } from "@/Types/mediaType";

function ListsButtonGroup({ state, mediaType, loadingFavs, loadingWatchlist }: { state: ImediaDetailsData | null; mediaType: MediaTypeApi; loadingFavs: boolean; loadingWatchlist: boolean }) {
  const { currentId, setAuthModalActive, userLogged, addedToFavs, setAddedToFavs, addedtoWatchList, setAddedtoWatchList, firebaseActiveUser } = useContext(Context);
  const [message, setMessage] = useState<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>({ message: "", severity: "info", open: false });
  const mediaTypeRef = useRef<HTMLDivElement>(null);
  const mediaTypeRef2 = useRef<HTMLDivElement>(null);

  const handleLists = async (list: string) => {
    if (userLogged) {
      const buttonToChange = list == DBLists.favs ? setAddedToFavs : setAddedtoWatchList;
      const stateOfButtonToChange = buttonToChange == setAddedToFavs ? addedToFavs : addedtoWatchList;
      try {
        buttonToChange(!stateOfButtonToChange);
        await handle_favs_watchlists(firebaseActiveUser?.uid, mediaTypeRef, state, list, currentId);
      } catch (e) {
        buttonToChange(stateOfButtonToChange);

        setMessage({ message: `Error executing action on ${list}, try later`, severity: "error", open: true });
      }
    } else {
      setAuthModalActive(true);
    }
  };
  return (
    <>
      {loadingFavs ? (
        <Loader />
      ) : (
        <AddToListButton type="Favorites" wasAdded={addedToFavs} currentId={currentId} mediaType={mediaType} mediaTypeRef={mediaTypeRef} onClick={() => handleLists(DBLists.favs)} />
      )}

      {loadingWatchlist ? (
        <Loader />
      ) : (
        <AddToListButton type="Watchlist" wasAdded={addedtoWatchList} currentId={currentId} mediaType={mediaType} mediaTypeRef={mediaTypeRef2} onClick={() => handleLists(DBLists.watchs)} />
      )}
    </>
  );
}

export default ListsButtonGroup;
