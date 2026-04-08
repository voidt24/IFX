import SearchSlideOver from "../common/SearchSlideOver";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
function NavDrawers() {
  const { showSearchBar } = useSelector((state: RootState) => state.ui);

  const dispatch = useDispatch();
  return <>{showSearchBar && <SearchSlideOver />}</>;
}

export default NavDrawers;
