"use client";
import React from "react";
import { useContext, useEffect, useState } from "react";
import { Context } from "@/context/Context";
import { search } from "../../helpers/search";
import Input from "../common/Input";
export default function SearchBar() {
  const { setSearchResults, setLoadingSearch, searchStarted, setSearchStarted, pageActive, setPageActive, setNumberOfPages, searchQuery, setSearchQuery } = useContext(Context);

  const [inputValue, setInputValue] = useState("");

  function handleSearch(value: string) {
    if (value.trim().length === 0) {
      return;
    }
    setSearchStarted(true);
    setSearchResults([]);
    setLoadingSearch(true);

    search(value, pageActive).then((data) => {
      if (data.page === pageActive) {
        setSearchResults(data.results);
      }
      setLoadingSearch(false);

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
            setSearchQuery(inputValue);
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
