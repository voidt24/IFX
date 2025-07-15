import { Context, ImediaDetailsData } from "@/context/Context";
import { saveToHistory } from "@/firebase/saveToHistory";
import { IhistoryMedia } from "@/Types";
import { MediaTypeApi } from "@/Types/mediaType";
import { useRouter } from "next/navigation";
import { useContext } from "react";

function PlayButton({ mediaId, mediaType, data }: { mediaId: number; mediaType: MediaTypeApi; data: ImediaDetailsData }) {
  const { firebaseActiveUser, setSeasonModal, openTrailer, setOpenTrailer, isMobilePWA, setOpenDisplayMediaSheet, setCurrentId, setSheetMediaType } = useContext(Context);
  const router = useRouter();

  return (
    <button
      className="btn-primary relative z-[4] w-full pointer-events-auto"
      data-id={mediaId}
      onClick={() => {
        if (mediaType == "tv") {
          setSeasonModal(true);
        } else {
          if (isMobilePWA) {
            setSheetMediaType(mediaType == "movie" ? "movies" : "tvshows");
            setCurrentId(mediaId);
            setOpenDisplayMediaSheet(true);
          } else {
            router.push(`${mediaId}/watch?name=${data?.title}`);
          }
          const dataToSave: IhistoryMedia = {
            id: mediaId,
            media_type: mediaType,
            title: data?.title,
            vote_average: data?.vote,
            poster_path: data?.poster,
            backdrop_path: data?.bigHeroBackground,
            release_date: data?.releaseDate,
            watchedAt: Date.now(),
          };
  
          if (firebaseActiveUser && mediaId && firebaseActiveUser.uid) {
            try {
              saveToHistory(dataToSave, mediaId, firebaseActiveUser.uid);
            } catch (error) {
              console.log(error);
            }
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
