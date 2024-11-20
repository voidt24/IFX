"use client";
import React, { useContext } from "react";
import SearchBar from "@/components/Search";
import Results from "@/components/Search/Results";
import { Context } from "@/context/Context";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const { setAuthModalActive, authModalActive, firebaseActiveUser } = useContext(Context);
  return (
    <div className="pb-20 mx-auto md:w-[90%] xl:w-[80%] 4k:w-[60%] max-w-full px-2">
      <div className=" flex flex-col gap-6 relative mt-24 sm:mt-40 z-50">
        <div className=" bg-black w-full fixed z-50 py-4 top-0 sm:top-[67px]  left-0">
          <div className="w-[85%] md:w-[55%] 2xl:w-[35%] mx-auto ">
            <SearchBar />
          </div>
        </div>
        <Results />
        {children}

        {!firebaseActiveUser?.uid ? (
          <div className="mt-10 md:mt-16 w-full md:w-[90%] py-6 md:py-10  mx-auto relative isolate overflow-hidden bg-gray-900 px-6 shadow-2xl rounded-3xl   lg:flex  lg:px-20 ">
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
              aria-hidden="true"
            >
              <circle cx="512" cy="512" r="512" fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#7775D6" />
                  <stop offset="1" stopColor="#E935C1" />
                </radialGradient>
              </defs>
            </svg>
            <div className="mx-auto lg:text-left flex items-center justify-center w-full">
              <div className=" flex flex-col items-start justify-start lg:justify-start lg:w-[60%]">
                <h2 className="text-xl  xl:text-3xl font-semibold tracking-tight text-white ">Save what you like.</h2>
                <p className="mt-6 text-pretty text-[75%] md:text-sm text-gray-300 md:max-w-[70%]">Sign up to save movies and tv shows to favorites, watchlists and any other custom list.</p>

                <button
                  className="mt-6 px-4 py-2.5 text-[75%] md:text-sm font-semibold btn-primary"
                  onClick={() => {
                    setAuthModalActive(true);
                  }}
                >
                  Sign up
                </button>
              </div>
              <div className="flex flex-col gap-6 lg:flex-row md:gap-2">
                <img src="https://em-content.zobj.net/source/apple/391/clapper-board_1f3ac.png" alt="" className="-rotate-6" />
                <img src="https://em-content.zobj.net/source/apple/391/popcorn_1f37f.png" alt="" className="-rotate-6" />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
