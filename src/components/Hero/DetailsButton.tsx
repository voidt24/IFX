"use client";
import Link from "next/link";
import { IMediaData } from "@/Types";
import { setMediaIdPWA } from "@/store/slices/mediaDetailsSlice";
import { useDispatch } from "react-redux";

function DetailsButton({ variant, sliderData, type }: { variant: "desktop" | "mobile"; sliderData: IMediaData; type: string }) {
  const dispatch = useDispatch();

  const mobileStyles = "bg-surface-modal hover:bg-white/20 rounded-full  border border-[#ffffff4b] py-[0.5px] px-6";
  const desktopStyles = "btn-primary text-[40%] !py-0 !px-8";

  return (
    <Link
      className={variant === "desktop" ? desktopStyles : mobileStyles}
      href={`${type.toLowerCase().split(" ").join("")}/${sliderData.id}`}
      onClick={() => {
        dispatch(setMediaIdPWA(sliderData.id));
        sessionStorage.setItem("navigatingFromApp", "1");
      }}
    >
      {variant === "desktop" ? "Details" : <i className="bi bi-caret-right-fill leading-none text-[90%]"></i>}
    </Link>
  );
}

export default DetailsButton;
