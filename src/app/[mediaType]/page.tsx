import AllMediaData from "@/components/common/AllMediaData";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import { Metadata } from "next";

interface Params {
  params: { mediaType: string; id: string };
}

export function generateMetadata({ params }: Params): Metadata {
  const { mediaType } = params;
  const title = mediaType === "movies" ? "Movies - Prods" : "TV Shows - Prods";

  return {
    title,
  };
}

function isValidRoute(route: string) {
  return route === "movies" || route === "tvshows";
}
export default function MediaType({ params }: Params) {
  const { mediaType } = params;
  const mediaTypeObj = mediaType == "movies" ? mediaProperties.movie : mediaProperties.tv;
  const title = mediaType == "movies" ? "All movies" : "All TV Shows";
  return isValidRoute(mediaType) && <AllMediaData mediaTypeObj={mediaTypeObj} searchCategory={"trending"} title={title} />;
}
