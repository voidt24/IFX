import { IMediaData } from "@/Types";
import { useState } from "react";
import ComingSoonBadge from "./ComingSoonBadge";
import InTheatersBadge from "./InTheatersBadge";
import VoteBadge from "./VoteBadge";
import YearBadge from "./YearBadge";
import MediaTypeBadge from "./MediaTypeBadge";
import OriginalBadge from "@/components/common/OriginalBadge";
import useIsMobile from "@/Hooks/useIsMobile";
import { isInTheaters } from "@/helpers/isInTheaters";

function MediaCard({ result, poster, vote, canBeEdited, showBadge }: { result: IMediaData; poster: string; vote: string | undefined; canBeEdited: boolean; showBadge?: boolean }) {
  const { release_date, first_air_date, title, name, media_type, hadTheatricalRelease, digitalReleaseDate } = result;
  const notReleasedYet = (release_date && new Date(release_date).getTime() > Date.now()) || (first_air_date && new Date(first_air_date).getTime() > Date.now());
  // Recomputed against the current time on every render — never trusts a stored
  // verdict — so a card saved to a watchlist/recently-browsed/search cache long ago
  // stops showing this badge on its own once the movie has actually left theaters.
  const inTheaters = !notReleasedYet && isInTheaters(media_type, release_date, hadTheatricalRelease, digitalReleaseDate);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  return (
    <div className={`card  border-[3px] border-transparent z-[1]`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="content h-full relative">
        {poster ? (
          <img src={poster} alt="" className={`rounded-md`} width={780} height={1170} />
        ) : (
          <div className="content-center h-full w-full">
            <img src={"./logo.png"} alt="" className={`rounded-md opacity-10`} width={780} height={1170} />
            <p className="max-md:text-[90%] xl:text-[110%] h-full left-0 w-full content-center absolute top-0 text-center bg-black/75 py-2">{result.title || result.name}</p>
          </div>
        )}
        {notReleasedYet ? <ComingSoonBadge release_date={release_date} first_air_date={first_air_date} /> : inTheaters ? <InTheatersBadge /> : null}
        <OriginalBadge provider={result.originalProvider} originalTextClassName="text-[70%] sm:text-[90%]" />

        {/* todo: refact */}
        <div
          className={`absolute bottom-0 w-full px-1 h-[40%] bg-gradient-to-t from-black via-black/80 to-black/5 flex flex-col justify-end pb-2 flex-wrap overflow-hidden opacity-${isHovered && !isMobile ? "100" : "0"} `}
        >
          <div className="bottom-0 align-bottom flex flex-col justify-center items-start gap-1">
            <p className=" text-[92%] font-semibold line-clamp-2">{title || name}</p>
            <div className="flex justify-between w-full">
              <YearBadge release_date={release_date} first_air_date={first_air_date} />
              <VoteBadge vote={vote} />
            </div>
          </div>
        </div>
        {canBeEdited || showBadge ? <MediaTypeBadge mediaType={result.media_type} /> : null}
      </div>

      {isMobile && (
        <div className="px-1 mt-3">
          {" "}
          <div className="flex flex-col gap-1.5">
            <p className="text-[75%] font-semibold line-clamp-2 leading-tight">{title || name}</p>
            <div className="flex justify-between">
              <YearBadge release_date={release_date} first_air_date={first_air_date} />
              <VoteBadge vote={vote} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaCard;
