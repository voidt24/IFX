"use client";
import { useContext, useEffect, useState } from "react";
import SliderCard from "../../components/SliderCard";
import { Context } from "../../context/Context";
import { search } from "../../helpers/search";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";

function SearchSection() {
  const { openTrailer} = useContext(Context);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchStarted, setSearchStarted] = useState(false);
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [pageActive, setPageActive] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  function handleSearch(value) {
    if (value.trim().length === 0) {
      return;
    }
    setSearchResults([]);
    setSearchStarted(true);

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
    handleSearch(searchQuery);
  }, [pageActive]);

  if (loadingSearch) {
    return (
      <span className="flex items-center justify-center h-screen">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress color="inherit" size={100} />
        </div>
      </span>
    );
  }

  return (
    <section className={`search-section ${openTrailer && "on-trailer"} px-4 sm:px-10 flex items-center justify-center`}>
      <div className="form-bg flex-col gap-6 px-8 pt-8">
        <i
          className="bi bi-arrow-left absolute left-0 top-[38px] "
          onClick={() => {
            router.back();
            window.scrollTo(0, 0);
          }}
        ></i>
        <form
          className="searchForm "
          onSubmit={(event) => {
            event.preventDefault();
            handleSearch(inputValue);

            if (inputValue.trim().length !== 0) {
              setSearchQuery(inputValue);
            }
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
          <button type="submit" className="bg-gray-800">
            <i className="bi bi-search"></i>
          </button>
        </form>

        {numberOfPages > 1 && (
          <>
            <nav className="flex items-center justify-center w-full">
              <ul className="flex text-[70%] self-center">
                <li>
                  <button
                    href="#"
                    className="flex items-center justify-center max-md:px-3 px-4 h-8 ms-0  leading-tight text-gray-200 bg-gray-800 border  border-gray-600 rounded-s-full hover:bg-gray-500 hover:text-white"
                    onClick={() => {
                      if (pageActive > 1) {
                        setPageActive(pageActive - 1);
                      }
                    }}
                  >
                    Prev
                  </button>
                </li>

                {Array.from({ length: numberOfPages }).map((_, index) => {
                  return (
                    <li key={index}>
                      <button
                        href="#"
                        className={`flex items-center justify-center max-md:px-3 px-4 h-8 leading-tight  border border-gray-600 ${
                          Number(index + 1) === pageActive ? "bg-[goldenrod]  hover:bg-[goldenrod] text-white" : "bg-gray-800 hover:bg-gray-500  text-gray-300"
                        }`}
                        onClick={() => {
                          setPageActive(Number(index + 1));
                        }}
                      >
                        {index + 1}
                      </button>
                    </li>
                  );
                })}

                <li>
                  <button
                    href="#"
                    className="flex items-center justify-center max-md:px-3 px-4 h-8 leading-tight text-gray-200 bg-gray-800 border border-gray-600 rounded-e-full hover:bg-gray-500 hover:text-white"
                    onClick={() => {
                      if (pageActive < 5) {
                        setPageActive(pageActive + 1);
                      }
                    }}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
            <p className=" md:text-xl self-start ">
              Results for "{searchQuery}" page: {pageActive}
            </p>
          </>
        )}
      </div>

      <div className="results relative">
        {searchResults.length > 0 ? (
          <>
            {searchResults.map((result) => {
              if (result.media_type !== "person" && result.media_type) {
                return (
                  <>
                    <SliderCard result={result} changeMediaType={result.media_type} key={result.id} />
                  </>
                );
              }
            })}

            {/* {numberOfPages && numberOfPages > 1 && (
                  <>
                    <p className="absolute top-10 md:text-xl">
                      Results for "{searchQuery}" page: {pageActive}
                    </p>
                    <nav className="flex absolute top-0 items-center justify-center w-full">
                      <ul className="flex text-[70%] self-center">
                        <li>
                          <button
                            href="#"
                            className="flex items-center justify-center max-md:px-3 px-4 h-8 ms-0  leading-tight text-gray-200 bg-gray-800 border  border-gray-600 rounded-s-full hover:bg-gray-500 hover:text-white"
                            onClick={() => {
                              if (pageActive > 1) {
                                setPageActive(pageActive - 1);
                              }
                            }}
                          >
                            Prev
                          </button>
                        </li>

                        {Array.from({ length: numberOfPages }).map((_, index) => {
                          return (
                            <li key={index}>
                              <button
                                href="#"
                                className={`flex items-center justify-center max-md:px-3 px-4 h-8 leading-tight  border border-gray-600 ${
                                  Number(index + 1) === pageActive ? "bg-[goldenrod]  hover:bg-[goldenrod] text-white" : "bg-gray-800 hover:bg-gray-500  text-gray-300"
                                }`}
                                onClick={() => {
                                  setPageActive(Number(index + 1));
                                }}
                              >
                                {index + 1}
                              </button>
                            </li>
                          );
                        })}

                        <li>
                          <button
                            href="#"
                            className="flex items-center justify-center max-md:px-3 px-4 h-8 leading-tight text-gray-200 bg-gray-800 border border-gray-600 rounded-e-full hover:bg-gray-500 hover:text-white"
                            onClick={() => {
                              if (pageActive < 5) {
                                setPageActive(pageActive + 1);
                              }
                            }}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </>
                )} */}
          </>
        ) : (
          searchStarted && <p style={{ gridColumn: "1/-1" }}>no results</p>
        )}
      </div>
    </section>
  );
}

export default SearchSection;
