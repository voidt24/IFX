"use client";
import { useState, createContext, Dispatch, SetStateAction, useRef, RefObject } from "react";
import Modal from "@/components/common/Modal";
import AuthForm from "@/components/AuthForm";
import LoadingScreen from "@/components/common/Loaders/LoadingScreen";
import { useIsPWA } from "@/Hooks/useIsPWA";
import useIsMobile from "@/Hooks/useIsMobile";
interface IContextValues {
  openTrailer: boolean;
  setOpenTrailer: Dispatch<SetStateAction<boolean>>;
  trailerKey: number | null;
  setTrailerKey: Dispatch<SetStateAction<number | null>>;
  authModalActive: boolean;
  setAuthModalActive: Dispatch<SetStateAction<boolean>>;
  noAccount: boolean;
  setNoAccount: Dispatch<SetStateAction<boolean>>;
  loadingAllData: boolean;
  setLoadingAllData: Dispatch<SetStateAction<boolean>>;
  initialDataIsLoading: boolean;
  setInitialDataIsLoading: Dispatch<SetStateAction<boolean>>;
  initialDataError: boolean;
  setInitialDataError: Dispatch<SetStateAction<boolean>>;
  castError: boolean;
  setCastError: Dispatch<SetStateAction<boolean>>;
  reviewsError: boolean;
  setReviewsError: Dispatch<SetStateAction<boolean>>;
  loadingScreen: boolean;
  setLoadingScreen: Dispatch<SetStateAction<boolean>>;
  seasonModal: boolean;
  setSeasonModal: Dispatch<SetStateAction<boolean>>;
  showSearchBar: boolean;
  setShowSearchBar: Dispatch<SetStateAction<boolean>>;
  userMenuActive: boolean;
  setUserMenuActive: Dispatch<SetStateAction<boolean>>;
  containerMargin: number | undefined;
  setContainerMargin: Dispatch<SetStateAction<number | undefined>>;
  sheetMediaType: "movies" | "tvshows";
  setSheetMediaType: Dispatch<SetStateAction<"movies" | "tvshows">>;
  sheetSeason: number | undefined;
  setSheetSeason: Dispatch<SetStateAction<number | undefined>>;
  sheetEpisode: number | undefined;
  setSheetEpisode: Dispatch<SetStateAction<number | undefined>>;
  isPWA: boolean;
  isMobilePWA: boolean;
  sheetsRef: RefObject<HTMLDivElement>;
  openMediaDetailsSheet: boolean;
  setOpenMediaDetailsSheet: Dispatch<SetStateAction<boolean>>;
  openDisplayMediaSheet: boolean;
  setOpenDisplayMediaSheet: Dispatch<SetStateAction<boolean>>;
  openSearchDrawer: boolean;
  setOpenSearchDrawer: Dispatch<SetStateAction<boolean>>;
  openUserDrawer: boolean;
  setOpenUserDrawer: Dispatch<SetStateAction<boolean>>;
}

export const Context = createContext<IContextValues>({} as IContextValues);

export default function ContextWrapper({ children }: { children: React.ReactNode }) {
  const [openTrailer, setOpenTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState<number | null>(null);
  const [authModalActive, setAuthModalActive] = useState(false);
  const [noAccount, setNoAccount] = useState(true);
  const [loadingAllData, setLoadingAllData] = useState(true);

  const [initialDataIsLoading, setInitialDataIsLoading] = useState(true);

  const [initialDataError, setInitialDataError] = useState(false);

  const [castError, setCastError] = useState(false);

  const [reviewsError, setReviewsError] = useState(false);  

  const [loadingScreen, setLoadingScreen] = useState(false);
  const [seasonModal, setSeasonModal] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [containerMargin, setContainerMargin] = useState<number | undefined>();
  const [sheetMediaType, setSheetMediaType] = useState<"movies" | "tvshows">("movies");
  const [sheetSeason, setSheetSeason] = useState<number | undefined>();
  const [sheetEpisode, setSheetEpisode] = useState<number | undefined>();

  const sheetsRef = useRef<HTMLDivElement>(null);
  const [openMediaDetailsSheet, setOpenMediaDetailsSheet] = useState(false);
  const [openDisplayMediaSheet, setOpenDisplayMediaSheet] = useState(false);
  const [openSearchDrawer, setOpenSearchDrawer] = useState(false);
  const [openUserDrawer, setOpenUserDrawer] = useState(false);
  const isPWA = useIsPWA();
  const isMobile = useIsMobile(768);
  const isMobilePWA = isPWA && isMobile;

  const contextValues = {
    openTrailer,
    setOpenTrailer,
    trailerKey,
    setTrailerKey,
    authModalActive,
    setAuthModalActive,
    noAccount,
    setNoAccount,
    loadingAllData,
    setLoadingAllData,
    initialDataIsLoading,
    setInitialDataIsLoading,
    initialDataError,
    setInitialDataError,
    castError,
    setCastError,
    reviewsError,
    setReviewsError,
    loadingScreen,
    setLoadingScreen,
    seasonModal,
    setSeasonModal,
    showSearchBar,
    setShowSearchBar,
    userMenuActive,
    setUserMenuActive,
    containerMargin,
    setContainerMargin,
    sheetMediaType,
    setSheetMediaType,
    sheetSeason,
    setSheetSeason,
    sheetEpisode,
    setSheetEpisode,
    isPWA,
    sheetsRef,
    isMobilePWA,
    openMediaDetailsSheet,
    setOpenMediaDetailsSheet,
    openDisplayMediaSheet,
    setOpenDisplayMediaSheet,
    openSearchDrawer,
    setOpenSearchDrawer,
    openUserDrawer,
    setOpenUserDrawer,
  };

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
