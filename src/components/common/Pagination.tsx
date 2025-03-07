import { Dispatch, SetStateAction } from "react";

function Pagination({
  pageActive,
  setPageActive,
  numberOfPages,
  customClasses,
}: {
  pageActive: number;
  setPageActive: Dispatch<SetStateAction<number>>;
  numberOfPages: number;
  customClasses?: string;
}) {
  return (
    <nav className={`flex items-center justify-center w-full px-4 ${customClasses || ""}`}>
      <ul className="flex text-[67%] md:text-[70%] self-center bg-zinc-800 rounded-full">
        <li>
          <button
            className="flex items-center justify-center max-md:px-2 px-4 h-8 ms-0  leading-tight text-gray-200  border  border-zinc-500 rounded-s-full hover:bg-zinc-500 hover:text-white"
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
                className={`flex items-center justify-center max-md:px-2.5 px-4 h-8 leading-tight  border border-zinc-500 ${
                  Number(index + 1) === pageActive ? "bg-[goldenrod]  hover:bg-[goldenrod] text-white" : " hover:bg-zinc-500  text-gray-300"
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
            className="flex items-center justify-center max-md:px-2 px-4 h-8 leading-tight text-gray-200  border border-zinc-500 rounded-e-full hover:bg-zinc-500 hover:text-white"
            onClick={() => {
              if (pageActive < numberOfPages) {
                setPageActive(pageActive + 1);
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
