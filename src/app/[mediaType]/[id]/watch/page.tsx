import DisplayMedia from "@/components/DisplayMedia/DisplayMedia";
import { APP_NAME } from "@/helpers/api.config";
import { MediaTypeUrl } from "@/Types/mediaType";
import { Metadata } from "next";
import { headers } from "next/headers";
interface Params {
  params: { mediaType: MediaTypeUrl; id: string };
}

export function generateMetadata({ params }: Params): Metadata {
  const headersList = headers();
  const name = headersList.get("x-name") || params.id;
  const season = headersList.get("x-season") || "N/A";
  const episode = headersList.get("x-episode") || "N/A";

  return {
    title: params.mediaType == "movies" ? `Watch ${name} - ${APP_NAME}` : `Watch ${name} - S${season}-E${episode} - ${APP_NAME}`,
  };
}

export default function Watch({ params }: Params) {
  return <DisplayMedia mediaType={params.mediaType} />;
}
