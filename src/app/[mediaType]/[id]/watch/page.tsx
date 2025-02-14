import DisplayMedia from "@/components/common/DisplayMedia";
import { Metadata } from "next";
import { headers } from "next/headers";
interface Params {
  params: { mediaType: string; id: string };
}

export function generateMetadata({ params }: Params): Metadata {
  const headersList = headers();
  const name = headersList.get("x-name") || params.id;
  const season = headersList.get("x-season") || "N/A";
  const episode = headersList.get("x-episode") || "N/A";

  return {
    title: params.mediaType == "movies" ? `Watch ${name} - Prods` : `Watch ${name} - S${season}-E${episode} - Prods`,
  };
}

export default function Watch({ params }: Params) {
  return <DisplayMedia mediaType={params.mediaType == "movies" ? "movie" : "tv"} />;
}
