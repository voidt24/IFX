"use client";
import AllMediaData from "@/components/common/AllMediaData";
import { mediaProperties } from "@/helpers/mediaProperties.config";

export default function Movies() {
  return <AllMediaData mediaTypeObj={mediaProperties.movie} searchCategory={"popular"} title="All Movies" />;
}
