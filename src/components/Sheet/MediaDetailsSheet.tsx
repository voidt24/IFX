"use client";
import MediaDetails from "../MediaDetails/MediaDetails";
import { useContext } from "react";
import { Context } from "@/context/Context";
import { getApiMediaType } from "@/helpers/getApiMediaType";
import SheetWrapper from "./SheetWrapper";
import Trailer from "../Trailer";

export default function MediaDetailsSheet() {
  const { currentId, openMediaDetailsSheet, setOpenMediaDetailsSheet, sheetMediaType } = useContext(Context);

  return (
    <>
      <SheetWrapper isOpen={openMediaDetailsSheet} setIsOpen={setOpenMediaDetailsSheet}>
        <MediaDetails mediaType={getApiMediaType(sheetMediaType)} mediaId={currentId} />
        <Trailer />
      </SheetWrapper>
    </>
  );
}
