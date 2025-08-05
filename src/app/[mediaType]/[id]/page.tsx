import { APP_NAME } from "@/helpers/api.config";
import { fetchDetailsData } from "@/helpers/fetchDetailsData";
import MediaDetails from "@/views/MediaDetails";
import { Metadata } from "next";

interface Params {
  params: { mediaType: string; id: string };
}
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { mediaType, id } = params;
  async function getData(mediaType: string, id: string) {
    let mediaTitle = "Movie Details";

    try {
      const mediaDetails = await fetchDetailsData("byId", mediaType == "movies" ? "movie" : "tv", id);

      if (mediaType == "movies") {
        if ((mediaDetails && mediaDetails.title) || mediaDetails.original_title) {
          mediaTitle = mediaDetails.title || mediaDetails.original_title;
        }
      } else {
        if ((mediaDetails && mediaDetails.name) || mediaDetails.original_name) {
          mediaTitle = mediaDetails.name || mediaDetails.original_name;
        }
      }

      return mediaTitle;
    } catch (error) {
      console.error("Error fetching title:", error);
    }
  }
  const title = await getData(mediaType, id);

  return {
    title: title + ` - ${APP_NAME}`,
  };
}

const Media = ({ params }: Params) => {
  return <MediaDetails mediaType={params.mediaType == "movies" ? "movie" : "tv"} mediaId={Number(params.id)} />;
};

export default Media;
