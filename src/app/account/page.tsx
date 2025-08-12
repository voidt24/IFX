"use client";
import Banner from "@/components/Banner/Banner";
import Wrapper from "@/components/common/Wrapper/Wrapper";
import useVerifyToken from "@/Hooks/useVerifyToken";
import Settings from "@/components/settings/Settings";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import useHideDrawers from "@/Hooks/useHideDrawers";

export default function Profile() {
  const auth = useSelector((state: RootState) => state.auth);
  const { profileData } = auth;

  useVerifyToken();
  useHideDrawers();

  return (
    <Wrapper>
      <div className="flex-col-center gap-6 ">
        <span className="w-full">
          <Banner />
        </span>

        <div className="w-full z-[2] ">
          <h2 className="text-center title-style border-none">{profileData?.displayName}</h2>
          <Settings />
        </div>
      </div>
    </Wrapper>
  );
}
