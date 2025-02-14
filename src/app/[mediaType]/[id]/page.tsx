import MediaDetails from "@/components/MediaDetails";
import { fetchDetailsData } from "@/helpers/fetchDetailsData";
import { Metadata } from "next";

interface Params {
  params: { mediaType: string; id: string };
}
export async function getData(mediaType: string, id: string) {
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
export async function generateMetadata({ params }: Params) {
  const { mediaType, id } = params;
  const title = await getData(mediaType, id);

  return {
    title: title + " - Prods",
  };
}

const Media = ({ params }: Params) => {
  return <MediaDetails mediaType={params.mediaType == "movies" ? "movie" : "tv"} />;
};

export default Media;
