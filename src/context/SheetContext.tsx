"use client";
import { MediaTypeApi } from "@/Types";
import React, { createContext, useContext, useState, ReactNode } from "react";

type SheetBase = {
  type: "play-media" | "media-details";
};

type MediaDetailsSheet = SheetBase & {
  type: "media-details";
  mediaType: MediaTypeApi;
  mediaId: number;
};

type PlayMediaSheet = SheetBase & {
  type: "play-media";
  mediaType: MediaTypeApi;
  mediaId: number;
};

type Sheet = MediaDetailsSheet | PlayMediaSheet;

type SheetStackContextType = {
  sheetStack: Sheet[];
  pushMediaDetailsSheet: (mediaType: MediaTypeApi, mediaId: number) => void;
  pushPlayMediaSheet: (mediaType: MediaTypeApi, mediaId: number | number) => void;
  popSheet: () => void;
  resetSheet: () => void;
};

const SheetStackContext = createContext<SheetStackContextType | undefined>(undefined);

export const SheetStackProvider = ({ children }: { children: ReactNode }) => {
  const [sheetStack, setSheetStack] = useState<Sheet[]>([]);

  const pushSheet = (sheet: Sheet) => {
    setSheetStack((prev) => [...prev, sheet]);
  };
  function pushMediaDetailsSheet(mediaType: MediaTypeApi, mediaId: number) {
    pushSheet({ type: "media-details", mediaType, mediaId });
  }

  function pushPlayMediaSheet(mediaType: MediaTypeApi, mediaId: number) {
    pushSheet({ type: "play-media", mediaType, mediaId });
  }

  const popSheet = () => {
    setSheetStack((prev) => prev.slice(0, -1));
  };

  const resetSheet = () => {
    setSheetStack([]);
  };

  return <SheetStackContext.Provider value={{ sheetStack, pushMediaDetailsSheet, pushPlayMediaSheet, popSheet, resetSheet }}>{children}</SheetStackContext.Provider>;
};

export const useSheetStack = () => {
  const ctx = useContext(SheetStackContext);
  if (!ctx) throw new Error("useSheetStack must be used within a SheetStackProvider");
  return ctx;
};
