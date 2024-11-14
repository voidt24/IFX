"use client";
import React from "react";
import { useContext, useEffect, useState } from "react";
import { Context } from "@/context/Context";
import { search } from "../../helpers/search";
import { useRouter } from "next/navigation";
export default function SearchBar() {
  const { setSearchResults, setLoadingSearch, searchStarted, setSearchStarted, pageActive, setPageActive, setNumberOfPages, searchQuery, setSearchQuery } = useContext(Context);

  const { openTrailer } = useContext(Context);

  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  function handleSearch(value: string) {
    if (value.trim().length === 0) {
      return;
    }
    setSearchStarted(true);
    document.body.style.overflow = "hidden";
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
        className="flex justify-between gap-1 py-1 bg-zinc-900 z-50  w-full rounded-full border border-zinc-800"
        onSubmit={(event) => {
          event.preventDefault();
          handleSearch(inputValue);
          setPageActive(1);

          if (inputValue.trim().length !== 0) {
            setSearchQuery(inputValue);
          }
        }}
      >
        <input
          className="input-style !border-none !pl-4"
          type="search"
          id="search-input"
          placeholder="Search for a movie or tv show..."
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
        />
        <button type="submit" className="border-0 hover:bg-zinc-800 rounded-full py-2 px-6" title={undefined}>
          <i className="bi bi-search"></i>
        </button>
      </form>
    </>
  );
}
