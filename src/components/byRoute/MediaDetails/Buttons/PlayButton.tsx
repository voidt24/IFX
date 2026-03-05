import { Context } from "@/context/Context";
import { MediaTypeApi } from "@/Types/mediaType";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { setSeasonModal } from "@/store/slices/UISlice";

function PlayButton({ mediaId, mediaType }: { mediaId: number; mediaType: MediaTypeApi }) {
  const { openTrailer, setOpenTrailer } = useContext(Context);

  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <button
      className="btn-primary relative z-[4] w-full pointer-events-auto !px-16 !py-2.5"
      data-id={mediaId}
      onClick={() => {
        sessionStorage.setItem("watch/navigatingFromApp", "1");
        if (mediaType == "tv") {
          dispatch(setSeasonModal(true));
        } else {
          router.push(`${mediaId}/watch?option=1`);
        }

        if (openTrailer) setOpenTrailer(false);
      }}
    >
      <i className="bi bi-play-fill  "></i> Play
    </button>
  );
}

export default PlayButton;
