import { Context } from "@/context/Context";
import { useContext } from "react";
import MenuDrawer from "../PWA/MenuDrawer";
import Search from "../Search";
import SlideOver from "../common/SlideOver";
import SearchSlideOver from "../common/SearchSlideOver";
import UserMenuData from "../common/UserMenuData";

function NavDrawers() {
  const { showSearchBar, userMenuActive, setUserMenuActive, isMobilePWA, openSearchDrawer, setOpenSearchDrawer, openUserDrawer, setOpenUserDrawer } = useContext(Context);
  return (
    <>
      {isMobilePWA ? (
        <>
          <MenuDrawer isOpen={openSearchDrawer} setIsOpen={setOpenSearchDrawer}>
            <Search />
          </MenuDrawer>
          <MenuDrawer isOpen={openUserDrawer} setIsOpen={setOpenUserDrawer}>
            <UserMenuData />
          </MenuDrawer>
        </>
      ) : (
        <>
          {userMenuActive && (
            <SlideOver activeState={userMenuActive} setActiveState={setUserMenuActive}>
              <UserMenuData />
            </SlideOver>
          )}

          {showSearchBar && <SearchSlideOver />}
        </>
      )}
    </>
  );
}

export default NavDrawers;
