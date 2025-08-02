"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Link from "next/link";
import CollapsibleElement from "../common/CollapsibleElement";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { ISeasonArray, MediaTypeApi, MediaTypeUrl } from "@/Types";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { getRunTime } from "@/helpers/getRunTime";
import { API_KEY, apiUrl, image, imageWithSize } from "@/helpers/api.config";
import { fetchDetailsData } from "@/helpers/fetchDetailsData";
import { setCurrentMediaType, setMediaDetailsData, setCurrentId, setEpisodesArray } from "@/store/slices/mediaDetailsSlice";
import isValidMediatype, { setMedia } from "@/helpers/isvalidMediatype";
import { getApiMediaType } from "@/helpers/getApiMediaType";
import EpisodeNavigation from "./EpisodeNavigation";

function paramIsValid(param: string | null) {
  if (!param || Number(param) < 1) return false;

  if (Number.isSafeInteger(Number(param))) {
    return true;
  }
}

export async function getInfo(mediaType: MediaTypeApi, mediaId: number | undefined) {
  try {
    const data = await fetchDetailsData("byId", mediaType, mediaId);
    return data;
  } catch (error) {
    throw error;
  }
}

function DisplayInfo({
  mediaType,

  mediaTypeReady,
  setMediaTypeReady,
}: {
  mediaType: MediaTypeUrl;
  mediaTypeReady: boolean;
  setMediaTypeReady: Dispatch<SetStateAction<boolean>>;
}) {
  const truncatedTextStyle: React.CSSProperties & { WebkitLineClamp: string; WebkitBoxOrient: "horizontal" | "vertical" | "inline-axis" | "block-axis" } = {
    WebkitLineClamp: "3 ",
    WebkitBoxOrient: "vertical",
    overflow: "hidden ",
    display: "-webkit-box ",
  };
  const [seasonArray, setSeasonArray] = useState<ISeasonArray[]>([]);
  const { currentId, mediaDetailsData, currentMediaType, episodesArray } = useSelector((state: RootState) => state.mediaDetails);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  params.set("season", "1");
  params.set("episode", "1");
  const season = searchParams.get("season");
  const episode = searchParams.get("episode");
  const path = usePathname();

  const { id: idFromUrl } = useParams();
  const router = useRouter();

  useEffect(() => {
    return () => {
      dispatch(setMediaDetailsData(null));
    };
  }, []);

  useEffect(() => {
    if (mediaType == "movies" && (season == null || episode == null)) return;
    if (mediaType == "tvshows") {
      if (season == null || episode == null || !paramIsValid(season) || !paramIsValid(episode)) {
        router.push(`?${params.toString()}`);
      }
    }
  }, [season, episode]);

  //1.set mediatype always to a valid value or to 'movies' by  default
  //2.establish mediaTypeReady to advance to other requests in order to get correct data
  useEffect(() => {
    const mediaTypeFromUrl = setMedia(path);
    dispatch(setCurrentMediaType(isValidMediatype(mediaTypeFromUrl) ? mediaTypeFromUrl : "movies"));
    setMediaTypeReady(true);
  }, [path]);

  //set currentId to url value (if url changes)
  useEffect(() => {
    if (Number(idFromUrl) != currentId && currentId == 0) {
      dispatch(setCurrentId(Number(idFromUrl)));
    }
  }, [idFromUrl]);

  // if mediatype is set and currentId is valid, get  general info of movie or tvshow
  useEffect(() => {
    if (!mediaTypeReady || !currentId || currentId == 0) return;

    async function setInitialData() {
      const inf = await getInfo(getApiMediaType(mediaType), currentId);
      const { title, name, overview, release_date, first_air_date, genres, vote_average, backdrop_path, poster_path, runtime, number_of_seasons, seasons } = inf;

      dispatch(
        setMediaDetailsData({
          results: [],
          heroBackground: window.innerWidth >= 640 ? `${image}${backdrop_path}` : `${image}${poster_path}`,
          bigHeroBackground: `${image}${backdrop_path}`,
          title: title || name,
          poster: `${imageWithSize("500")}${poster_path}`,
          overview,
          releaseDate: release_date?.slice(0, 4) || first_air_date?.slice(0, 4),
          vote: String(vote_average).slice(0, 3),
          genres: genres && genres.map((genre: { name: string }) => genre.name),
          loadingAllData: false,
          runtime: runtime ? getRunTime(runtime) : "",
          seasons: number_of_seasons ? (number_of_seasons == 1 ? number_of_seasons + " Season" : number_of_seasons + " Seasons") : "",
          seasonsArray: seasons,
        })
      );
    }

    setInitialData();
  }, [mediaTypeReady, currentId, season, episode, path]);

  useEffect(() => {
    if (!mediaDetailsData) return;

    if (mediaDetailsData.seasonsArray && Array.isArray(mediaDetailsData.seasonsArray)) {
      const seasonInfo: ISeasonArray[] | null = [];

      let seasonA: ISeasonArray;
      for (seasonA of mediaDetailsData.seasonsArray) {
        if (seasonA.name != "Specials") {
          seasonInfo.push(seasonA);
        }
      }
      setSeasonArray(seasonInfo);
    }

    async function getEpisodes() {
      try {
        if (currentId && currentId != 0) {
          const seasonResponse = await fetch(`${apiUrl}${getApiMediaType(mediaType)}/${currentId}/season/${Number(season)}?api_key=${API_KEY}`);
          const json = await seasonResponse.json();
          dispatch(setEpisodesArray([json]));
        }
      } catch (error) {
        console.error("Error fetching season data:", error);
      }
    }
    if (mediaType == "tvshows") {
      getEpisodes();
    }
  }, [mediaDetailsData]);

  return (
    <>
      <div className="flex-col-center md:items-start md:justify-start gap-6 xl:gap-10 w-full mt-6 px-1">
        <div className="flex justify-center items-start  md:items-start  gap-3.5 xl:gap-6">
          <img src={mediaDetailsData?.poster || ""} alt="poster" className="w-32 md:w-40 xl:w-56 h-auto min-h-40 rounded-lg" />

          <div className="flex flex-col items-start justify-center gap-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <Link className="font-bold text-xl md:text-2xl xl:text-3xl text-left hover:underline" href={`/${currentMediaType}/${currentId}`}>
                {mediaDetailsData?.title}
              </Link>

              {mediaType == mediaProperties.tv.route && (
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
                {mediaType == mediaProperties.tv.route ? (
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
                {mediaType == mediaProperties.tv.route ? (
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
                <i className="bi bi-star-fill text-[goldenrod]"></i> {mediaType == mediaProperties.tv.route ? `${seasonArray?.[Number(season)]?.vote_average || 0}` : mediaDetailsData?.vote}
              </div>
              <p>{mediaDetailsData?.genres && mediaDetailsData.genres[0].name}</p>
            </div>

            <div className=" info max-md:hidden flex flex-col items-center md:items-start justify-center flex-wrap gap-2 text-content-primary text-[85%] md:text-[95%] xl:text-[100%]">
              <CollapsibleElement customClassesForParent={" md:text-left md:w-[85%] xl:w-[90%]"} truncatedTextStyle={truncatedTextStyle}>
                {mediaType == mediaProperties.tv.route ? (
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
            {mediaType == mediaProperties.tv.route ? (
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

      {mediaType == mediaProperties.tv.route && (
        <EpisodeNavigation season={season} episode={episode} searchParams={searchParams} currentMediaType={currentMediaType} currentId={currentId} seasonArray={seasonArray} />
      )}
    </>
  );
}

export default DisplayInfo;
