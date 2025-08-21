import { Context } from "@/context/Context";
import { RootState } from "@/store";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShowSearchBar, setUserMenuActive, setOpenSearchDrawer, setOpenUserDrawer } from "@/store/slices/UISlice";

function useHideDrawers(keepSearchOpen = false) {
  const { isMobilePWA } = useContext(Context);
  const { showSearchBar, userMenuActive, openSearchDrawer, openUserDrawer } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isMobilePWA) {
      if (openSearchDrawer && !keepSearchOpen) dispatch(setOpenSearchDrawer(false));
      if (openUserDrawer) dispatch(setOpenUserDrawer(false));
    }
    if (showSearchBar) dispatch(setShowSearchBar(false));
    if (userMenuActive) dispatch(setUserMenuActive(false));
  }, []);

  return null;
}

export default useHideDrawers;
