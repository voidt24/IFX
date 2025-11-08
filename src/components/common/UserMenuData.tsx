import { auth, ID_TOKEN_COOKIE_NAME } from "@/firebase/firebase.config";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setFirebaseActiveUser, setUserLogged } from "@/store/slices/authSlice";
import Link from "next/link";
import { setLoadingScreen, setUserMenuActive, setOpenUserDrawer } from "@/store/slices/UISlice";
import { RootState } from "@/store";

function UserMenuData() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { userLogged, testingInitialized } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    if (userLogged) {
      auth.signOut().then(() => {
        dispatch(setUserMenuActive(false));
        dispatch(setOpenUserDrawer(false));
        document.cookie = `${ID_TOKEN_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
        dispatch(setLoadingScreen(true));

        setTimeout(() => {
          dispatch(setLoadingScreen(false));
        }, 1000);
        router.push("/");
      });
    }
  };

  const userActions = [
    {
      name: "Account",
      href: "/account",
      icon: <i className="bi bi-person-fill"></i>,
      actionFunction: () => {
        sessionStorage.setItem("profile/navigatingFromApp", "1");
      },
    },
    {
      name: "My Lists",
      href: "/lists",
      icon: <i className="bi bi-list-check"></i>,
      actionFunction: null,
    },
    {
      name: "History",
      href: "/history",
      icon: <i className="bi bi-clock-history"></i>,
      actionFunction: null,
    },
    {
      name: "Log out",
      href: "",
      icon: <i className="bi bi-box-arrow-left"></i>,
      actionFunction: handleLogout,
    },
  ];

  const profileData = {
    displayName: auth.currentUser?.displayName,
    email: auth.currentUser?.email,
  };
  return (
    <div className={`wrapper`}>
      <div className={`flex flex-col items-start justify-start w-full sm:h-full gap-6`}>
        {profileData && (
          <div className="flex gap-2 items-start justify-center pb-4  border-b border-zinc-700 ">
            <div className="flex flex-col gap-1 items-start justify-center ">
              <h1 className="text-3xl font-semibold">Hi, {userLogged && !testingInitialized ? profileData.displayName : "Tester"}</h1>
              <p className="text-zinc-400">{profileData.email}</p>
            </div>
          </div>
        )}

        {userActions.map((element, index) => {
          return (
            <Link
              key={index}
              href={element.href}
              className={`flex items-center ml-4 gap-4 hover:text-[var(--primary)] hover:translate-x-1 transition-all duration-200 ${element.name == "Log out" ? "!text-red-500 mt-2" : "text-white"}`}
              onClick={async () => {
                if (element.actionFunction) await element.actionFunction();
              }}
            >
              {element.icon}
              {element.name} {element.name != "Log out" && ">"}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default UserMenuData;
