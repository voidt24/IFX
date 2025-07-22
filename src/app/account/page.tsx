"use client";
import Banner from "@/components/Banner/Banner";
import Wrapper from "@/components/common/Wrapper/Wrapper";
import useVerifyToken from "@/Hooks/useVerifyToken";
import Settings from "@/components/settings/Settings";
import { useContext } from "react";
import { Context } from "@/context/Context";
export default function Profile() {
  useVerifyToken();
  const { profileData } = useContext(Context);

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
