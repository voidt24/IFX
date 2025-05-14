import { Dispatch, SetStateAction, useEffect, useState } from "react";

const MIN_NUMBER_OF_PAGES = 8;

function Pagination({
  pageActive,
  setPageActive,
  numberOfPages,
  startingPage,
  setStartingPage,
  customClasses,
}: {
  pageActive: number;
  setPageActive: Dispatch<SetStateAction<number>>;
  numberOfPages: number;
  startingPage: number;
  setStartingPage: Dispatch<SetStateAction<number>>;
  customClasses?: string;
}) {
  const [lengthOfPag, setLengthOfPag] = useState(0);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    setLengthOfPag(numberOfPages > MIN_NUMBER_OF_PAGES ? MIN_NUMBER_OF_PAGES : numberOfPages < MIN_NUMBER_OF_PAGES ? numberOfPages : numberOfPages);
  }, [numberOfPages]);

  useEffect(() => {
    if (clicks == 0) setStartingPage(1);
  }, [clicks]);

  return (
    <nav className={`flex items-center justify-center w-full px-4 ${customClasses || ""} `}>
      <ul className="flex text-[67%] md:text-[70%] self-center  bg-[#0e1017ca] rounded-full">
        <li>
          <button
            className={`flex items-center justify-center max-md:px-2 px-4 h-8 ms-0  leading-tight text-gray-200  border  border-zinc-500 rounded-s-full hover:bg-gray-600 hover:text-white transition-all duration-200 ${
              pageActive == 1 ? " pointer-events-none text-zinc-600" : "pointer-events-auto text-gray-200  hover:text-white"
            }`}
            onClick={() => {
              if (pageActive > 1) {
                setPageActive(pageActive - 1);
              }

              if (pageActive - 1 < startingPage && clicks > 0) {
                setClicks(clicks - 1);
                setStartingPage(lengthOfPag - 1);
              }
            }}
          >
            Prev
          </button>
        </li>
        {Array.from({ length: lengthOfPag }).map((_, index) => {
          const pageNumber = startingPage + index;
          return (
            <li key={index}>
              <button
                className={`flex items-center justify-center max-md:px-2.5 px-4 h-8 leading-tight  border border-zinc-500 transition-all duration-200 ${
                  pageNumber === pageActive ? "bg-[goldenrod]  hover:bg-[goldenrod] text-white" : " hover:bg-gray-600 "
                }${pageNumber > numberOfPages ? " text-zinc-800 hidden pointer-events-none " : "pointer-events-auto text-gray-300 flex"}`}
                onClick={() => {
                  setPageActive(pageNumber);
                }}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}

        <li>
          <button
            className={`flex items-center justify-center max-md:px-2 px-4 h-8 ms-0  leading-tight text-gray-200  border  border-zinc-500 rounded-e-full hover:bg-gray-600 hover:text-white transition-all duration-200 ${
              pageActive == numberOfPages ? " pointer-events-none text-zinc-600" : "pointer-events-auto text-gray-200  hover:text-white"
            }`}
            onClick={() => {
              if (pageActive < numberOfPages) {
                setPageActive(pageActive + 1);
              }

              if (pageActive + 1 == startingPage + lengthOfPag) {
                setClicks(clicks + 1);
                setStartingPage(lengthOfPag + 1);
              }
            }}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
