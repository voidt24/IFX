"use client";
import { useRef, useEffect, useContext, useState } from "react";
import Link from "next/link";
import { Context } from "@/context/Context";

export default function Navbar() {
  const navRef = useRef();
  const { setCurrentMediaType, userClicked, setUserClicked } = useContext(Context);
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
    <nav className="nav" ref={navRef}>
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
            <i className="bi bi-camera-reels to-hide-on-desk"></i>
            <p>Movies</p>
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
            <i className="bi bi-tv to-hide-on-desk"></i>
            <p>TV Shows</p>
          </Link>
        </li>
      </ul>
      <span
        className="nav-item-box"
        onClick={() => {
          localStorage.setItem("auth", JSON.stringify("auth clicked"));
          setUserClicked(!userClicked);
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
