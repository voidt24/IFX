"use client";
import { getApiMediaType } from "@/helpers/getApiMediaType";
import SheetWrapper from "./SheetWrapper";
import DisplayMediaPWA from "../PWA/DisplayMediaPWA";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setOpenDisplayMediaSheet } from "@/store/slices/UISlice";

export default function DisplayMediaSheet() {
  const { mediaIdPWA, sheetMediaType } = useSelector((state: RootState) => state.mediaDetails);
  const { openDisplayMediaSheet } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();

  return (
    <>
      <SheetWrapper
        isOpen={openDisplayMediaSheet}
        setIsOpen={(value) => {
          dispatch(setOpenDisplayMediaSheet(value));
        }}
      >
        <DisplayMediaPWA mediaType={getApiMediaType(sheetMediaType)} mediaId={mediaIdPWA} />
      </SheetWrapper>
    </>
  );
}
