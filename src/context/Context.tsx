"use client";
import { usePathname } from "next/navigation";
import { useState, createContext, useEffect, Dispatch, SetStateAction, useRef } from "react";
import { auth, ID_TOKEN_COOKIE_NAME } from "../firebase/firebase.config";
import { useParams } from "next/navigation";
import Modal from "@/components/common/Modal";

import isValidMediatype, { setMedia } from "@/helpers/isvalidMediatype";
import AuthForm from "@/components/AuthForm";
import LoadingScreen from "@/components/common/Loaders/LoadingScreen";
import { ISliderData } from "@/helpers/api.config";

interface ImediaDetailsData {
  results: [] | null;
  heroBackground: string | null;
  bigHeroBackground: string | null; //to get the backdrop even in smaller size devices
  title: string | null;
  poster: string | null;
  overview: string | null;
  releaseDate: string | null;
  vote: string | null;
  genres: string | null;
  loadingAllData: boolean | null;
  runtime: string | null;
  seasons: string | null;
  seasonsArray: [] | null;
}

interface Iepisode {
  air_date: string;
  episode_number: number;
  episode_type: string;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}
interface IepisodesArray {
  air_date: string | null;
  episodes: Iepisode[] | null;
  id: number | null;
  name: string | null;
  overview: string | null;
  poster_path: string | null;
  season_number: number | null;
  vote_average: number | null;
  _id: string | null;
}

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
  loadingScreen: boolean;
  setLoadingScreen: Dispatch<SetStateAction<boolean>>;
  listActive: string | null;
  setListActive: Dispatch<SetStateAction<string | null>>;
  searchResults: ISliderData[] | null;
  setSearchResults: Dispatch<SetStateAction<ISliderData[] | null>>;
  mediaDetailsData: ImediaDetailsData | null;
  setMediaDetailsData: Dispatch<SetStateAction<ImediaDetailsData | null>>;
  episodesArray: IepisodesArray[] | null;
  setEpisodesArray: Dispatch<SetStateAction<IepisodesArray[] | null>>;
  activeSeason: number;
  setActiveSeason: Dispatch<SetStateAction<number>>;
  seasonModal: boolean;
  setSeasonModal: Dispatch<SetStateAction<boolean>>;
  listChanged: boolean;
  setListChanged: Dispatch<SetStateAction<boolean>>;
  showSearchBar: boolean;
  setShowSearchBar: Dispatch<SetStateAction<boolean>>;
  userMenuActive: boolean;
  setUserMenuActive: Dispatch<SetStateAction<boolean>>;
  containerMargin: number | undefined;
  setContainerMargin: Dispatch<SetStateAction<number | undefined>>;
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

  const [initialDataIsLoading, setInitialDataIsLoading] = useState(true);

  const [initialDataError, setInitialDataError] = useState(false);

  const [castError, setCastError] = useState(false);

  const [reviewsError, setReviewsError] = useState(false);

  const [similarError, setSimilarError] = useState(false);

  const [listActive, setListActive] = useState<string | null>("favorites");

  const [searchResults, setSearchResults] = useState<ISliderData[] | null>([]);

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchStarted, setSearchStarted] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [pageActive, setPageActive] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { id: idFromUrl } = useParams();

  const [mediaDetailsData, setMediaDetailsData] = useState<ImediaDetailsData | null>(null);

  const [episodesArray, setEpisodesArray] = useState<IepisodesArray[] | null>(null);

  const [activeSeason, setActiveSeason] = useState(0);
  const [seasonModal, setSeasonModal] = useState(false);
  const [listChanged, setListChanged] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [containerMargin, setContainerMargin] = useState<number | undefined>();

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
    searchResults,
    setSearchResults,
    loadingScreen,
    setLoadingScreen,
    mediaDetailsData,
    setMediaDetailsData,
    episodesArray,
    setEpisodesArray,
    activeSeason,
    setActiveSeason,
    seasonModal,
    setSeasonModal,
    listChanged,
    setListChanged,
    showSearchBar,
    setShowSearchBar,
    userMenuActive,
    setUserMenuActive,
    containerMargin,
    setContainerMargin,
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
      }
    });

    auth.onIdTokenChanged((user) => {
      async function saveTokenToCookies() {
        const token = await auth?.currentUser?.getIdToken();
        document.cookie = `${ID_TOKEN_COOKIE_NAME}=${token};path=/`;
      }
      if (user) {
        saveTokenToCookies();
      }
    });
  }, []);

  if (loadingScreen) return <LoadingScreen />;
  return (
    <Context.Provider value={contextValues}>
      {children}
      <Modal modalActive={authModalActive} setModalActive={setAuthModalActive}>
        <AuthForm />
      </Modal>
    </Context.Provider>
  );
}
