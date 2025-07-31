"use client";
import MediaDetails from "../MediaDetails/MediaDetails";
import { useContext } from "react";
import { Context } from "@/context/Context";
import { getApiMediaType } from "@/helpers/getApiMediaType";
import SheetWrapper from "./SheetWrapper";
import Trailer from "../Trailer";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function MediaDetailsSheet() {
  const { openMediaDetailsSheet, setOpenMediaDetailsSheet, sheetMediaType } = useContext(Context);
  const { currentId } = useSelector((state: RootState) => state.mediaDetails);

  return (
    <>
      <SheetWrapper isOpen={openMediaDetailsSheet} setIsOpen={setOpenMediaDetailsSheet}>
        <MediaDetails mediaType={getApiMediaType(sheetMediaType)} mediaId={currentId} />
        <Trailer />
      </SheetWrapper>
    </>
  );
}
