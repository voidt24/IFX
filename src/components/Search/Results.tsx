"use client";
import React, { useEffect, useRef } from "react";
import { useContext } from "react";
import { Context } from "@/context/Context";
import SliderCard from "../SliderCard";
import Loader from "../common/Loader";
import { Isearch } from "@/helpers/search";

export default function Results() {
  const { searchResults, loadingSearch, searchStarted, setSearchStarted, pageActive, setPageActive, numberOfPages, searchQuery, setNumberOfPages } = useContext(Context);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref) {
      ref?.current?.style.overflow == "auto";
    }
  }, []);

  return (
    <>
      {searchStarted && (
        <>
          <div className="bg-black/95 absolute top-0 left-0 w-full h-full z-50 mt-[90px] md:mt-[100px] pb-6"></div>

          <div className={`search-section rounded-lg flex flex-col pb-2 items-center overflow-auto absolute w-full gap-4 justify-center z-50 bg-zinc-900 `}>
            <div className=" sticky top-0 w-full z-50 bg-zinc-900 p-4">
              <div className="flex gap-2 mb-4 flex-col">
                <button
                  className="self-start text-center p1 rounded-full text-[120%] hover:text-[var(--primary)]"
                  onClick={() => {
                    setSearchStarted(false);
                  }}
                >
                  <i className="bi bi-x"></i>
                </button>

                {numberOfPages > 1 && (
                  <>
                    <nav className="flex items-center justify-center w-full">
                      <ul className="flex text-[70%] self-center bg-zinc-800 rounded-full">
                        <li>
                          <button
                            className="flex items-center justify-center max-md:px-3 px-4 h-8 ms-0  leading-tight text-gray-200  border  border-zinc-500 rounded-s-full hover:bg-gray-500 hover:text-white"
                            onClick={() => {
                              if (pageActive > 1) {
                                setPageActive(pageActive - 1);
                              }
                            }}
                          >
                            Prev
                          </button>
                        </li>

                        {Array.from({ length: numberOfPages }).map((_, index) => {
                          return (
                            <li key={index}>
                              <button
                                className={`flex items-center justify-center max-md:px-3 px-4 h-8 leading-tight  border border-zinc-500 ${
                                  Number(index + 1) === pageActive ? "bg-[goldenrod]  hover:bg-[goldenrod] text-white" : " hover:bg-gray-500  text-gray-300"
                                }`}
                                onClick={() => {
                                  setPageActive(Number(index + 1));
                                }}
                              >
                                {index + 1}
                              </button>
                            </li>
                          );
                        })}

                        <li>
                          <button
                            className="flex items-center justify-center max-md:px-3 px-4 h-8 leading-tight text-gray-200  border border-zinc-500 rounded-e-full hover:bg-gray-500 hover:text-white"
                            onClick={() => {
                              if (pageActive < 5) {
                                setPageActive(pageActive + 1);
                              }
                            }}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </>
                )}
              </div>

              {numberOfPages > 1 && (
                <p className=" md:text-xl self-start ">
                  Results for "{searchQuery}" page: {pageActive}
                </p>
              )}
            </div>

            {loadingSearch ? (
              <Loader />
            ) : (
              <div ref={ref} className="results w-full h-[500px] xl:h-[650px] overflow-auto relative z-30 pb-10 ">
                {searchResults?.length && searchResults.length > 0 ? (
                  <>
                    {searchResults?.map((result: Isearch) => {
                      return <SliderCard result={result} changeMediaType={result.media_type} key={result.id} />;
                    })}
                  </>
                ) : (
                  searchStarted && <p className="col-span-full">no results</p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
