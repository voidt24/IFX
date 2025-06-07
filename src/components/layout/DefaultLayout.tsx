"use client";
import React, { RefObject, useRef } from "react";
import Navbar from "@/components/Navbar/TopNavbar";
import TopNavbar from "../Navbar/BottomNavbar";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const navRef = useRef<HTMLDivElement>(null);
  return (
    <div className={`default-layout-container mx-auto relative max-w-full min-h-screen max-sm:pb-[60px] [text-shadow: 2px_2px_5px_#d9960f]`}>
      <TopNavbar />
      <Navbar navRef={navRef} />
      {children}
    </div>
  );
}
