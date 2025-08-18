import { IMediaData } from "@/Types";
import React from "react";
import MediaCardContainer from "../MediaCard/MediaCardContainer";

function MediaGrid({ mediaData }: { mediaData: IMediaData[] }) {
  return (
    <div className="media-lists">
      {mediaData.map((data) => {
        return <MediaCardContainer key={data.id} result={data} mediaType={data.media_type} />;
      })}
    </div>
  );
}

export default MediaGrid;
