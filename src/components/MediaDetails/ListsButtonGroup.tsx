import React, { useContext, useRef, useState } from "react";
import Loader from "../common/Loader";
import AddToListButton from "../common/AddToListButton/AddToListButton";
import { Context } from "@/context/Context";
import { DBLists } from "@/firebase/firebase.config";
import { handle_favs_watchlists } from "@/firebase/handle_favs_watchlists";
import { MediaTypeApi } from "@/Types/mediaType";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { setAddedToFavs, setAddedToWatchList } from "@/store/slices/listsManagementSlice";
import { ImediaDetailsData } from "@/Types/mediaDetails";

function ListsButtonGroup({ state, mediaType, loadingFavs, loadingWatchlist }: { state: ImediaDetailsData | null; mediaType: MediaTypeApi; loadingFavs: boolean; loadingWatchlist: boolean }) {
  const { setAuthModalActive } = useContext(Context);
  const [message, setMessage] = useState<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>({ message: "", severity: "info", open: false });
  const mediaTypeRef = useRef<HTMLDivElement>(null);
  const mediaTypeRef2 = useRef<HTMLDivElement>(null);

  const auth = useSelector((state: RootState) => state.auth);
  const { firebaseActiveUser, userLogged } = auth;

  const { addedToFavs, addedToWatchList } = useSelector((state: RootState) => state.listsManagement);
  const dispatch = useDispatch();
  const { currentId } = useSelector((state: RootState) => state.mediaDetails);

  const handleLists = async (list: string) => {
    if (userLogged) {
      const buttonToChange = list == DBLists.favs ? setAddedToFavs : setAddedToWatchList;
      const stateOfButtonToChange = buttonToChange == setAddedToFavs ? addedToFavs : addedToWatchList;
      try {
        dispatch(buttonToChange(Boolean(!stateOfButtonToChange)));
        await handle_favs_watchlists(firebaseActiveUser?.uid, mediaTypeRef, state, list, currentId);
      } catch (e) {
        dispatch(buttonToChange(Boolean(stateOfButtonToChange)));

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
        <AddToListButton type="Watchlist" wasAdded={addedToWatchList} currentId={currentId} mediaType={mediaType} mediaTypeRef={mediaTypeRef2} onClick={() => handleLists(DBLists.watchs)} />
      )}
    </>
  );
}

export default ListsButtonGroup;
