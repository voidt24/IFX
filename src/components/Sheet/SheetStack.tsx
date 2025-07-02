"use client";
import { Sheet } from "react-modal-sheet";
import { useSheetStack } from "@/context/SheetContext";
import MediaDetails from "../MediaDetails/MediaDetails";
import { useContext } from "react";
import { Context } from "@/context/Context";
import DisplayMediaPWA from "../PWA/DisplayMediaPWA";

export default function SheetStack() {
  const { sheetStack, popSheet, resetSheet } = useSheetStack();
  const { currentId, sheetsRef } = useContext(Context);

  return (
    <>
      {sheetStack.map((sheetType, index) => (
        <Sheet
          key={`media-${currentId}-${index}`}
          ref={sheetsRef}
          isOpen={true}
          onClose={popSheet}
          snapPoints={[1, 0.5, 0]}
          initialSnap={0}
          onSnap={(snapIndex) => {
            if (snapIndex === 1) resetSheet();
          }}
        >
          <Sheet.Container style={{ backgroundColor: "black", height: "100vh" }}>
            {sheetStack.length > 1 && (
              <>
                <button className="lg:hidden text-content-primary text-2xl font-semibold fixed top-6 left-3 bg-black/50 backdrop-blur-lg rounded-full px-1.5 py-0.5 z-[9999]" title="close-btn">
                  <i
                    className="bi bi-chevron-left"
                    onClick={() => {
                      popSheet();
                    }}
                  ></i>
                </button>
              </>
            )}

            {sheetType.type !== "play-media" && (
              <button className="lg:hidden text-content-primary text-2xl font-semibold fixed top-6 right-3 bg-black/50 backdrop-blur-lg rounded-full px-1.5 py-0.5 z-[9999]" title="close-btn">
                <i
                  className="bi bi-x"
                  onClick={() => {
                    resetSheet();
                  }}
                ></i>
              </button>
            )}
            <Sheet.Content className=" overflow-hidden rounded-2xl">
              <Sheet.Scroller>
                <div>{sheetType.type === "media-details" && <MediaDetails mediaType={sheetType.mediaType} mediaId={sheetType.mediaId} />}</div>
                <div>{sheetType.type === "play-media" && <DisplayMediaPWA mediaType={sheetType.mediaType} mediaId={sheetType.mediaId} />}</div>
              </Sheet.Scroller>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop onTap={popSheet} />
        </Sheet>
      ))}
    </>
  );
}
