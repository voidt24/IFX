"use client";
import { useEffect } from "react";
import Results from "./Results";
import SearchBar from "./SearchBar";
import { APP_NAME } from "@/helpers/api.config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setLoadingSearch, setRecentlySearched, setSearchQuery, setSearchResults, setSearchStarted } from "@/store/slices/searchSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { search } from "@/helpers/search";
import { setNumberOfPages, setPageActive } from "@/store/slices/paginationSlice";
export default function Search() {
  const { recentlySearched, searchStarted } = useSelector((state: RootState) => state.search);
  const dispatch = useDispatch();

  const searchParams = useSearchParams();

  const searchPage = searchParams.get("searchPage");
  const params = new URLSearchParams(searchParams.toString());

  const router = useRouter();

  // TO-DO: create helper and separate ui states from logic
  function handleSearch(value: string) {
    if (value.trim().length === 0) {
      return;
    }
    dispatch(setSearchStarted(true));
    dispatch(setSearchResults(null));
    dispatch(setLoadingSearch(true));

    search(value, Number(searchPage || 1)).then((data) => {
      if (data.page === Number(searchPage)) {
        dispatch(setSearchResults(data.results));
      }
      dispatch(setLoadingSearch(false));

      dispatch(setNumberOfPages(data.total_pages >= 5 ? 5 : data.total_pages));
    });
  }

  useEffect(() => {
    //TO-DO: create a hook
    function syncRecentlySearched() {
      const LSrecentlySearched = localStorage.getItem(`${APP_NAME}-recentlySearched`);
      const parsedData = JSON.parse(LSrecentlySearched || "[]");
      dispatch(setRecentlySearched([...parsedData].reverse()));
    }

    syncRecentlySearched();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === `${APP_NAME}-recentlySearched`) {
        syncRecentlySearched();
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <>
      <div className={`w-full search-section h-[100%] rounded-lg flex flex-col items-center m-auto gap-6 justify-start`}>
        <div className="w-[85%] md:w-[55%] 2xl:w-[35%] mx-auto ">
          <SearchBar />

          {recentlySearched && recentlySearched.length > 0 && !searchStarted && (
            <div className="overflow-y-auto">
              <div className="flex gap-2 justify-between text-content-third mt-6 mb-4">
                <p className="">Recent searches</p>
                <button
                  className="hover:text-content-primary"
                  onClick={() => {
                    localStorage.removeItem(`${APP_NAME}-recentlySearched`);
                    dispatch(setRecentlySearched([]));
                  }}
                >
                  Clear
                </button>
              </div>
              {recentlySearched.map((search, index) => {
                return (
                  <div
                    className="flex hover:bg-zinc-800 p-2 rounded-lg cursor-pointer"
                    key={index}
                    onClick={() => {
                      params.set("searchPage", `1`);
                      router.push(`?${params.toString()}`);
                      dispatch(setPageActive(1));
                      dispatch(setSearchQuery(search));
                      handleSearch(search);
                    }}
                  >
                    <button className="mr-2 text-content-third" title=".">
                      <i className="bi bi-search"></i>
                    </button>

                    <button>{search}</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <Results />
      </div>
    </>
  );
}
