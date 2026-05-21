"use client";
import Link from "next/link";
import { IMediaData } from "@/Types";
import { setMediaIdPWA } from "@/store/slices/mediaDetailsSlice";
import { useDispatch } from "react-redux";

function DetailsButton({ sliderData, type }: { sliderData: IMediaData; type: string }) {
  const dispatch = useDispatch();

  return (
    <Link
      className={`btn-primary text-[40%] !py-0 !px-8 !bg-[#1d1d1d] !border-solid !border !border-white/20 !text-white`}
      href={`${type.toLowerCase().split(" ").join("")}/${sliderData.id}`}
      onClick={() => {
        dispatch(setMediaIdPWA(sliderData.id));
        sessionStorage.setItem("navigatingFromApp", "1");
      }}
    >
      <span>
        <i className="bi bi-info-circle mr-1"></i> Details
      </span>
    </Link>
  );
}

export default DetailsButton;
