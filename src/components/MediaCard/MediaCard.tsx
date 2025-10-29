import { IMediaData } from "@/Types";
import React from "react";
import ComingSoonBadge from "./ComingSoonBadge";
import VoteBadge from "./VoteBadge";
import YearBadge from "./YearBadge";
import MediaTypeBadge from "./MediaTypeBadge";

function MediaCard({ result, poster, vote, canBeEdited }: { result: IMediaData; poster: string; vote: string | undefined; canBeEdited: boolean }) {
  const { release_date, first_air_date } = result;
  const notReleasedYet = (release_date && new Date(release_date).getTime() > Date.now()) || (first_air_date && new Date(first_air_date).getTime() > Date.now());

  return (
    <div className={`card h-full border-[3px] border-transparent z-[1]`}>
      <div className="content h-full">
        <VoteBadge vote={vote} />

        <YearBadge release_date={release_date} first_air_date={first_air_date} />

        {poster ? (
          <img src={poster} alt="" className={`rounded-md`} width={780} height={1170} />
        ) : (
          <div className="content-center h-full w-full">
            <img src={"./logo.png"} alt="" className={`rounded-md opacity-10`} width={780} height={1170} />
            <p className="text-[80%] h-full left-0 w-full content-center absolute top-0 text-center bg-black/75 py-2">{result.title || result.name}</p>
          </div>
        )}

        {notReleasedYet ? <ComingSoonBadge release_date={release_date} first_air_date={first_air_date} /> : null}

        {canBeEdited ? <MediaTypeBadge mediaType={result.media_type} /> : null}
      </div>
    </div>
  );
}

export default MediaCard;
