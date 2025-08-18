import { IMediaData } from "@/Types";
import React from "react";
import ComingSoonBadge from "./ComingSoonBadge";
import VoteBadge from "./VoteBadge";
import YearBadge from "./YearBadge";
import MediaTypeBadge from "./MediaTypeBadge";

function MediaCard({ result, poster, vote, canBeEdited }: { result: IMediaData; poster: string; vote: string | undefined; canBeEdited: boolean }) {
  const { release_date, first_air_date } = result;

  return (
    <div className={`card rounded-md border-[3px] border-transparent z-[1] lg:hover:border lg:hover:border-brand-primary transition-all duration-200 `}>
      <div className="content ">
        <VoteBadge vote={vote} />

        <YearBadge release_date={release_date} first_air_date={first_air_date} />

        <img src={poster} alt="" className={`rounded-md`} width={780} height={1170} />

        <ComingSoonBadge release_date={release_date} first_air_date={first_air_date} />

        {canBeEdited ? <MediaTypeBadge mediaType={result.media_type} /> : null}
      </div>
    </div>
  );
}

export default MediaCard;
