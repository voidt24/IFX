import { Context } from "@/context/Context";
import { Dispatch, ReactNode, SetStateAction, useContext } from "react";
import { RemoveScroll } from "react-remove-scroll";

type NavbarActions = {
  name: string;
  href: string;
  icon: React.JSX.Element;
  actionFunction: () => void | null;
};

export default function SlideOver({ activeState, setActiveState, children }: { activeState: boolean; setActiveState: Dispatch<SetStateAction<boolean>>; children: ReactNode }) {
  const { containerMargin } = useContext(Context);
  return (
    <RemoveScroll>
      <div
        className={`overlay !fixed right-0 transition-all duration-400 z-[9999] overflow-hidden ${activeState ? "w-[100vw] opacity-100 pointer-events-auto" : "w-0 opacity-0 pointer-events-none"}`}
        style={{ marginTop: containerMargin ? `${containerMargin}px` : undefined }}
      >
        {children}
      </div>
    </RemoveScroll>
  );
}
