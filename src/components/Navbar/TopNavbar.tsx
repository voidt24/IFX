"use client";
import { useEffect, useContext, useState, RefObject, Dispatch, SetStateAction } from "react";
import Headroom from "react-headroom";
import Link from "next/link";
import { Context } from "@/context/Context";
import { auth, ID_TOKEN_COOKIE_NAME } from "@/firebase/firebase.config";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import SearchSlideOver from "../common/SearchSlideOver";
import SlideOver from "../common/SlideOver";
import useIsMobile from "@/Hooks/useIsMobile";

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
export default function Navbar({ navRef }: { navRef: RefObject<HTMLDivElement> }) {
  const router = useRouter();

  const {
    setLoadingScreen,
    setUserLogged,
    authModalActive,
    setAuthModalActive,
    firebaseActiveUser,
    setFirebaseActiveUser,
    setNoAccount,
    showSearchBar,
    setShowSearchBar,
    userMenuActive,
    setUserMenuActive,
    setContainerMargin,
  } = useContext(Context);
  const [menuActive, setMenuActive] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [loadingAuth, setLoadingAuth] = useState({ state: "unknown" });
  const pathname = usePathname();

  const isMobile = useIsMobile(640);
  const profileData = {
    displayName: auth.currentUser?.displayName,
    email: auth.currentUser?.email,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoadingAuth({ state: "on" });
      } else {
        setLoadingAuth({ state: "off" });
      }
    });

    function onResize() {
      if (!window) return;

      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", onResize);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (!navRef) return;

    const height = navRef.current?.offsetHeight;
    setContainerMargin(height);
  }, [navRef]);

  const handleLogout = async () => {
    auth.signOut().then(() => {
      setUserLogged(false);
      setFirebaseActiveUser({ email: null, uid: null });
      setUserMenuActive(false);
      document.cookie = `${ID_TOKEN_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      setLoadingScreen(true);

      setTimeout(() => {
        setLoadingScreen(false);
      }, 1000);
      router.push("/");
    });
  };

  const userActions = [
    {
      name: "Profile",
      href: "/profile",
      icon: <i className="bi bi-person-fill"></i>,
      actionFunction: null,
    },
    {
      name: "My Lists",
      href: "/lists",
      icon: <i className="bi bi-list-check"></i>,
      actionFunction: null,
    },
    {
      name: "History",
      href: "/history",
      icon: <i className="bi bi-clock-history"></i>,
      actionFunction: null,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <i className="bi bi-gear"></i>,
      actionFunction: null,
    },
    {
      name: "Log out",
      href: "",
      icon: <i className="bi bi-box-arrow-left"></i>,
      actionFunction: handleLogout,
    },
  ];

  return (
    <>
      {isMobile ? (
        <div className=" fixed top-0 w-full max-lg:z-[99] z-[999]" ref={navRef}>
          <Headroom className="transition-all duration-500">
            <nav className="nav ">
              <div className={`links relative flex-row-between gap-2 w-full `}>
                <ul className="">
                  <li id="logo" className="">
                    <Link
                      href="/"
                      onClick={() => {
                        if (showSearchBar) setShowSearchBar(false);
                        if (userMenuActive) setUserMenuActive(false);
                      }}
                    >
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
                          onClick={() => {
                            if (showSearchBar) setShowSearchBar(false);
                            if (userMenuActive) setUserMenuActive(false);
                          }}
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
                        if (userMenuActive) setUserMenuActive(false);
                        setShowSearchBar(!showSearchBar);
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
                          if (showSearchBar) setShowSearchBar(false);

                          setUserMenuActive(!userMenuActive);
                          setMenuActive(false);
                        }}
                        title="user-option"
                      >
                        <span className="text-xl">{auth.currentUser?.displayName?.slice(0, 1).toUpperCase() || firebaseActiveUser?.email?.slice(0, 1).toUpperCase()}</span>
                      </button>
                    )}
                  </li>
                </ul>
              </div>
            </nav>
          </Headroom>
        </div>
      ) : (
        <nav className="nav fixed top-0 " ref={navRef}>
          <div className={`links relative flex-row-between gap-2 w-full `}>
            <ul className="">
              <li id="logo" className="">
                <Link
                  href="/"
                  onClick={() => {
                    if (showSearchBar) setShowSearchBar(false);
                    if (userMenuActive) setUserMenuActive(false);
                  }}
                >
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
                      } nav-item-box  border-b border-transparent transition-all duration-200`}
                      key={index}
                      href={element.href}
                      onClick={() => {
                        if (showSearchBar) setShowSearchBar(false);
                        if (userMenuActive) setUserMenuActive(false);
                      }}
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
                    if (userMenuActive) setUserMenuActive(false);
                    setShowSearchBar(!showSearchBar);
                  }}
                  title="search-button"
                >
                  <i className={`bi ${!showSearchBar ? "bi-search" : "bi-x-lg"}  text-lg`}></i>
                </button>
              </li>
              <li className="">
                {loadingAuth.state === "unknown" ? (
                  <div className="py-2 px-4 bg-gray-800 rounded-full animate-pulse"></div>
                ) : loadingAuth.state === "off" ? (
                  <button
                    className=" btn-primary px-2.5 py-1 shadow-none "
                    onClick={() => {
                      setNoAccount(false);
                      setAuthModalActive(!authModalActive);
                    }}
                  >
                    <p className="max-sm:text-[80%] font-semibold">Log in</p>
                  </button>
                ) : (
                  <button
                    className={`w-[2rem] h-[2rem] rounded-full  font-semibold ${userMenuActive ? "bg-brand-primary/80" : "bg-gray-800"} lg:hover:bg-brand-primary/80`}
                    onClick={() => {
                      if (showSearchBar) setShowSearchBar(false);

                      setUserMenuActive(!userMenuActive);
                      setMenuActive(false);
                    }}
                    title="user-option"
                  >
                    <span className="text-xl">{auth.currentUser?.displayName?.slice(0, 1).toUpperCase() || firebaseActiveUser?.email?.slice(0, 1).toUpperCase()}</span>
                  </button>
                )}
              </li>
            </ul>
          </div>
        </nav>
      )}
      {userMenuActive && (
        <SlideOver activeState={userMenuActive} setActiveState={setUserMenuActive}>
          <div className={`wrapper`}>
            <div className={`flex flex-col items-start justify-start w-full sm:h-full gap-6`}>
              {profileData && (
                <div className="flex gap-2 items-start justify-center pb-4  border-b border-zinc-700 ">
                  <div className="flex flex-col gap-1 items-start justify-center ">
                    <h1 className="text-3xl font-semibold">Hi, {profileData.displayName}</h1>
                    <p className="text-zinc-400">{profileData.email}</p>
                  </div>
                </div>
              )}

              {userActions.map((element, index) => {
                return (
                  <Link
                    key={index}
                    href={element.href}
                    className={`flex items-center ml-4 gap-4 hover:text-[var(--primary)] hover:translate-x-1 transition-all duration-200 ${
                      element.name == "Log out" ? "!text-red-500 mt-2" : "text-white"
                    }`}
                    onClick={async () => {
                      if (showSearchBar) setShowSearchBar(false);
                      if (userMenuActive) setUserMenuActive(false);
                      if (element.actionFunction) await element.actionFunction();
                    }}
                  >
                    {element.icon}
                    {element.name} {element.name != "Log out" && ">"}
                  </Link>
                );
              })}
            </div>
          </div>
        </SlideOver>
      )}
      {showSearchBar && <SearchSlideOver />}
    </>
  );
}
