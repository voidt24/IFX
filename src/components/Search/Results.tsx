"use client";
import { useEffect, useRef } from "react";
import { useContext } from "react";
import { Context } from "@/context/Context";
import Loader from "../common/Loader";
import Pagination from "../common/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setSearchStarted } from "@/store/slices/searchSlice";
import { useSearchParams } from "next/navigation";
import MediaGrid from "../MediaGrid/MediaGrid";

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
              {searchResults?.length && searchResults.length > 0 ? (
                <MediaGrid mediaData={searchResults} />
              ) : (
                searchStarted && searchResults && searchResults.length < 0 && <p className="text-center mt-4">no results</p>
              )}
              {searchStarted && !loadingSearch && (
                <div className="flex-row-center w-full">{numberOfPages > 1 && <Pagination queryName="searchPage" pageActive={Number(searchPage) || 1} numberOfPages={numberOfPages} />}</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
