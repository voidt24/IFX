"use client";
import { useRef, useEffect, useContext, useState } from "react";
import Link from "next/link";
import { Context } from "@/context/Context";
import MenuDropdown from "./common/MenuDropDown";
import { auth, ID_TOKEN_COOKIE_NAME } from "@/firebase/firebase.config";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const navRef = useRef();
  const router = useRouter();

  const { setLoadingScreen, setUserLogged, authModalActive, setAuthModalActive, setFirebaseActiveUser, setNoAccount } = useContext(Context);
  const [errorMessage, setErrorMessage] = useState({ active: false, text: "" });
  const [menuActive, setMenuActive] = useState(false);
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState({ state: "unknown" });

  const profileData = {
    displayName: auth.currentUser?.displayName,
    email: auth.currentUser?.email,
  };
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.innerWidth >= 640) {
        if (window.scrollY > 0) {
          navRef.current.style.backgroundColor = "#000";
        } else {
          navRef.current.style.background = "none";
        }
      }
    });
  }, []);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoadingAuth({ state: "on" });
      } else {
        setLoadingAuth({ state: "off" });
      }
    });

    return () => unsubscribe();
  }, []);
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
  const menuActions = [
    {
      name: "Home",
      href: "/",
      icon: <i className="bi bi-house"></i>,
      actionFunction: null,
    },
    {
      name: "TV Shows",
      href: "/tvshows",
      icon: <i className="bi bi-tv"></i>,
      actionFunction: null,
    },
    {
      name: "Movies",
      href: "/movies",
      icon: <i className="bi bi-film"></i>,
      actionFunction: null,
    },
  ];
  const userActions = [
    {
      name: "Profile",
      href: "/profile",
      icon: <i className="bi bi-person-fill"></i>,
      actionFunction: setAuthModalActive,
    },
    {
      name: "My Lists",
      href: "/lists",
      icon: <i className="bi bi-list-check"></i>,
      actionFunction: setAuthModalActive,
    },
    {
      name: "History",
      href: "/history",
      icon: <i className="bi bi-clock-history"></i>,
      actionFunction: setAuthModalActive,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <i className="bi bi-gear"></i>,
      actionFunction: setAuthModalActive,
    },
    {
      name: "Log out",
      href: "",
      icon: <i className="bi bi-box-arrow-left"></i>,
      actionFunction: handleLogout,
    },
  ];

  return (
    <nav className="nav z-[999] " ref={navRef}>
      <ul className={`links relative`}>
        <li>
          <button
            className="nav-item-box sm:px-1.5 sm:py-1 sm:hover:bg-zinc-900 sm:rounded-full"
            onClick={() => {
              setMenuActive(!menuActive);
              setUserMenuActive(false);

              if (errorMessage.active) {
                setErrorMessage({ active: false, text: "" });
              }
            }}
          >
            <i className="bi bi-list max-sm:text-[137%] text-xl 2xl:text-2xl"></i>
          </button>
        </li>
        <MenuDropdown activeState={menuActive} setActiveState={setMenuActive} XPosition={"left-0"} navbarActions={menuActions} />

        <li id="logo">
          <Link href="/" className="nav-item-box ">
            <img src="/logo.png" className="w-[5rem] sm:w-[7.5rem] rounded-sm " alt="" />
          </Link>
        </li>
        <li>
          {loadingAuth.state === "unknown" ? (
            <div className="py-2 px-4 bg-zinc-800 rounded-full animate-pulse"></div>
          ) : loadingAuth.state === "off" ? (
            <button
              className="nav-item-box px-3.5 py-1 bg-zinc-900 sm:hover:bg-zinc-800 border border-zinc-600 rounded-full"
              onClick={() => {
                setNoAccount(false);
                setAuthModalActive(!authModalActive);
              }}
            >
              <p className=" max-sm:text-[80%] ">Log in</p>
            </button>
          ) : (
            <button
              className="nav-item-box sm:px-1.5 sm:py-1 sm:hover:bg-zinc-900 sm:rounded-full"
              onClick={() => {
                setUserMenuActive(!userMenuActive);
                setMenuActive(false);

                if (errorMessage.active) {
                  setErrorMessage({ active: false, text: "" });
                }
              }}
            >
              <i className="bi bi-person-circle max-sm:text-[127%] text-xl 2xl:text-2xl" id="user"></i>
            </button>
          )}
        </li>
        <MenuDropdown activeState={userMenuActive} setActiveState={setUserMenuActive} XPosition={"right-0"} navbarActions={userActions} profileData={profileData} />
      </ul>
    </nav>
  );
}
