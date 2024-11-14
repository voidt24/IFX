"use client";
import { useRef, useEffect, useContext, useState } from "react";
import Link from "next/link";
import { Context } from "@/context/Context";

export default function Navbar() {
  const navRef = useRef();
  const { authModalActive, setAuthModalActive } = useContext(Context);
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
    <nav className="nav z-[999] " ref={navRef}>
      <ul className={` links`}>
        <li>
          <Link
            className="nav-item-box"
            href="/"
          >
            <i className={`  bi bi-house-fill `}></i>
            <p className={`  max-sm:text-[65%]`}>Home</p>
          </Link>
        </li>
        <li>
          <Link
            href=""
            className="nav-item-box"
            onClick={() => {
              setAuthModalActive(!authModalActive);

              if (errorMessage.active) {
                setErrorMessage({ active: false, text: "" });
              }
            }}
          >
            <i className="bi bi-person-circle " id="user"></i>
            <p className=" max-sm:text-[65%]">Profile</p>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
