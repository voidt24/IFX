"use client";

import { useContext } from "react";
import { Context } from "@/context/Context";
import { getApiMediaType } from "@/helpers/getApiMediaType";
import SheetWrapper from "./SheetWrapper";
import DisplayMediaPWA from "../PWA/DisplayMediaPWA";

export default function DisplayMediaSheet() {
  const { currentId, openDisplayMediaSheet, setOpenDisplayMediaSheet, sheetMediaType } = useContext(Context);

  return (
    <>
      <SheetWrapper isOpen={openDisplayMediaSheet} setIsOpen={setOpenDisplayMediaSheet}>
        <DisplayMediaPWA mediaType={getApiMediaType(sheetMediaType)} mediaId={currentId} />
      </SheetWrapper>
    </>
  );
}
