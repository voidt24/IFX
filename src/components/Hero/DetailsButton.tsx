"use client";
import Link from "next/link";
import { IMediaData, MediaTypeApi } from "@/Types";
import { setMediaIdPWA } from "@/store/slices/mediaDetailsSlice";
import { useDispatch } from "react-redux";

function DetailsButton({ sliderData, type, mediaType, released }: { sliderData: IMediaData; type: string; mediaType: MediaTypeApi; released: boolean | "" | undefined }) {
  const dispatch = useDispatch();

  return (
    <Link
      className={`btn-primary text-[40%] !py-0 !px-8  !border-solid !border ${mediaType == "movie" && released ? "!bg-[#1d1d1d] !border-white/20 !text-white" : "bg-white"}`}
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
