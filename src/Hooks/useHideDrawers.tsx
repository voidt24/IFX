import { RootState } from "@/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShowSearchBar, setUserMenuActive } from "@/store/slices/UISlice";

function useHideDrawers(keepSearchOpen = false) {
  const { showSearchBar, userMenuActive } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();

  useEffect(() => {
    if (showSearchBar) dispatch(setShowSearchBar(false));
    if (userMenuActive) dispatch(setUserMenuActive(false));
  }, []);

  return null;
}

export default useHideDrawers;
