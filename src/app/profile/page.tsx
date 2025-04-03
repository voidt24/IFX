"use client";
import Banner from "@/components/Banner/Banner";
import DefaultLayout from "@/components/layout/DefaultLayout";
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
    <DefaultLayout>
      <div className="lists  !gap-6">
        <Banner />

        <div className="flex gap-2">
          <div className="flex flex-col gap-1 justify-center items-start ">
            <p className="text-xl">{profileData?.displayName}</p>
            <p className="text-zinc-400">{profileData?.email}</p>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
