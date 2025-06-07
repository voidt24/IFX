import React, { useContext } from "react";
import Search from "../Search";
import SlideOver from "./SlideOver";
import { Context } from "@/context/Context";

function SearchSlideOver() {
  const { showSearchBar, setShowSearchBar } = useContext(Context);
  return (
    <SlideOver activeState={showSearchBar} setActiveState={setShowSearchBar}>
      <div className={`flex-col-center w-[95%] sm:w-[90%] mx-auto h-full pt-4 pb-10 gap-6 sm:pt-4`}>
        <Search />
      </div>
    </SlideOver>
  );
}

export default SearchSlideOver;
