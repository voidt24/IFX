import Link from "next/link";
import { useEffect, useState } from "react";
import { menuActions } from "./TopNavbar";
import { usePathname } from "next/navigation";
import { auth } from "@/firebase/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import SearchButton from "./SearchButton";
import LoginButton from "./LoginButton";
import UserMenuButton from "./UserMenuButton";

function NavItems() {
  const [loadingAuth, setLoadingAuth] = useState({ state: "unknown" });
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoadingAuth({ state: "on" });
      } else {
        setLoadingAuth({ state: "off" });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <div className={`links relative flex-row-between gap-2 w-full `}>
      <ul className="">
        <li id="logo" className="">
          <Link href="/">
            <img src="/logo.png" className="w-[3.5rem]" alt="" />
          </Link>
        </li>
      </ul>
      <ul className="max-sm:hidden flex  gap-8 items-center justify-center font-medium">
        {menuActions.map((element, index) => {
          return (
            <li className="" key={index}>
              <Link
                className={`${
                  pathname == element.href || (element.href != "/" && pathname.includes(element.href.split("").slice(1).join("")))
                    ? "text-brand-primary font-semibold"
                    : "text-content-secondary hover:text-brand-light hover:font-semibold"
                } nav-item-box max-sm:text-[80%]   border-b border-transparent transition-all duration-200`}
                key={index}
                href={element.href}
              >
                {element.icon}
                {element.name}
              </Link>
            </li>
          );
        })}
      </ul>

      <ul className="flex gap-2 items-center justify-center">
        <li>
          <SearchButton />
        </li>
        <li className="">
          {loadingAuth.state === "unknown" ? <div className="py-2 px-4 bg-zinc-800 rounded-full animate-pulse"></div> : loadingAuth.state === "off" ? <LoginButton /> : <UserMenuButton />}
        </li>
      </ul>
    </div>
  );
}

export default NavItems;
