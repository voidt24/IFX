"use client";
import { IMediaData, MediaTypeApi } from "@/Types";
import { setMediaIdPWA, setSheetMediaType } from "@/store/slices/mediaDetailsSlice";
import { useDispatch } from "react-redux";
import { setOpenMediaDetailsSheet } from "@/store/slices/UISlice";

function PWADetailsButton({ sliderData, mediaType }: { sliderData: IMediaData; mediaType: MediaTypeApi }) {
  const dispatch = useDispatch();
  return (
    <button
      className="bg-surface-modal hover:bg-white/20 rounded-full  border border-[#ffffff4b] py-[0.5px] px-6"
      onClick={() => {
        dispatch(setSheetMediaType(mediaType == "movie" ? "movies" : "tvshows"));
        dispatch(setMediaIdPWA(sliderData.id));
        dispatch(setOpenMediaDetailsSheet(true));
      }}
      title="media-details-button"
    >
      <i className="bi bi-caret-right-fill leading-none text-[90%]"></i>
    </button>
  );
}

export default PWADetailsButton;
