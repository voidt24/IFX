"use client";
import { useEffect, RefObject } from "react";
import Headroom from "react-headroom";
import NavItems from "./NavItems";
import NavDrawers from "./NavDrawers";
import { setContainerMargin, setUserMenuActive } from "@/store/slices/UISlice";
import { useDispatch, useSelector } from "react-redux";
import MenuDropdown from "../common/MenuDropDown";
import { RootState } from "@/store";

export const menuActions = [
  {
    name: "Home",
    href: "/",
    icon: <i className="bi bi-house nav-mobile-icon"></i>,
    actionFunction: null,
  },
  {
    name: "TV Shows",
    href: "/tvshows",
    icon: <i className="bi bi-aspect-ratio nav-mobile-icon"></i>,
    actionFunction: null,
  },
  {
    name: "Movies",
    href: "/movies",
    icon: <i className="bi bi-camera-video nav-mobile-icon"></i>,
    actionFunction: null,
  },
];
export default function TopNavbar({ navRef }: { navRef: RefObject<HTMLDivElement> }) {
  const dispatch = useDispatch();
  const { userMenuActive } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    if (!navRef) return;

    const height = navRef.current?.offsetHeight || 0;
    dispatch(setContainerMargin(height));
  }, [navRef]);

  return (
    <>
      <div className=" fixed top-0 w-full max-lg:z-[99] z-[999]" ref={navRef}>
        <Headroom className="transition-all duration-500">
          <nav className="nav ">
            <NavItems />
          </nav>
          <>
            {userMenuActive && (
              <div className="relative xs:top-[0.5px] max-xs:h-[100vh] w-full xs:w-[300px]  ms-auto mr-3">
                <MenuDropdown
                  activeState={userMenuActive}
                  setActiveState={(val) => {
                    dispatch(setUserMenuActive(val));
                  }}
                  XPosition=""
                />
              </div>
            )}
          </>
        </Headroom>
      </div>
      <NavDrawers />
    </>
  );
}
