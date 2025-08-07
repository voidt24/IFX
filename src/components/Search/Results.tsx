"use client";
import { useEffect, useRef } from "react";
import { useContext } from "react";
import { Context } from "@/context/Context";
import SliderCard from "../Slider/SliderCard";
import Loader from "../common/Loader";
import Pagination from "../common/Pagination";
import { IMediaData } from "@/Types/index";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setSearchStarted } from "@/store/slices/searchSlice";
import { useSearchParams } from "next/navigation";

export default function Results() {
  const { numberOfPages, isMobilePWA } = useContext(Context);

  const ref = useRef<HTMLDivElement>(null);

  const { searchResults, loadingSearch, searchStarted, searchQuery } = useSelector((state: RootState) => state.search);
  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const searchPage = searchParams.get("searchPage");

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
              Results for "{searchQuery}" page: {searchPage}
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
              {searchStarted && !loadingSearch && <div className="flex-row-center w-full">{numberOfPages > 1 && <Pagination queryName="searchPage" pageActive={Number(searchPage) || 1} numberOfPages={numberOfPages} />}</div>}
            </div>
          )}
        </>
      )}
    </div>
  );
}
