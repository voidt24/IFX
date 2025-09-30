"use client";
import { useContext } from "react";
import Link from "next/link";
import CollapsibleElement from "../common/CollapsibleElement";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { MediaTypeApi } from "@/Types";
import { ReadonlyURLSearchParams } from "next/navigation";
import { getRunTime } from "@/helpers/getRunTime";
import EpisodeNavigation from "./EpisodeNavigation";
import useMediaDetails from "@/Hooks/useMediaDetails";
import { Context } from "@/context/Context";

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
  const truncatedTextStyle: React.CSSProperties & { WebkitLineClamp: string; WebkitBoxOrient: "horizontal" | "vertical" | "inline-axis" | "block-axis" } = {
    WebkitLineClamp: "3 ",
    WebkitBoxOrient: "vertical",
    overflow: "hidden ",
    display: "-webkit-box ",
  };
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
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <Link className="font-bold text-xl md:text-2xl xl:text-3xl text-left hover:underline" href={`/${currentMediaType}/${mediaId}`}>
                {mediaDetailsData?.title}
              </Link>

              {isTV && (
                <p className="text-content-secondary text-left max-lg:text-[88%]">
                  {season && season != "0" && `Season ${season} - `}
                  {episode && episode != "0" && `Episode ${episode} `}
                  {episodesArray?.[0]?.episodes &&
                    episodesArray[0].episodes[Number(episode) - 1]?.name.toLowerCase() != `episode ${Number(episode)}` &&
                    `- ${episodesArray[0].episodes[Number(episode) - 1]?.name}`}
                </p>
              )}
            </div>
            <div className="text-left text-content-third text-[80%] md:text-[90%] flex flex-col gap-2">
              <div>
                {isTV ? (
                  episodesArray == null ? (
                    ""
                  ) : episodesArray?.[0]?.episodes ? (
                    <p>{getRunTime(episodesArray[0].episodes?.[Number(episode) - 1]?.runtime)}</p>
                  ) : (
                    "No runtime data available"
                  )
                ) : (
                  mediaDetailsData?.runtime
                )}
              </div>
              <div>
                {isTV ? (
                  episodesArray == null ? (
                    ""
                  ) : episodesArray?.[0]?.episodes ? (
                    <p>{episodesArray[0].episodes[Number(episode) - 1]?.air_date}</p>
                  ) : (
                    "No episode data available"
                  )
                ) : (
                  mediaDetailsData?.releaseDate
                )}
              </div>
              <div>
                <i className="bi bi-star-fill text-[goldenrod]"></i> {mediaType == mediaProperties.tv.mediaType ? `${seasonArray?.[Number(season)]?.vote_average || 0}` : mediaDetailsData?.vote}
              </div>
              <p>{mediaDetailsData?.genres && mediaDetailsData.genres[0].name}</p>
            </div>

            <div className=" info max-md:hidden flex flex-col items-center md:items-start justify-center flex-wrap gap-2 text-content-primary text-[85%] md:text-[95%] xl:text-[100%]">
              <CollapsibleElement customClassesForParent={" md:text-left md:w-[85%] xl:w-[90%]"} truncatedTextStyle={truncatedTextStyle}>
                {isTV ? (
                  episodesArray == null ? (
                    ""
                  ) : episodesArray?.[0]?.episodes && episodesArray[0].episodes[Number(episode) - 1] ? (
                    <p>{episodesArray[0].episodes[Number(episode) - 1].overview}</p>
                  ) : (
                    "No overview"
                  )
                ) : (
                  mediaDetailsData?.overview
                )}
              </CollapsibleElement>
            </div>
          </div>
        </div>
        {/* MOBILE */}
        <div className="info md:hidden flex flex-col items-center md:items-start justify-center flex-wrap gap-2 text-content-primary text-[85%] md:text-[95%] xl:text-[100%]">
          <CollapsibleElement customClassesForParent={"md:text-left md:w-[85%] xl:w-[90%]"} truncatedTextStyle={truncatedTextStyle}>
            {isTV ? (
              episodesArray == null ? (
                ""
              ) : episodesArray?.[0]?.episodes && episodesArray[0].episodes[Number(episode) - 1] ? (
                <p>{episodesArray[0].episodes[Number(episode) - 1].overview}</p>
              ) : (
                "No overview"
              )
            ) : (
              mediaDetailsData?.overview
            )}
          </CollapsibleElement>
        </div>
      </div>

      {!isMobilePWA && searchParams && isTV && (
        <EpisodeNavigation season={season} episode={episode} searchParams={searchParams} currentMediaType={currentMediaType} currentId={mediaId} seasonArray={seasonArray} />
      )}
    </>
  );
}

export default DisplayInfo;
