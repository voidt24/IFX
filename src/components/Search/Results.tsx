"use client";
import React, { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { Context } from "@/context/Context";
import SliderCard from "../SliderCard";
import Loader from "../common/Loader";
import Pagination from "../common/Pagination";
import { ISliderData } from "@/helpers/api.config";

export default function Results() {
  const { searchResults, loadingSearch, searchStarted, setSearchStarted, pageActive, setPageActive, numberOfPages, searchQuery, setNumberOfPages } = useContext(Context);
  const [startingPage, setStartingPage] = useState(1);

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
                  className="self-start text-center px-2 py-1 rounded-full text-[120%] hover:text-[var(--primary)]"
                  onClick={() => {
                    setSearchStarted(false);
                  }}
                  title="close"
                >
                  <i className="bi bi-x"></i>
                </button>

                {numberOfPages > 1 && <Pagination pageActive={pageActive} setPageActive={setPageActive} numberOfPages={numberOfPages} startingPage={startingPage} setStartingPage={setStartingPage} />}
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
              <div ref={ref} className="results w-full h-[500px] xl:h-[650px] overflow-auto relative z-30 pb-10 2xl:w-[85%] 4k:w-[80%]">
                {searchResults?.length && searchResults.length > 0 ? (
                  <>
                    {searchResults?.map((result: ISliderData) => {
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
