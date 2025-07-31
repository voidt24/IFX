"use client";
import React from "react";
import { useContext, useEffect, useState } from "react";
import { Context } from "@/context/Context";
import { search } from "../../helpers/search";
import Input from "../common/Input";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setLoadingSearch, setSearchQuery, setSearchResults, setSearchStarted } from "@/store/slices/searchSlice";
export default function SearchBar() {
  const { pageActive, setPageActive, setNumberOfPages } = useContext(Context);

  const [inputValue, setInputValue] = useState("");
  const { searchStarted, searchQuery } = useSelector((state: RootState) => state.search);
  const dispatch = useDispatch();

  function handleSearch(value: string) {
    if (value.trim().length === 0) {
      return;
    }
    dispatch(setSearchStarted(true));
    dispatch(setSearchResults([]));
    dispatch(setLoadingSearch(true));

    search(value, pageActive).then((data) => {
      if (data.page === pageActive) {
        dispatch(setSearchResults(data.results));
      }
      dispatch(setLoadingSearch(false));

      data.total_pages >= 5 ? setNumberOfPages(5) : setNumberOfPages(data.total_pages);
    });
  }

  useEffect(() => {
    if (!searchStarted) {
      setInputValue("");
    }
  }, [searchStarted]);

  useEffect(() => {
    if (searchStarted) {
      handleSearch(searchQuery);
    }
  }, [pageActive]);
  return (
    <>
      <form
        className="flex justify-between  bg-black/40 backdrop-blur-lg z-50  w-full rounded-full border border-zinc-600 focus-within:border focus-within:border-blue-500 "
        onSubmit={(event) => {
          event.preventDefault();
          handleSearch(inputValue);
          setPageActive(1);

          if (inputValue.trim().length !== 0) {
            dispatch(setSearchQuery(inputValue));
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
