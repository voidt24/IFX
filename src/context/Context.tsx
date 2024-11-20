"use client";
import { usePathname } from "next/navigation";
import { useState, createContext, useEffect, Dispatch, SetStateAction } from "react";
import { auth } from "../firebase/firebase.config";
import { useParams } from "next/navigation";
import Modal from "@/components/common/Modal";

import isValidMediatype, { setMedia } from "@/helpers/isvalidMediatype";
import { Isearch } from "@/helpers/search";
import AuthForm from "@/components/AuthForm";

interface IContextValues {
  numberOfPages: number;
  setNumberOfPages: Dispatch<SetStateAction<number>>;
  pageActive: number;
  setPageActive: Dispatch<SetStateAction<number>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  loadingSearch: boolean;
  setLoadingSearch: Dispatch<SetStateAction<boolean>>;
  searchStarted: boolean;
  setSearchStarted: Dispatch<SetStateAction<boolean>>;
  currentId: number | undefined;
  setCurrentId: Dispatch<SetStateAction<number | undefined>>;
  openTrailer: boolean;
  setOpenTrailer: Dispatch<SetStateAction<boolean>>;
  trailerKey: number | undefined;
  setTrailerKey: Dispatch<SetStateAction<number | undefined>>;
  currentMediaType: string;
  setCurrentMediaType: Dispatch<SetStateAction<string>>;
  authModalActive: boolean;
  setAuthModalActive: Dispatch<SetStateAction<boolean>>;
  userLogged: boolean;
  setUserLogged: Dispatch<SetStateAction<boolean>>;
  noAccount: boolean;
  setNoAccount: Dispatch<SetStateAction<boolean>>;
  addedToFavs: boolean;
  setAddedToFavs: Dispatch<SetStateAction<boolean>>;
  addedtoWatchList: boolean;
  setAddedtoWatchList: Dispatch<SetStateAction<boolean>>;
  firebaseActiveUser: { email: string | null; uid: string | null } | null;
  setFirebaseActiveUser: Dispatch<SetStateAction<{ email: string | null; uid: string | null } | null>>;
  loadingAllData: boolean;
  setLoadingAllData: Dispatch<SetStateAction<boolean>>;
  edit: boolean;
  setEdit: Dispatch<SetStateAction<boolean>>;
  checkedMedia: (number | string)[];
  setCheckedMedia: Dispatch<SetStateAction<(number | string)[]>>;
  isMember: boolean;
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  initialDataIsLoading: boolean;
  setInitialDataIsLoading: Dispatch<SetStateAction<boolean>>;
  initialDataError: boolean;
  setInitialDataError: Dispatch<SetStateAction<boolean>>;
  castError: boolean;
  setCastError: Dispatch<SetStateAction<boolean>>;
  reviewsError: boolean;
  setReviewsError: Dispatch<SetStateAction<boolean>>;
  similarError: boolean;
  setSimilarError: Dispatch<SetStateAction<boolean>>;
  listActive: string | null;
  setListActive: Dispatch<SetStateAction<string | null>>;
  message: { message: string; severity: string; open: boolean } | null;
  setMessage: Dispatch<SetStateAction<{ message: string; severity: string; open: boolean } | null>>;
  searchResults: Isearch[] | null;
  setSearchResults: Dispatch<SetStateAction<Isearch[] | null>>;
}
export const Context = createContext<IContextValues>({} as IContextValues);

export default function ContextWrapper({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [currentId, setCurrentId] = useState<number | undefined>();
  const [openTrailer, setOpenTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState<number | undefined>();
  const [currentMediaType, setCurrentMediaType] = useState("");
  const [authModalActive, setAuthModalActive] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const [noAccount, setNoAccount] = useState(true);
  const [addedToFavs, setAddedToFavs] = useState(false);
  const [addedtoWatchList, setAddedtoWatchList] = useState(false);
  const [firebaseActiveUser, setFirebaseActiveUser] = useState<{ email: string | null; uid: string | null } | null>(null);
  const [loadingAllData, setLoadingAllData] = useState(true);
  const [edit, setEdit] = useState(false);
  const [checkedMedia, setCheckedMedia] = useState<(number | string)[]>([]);

  const [isMember, setIsMember] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [initialDataIsLoading, setInitialDataIsLoading] = useState(true);

  const [initialDataError, setInitialDataError] = useState(false);

  const [castError, setCastError] = useState(false);

  const [reviewsError, setReviewsError] = useState(false);

  const [similarError, setSimilarError] = useState(false);

  const [listActive, setListActive] = useState<string | null>("favorites");

  const [message, setMessage] = useState<{ message: string; severity: string; open: boolean } | null>(null);

  const [searchResults, setSearchResults] = useState<Isearch[] | null>([]);

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchStarted, setSearchStarted] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [pageActive, setPageActive] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { id: idFromUrl } = useParams();

  const contextValues = {
    numberOfPages,
    setNumberOfPages,
    pageActive,
    setPageActive,
    searchQuery,
    setSearchQuery,
    loadingSearch,
    setLoadingSearch,
    searchStarted,
    setSearchStarted,
    currentId,
    setCurrentId,
    openTrailer,
    setOpenTrailer,
    trailerKey,
    setTrailerKey,
    currentMediaType,
    setCurrentMediaType,

    authModalActive,
    setAuthModalActive,
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
    isMember,
    openDialog,
    setOpenDialog,
    initialDataIsLoading,
    setInitialDataIsLoading,
    initialDataError,
    setInitialDataError,
    castError,
    setCastError,
    reviewsError,
    setReviewsError,
    similarError,
    setSimilarError,
    listActive,
    setListActive,
    message,
    setMessage,
    searchResults,
    setSearchResults,
  };

  useEffect(() => {
    if (Number(idFromUrl) != currentId && currentId == undefined) {
      setCurrentId(Number(idFromUrl));
    }
  }, [idFromUrl]);

  useEffect(() => {
    const mediaTypeFromUrl = setMedia(path);
    if (isValidMediatype(mediaTypeFromUrl)) {
      setCurrentMediaType(mediaTypeFromUrl);
    } else {
      setCurrentMediaType("movies");
    }
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

  return (
    <Context.Provider value={contextValues}>
      {children}
      <Modal modalActive={authModalActive} setModalActive={setAuthModalActive}>
        <AuthForm />
      </Modal>
    </Context.Provider>
  );
}
