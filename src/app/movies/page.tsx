import AllMediaData from "@/components/common/AllMediaData";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movies - Prods",
};

export default function Movies() {
  return <AllMediaData mediaTypeObj={mediaProperties.movie} searchCategory={"popular"} title="All Movies" />;
}
