"use client";
import { useContext, useEffect, useState } from "react";
import { Context } from "@/context/Context";
import { API_KEY, apiUrl, image, imageWithSize, MEDIA_URL_RESOLVER, srcOptions } from "@/helpers/api.config";
import { getRunTime } from "@/helpers/getRunTime";
import { fetchDetailsData } from "@/helpers/fetchDetailsData";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import { CircularProgress } from "@mui/material";
import Slider from "../Slider/Slider";
import CollapsibleElement from "../common/CollapsibleElement";
import { ISeasonArray, MediaTypeApi } from "@/Types";
import { ImediaDetailsData } from "@/Types/mediaDetails";
import {  setEpisodesArray } from "@/store/slices/mediaDetailsSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export async function getInfo(mediaType: string | undefined, mediaId: number) {
  try {
    const data = await fetchDetailsData("byId", mediaType, mediaId);
    return data;
  } catch (error) {
    throw error;
  }
}
function DisplayMediaPWA({ mediaType, mediaId }: { mediaType: MediaTypeApi; mediaId: number }) {
  const { sheetMediaType } = useContext(Context);
  const [mediaDetailsData, setMediaDetailsData] = useState<ImediaDetailsData | null>(null);

  const [mediaURL, setMediaURL] = useState<string | undefined>("");
  const [selectedSrc, setSelectedSrc] = useState(0);
  const [seasonArray, setSeasonArray] = useState<
    {
      air_date: string;
      episode_count: number;
      id: number;
      name: string;
      overview: string;
      poster_path: string;
      season_number: number;
      vote_average: number;
    }[]
  >();

  const { episodesArray, activeEpisode, activeSeason } = useSelector((state: RootState) => state.mediaDetails);

  useEffect(() => {
    async function setInitialMediaInfo() {
      const info = await getInfo(mediaType, mediaId);
      const { title, name, overview, release_date, first_air_date, genres, vote_average, backdrop_path, poster_path, runtime, number_of_seasons, seasons } = info;

      setMediaDetailsData({
        results: [],
        heroBackground: `${image}${backdrop_path}`,
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
      });
    }

    setInitialMediaInfo();
    setMediaURL(sheetMediaType == "movies" ? MEDIA_URL_RESOLVER(0, mediaId, "movie") : MEDIA_URL_RESOLVER(0, mediaId, "tv", Number(activeSeason), Number(activeEpisode)));
  }, [mediaId]);

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
        if (mediaId != undefined) {
          const seasonResponse = await fetch(`${apiUrl}${mediaType}/${mediaId}/season/${Number(activeSeason)}?api_key=${API_KEY}`);
          const json = await seasonResponse.json();
          setEpisodesArray([json]);
        }
      } catch (error) {
        console.error("Error fetching season data:", error);
      }
    }
    if (mediaType == "tv") {
      getEpisodes();
    }
  }, [mediaDetailsData]);

  const truncatedTextStyle: React.CSSProperties & { WebkitLineClamp: string; WebkitBoxOrient: "horizontal" | "vertical" | "inline-axis" | "block-axis" } = {
    WebkitLineClamp: "3 ",
    WebkitBoxOrient: "vertical",
    overflow: "hidden ",
    display: "-webkit-box ",
  };

  return (
    <div className=" relative text-center bg-cover bg-top bg-no-repeat overflow-hidden" style={{ backgroundImage: `url(${mediaDetailsData?.heroBackground})` }}>
      <div className="to-top-gradient-bg z-[1]"></div>

      <div className="wrapper relative z-[2]">
        <div className="h-full w-full m-auto flex flex-col items-center justify-center">
          <div className="bg-black/35 backdrop-blur-lg flex flex-col items-center justify-center gap-2 xl:gap-4 h-auto w-full px-2 md:px-4 max-sm:py-12 py-4 rounded-xl xl:px-10">
            <div className="src-options p-0 w-full max-sm:text-[80%]">
              <Slider sideControls padding="px-7">
                {srcOptions.map((option, index) => {
                  return (
                    <button
                      key={index}
                      className={`border bg-black rounded-full py-[4px]  ${selectedSrc == index ? "bg-zinc-300 text-black" : "text-content-secondary hover:text-content-primary hover:bg-zinc-800"}`}
                      onClick={() => {
                        if (selectedSrc != index) {
                          setSelectedSrc(index);
                          setMediaURL("");
                          setMediaURL(mediaType == "movie" ? MEDIA_URL_RESOLVER(index, mediaId, "movie") : MEDIA_URL_RESOLVER(index, mediaId, "tv", Number(activeSeason), Number(activeEpisode)));
                        }
                      }}
                    >
                      Option {index + 1}
                    </button>
                  );
                })}
              </Slider>
            </div>

            {mediaURL == "" ? (
              <div className="h-[20rem] lg:h-[40rem] xl:h-[40rem]  w-full flex items-center justify-center">
                {" "}
                <CircularProgress color="inherit" size={30} />
              </div>
            ) : (
              <iframe src={mediaURL} className="h-[20rem] lg:h-[40rem] xl:h-[40rem] w-full  rounded-lg" title="media" referrerPolicy="origin" allowFullScreen></iframe>
            )}

            <div className="flex-col-center md:items-start md:justify-start gap-6 xl:gap-10 w-full mt-6 px-1">
              <div className="flex justify-center items-start  md:items-start  gap-3.5 xl:gap-6">
                <img src={mediaDetailsData?.poster || ""} alt="poster" className="w-32 md:w-40 xl:w-56 h-auto min-h-40 rounded-lg" />

                <div className="flex flex-col items-start justify-center gap-2">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    <p className="font-bold text-xl md:text-2xl xl:text-3xl text-left">{mediaDetailsData?.title}</p>

                    {mediaType == mediaProperties.tv.mediaType && (
                      <p className="text-content-secondary text-left max-lg:text-[88%]">
                        {activeSeason && activeSeason != 0 && `Season ${activeSeason} - `}
                        {activeEpisode && activeEpisode != 0 && `Episode ${activeEpisode} `}
                        {episodesArray?.[0]?.episodes &&
                          episodesArray[0].episodes[Number(activeEpisode) - 1]?.name.toLowerCase() != `episode ${Number(activeEpisode)}` &&
                          `- ${episodesArray[0].episodes[Number(activeEpisode) - 1]?.name}`}
                      </p>
                    )}
                  </div>
                  <div className="text-left text-content-third text-[80%] md:text-[90%] flex flex-col gap-2">
                    <div>
                      {mediaType == mediaProperties.tv.mediaType ? (
                        episodesArray == null ? (
                          ""
                        ) : episodesArray?.[0]?.episodes ? (
                          <p>{getRunTime(episodesArray[0].episodes?.[Number(activeEpisode) - 1]?.runtime)}</p>
                        ) : (
                          "No runtime data available"
                        )
                      ) : (
                        mediaDetailsData?.runtime
                      )}
                    </div>
                    <div>
                      {mediaType == mediaProperties.tv.mediaType ? (
                        episodesArray == null ? (
                          ""
                        ) : episodesArray?.[0]?.episodes ? (
                          <p>{episodesArray[0].episodes[Number(activeEpisode) - 1]?.air_date}</p>
                        ) : (
                          "No episode data available"
                        )
                      ) : (
                        mediaDetailsData?.releaseDate
                      )}
                    </div>
                    <div>
                      <i className="bi bi-star-fill text-[goldenrod]"></i>{" "}
                      {mediaType == mediaProperties.tv.mediaType ? `${seasonArray?.[Number(activeSeason)]?.vote_average || 0}` : mediaDetailsData?.vote}
                    </div>
                    <p>{mediaDetailsData?.genres && mediaDetailsData.genres[0].name}</p>
                  </div>
                </div>
              </div>

              <div className="info flex flex-col items-center md:items-start justify-center flex-wrap gap-2 text-content-primary text-[85%] md:text-[95%] xl:text-[100%]">
                <CollapsibleElement customClassesForParent={"md:text-left md:w-[85%] xl:w-[90%]"} truncatedTextStyle={truncatedTextStyle}>
                  {mediaType == mediaProperties.tv.mediaType ? (
                    episodesArray == null ? (
                      ""
                    ) : episodesArray?.[0]?.episodes && episodesArray[0].episodes[Number(activeEpisode) - 1] ? (
                      <p>{episodesArray[0].episodes[Number(activeEpisode) - 1].overview}</p>
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
        </div>
      </div>
    </div>
  );
}

export default DisplayMediaPWA;
