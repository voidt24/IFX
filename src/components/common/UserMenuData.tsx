import { Context } from "@/context/Context";
import { auth, ID_TOKEN_COOKIE_NAME } from "@/firebase/firebase.config";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { setFirebaseActiveUser, setUserLogged } from "@/store/slices/authSlice";
import Link from "next/link";

function UserMenuData() {
  const { setLoadingScreen, setUserMenuActive } = useContext(Context);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    auth.signOut().then(() => {
      dispatch(setUserLogged(false));
      dispatch(setFirebaseActiveUser({ email: null, uid: null }));
      setUserMenuActive(false);
      document.cookie = `${ID_TOKEN_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      setLoadingScreen(true);

      setTimeout(() => {
        setLoadingScreen(false);
      }, 1000);
      router.push("/");
    });
  };

  const userActions = [
    {
      name: "Account",
      href: "/account",
      icon: <i className="bi bi-person-fill"></i>,
      actionFunction: null,
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
              <h1 className="text-3xl font-semibold">Hi, {profileData.displayName}</h1>
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
