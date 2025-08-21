"use client";
import { useState, createContext, Dispatch, SetStateAction, useRef, RefObject } from "react";
import { useIsPWA } from "@/Hooks/useIsPWA";
import useIsMobile from "@/Hooks/useIsMobile";
interface IContextValues {
  openTrailer: boolean;
  setOpenTrailer: Dispatch<SetStateAction<boolean>>;
  trailerKey: number | null;
  setTrailerKey: Dispatch<SetStateAction<number | null>>;

  loadingAllData: boolean;
  setLoadingAllData: Dispatch<SetStateAction<boolean>>;
  initialDataIsLoading: boolean;
  setInitialDataIsLoading: Dispatch<SetStateAction<boolean>>;
  initialDataError: boolean;
  setInitialDataError: Dispatch<SetStateAction<boolean>>;

  isPWA: boolean;
  isMobilePWA: boolean;
  sheetsRef: RefObject<HTMLDivElement>;
  castError: boolean;
  setCastError: Dispatch<SetStateAction<boolean>>;
  reviewsError: boolean;
  setReviewsError: Dispatch<SetStateAction<boolean>>;
}

export const Context = createContext<IContextValues>({} as IContextValues);

export default function ContextWrapper({ children }: { children: React.ReactNode }) {
  const [openTrailer, setOpenTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState<number | null>(null);
  const [loadingAllData, setLoadingAllData] = useState(true);

  const [initialDataIsLoading, setInitialDataIsLoading] = useState(true);

  const [initialDataError, setInitialDataError] = useState(false);

  const [castError, setCastError] = useState(false);

  const [reviewsError, setReviewsError] = useState(false);
  const sheetsRef = useRef<HTMLDivElement>(null);
  const isPWA = useIsPWA();
  const isMobile = useIsMobile(768);
  const isMobilePWA = isPWA && isMobile;

  const contextValues = {
    openTrailer,
    setOpenTrailer,
    trailerKey,
    setTrailerKey,

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

    sheetsRef,

    isPWA,
    isMobilePWA,
  };

  return <Context.Provider value={contextValues}>{children}</Context.Provider>;
}
