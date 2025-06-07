"use client";
import Results from "./Results";
import SearchBar from "./SearchBar";
export default function Search() {
  return (
    <>
      <div className={`w-full search-section h-[100%] rounded-lg flex flex-col items-center m-auto gap-6 justify-start`}>
        <div className="w-[85%] md:w-[55%] 2xl:w-[35%] mx-auto ">
          <SearchBar />
        </div>
        <Results />
      </div>
    </>
  );
}
