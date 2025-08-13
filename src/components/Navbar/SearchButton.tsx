import { Context } from "@/context/Context";
import { useContext } from "react";

function SearchButton() {
  const { showSearchBar, setShowSearchBar, userMenuActive, setUserMenuActive, isMobilePWA, setOpenSearchDrawer } = useContext(Context);

  return (
    <button
      className="w-[2rem] h-[2rem] sm:hover:bg-gray-800 rounded-full"
      id="main-search-btn"
      onClick={() => {
        if (isMobilePWA) {
          setOpenSearchDrawer(true);
        } else {
          if (userMenuActive) setUserMenuActive(false);
          setShowSearchBar(!showSearchBar);
        }
      }}
      title="search-button"
    >
      <i className={`bi ${!showSearchBar ? "bi-search" : "bi-x-lg"}  text-lg`}></i>
    </button>
  );
}

export default SearchButton;
