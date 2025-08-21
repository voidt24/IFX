"use client";

import { useContext } from "react";
import { Context } from "@/context/Context";
import { getApiMediaType } from "@/helpers/getApiMediaType";
import SheetWrapper from "./SheetWrapper";
import DisplayMediaPWA from "../PWA/DisplayMediaPWA";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { setOpenDisplayMediaSheet } from "@/store/slices/UISlice";

export default function DisplayMediaSheet() {
  const { mediaIdPWA, sheetMediaType } = useSelector((state: RootState) => state.mediaDetails);
  const { openDisplayMediaSheet } = useSelector((state: RootState) => state.ui);

  return (
    <>
      <SheetWrapper isOpen={openDisplayMediaSheet} setIsOpen={setOpenDisplayMediaSheet}>
        <DisplayMediaPWA mediaType={getApiMediaType(sheetMediaType)} mediaId={mediaIdPWA} />
      </SheetWrapper>
    </>
  );
}
