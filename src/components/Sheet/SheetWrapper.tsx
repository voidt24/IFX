"use client";
import { Sheet } from "react-modal-sheet";
import { ReactNode, useContext } from "react";
import { Context } from "@/context/Context";

export default function SheetWrapper({ children, isOpen, setIsOpen }: { children: ReactNode; isOpen: boolean; setIsOpen: (value: boolean) => void }) {
  const { sheetsRef } = useContext(Context);

  return (
    <>
      <Sheet
        ref={sheetsRef}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        snapPoints={[1, 0.5, 0]}
        initialSnap={0}
        onSnap={(snapIndex) => {
          if (snapIndex === 1) setIsOpen(false);
        }}
      >
        <Sheet.Container style={{ backgroundColor: "black", height: "100vh" }}>
          <button className="lg:hidden text-content-primary text-2xl font-semibold fixed top-6 right-3 bg-black/50 backdrop-blur-lg rounded-full px-1.5 py-0.5 z-[9999]" title="close-btn">
            <i
              className="bi bi-x"
              onClick={() => {
                setIsOpen(false);
              }}
            ></i>
          </button>
          <Sheet.Content className=" overflow-hidden rounded-2xl">
            <Sheet.Scroller>{children}</Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop
          onTap={() => {
            setIsOpen(false);
          }}
        />
      </Sheet>
    </>
  );
}
