"use client";
import { usePathname } from "next/navigation";
import { useState, createContext, useEffect } from "react";
import { auth } from "../firebase/firebase.config";
import { useParams } from "next/navigation";

export const Context = createContext([]);

export default function ContextWrapper({ children }) {
  const path = usePathname();
  const [currentId, setCurrentId] = useState();
  const [openTrailer, setOpenTrailer] = useState("");
  const [trailerKey, setTrailerKey] = useState("");
  const [currentMediaType, setCurrentMediaType] = useState("");
  const [apiData, setApiData] = useState([]);
  const [userClicked, setUserClicked] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const [noAccount, setNoAccount] = useState(true);
  const [addedToFavs, setAddedToFavs] = useState(false);
  const [addedtoWatchList, setAddedtoWatchList] = useState(false);
  const [firebaseActiveUser, setFirebaseActiveUser] = useState({ email: null, uid: null });
  const [loadingAllData, setLoadingAllData] = useState(true);
  const [edit, setEdit] = useState(false);
  const [checkedMedia, setCheckedMedia] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [isMember, setIsMember] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [initialDataIsLoading, setInitialDataIsLoading] = useState(true);

  const [initialDataError, setinitialDataError] = useState(false);

  const [castError, setCastError] = useState(false);

  const [reviewsError, setReviewsError] = useState(false);

  const [similarError, setSimilarError] = useState(false);

  const { id: idFromUrl } = useParams();

  const contextValues = {
    currentId,
    setCurrentId,
    openTrailer,
    setOpenTrailer,
    trailerKey,
    setTrailerKey,
    currentMediaType,
    setCurrentMediaType,
    apiData,
    setApiData,
    userClicked,
    setUserClicked,
    userLogged,
    setUserLogged,
    noAccount,
    setNoAccount,
    addedToFavs,
    setAddedToFavs,
    addedtoWatchList,
    setAddedtoWatchList,
    firebaseActiveUser,
    setFirebaseActiveUser,
    loadingAllData,
    setLoadingAllData,
    edit,
    setEdit,
    checkedMedia,
    setCheckedMedia,
    searchResults,
    setSearchResults,
    isMember,
    openDialog,
    setOpenDialog,
    initialDataIsLoading,
    setInitialDataIsLoading,
    initialDataError,
    setinitialDataError,
    castError,
    setCastError,
    reviewsError,
    setReviewsError,
    similarError,
    setSimilarError,
  };

  useEffect(() => {
    if (idFromUrl != currentId && currentId == undefined) {
      setCurrentId(Number(idFromUrl) );
    }
  }, [idFromUrl]);

  useEffect(() => {
    function setMedia(pathContainsValidMedia, pathName) {
      if (pathContainsValidMedia) {
        setCurrentMediaType(pathName);
      } else {
        setCurrentMediaType("movies");
      }
    }

    let pathName;
    let pathContainsValidMedia;

    if (path.slice(1).includes("/")) {
      pathName = path.slice(1, path.lastIndexOf("/"));
    } else {
      pathName = path.slice(1);
    }
    pathContainsValidMedia = pathName == "movies" || pathName == "tvshows";
    setMedia(pathContainsValidMedia, pathName);
  }, [path]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserLogged(true);
        setFirebaseActiveUser({ email: user.email, uid: user.uid });

        setIsMember(true);
        setOpenDialog(false);
      } else {
        setTimeout(() => {
          if (!user && !localStorage.getItem("auth")) {
            setIsMember(false);
            setOpenDialog(true);
          }
        }, 4000);
      }
    });
  }, []);

  return <Context.Provider value={contextValues}>{children}</Context.Provider>;
}
