import { isReleased } from "@/helpers/isReleased";
import PlayButton from "./Buttons/PlayButton";
import TrailerButton from "./Buttons/TrailerButton";
import { MediaTypeApi } from "@/Types";
import { ImediaDetailsData } from "@/Types/mediaDetails";

function PlayOrTrailerButton({ mediaId, mediaType, mediaData }: { mediaId: number; mediaType: MediaTypeApi; mediaData: ImediaDetailsData }) {
  return isReleased(mediaData.releaseDate) ? <PlayButton mediaId={mediaId} mediaType={mediaType} /> : <TrailerButton id={mediaId} mediaType={mediaType} />;
}

export default PlayOrTrailerButton;
