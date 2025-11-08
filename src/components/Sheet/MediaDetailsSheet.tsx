"use client";
import { getApiMediaType } from "@/helpers/getApiMediaType";
import SheetWrapper from "./SheetWrapper";
import Trailer from "../byRoute/MediaDetails/Trailer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import MediaDetails from "@/views/MediaDetails";
import { setOpenMediaDetailsSheet } from "@/store/slices/UISlice";

export default function MediaDetailsSheet() {
  const { mediaIdPWA, sheetMediaType } = useSelector((state: RootState) => state.mediaDetails);
  const { openMediaDetailsSheet } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();

  return (
    <>
      <SheetWrapper
        isOpen={openMediaDetailsSheet}
        setIsOpen={(value) => {
          dispatch(setOpenMediaDetailsSheet(value));
        }}
      >
        <MediaDetails mediaType={getApiMediaType(sheetMediaType)} mediaId={mediaIdPWA} />
        <Trailer />
      </SheetWrapper>
    </>
  );
}
