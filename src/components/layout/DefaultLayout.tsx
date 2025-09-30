"use client";
import { useRef } from "react";
import TopNavbar from "@/components/Navbar/TopNavbar";
import BottomNavbar from "../Navbar/BottomNavbar";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const navRef = useRef<HTMLDivElement>(null);
  return (
    <div className={`default-layout-container mx-auto relative max-w-full min-h-screen max-sm:pb-[60px] [text-shadow: 2px_2px_5px_#d9960f]`}>
      <TopNavbar navRef={navRef} />
      <BottomNavbar />
      {children}
    </div>
  );
}
