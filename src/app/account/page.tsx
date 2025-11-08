"use client";
import Banner from "@/components/byRoute/Account/Banner/Banner";
import useVerifyToken from "@/Hooks/useVerifyToken";
import Settings from "@/components/byRoute/Account/settings/Settings";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import useHideDrawers from "@/Hooks/useHideDrawers";
import useIsMobile from "@/Hooks/useIsMobile";
import MobileCloseButton from "@/components/byRoute/MediaDetails/Buttons/MobileCloseButton";

export default function Profile() {
  const { profileData, userLogged } = useSelector((state: RootState) => state.auth);
  const isMobile = useIsMobile(768);
  const { containerMargin } = useSelector((state: RootState) => state.ui);

  useVerifyToken();
  useHideDrawers();

  return (
    <div className="wrapper relative max-lg:z-[999] z-[99] bg-black max-md:!pt-16 min-h-screen" style={{ ...(!isMobile ? { marginTop: containerMargin ? `${containerMargin}px` : undefined } : {}) }}>
      {isMobile && <MobileCloseButton variant="profile" />}

      <div className="flex-col-center gap-6 ">
        <span className="w-full">
          <Banner />
        </span>

        <div className="w-full z-[2] ">
          <h2 className="text-center title-style border-none">
            {userLogged ? profileData?.displayName : "Hi test user"}

            <p className="text-[45%] font-normal text-center text-content-third">*Remember to create an account to perform any of the following actions*</p>
          </h2>
          <Settings />
        </div>
      </div>
    </div>
  );
}
