import { Context } from "@/context/Context";
import { useContext, useEffect } from "react";

function useHideDrawers(keepSearchOpen = false) {
  const { isMobilePWA, showSearchBar, setShowSearchBar, userMenuActive, setUserMenuActive, setOpenSearchDrawer, openSearchDrawer, openUserDrawer, setOpenUserDrawer } = useContext(Context);

  useEffect(() => {
    if (isMobilePWA) {
      if (openSearchDrawer && !keepSearchOpen) setOpenSearchDrawer(false);
      if (openUserDrawer) setOpenUserDrawer(false);
    }
    if (showSearchBar) setShowSearchBar(false);
    if (userMenuActive) setUserMenuActive(false);
  }, []);

  return null;
}

export default useHideDrawers;
