"use client";
import { SwipeableDrawer } from "@mui/material";
import { ReactNode } from "react";

function MenuDrawer({ isOpen, setIsOpen, children }: { isOpen: boolean; setIsOpen: (value: boolean) => void; children: ReactNode }) {
  return (
    <SwipeableDrawer
      PaperProps={{
        sx: {
          width: "100%",
          bgcolor: "black",
          background: "rgba(0, 0, 0, 0.659)",
          backdropFilter: "blur(16px)",
          
          WebkitBackdropFilter: "blur(16px)",
          color: "white",
        },
      }}
      anchor={"right"}
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
      onOpen={() => {
        setIsOpen(true);
      }}
    >
      <div className={`flex-col-center w-full mx-auto mt-4`}>
        <button className=" text-content-primary text-2xl font-semibold px-1.5 py-0.5 z-[9999] self-start" title="close-btn">
          <i
            className="bi bi-chevron-left"
            onClick={() => {
              setIsOpen(false);
            }}
          ></i>
        </button>
        {children}
      </div>
    </SwipeableDrawer>
  );
}

export default MenuDrawer;
