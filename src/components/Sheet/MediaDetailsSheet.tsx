"use client";
import { useContext } from "react";
import { Context } from "@/context/Context";
import { getApiMediaType } from "@/helpers/getApiMediaType";
import SheetWrapper from "./SheetWrapper";
import Trailer from "../Trailer";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import MediaDetails from "@/views/MediaDetails";
import { setOpenMediaDetailsSheet } from "@/store/slices/UISlice";

export default function MediaDetailsSheet() {
  const { mediaIdPWA, sheetMediaType } = useSelector((state: RootState) => state.mediaDetails);
  const { openMediaDetailsSheet } = useSelector((state: RootState) => state.ui);

  return (
    <>
      <SheetWrapper isOpen={openMediaDetailsSheet} setIsOpen={setOpenMediaDetailsSheet}>
        <MediaDetails mediaType={getApiMediaType(sheetMediaType)} mediaId={mediaIdPWA} />
        <Trailer />
      </SheetWrapper>
    </>
  );
}
