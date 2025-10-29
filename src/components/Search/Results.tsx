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
  const { isMobilePWA } = useContext(Context);

  const ref = useRef<HTMLDivElement>(null);

  const { searchResults, loadingSearch, searchStarted, searchQuery } = useSelector((state: RootState) => state.search);
  const { numberOfPages } = useSelector((state: RootState) => state.pagination);

  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const searchPage = searchParams.get("searchPage");

  useEffect(() => {
    return () => {
      dispatch(setSearchStarted(false));
    };
  }, []);

  if (searchResults == null) {
    return searchStarted && <Loader />;
  }

  return (
    <div className={`h-full w-full ${!isMobilePWA ? "overflow-auto" : ""} flex flex-col gap-4 pb-8 rounded-lg relative ${searchStarted && !loadingSearch && "bg-black/60"}`}>
      {searchStarted && (
        <>
          <div className="md:text-xl flex justify-between items-center text-center sticky top-0 z-50 bg-black/70 p-2">
            <p className="w-full">
              Results for
              <span> "{searchQuery}" </span>
              page: {searchPage}
            </p>
            <button
              className="w-auto text-right px-4 py-1"
              onClick={() => {
                dispatch(setSearchStarted(false));
              }}
            >
              x
            </button>
          </div>

          <div ref={ref} className="flex flex-col gap-4 h-!full w-!full z-30">
            {searchResults.length > 0 ? (
              <>
                <MediaGrid mediaData={searchResults} />
              </>
            ) : (
              <>
                <p className="text-center mt-4 text-content-third text-lg">No media found, try searching again.</p>
              </>
            )}
          </div>
          <div className="flex-row-center w-full">{<Pagination queryName="searchPage" pageActive={Number(searchPage) || 1} numberOfPages={numberOfPages} />}</div>
        </>
      )}
    </div>
  );
}
