"use client";
import Banner from "@/components/Banner/Banner";
import Wrapper from "@/components/common/Wrapper/Wrapper";
import { auth } from "@/firebase/firebase.config";
import useVerifyToken from "@/Hooks/useVerifyToken";
import { useEffect, useState } from "react";
export default function Profile() {
  const [profileData, setProfileData] = useState<{ displayName: string | null | undefined; email: string | null | undefined } | null>(null);

  useVerifyToken();

  useEffect(() => {
    setProfileData({ displayName: auth.currentUser?.displayName, email: auth.currentUser?.email });
  }, [auth]);

  return (
    <Wrapper>
      <div className="flex-col-center gap-6">
        <Banner />

        <div className="flex gap-2 z-[0]">
          <div className="flex flex-col justify-center items-center gap-1">
            <p className="text-xl">{profileData?.displayName}</p>
            <p className="text-content-secondary">{profileData?.email}</p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
