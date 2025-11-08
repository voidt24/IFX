import { Context } from "@/context/Context";
import { auth } from "@/firebase/firebase.config";
import { RootState } from "@/store";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShowSearchBar, setUserMenuActive, setOpenUserDrawer } from "@/store/slices/UISlice";

function UserMenuButton() {
  const { isMobilePWA } = useContext(Context);
  const { showSearchBar, userMenuActive } = useSelector((state: RootState) => state.ui);
  const { firebaseActiveUser, userLogged, testingInitialized } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();

  return (
    <button
      className={`flex items-center justify-center gap-2  ${userMenuActive ? "bg-white/20" : "hover:bg-white/20"} px-1 py-0.5 rounded-lg`}
      onClick={() => {
        if (isMobilePWA) {
          dispatch(setOpenUserDrawer(true));
        } else {
          if (showSearchBar) dispatch(setShowSearchBar(false));
          dispatch(setUserMenuActive(!userMenuActive));
        }
      }}
      title="user-option"
    >
      <span className={`text-xl  w-[2rem] h-[2rem]  flex gap-2 items-center justify-center rounded-full font-semibold  bg-gray-800`}>
        {userLogged ? (
          <p className="text-center">{auth.currentUser?.displayName?.slice(0, 1).toUpperCase() || firebaseActiveUser?.email?.slice(0, 1).toUpperCase()}</p>
        ) : (
          <p className="text-center">T</p>
        )}
      </span>
      <i className={` transition-all bi bi-caret-down-fill  ${userMenuActive && "rotate-180 -translate-y-[5px]"}   `}></i>
    </button>
  );
}

export default UserMenuButton;
