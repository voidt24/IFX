"use client";
import { useRef, useEffect, useContext, useState } from "react";
import Link from "next/link";
import { Context } from "@/context/Context";

export default function Navbar() {
  const navRef = useRef();
  const { currentMediaType, setCurrentMediaType, authModalActive, setAuthModalActive } = useContext(Context);
  const [errorMessage, setErrorMessage] = useState({ active: false, text: "" });

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.innerWidth >= 640) {
        if (window.scrollY > 0) {
          navRef.current.style.backgroundColor = "#0007";
          navRef.current.style.backdropFilter = "blur(8px)";
        } else {
          navRef.current.style.background = "none";
          navRef.current.style.backdropFilter = "none";
        }
      } else {
        navRef.current.style.backgroundColor = "#0007";
        navRef.current.style.backdropFilter = "blur(8px)";
      }
    });
  }, []);

  return (
    <nav className="nav z-30" ref={navRef}>
      <Link href="/search" id="search-btn" className="nav-item-box">
        <i className="bi bi-search"></i>
        <p className="to-hide-on-desk">search</p>
      </Link>

      <ul className={` links`}>
        <li>
          <Link
            className="nav-item-box"
            href="/movies"
            onClick={() => {
              setCurrentMediaType("movies");
            }}
          >
            <i className={` ${currentMediaType == "movies" && "text-[#e5b334]"} bi bi-camera-reels to-hide-on-desk`}></i>
            <p className={`${currentMediaType == "movies" && "text-[#e5b334]"} `}>Movies</p>
          </Link>
        </li>
        <li>
          <Link
            className="nav-item-box"
            href="/tvshows"
            onClick={() => {
              setCurrentMediaType("tvshows");
            }}
          >
            <i className={` ${currentMediaType == "tvshows" && "text-[#e5b334]"} bi bi-tv to-hide-on-desk`}></i>
            <p className={`${currentMediaType == "tvshows" && "text-[#e5b334]"} `}>TV Shows</p>
          </Link>
        </li>
      </ul>
      <span
        className="nav-item-box"
        onClick={() => {
          localStorage.setItem("auth", JSON.stringify("auth clicked"));
          setAuthModalActive(!authModalActive);
          if (errorMessage.active) {
            setErrorMessage({ active: false, text: "" });
          }
        }}
      >
        <i className="bi bi-person-circle" id="user"></i>
        <p className="to-hide-on-desk">Me</p>
      </span>
    </nav>
  );
}
