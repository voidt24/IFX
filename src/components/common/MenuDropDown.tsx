import Link from "next/link";
import { auth, ID_TOKEN_COOKIE_NAME } from "@/firebase/firebase.config";
import { setLoadingScreen, setUserMenuActive, setOpenUserDrawer } from "@/store/slices/UISlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";

type NavbarActions = {
  name: string;
  href: string;
  icon: React.JSX.Element;
  actionFunction: () => void | null;
};

export default function MenuDropdown({ activeState, setActiveState, XPosition }: { activeState: boolean; setActiveState: (state: boolean) => void; XPosition: string }) {
  const { userLogged, testingInitialized } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
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
  return activeState ? (
    <div className={`xs:border h-full p-4 xs:p-6 rounded-md border-white/10 ${XPosition}  bg-black relative z-[999999]`}>
      <div className="flex flex-col items-start justify-start w-full sm:h-full gap-6">
        {profileData && (
          <div className="flex gap-2 items-start justify-center pb-4 border-b border-zinc-700">
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
  ) : null;
}
