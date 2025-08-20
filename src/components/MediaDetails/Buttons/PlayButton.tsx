import { Context } from "@/context/Context";
import { MediaTypeApi } from "@/Types/mediaType";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { setMediaIdPWA, setSheetMediaType } from "@/store/slices/mediaDetailsSlice";

function PlayButton({ mediaId, mediaType }: { mediaId: number; mediaType: MediaTypeApi }) {
  const { setSeasonModal, openTrailer, setOpenTrailer, isMobilePWA, setOpenDisplayMediaSheet } = useContext(Context);
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <button
      className="btn-primary relative z-[4] w-full pointer-events-auto"
      data-id={mediaId}
      onClick={() => {
        if (mediaType == "tv") {
          setSeasonModal(true);
        } else {
          if (isMobilePWA) {
           dispatch(setSheetMediaType(mediaType == "movie" ? "movies" : "tvshows"));
            dispatch(setMediaIdPWA(mediaId));
            setOpenDisplayMediaSheet(true);
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
