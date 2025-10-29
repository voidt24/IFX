"use client";
import { useContext } from "react";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { MediaTypeApi } from "@/Types";
import { ReadonlyURLSearchParams } from "next/navigation";
import { getRunTime } from "@/helpers/getRunTime";
import EpisodeNavigation from "./EpisodeNavigation";
import useMediaDetails from "@/Hooks/useMediaDetails";
import { Context } from "@/context/Context";
import DisplayInfoTitle from "./DisplayInfoTitle";
import DisplayInfoOverview from "./DisplayInfoOverview";

function DisplayInfo({
  mediaId,
  mediaType,
  mediaTypeReady,
  season,
  episode,
  path,
  searchParams,
}: {
  mediaId: number;
  mediaType: MediaTypeApi;
  mediaTypeReady?: boolean;
  season: string | null;
  episode: string | null;
  path?: string;
  searchParams?: ReadonlyURLSearchParams;
}) {
  const { mediaDetailsData, currentMediaType, episodesArray } = useSelector((state: RootState) => state.mediaDetails);

  const { seasonArray } = useMediaDetails({ mediaId, season, episode, mediaTypeReady, mediaType, path });
  const { isMobilePWA } = useContext(Context);

  const isTV = mediaType == mediaProperties.tv.mediaType;
  return (
    <>
      <div className="flex-col-center md:items-start md:justify-start gap-6 xl:gap-10 w-full mt-6 px-1">
        <div className="flex justify-center items-start  md:items-start  gap-3.5 xl:gap-6">
          <img src={mediaDetailsData?.poster || ""} alt="poster" className="w-32 md:w-40 xl:w-56 h-auto min-h-40 rounded-lg" />

          <div className="flex flex-col items-start justify-center gap-2">
            <DisplayInfoTitle mediaId={mediaId} title={mediaDetailsData && mediaDetailsData.title} isTV={isTV} season={season} episode={episode} />
            <div className="text-left text-content-third text-[80%] md:text-[90%] flex flex-col gap-2">
              <div>
                {isTV ? (
                  episodesArray == null ? (
                    ""
                  ) : episodesArray?.[0]?.episodes ? (
                    <div className="flex flex-col gap-2">
                      <p>{getRunTime(episodesArray[0].episodes?.[Number(episode) - 1]?.runtime)}</p>
                      <p>{episodesArray[0].episodes[Number(episode) - 1]?.air_date}</p>
                    </div>
                  ) : (
                    "N/A"
                  )
                ) : (
                  <div className="flex flex-col gap-2">
                    <p>{mediaDetailsData?.runtime}</p>
                    <p>{mediaDetailsData?.releaseDate}</p>
                  </div>
                )}
              </div>

              <div>
                <i className="bi bi-star-fill text-[goldenrod]"></i> {mediaType == mediaProperties.tv.mediaType ? `${seasonArray?.[Number(season)]?.vote_average || 0}` : mediaDetailsData?.vote}
              </div>
              <p>{mediaDetailsData?.genres && mediaDetailsData.genres[0].name}</p>
            </div>

            <DisplayInfoOverview variant={"desktop"} isTV={isTV} episode={episode} />
          </div>
        </div>

        <DisplayInfoOverview variant={"mobile"} isTV={isTV} episode={episode} />
      </div>

      {!isMobilePWA && searchParams && isTV && (
        <EpisodeNavigation season={season} episode={episode} searchParams={searchParams} currentMediaType={currentMediaType} currentId={mediaId} seasonArray={seasonArray} />
      )}
    </>
  );
}

export default DisplayInfo;
