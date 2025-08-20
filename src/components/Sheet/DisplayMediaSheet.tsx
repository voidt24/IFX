"use client";

import { useContext } from "react";
import { Context } from "@/context/Context";
import { getApiMediaType } from "@/helpers/getApiMediaType";
import SheetWrapper from "./SheetWrapper";
import DisplayMediaPWA from "../PWA/DisplayMediaPWA";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function DisplayMediaSheet() {
  const { openDisplayMediaSheet, setOpenDisplayMediaSheet } = useContext(Context);
  const { mediaIdPWA, sheetMediaType } = useSelector((state: RootState) => state.mediaDetails);

  return (
    <>
      <SheetWrapper isOpen={openDisplayMediaSheet} setIsOpen={setOpenDisplayMediaSheet}>
        <DisplayMediaPWA mediaType={getApiMediaType(sheetMediaType)} mediaId={mediaIdPWA} />
      </SheetWrapper>
    </>
  );
}
