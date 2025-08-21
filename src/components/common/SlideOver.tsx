import { Context } from "@/context/Context";
import { RootState } from "@/store";
import { ReactNode, useContext } from "react";
import { useSelector } from "react-redux";
import { RemoveScroll } from "react-remove-scroll";

export default function SlideOver({ activeState, children }: { activeState: boolean; children: ReactNode }) {
  const { sheetsRef } = useContext(Context);
  const { containerMargin } = useSelector((state: RootState) => state.ui);

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
