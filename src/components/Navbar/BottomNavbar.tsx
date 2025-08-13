import Link from "next/link";
import { menuActions } from "./TopNavbar";
import { usePathname } from "next/navigation";
import { useIsPWA } from "@/Hooks/useIsPWA";

function BottomNavbar() {
  const pathname = usePathname();

  const isPWA = useIsPWA();
  const isIOS = () => /iphone/.test(window.navigator.userAgent.toLowerCase());

  return (
    <nav className={`nav fixed bottom-0 sm:hidden  ${isPWA && isIOS() ? "max-lg:!pb-6" : ""} `}>
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
                  } nav-item-box max-sm:text-[90%]   border-b border-transparent transition-all duration-200`}
                  key={index}
                  href={element.href}
                >
                  {element.icon}
                  <span className={`text-[85%]`}>{element.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default BottomNavbar;
