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
  profileData,
}: {
  activeState: boolean;
  setActiveState: Dispatch<SetStateAction<boolean>>;
  XPosition: string;
  navbarActions: NavbarActions[];
  profileData?: { displayName: string; email: string };
}) {
  return activeState ? (
    <div className={` border border-white/60 absolute ${XPosition}  ${profileData ? "h-[300px]" : "h-[200px]"} bottom-14 sm:top-14 bg-black user-options`}>
      {profileData && (
        <div className="flex  gap-2 items-start justify-center pb-4  border-b border-zinc-700">
          <span className="flex items-center justify-center h-full">
            <i className="bi bi-person-circle text-3xl cursor-default"></i>
          </span>
          <div className="flex flex-col gap-1 items-start justify-center ">
            <p className="!text-xl">{profileData.displayName}</p>
            <p className="text-zinc-400">{profileData.email}</p>
          </div>
        </div>
      )}

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
