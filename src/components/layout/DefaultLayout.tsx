"use client";
import React from "react";
import SearchBar from "@/components/Search";
import Results from "@/components/Search/Results";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-20 mx-auto md:w-[90%] xl:w-[80%] 4k:w-[60%] max-w-full px-2">
      <div className=" flex flex-col gap-6 relative mt-24 sm:mt-40 z-50">
        <div className=" bg-black w-full fixed z-50 py-4 top-0 sm:top-[54px]  left-0">
          <div className="w-[85%] md:w-[55%] 2xl:w-[35%] mx-auto ">
            <SearchBar />
          </div>
        </div>
        <Results />
        {children}
      </div>
    </div>
  );
}
