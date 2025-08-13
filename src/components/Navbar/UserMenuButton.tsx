import { Context } from "@/context/Context";
import { auth } from "@/firebase/firebase.config";
import { RootState } from "@/store";
import { useContext } from "react";
import { useSelector } from "react-redux";

function UserMenuButton() {
  const { showSearchBar, setShowSearchBar, userMenuActive, setUserMenuActive, isMobilePWA, setOpenUserDrawer } = useContext(Context);
  const { firebaseActiveUser } = useSelector((state: RootState) => state.auth);

  return (
    <button
      className={`w-[2rem] h-[2rem] rounded-full font-semibold  ${userMenuActive ? "bg-brand-primary/80" : "bg-gray-800"} lg:hover:bg-brand-primary/80`}
      onClick={() => {
        if (isMobilePWA) {
          setOpenUserDrawer(true);
        } else {
          if (showSearchBar) setShowSearchBar(false);
          setUserMenuActive(!userMenuActive);
        }
      }}
      title="user-option"
    >
      <span className="text-xl">{auth.currentUser?.displayName?.slice(0, 1).toUpperCase() || firebaseActiveUser?.email?.slice(0, 1).toUpperCase()}</span>
    </button>
  );
}

export default UserMenuButton;
