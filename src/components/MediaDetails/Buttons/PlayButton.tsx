import { Context } from "@/context/Context";
import { MediaTypeApi } from "@/Types/mediaType";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { setMediaIdPWA, setSheetMediaType } from "@/store/slices/mediaDetailsSlice";
import { setSeasonModal, setOpenDisplayMediaSheet } from "@/store/slices/UISlice";

function PlayButton({ mediaId, mediaType }: { mediaId: number; mediaType: MediaTypeApi }) {
  const { openTrailer, setOpenTrailer, isMobilePWA } = useContext(Context);

  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <button
      className="btn-primary relative z-[4] w-full pointer-events-auto"
      data-id={mediaId}
      onClick={() => {
        if (mediaType == "tv") {
          dispatch(setSeasonModal(true));
        } else {
          if (isMobilePWA) {
            dispatch(setSheetMediaType(mediaType == "movie" ? "movies" : "tvshows"));
            dispatch(setMediaIdPWA(mediaId));
            dispatch(setOpenDisplayMediaSheet(true));
          } else {
            router.push(`${mediaId}/watch?option=1`);
          }
        }

        if (openTrailer) setOpenTrailer(false);
      }}
    >
      <i className="bi bi-play-fill  "></i> Play
    </button>
  );
}

export default PlayButton;
