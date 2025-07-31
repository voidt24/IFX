"use client";
import React, { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { Context } from "@/context/Context";
import SliderCard from "../Slider/SliderCard";
import Loader from "../common/Loader";
import Pagination from "../common/Pagination";
import { IMediaData } from "@/Types/index";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setSearchStarted } from "@/store/slices/searchSlice";

export default function Results() {
  const { pageActive, setPageActive, numberOfPages, setNumberOfPages, isMobilePWA } = useContext(Context);

  const [startingPage, setStartingPage] = useState(1);

  const ref = useRef<HTMLDivElement>(null);

  const { searchResults, loadingSearch, searchStarted, searchQuery } = useSelector((state: RootState) => state.search);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setSearchStarted(false));
    };
  }, []);

  return (
    <div className={`h-full w-full ${!isMobilePWA ? "overflow-auto" : ""} flex flex-col gap-4 pb-8 rounded-lg relative ${searchStarted && !loadingSearch && "bg-black/60"}`}>
      {searchStarted && (
        <>
          {numberOfPages > 1 && (
            <p className=" md:text-xl text-center sticky top-0 z-50 bg-black/70 p-2">
              Results for "{searchQuery}" page: {pageActive}
            </p>
          )}
          {loadingSearch ? (
            <Loader />
          ) : (
            <div ref={ref} className="flex flex-col gap-4 h-!full w-!full z-30">
              <div className="media-lists h-full">
                {searchResults?.length && searchResults.length > 0
                  ? searchResults?.map((result: IMediaData) => {
                      return <SliderCard key={result.id} result={result} canBeEdited={true} mediaType={result.media_type} />;
                    })
                  : searchStarted && <p className="col-span-full mt-4">no results</p>}
              </div>
              {searchStarted && !loadingSearch && (
                <div className="w-full ">
                  <div className="flex gap-2  flex-col">
                    {numberOfPages > 1 && (
                      <Pagination pageActive={pageActive} setPageActive={setPageActive} numberOfPages={numberOfPages} startingPage={startingPage} setStartingPage={setStartingPage} />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
