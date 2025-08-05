import MediaDetails from "@/views/MediaDetails";
import NextModal from "../../NextModal";

interface Params {
  params: { mediaType: string; id: string };
}

const Media = ({ params }: Params) => {
  return (
    <NextModal>
      <MediaDetails mediaType={params.mediaType == "movies" ? "movie" : "tv"} mediaId={Number(params.id)} />
    </NextModal>
  );
};

export default Media;
