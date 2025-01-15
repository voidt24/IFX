"use client";
import Banner from "@/components/Banner/Banner";
import { auth } from "@/firebase/firebase.config";
import { useEffect, useState } from "react";
export default function Profile() {
  const [profileData, setProfileData] = useState<{ displayName: string | null | undefined; email: string | null | undefined } | null>(null);

  useEffect(() => {
    setProfileData({ displayName: auth.currentUser?.displayName, email: auth.currentUser?.email });
  }, [auth]);

  return (
    <div className="lists py-10 sm:py-20 !gap-6">
      <Banner />

      <div className="flex gap-2">
        <i className="bi bi-person-circle self-center max-sm:text-[127%] text-2xl 2xl:text-3xl " id="user"></i>

        <div className="flex flex-col gap-1 justify-center items-start ">
          <p className="text-xl">{profileData?.displayName}</p>
          <p className="text-zinc-400">{profileData?.email}</p>
        </div>
      </div>
    </div>
  );
}
