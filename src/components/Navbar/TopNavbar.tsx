"use client";
import { useEffect, RefObject } from "react";
import Headroom from "react-headroom";
import NavItems from "./NavItems";
import NavDrawers from "./NavDrawers";
import { setContainerMargin } from "@/store/slices/UISlice";
import { useDispatch } from "react-redux";

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
        </Headroom>
      </div>
      <NavDrawers />
    </>
  );
}
