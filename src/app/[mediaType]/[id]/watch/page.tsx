import { APP_NAME } from "@/helpers/api.config";
import { fetchDetailsData } from "@/helpers/fetchDetailsData";
import { MediaTypeUrl } from "@/Types/mediaType";
import DisplayMedia from "@/views/DisplayMedia";
import { Metadata } from "next";
import { headers } from "next/headers";
interface Params {
  params: { mediaType: MediaTypeUrl; id: string; season: string; episode: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  // queryParams injected from middleware to headers
  const headersList = headers();
  const season = headersList.get("x-season") || "N/A";
  const episode = headersList.get("x-episode") || "N/A";

  const { mediaType, id } = params;
  async function getData(mediaType: string, id: string) {
    let mediaTitle = "";

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
    title: params.mediaType == "movies" ? `Watch ${title} - ${APP_NAME}` : `Watch ${title} - S${season}-E${episode} - ${APP_NAME}`,
  };
}

export default function Watch({ params }: Params) {
  return <DisplayMedia mediaId={Number(params.id)} mediaType={params.mediaType} />;
}
