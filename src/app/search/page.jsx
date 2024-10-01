"use client";
import { useContext, useState } from "react";
import SliderCard from "../../components/SliderCard";
import { Context } from "../../context/Context";
import { search } from "../../helpers/search";
import { useRouter } from "next/navigation";

 function SearchSection() {
  const { openTrailer, searchResults, setSearchResults } = useContext(Context);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchStarted, setSearchStarted] = useState(false);
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  function handleSearch(event) {
    event.preventDefault();
    if (inputValue.trim().length === 0) {
      return;
    }
    setSearchResults([]);
    setSearchStarted(true);

    setLoadingSearch(true);

    search(inputValue).then((data) => {
      setSearchResults(data.results);
      setLoadingSearch(false);
    });
  }

  return (
    <section className={`search-section ${openTrailer && "on-trailer"}`}>
      <div className="form-bg">
        <i
          className="bi bi-arrow-left"
          onClick={() => {
            router.back();
            window.scrollTo(0, 0);
          }}
        ></i>
        <form
          className="searchForm"
          onSubmit={(event) => {
            handleSearch(event);
          }}
        >
          <input
            type="search"
            placeholder="Search for a movie or tv show..."
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
          />
          <button type="submit">
            <i className="bi bi-search"></i>
          </button>
        </form>
      </div>
      {loadingSearch ? (
        <span className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="95px" height="95px" viewBox="0 0 24 24">
            <path fill="grey" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity="0.25" />
            <path fill="white" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
              <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" />
            </path>
          </svg>
        </span>
      ) : (
        <>
          <div className="results">
            {searchResults.length > 0
              ? searchResults.map((result) => {
                  if (result.media_type !== "person" && result.media_type) {
                    return <SliderCard result={result} changeMediaType={result.media_type} key={result.id} />;
                  }
                })
              : searchStarted && <p style={{ gridColumn: "1/-1" }}>no results</p>}
          </div>
        </>
      )}
    </section>
  );
};

export default SearchSection;
