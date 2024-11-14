"use client";
import AllMediaData from "@/components/common/AllMediaData";
import { mediaProperties } from "@/helpers/mediaProperties.config";

export default function Tvshows() {
  return <AllMediaData mediaTypeObj={mediaProperties.tv} searchCategory={"trending"} title="All TV Shows" />;
}
