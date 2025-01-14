import AllMediaData from "@/components/common/AllMediaData";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TV Shows - Prods",
};
export default function Tvshows() {
  return <AllMediaData mediaTypeObj={mediaProperties.tv} searchCategory={"trending"} title="All TV Shows" />;
}
