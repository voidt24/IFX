import { Context } from "@/context/Context";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { menuActions } from "./TopNavbar";
import { usePathname } from "next/navigation";
import { auth } from "@/firebase/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

function NavItems() {
  const { authModalActive, setAuthModalActive, setNoAccount, showSearchBar, setShowSearchBar, userMenuActive, setUserMenuActive, isMobilePWA, setOpenSearchDrawer, setOpenUserDrawer } =
    useContext(Context);

  const [loadingAuth, setLoadingAuth] = useState({ state: "unknown" });
  const pathname = usePathname();
  const authState = useSelector((state: RootState) => state.auth);
  const { firebaseActiveUser } = authState;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoadingAuth({ state: "on" });
      } else {
        setLoadingAuth({ state: "off" });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <div className={`links relative flex-row-between gap-2 w-full `}>
      <ul className="">
        <li id="logo" className="">
          <Link href="/">
            <img src="/logo.png" className="w-[3.5rem]" alt="" />
          </Link>
        </li>
      </ul>
      <ul className="max-sm:hidden flex  gap-8 items-center justify-center font-medium">
        {menuActions.map((element, index) => {
          return (
            <li className="" key={index}>
              <Link
                className={`${
                  pathname == element.href || (element.href != "/" && pathname.includes(element.href.split("").slice(1).join("")))
                    ? "text-brand-primary font-semibold"
                    : "text-content-secondary hover:text-brand-light hover:font-semibold"
                } nav-item-box max-sm:text-[80%]   border-b border-transparent transition-all duration-200`}
                key={index}
                href={element.href}
              >
                {element.icon}
                {element.name}
              </Link>
            </li>
          );
        })}
      </ul>

      <ul className="flex gap-2 items-center justify-center">
        <li>
          <button
            className="w-[2rem] h-[2rem] sm:hover:bg-gray-800 rounded-full"
            id="main-search-btn"
            onClick={() => {
              if (isMobilePWA) {
                setOpenSearchDrawer(true);
              } else {
                if (userMenuActive) setUserMenuActive(false);
                setShowSearchBar(!showSearchBar);
              }
            }}
            title="search-button"
          >
            <i className={`bi ${!showSearchBar ? "bi-search" : "bi-x-lg"}  text-lg`}></i>
          </button>
        </li>
        <li className="">
          {loadingAuth.state === "unknown" ? (
            <div className="py-2 px-4 bg-zinc-800 rounded-full animate-pulse"></div>
          ) : loadingAuth.state === "off" ? (
            <button
              className=" btn-primary px-2.5 py-1 shadow-none "
              onClick={() => {
                setNoAccount(false);
                setAuthModalActive(!authModalActive);
              }}
            >
              <p className="font-semibold">Log in</p>
            </button>
          ) : (
            <button
              className={`w-[2rem] h-[2rem] rounded-full font-semibold  ${userMenuActive ? "bg-brand-primary/80" : "bg-gray-800"} lg:hover:bg-brand-primary/80`}
              onClick={() => {
                if (isMobilePWA) {
                  setOpenUserDrawer(true);
                } else {
                  if (showSearchBar) setShowSearchBar(false);
                  setUserMenuActive(!userMenuActive);
                }
              }}
              title="user-option"
            >
              <span className="text-xl">{auth.currentUser?.displayName?.slice(0, 1).toUpperCase() || firebaseActiveUser?.email?.slice(0, 1).toUpperCase()}</span>
            </button>
          )}
        </li>
      </ul>
    </div>
  );
}

export default NavItems;
