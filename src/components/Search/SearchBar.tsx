"use client";
import { useEffect, useState } from "react";
import { search } from "../../helpers/search";
import Input from "../common/Input";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setLoadingSearch, setRecentlySearched, setSearchQuery, setSearchResults, setSearchStarted } from "@/store/slices/searchSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { setPageActive, setNumberOfPages } from "@/store/slices/paginationSlice";
import { APP_NAME } from "@/helpers/api.config";

export default function SearchBar() {
  const [inputValue, setInputValue] = useState("");
  const { searchStarted, searchQuery } = useSelector((state: RootState) => state.search);
  const dispatch = useDispatch();

  const router = useRouter();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const searchPage = searchParams.get("searchPage");

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

      if (data.results.length > 0) {
        const LSrecentlySearched = localStorage.getItem(`${APP_NAME}-recentlySearched`);
        const parsedData = JSON.parse(LSrecentlySearched || "[]");

        if (parsedData.length > 0) {
          let newData: string[];

          if (!parsedData.includes(value)) {
            if (parsedData.length > 9) {
              newData = [...parsedData.slice(1), value];
            } else {
              newData = [...parsedData, value];
            }

            localStorage.setItem(`${APP_NAME}-recentlySearched`, JSON.stringify(newData));
            dispatch(setRecentlySearched([...newData].reverse()));
          }
          return;
        }
        localStorage.setItem(`${APP_NAME}-recentlySearched`, JSON.stringify([value]));
        dispatch(setRecentlySearched([value]));
      }
    });
  }

  useEffect(() => {
    return () => {
      params.delete("searchPage");
      router.push(`?${params.toString()}`, { scroll: false });
    };
  }, []);
  useEffect(() => {
    if (!searchStarted) {
      setInputValue("");
    }
  }, [searchStarted]);

  useEffect(() => {
    if (searchStarted) {
      handleSearch(searchQuery);
    }
  }, [searchPage]);
  return (
    <>
      <form
        className="flex justify-between  bg-black/40 backdrop-blur-lg z-50  w-full rounded-full border border-zinc-600 focus-within:border focus-within:border-blue-500 "
        onSubmit={(event) => {
          event.preventDefault();
          params.set("searchPage", `1`);
          router.push(`?${params.toString()}`);
          dispatch(setPageActive(1));

          if (inputValue.trim().length !== 0) {
            dispatch(setSearchQuery(inputValue));
            handleSearch(inputValue);
          }
        }}
      >
        <Input
          customClassesForWrapper="focus-within:border-none !bg-transparent sm:text-[100%] lg:text-[100%]  px-2 w-full"
          customClassesForInput="!bg-transparent placeholder:!text-zinc-400 !text-zinc-200"
          type="search"
          placeholder="Search for a movie or tv show..."
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
        />
        <button type="submit" className="border-0 hover:bg-zinc-800 rounded-full px-6" title={undefined}>
          <i className="bi bi-search"></i>
        </button>
      </form>
    </>
  );
}
