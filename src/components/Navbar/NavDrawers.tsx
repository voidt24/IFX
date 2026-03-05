import SlideOver from "../common/SlideOver";
import SearchSlideOver from "../common/SearchSlideOver";
import UserMenuData from "../common/UserMenuData";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

function NavDrawers() {
  const { showSearchBar, userMenuActive } = useSelector((state: RootState) => state.ui);

  const dispatch = useDispatch();
  return (
    <>
      {userMenuActive && (
        <SlideOver activeState={userMenuActive}>
          <UserMenuData />
        </SlideOver>
      )}

      {showSearchBar && <SearchSlideOver />}
    </>
  );
}

export default NavDrawers;
