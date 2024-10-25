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
          navRef.current.style.backgroundColor = "#000";
        } else {
          navRef.current.style.background = "none";
        }
      }
    });
  }, []);

  return (
    <nav className="nav z-30 " ref={navRef}>
      <Link href="/search" id="search-btn" className="nav-item-box">
        <i className="bi bi-search max-sm:text-[125%]"></i>
        <p className="to-hide-on-desk max-sm:text-[65%]">search</p>
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
            <i className={` ${currentMediaType == "movies" && "text-[var(--primary)]"} bi bi-camera-reels to-hide-on-desk max-sm:text-[125%]`}></i>
            <p className={`${currentMediaType == "movies" && "text-[var(--primary)]"}  max-sm:text-[65%]`}>Movies</p>
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
            <i className={` ${currentMediaType == "tvshows" && "text-[var(--primary)]"} bi bi-tv to-hide-on-desk max-sm:text-[125%]`}></i>
            <p className={`${currentMediaType == "tvshows" && "text-[var(--primary)]"}  max-sm:text-[65%]`}>TV Shows</p>
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
        <i className="bi bi-person-circle max-sm:text-[125%]" id="user"></i>
        <p className="to-hide-on-desk max-sm:text-[65%]">Me</p>
      </span>
    </nav>
  );
}
