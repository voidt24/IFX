import { Dispatch, SetStateAction } from "react";
import Link from "next/link";

type NavbarActions = {
  name: string;
  href: string;
  icon: React.JSX.Element;
  actionFunction: () => void | null;
};

export default function MenuDropdown({
  activeState,
  setActiveState,
  XPosition,
  navbarActions,
}: {
  activeState: boolean;
  setActiveState: Dispatch<SetStateAction<boolean>>;
  XPosition: string;
  navbarActions: NavbarActions[];
}) {
  return activeState ? (
    <div className={` border border-white/60 absolute ${XPosition} h-[200px] bottom-14 sm:top-14 bg-black user-options`}>
      {navbarActions.map((element, index) => {
        return (
          <Link
            key={index}
            href={element.href}
            className={`flex items-center ${XPosition == "left-0" ? "justify-start" : "justify-end"}  gap-2 ${element.name == "Log out" ? "!text-gray-300" : "text-white"}`}
            onClick={() => {
              setActiveState(false);
              if (element.actionFunction) {
                element.actionFunction();
              }
            }}
          >
            {element.icon}
            {element.name}
          </Link>
        );
      })}
    </div>
  ) : null;
}
