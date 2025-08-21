import Search from "../Search";
import SlideOver from "./SlideOver";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

function SearchSlideOver() {
  const { showSearchBar } = useSelector((state: RootState) => state.ui);

  return (
    <SlideOver activeState={showSearchBar}>
      <div className={`flex-col-center w-[95%] sm:w-[90%] mx-auto h-full pt-4 pb-10 gap-6 sm:pt-4`}>
        <Search />
      </div>
    </SlideOver>
  );
}

export default SearchSlideOver;
