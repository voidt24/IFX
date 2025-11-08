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
import { image } from "@/helpers/api.config";

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
  const seasonIndex = Number(season && season);
  const episodeIndex = Number(episode && episode);
  const episodeData = isTV ? episodesArray && episodesArray?.[0].episodes?.[episodeIndex - 1] : null;

  return (
    <>
      <div
        className={`flex-col-center md:items-start md:justify-start gap-6 xl:gap-10 w-full mt-6 bg-cover bg-top bg-no-repeat px-6 py-6 md:px-10 md:py-14 rounded-lg relative`}
        style={{
          backgroundImage: `${episodeData ? `url(${image}${episodeData.still_path})` : ""}`,
        }}
      >
        <div
          className={`${isTV ? "absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.85)_0%,rgba(0,0,0,1)_100%)] z-[1] rounded-lg" : " hidden"} `}
        ></div>
        <div className="flex justify-center items-start  md:items-start  gap-3.5 xl:gap-6 z-[2]">
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
                <i className="bi bi-star-fill text-[goldenrod]"></i> {isTV ? `${seasonArray?.[Number(season)]?.vote_average || 0}` : mediaDetailsData?.vote}
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
