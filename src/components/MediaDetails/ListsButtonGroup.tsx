import { RefObject, useRef, useState } from "react";
import AddToListButton from "../common/AddToListButton/AddToListButton";
import { DBLists } from "@/firebase/firebase.config";
import { handle_favs_watchlists } from "@/firebase/handle_favs_watchlists";
import { MediaTypeApi } from "@/Types/mediaType";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { setAddedToFavs, setAddedToWatchList, setAddedToWatched } from "@/store/slices/listsManagementSlice";
import { ImediaDetailsData } from "@/Types/mediaDetails";
import { setAuthModalActive } from "@/store/slices/UISlice";

function ListsButtonGroup({
  state,
  mediaId,
  mediaType,
  loadingFavs,
  loadingWatchlist,
  loadingWatched,
}: {
  state: ImediaDetailsData | null;
  mediaId: number;
  mediaType: MediaTypeApi;
  loadingFavs: boolean;
  loadingWatchlist: boolean;
  loadingWatched: boolean;
}) {
  const [message, setMessage] = useState<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>({ message: "", severity: "info", open: false });
  const mediaTypeRef = useRef<HTMLDivElement>(null);
  const mediaTypeRef2 = useRef<HTMLDivElement>(null);
  const mediaTypeRef3 = useRef<HTMLDivElement>(null);

  const auth = useSelector((state: RootState) => state.auth);
  const { firebaseActiveUser, userLogged } = auth;

  const { addedToFavs, addedToWatchList, addedToWatched } = useSelector((state: RootState) => state.listsManagement);
  const dispatch = useDispatch();

  const handleLists = async (list: string) => {
    if (userLogged) {
      const buttonToChange = list == DBLists.favs ? setAddedToFavs : list == DBLists.watchs ? setAddedToWatchList : setAddedToWatched;
      const stateOfButtonToChange = buttonToChange == setAddedToFavs ? addedToFavs : buttonToChange == setAddedToWatchList ? addedToWatchList : addedToWatched;
      try {
        dispatch(buttonToChange(Boolean(!stateOfButtonToChange)));
        await handle_favs_watchlists(firebaseActiveUser?.uid, mediaTypeRef, state, list, mediaId);
      } catch (e) {
        dispatch(buttonToChange(Boolean(stateOfButtonToChange)));

        setMessage({ message: `Error executing action on ${list}, try later`, severity: "error", open: true });
      }
    } else {
      dispatch(setAuthModalActive(true));
    }
  };

  const listConfigs = [
    {
      loading: loadingFavs,
      type: "Favorites",
      wasAdded: addedToFavs,
      mediaTypeRef,
      onClick: () => handleLists(DBLists.favs),
    },
    {
      loading: loadingWatchlist,
      type: "Watchlist",
      wasAdded: addedToWatchList,
      mediaTypeRef: mediaTypeRef2,
      onClick: () => handleLists(DBLists.watchs),
    },
    {
      loading: loadingWatched,
      type: "Watched",
      wasAdded: addedToWatched,
      mediaTypeRef: mediaTypeRef3,
      onClick: () => handleLists(DBLists.watched),
    },
  ];

  function renderButton(isLoading: boolean, type: string, wasAdded: boolean, mediaTypeRef: RefObject<HTMLDivElement>, onClick: () => Promise<void>, key: number) {
    return isLoading ? (
      <div className="bg-zinc-700 p-4 rounded-full animate-pulse" key={key}></div>
    ) : (
      <AddToListButton type={type} wasAdded={wasAdded} currentId={mediaId} mediaType={mediaType} mediaTypeRef={mediaTypeRef} onClick={() => onClick()} key={key} />
    );
  }
  return (
    <>
      {listConfigs.map((list, index) => {
        const { loading, type, wasAdded, mediaTypeRef, onClick } = list;
        return renderButton(loading, type, wasAdded, mediaTypeRef, onClick, index);
      })}
    </>
  );
}

export default ListsButtonGroup;
