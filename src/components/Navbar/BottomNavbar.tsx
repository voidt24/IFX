import { Context } from "@/context/Context";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase.config";
import { menuActions } from "./TopNavbar";
import { usePathname } from "next/navigation";

function TopNavbar() {
  const { showSearchBar, setShowSearchBar, userMenuActive, setUserMenuActive } = useContext(Context);
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

    return () => unsubscribe();
  }, []);
  return (
    <nav className="nav fixed bottom-0 sm:hidden">
      <div className={`links relative flex-row-between gap-2 w-full max-sm:justify-center`}>
        <ul className="flex max-sm:gap-10 gap-8 items-center justify-center font-medium">
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
                  onClick={() => {
                    if (showSearchBar) setShowSearchBar(false);
                    if (userMenuActive) setUserMenuActive(false);
                  }}
                >
                  {element.icon}
                  <span className="text-[85%]">{element.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default TopNavbar;
