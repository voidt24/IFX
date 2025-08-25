import { Context } from "@/context/Context";
import { useContext } from "react";
import MenuDrawer from "../PWA/MenuDrawer";
import Search from "../Search";
import SlideOver from "../common/SlideOver";
import SearchSlideOver from "../common/SearchSlideOver";
import UserMenuData from "../common/UserMenuData";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setOpenSearchDrawer, setOpenUserDrawer } from "@/store/slices/UISlice";

function NavDrawers() {
  const { isMobilePWA } = useContext(Context);
  const { showSearchBar, userMenuActive, openSearchDrawer, openUserDrawer } = useSelector((state: RootState) => state.ui);

  const dispatch = useDispatch();
  return (
    <>
      {isMobilePWA ? (
        <>
          <MenuDrawer
            isOpen={openSearchDrawer}
            setIsOpen={(value: boolean) => {
              dispatch(setOpenSearchDrawer(value));
            }}
          >
            <Search />
          </MenuDrawer>
          <MenuDrawer
            isOpen={openUserDrawer}
            setIsOpen={(value: boolean) => {
              dispatch(setOpenUserDrawer(value));
            }}
          >
            <UserMenuData />
          </MenuDrawer>
        </>
      ) : (
        <>
          {userMenuActive && (
            <SlideOver activeState={userMenuActive}>
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
