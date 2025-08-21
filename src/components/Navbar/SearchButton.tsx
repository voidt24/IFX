import { Context } from "@/context/Context";
import { useContext } from "react";
import { setShowSearchBar, setUserMenuActive, setOpenSearchDrawer } from "@/store/slices/UISlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

function SearchButton() {
  const { isMobilePWA } = useContext(Context);
  const { showSearchBar, userMenuActive } = useSelector((state: RootState) => state.ui);

  const dispatch = useDispatch();

  return (
    <button
      className="w-[2rem] h-[2rem] sm:hover:bg-gray-800 rounded-full"
      id="main-search-btn"
      onClick={() => {
        if (isMobilePWA) {
          dispatch(setOpenSearchDrawer(true));
        } else {
          if (userMenuActive) setUserMenuActive(false);
          dispatch(setShowSearchBar(!showSearchBar));
        }
      }}
      title="search-button"
    >
      <i className={`bi ${!showSearchBar ? "bi-search" : "bi-x-lg"}  text-lg`}></i>
    </button>
  );
}

export default SearchButton;
