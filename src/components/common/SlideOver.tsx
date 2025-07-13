import { Context } from "@/context/Context";
import { Dispatch, ReactNode, SetStateAction, useContext } from "react";
import { RemoveScroll } from "react-remove-scroll";

export default function SlideOver({ activeState, setActiveState, children }: { activeState: boolean; setActiveState: Dispatch<SetStateAction<boolean>>; children: ReactNode }) {
  const { containerMargin, sheetsRef } = useContext(Context);
  return (
    <RemoveScroll shards={[sheetsRef]}>
      <div
        className={`overlay !fixed right-0 transition-all duration-400 z-[9999] overflow-hidden ${activeState ? "w-[100vw] opacity-100 pointer-events-auto" : "w-0 opacity-0 pointer-events-none"}`}
        style={{ marginTop: containerMargin ? `${containerMargin}px` : undefined }}
      >
        {children}
      </div>
    </RemoveScroll>
  );
}
