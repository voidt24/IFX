"use client";
import { useContext, useEffect, useState } from "react";
import { Context } from "@/context/Context";
import { API_KEY, apiUrl, image, imageWithSize, MEDIA_URL_RESOLVER, srcOptions } from "@/helpers/api.config";
import { getRunTime } from "@/helpers/getRunTime";
import { fetchDetailsData } from "@/helpers/fetchDetailsData";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import isValidMediatype, { setMedia } from "@/helpers/isvalidMediatype";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import Slider from "../Slider";
import CollapsibleElement from "./CollapsibleElement";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { database, usersCollectionName } from "@/firebase/firebase.config";
import { IhistoryMedia } from "@/Types/index";
import { saveToHistory } from "@/firebase/saveToHistory";
function DisplayMedia({ mediaType }: { mediaType: string }) {
  const {
    currentId,
    firebaseActiveUser,
    currentMediaType,
    setCurrentMediaType,
    mediaDetailsData,
    setMediaDetailsData,
    setCurrentId,
    episodesArray,
    setEpisodesArray,
    setSeasonModal,
    setActiveSeason,
  } = useContext(Context);
  const path = usePathname();

  const { id: idFromUrl } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const season = searchParams.get("season");
  const episode = searchParams.get("episode");
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

  const params = new URLSearchParams(searchParams.toString());
  params.set("season", "1");
  params.set("episode", "1");

  useEffect(() => {
    const mediaTypeFromUrl = setMedia(path);
    if (isValidMediatype(mediaTypeFromUrl)) {
      setCurrentMediaType(mediaTypeFromUrl);
    } else {
      setCurrentMediaType("movies");
    }
  }, [path]);

  useEffect(() => {
    if (Number(idFromUrl) != currentId && currentId == undefined) {
      setCurrentId(Number(idFromUrl));
    }
  }, [idFromUrl]);

  useEffect(() => {
    async function getInfo() {
      try {
        const data = await fetchDetailsData("byId", currentMediaType == "movies" ? "movie" : "tv", currentId);
        const { title, name, overview, release_date, first_air_date, genres, vote_average, backdrop_path, poster_path, runtime, number_of_seasons, seasons } = data;

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
        });
      } catch (error) {
        throw error;
      }
    }
    if (currentId != undefined) {
      getInfo();
    }
    setMediaURL(mediaType == "movie" ? MEDIA_URL_RESOLVER(0, currentId, "movie") : MEDIA_URL_RESOLVER(0, currentId, "tvshows", Number(season), Number(episode)));
    function paramIsValid(param: string | null) {
      if (!param || param == "0") return false;

      if (Number.isSafeInteger(Number(param))) {
        return true;
      }
    }
    if (mediaType == "tv" && (!paramIsValid(season) || !paramIsValid(episode))) {
      router.push(`?${params.toString()}`);
    }

    if (mediaDetailsData?.seasonsArray && Array.isArray(mediaDetailsData.seasonsArray)) {
      interface InewSeasonArray {
        air_date: string;
        episode_count: number;
        id: number;
        name: string;
        overview: string;
        poster_path: string;
        season_number: number;
        vote_average: number;
      }
      const newSeasonA: InewSeasonArray[] | null = [];

      let seasonA: InewSeasonArray;
      for (seasonA of mediaDetailsData?.seasonsArray) {
        if (seasonA.name != "Specials") {
          newSeasonA.push(seasonA);
        }
      }
      setSeasonArray(newSeasonA);
    }

    async function getEpisodes() {
      try {
        if (currentId != undefined) {
          const seasonResponse = await fetch(`${apiUrl}${mediaType}/${currentId}/season/${Number(season)}?api_key=${API_KEY}`);
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

    const dataToSave: IhistoryMedia = {
      id: currentId,
      media_type: currentMediaType === "tvshows" ? "tv" : "movie",
      ...(currentMediaType === "tvshows" && {
        episodeId: episodesArray?.[0].episodes?.[Number(episode) - 1].id,
        season: Number(season),
        episode: episodesArray?.[0].episodes?.[Number(episode) - 1].name,
        episode_number: Number(episode),
        episode_image: `${image}${episodesArray?.[0].episodes?.[Number(episode) - 1].still_path}`,
      }),
      title: mediaDetailsData?.title,
      vote_average: currentMediaType === "tvshows" ? episodesArray?.[0].episodes?.[Number(episode) - 1].vote_average : mediaDetailsData?.vote,
      poster_path: mediaDetailsData?.poster,
      backdrop_path: mediaDetailsData?.bigHeroBackground,
      release_date: mediaDetailsData?.releaseDate,
      watchedAt: Date.now(),
    };

    if (firebaseActiveUser && firebaseActiveUser.uid && dataToSave) {
      if (dataToSave.media_type === "movie" && currentId) {
        saveToHistory(dataToSave, currentId, firebaseActiveUser.uid);
      } else {
        if (dataToSave.episodeId) {
          saveToHistory(dataToSave, dataToSave.episodeId, firebaseActiveUser.uid);
        }
      }
    } 
  }, [currentId, firebaseActiveUser, season, episode, path]);

  const truncatedTextStyle: React.CSSProperties & { WebkitLineClamp: string; WebkitBoxOrient: "horizontal" | "vertical" | "inline-axis" | "block-axis" } = {
    WebkitLineClamp: "3 ",
    WebkitBoxOrient: "vertical",
    overflow: "hidden ",
    display: "-webkit-box ",
  };

  return (
    <div
      className="media-details min-h-[90vh] sm:min-h-screen  h-full pb-6 sm:mt-16 flex flex-col items-center justify-center "
      style={{ backgroundImage: `url(${mediaDetailsData?.heroBackground})` }}
    >
      <div className="overlay"></div>
      <i
        className="bi bi-arrow-left"
        onClick={() => {
          router.back();
        }}
      ></i>
      <div className="media-details__initial-content h-full w-full sm:w-[85%] lg:w-[80%] xl:w-[75%] 4k:w-[1500px] m-auto flex flex-col items-center justify-center ">
        <div className="bg-black/85 flex flex-col items-center justify-center gap-2 xl:gap-4  h-auto  w-full px-2 md:px-4 max-sm:py-12 py-4 rounded-xl xl:px-10">
          <div className="src-options text-xl xl:text-2xl w-full">
            <div className=" p-2 text-[55%] ">
              <Slider sideControls>
                {srcOptions.map((option, index) => {
                  return (
                    <button
                      key={index}
                      className={`border bg-black rounded-full py-.5  ${selectedSrc == index ? "bg-zinc-300 text-black" : "text-white/70 hover:bg-zinc-800"}`}
                      onClick={() => {
                        if (selectedSrc != index) {
                          setSelectedSrc(index);
                          setMediaURL("");
                          setMediaURL(mediaType == "movie" ? MEDIA_URL_RESOLVER(index, currentId, "movie") : MEDIA_URL_RESOLVER(index, currentId, "tvshows", Number(season), Number(episode)));
                        }
                      }}
                    >
                      Option {index + 1}
                    </button>
                  );
                })}
              </Slider>
            </div>
          </div>
          {mediaURL == "" ? (
            <div className="h-[20rem] lg:h-[40rem] xl:h-[40rem]  w-full flex items-center justify-center">
              {" "}
              <CircularProgress color="inherit" size={30} />
            </div>
          ) : (
            <iframe src={mediaURL} className="h-[20rem] lg:h-[40rem] xl:h-[40rem] w-full " title="media" referrerPolicy="origin" allowFullScreen></iframe>
          )}

          <div className="flex flex-col items-center justify-center md:items-start md:justify-start gap-6 xl:gap-10 w-full mt-6 px-4">
            <div className="flex  justify-center items-start  md:items-start  gap-3.5 xl:gap-6">
              <img src={mediaDetailsData?.poster || ""} alt="poster" className="w-32 md:w-40 xl:w-56 h-auto rounded-lg border border-[var(--primary)]" />

              <div className="flex flex-col gap-2 items-start justify-center">
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  <Link className="font-bold text-xl md:text-2xl xl:text-3xl text-left hover:underline" href={`/${currentMediaType}/${currentId}`}>
                    {mediaDetailsData?.title}
                  </Link>

                  {mediaType == mediaProperties.tv.mediaType && (
                    <p className="text-zinc-300 text-left max-lg:text-[88%]">
                      {season && season != "0" && `Season ${season} - `}
                      {episode && episode != "0" && `Episode ${episode} `}
                      {episodesArray?.[0]?.episodes &&
                        episodesArray[0].episodes[Number(episode) - 1]?.name.toLowerCase() != `episode ${Number(episode)}` &&
                        `- ${episodesArray[0].episodes[Number(episode) - 1]?.name}`}
                    </p>
                  )}
                </div>
                <div className="text-left text-zinc-400 text-[80%] md:text-[90%] flex flex-col gap-2">
                  <div>
                    {mediaType == mediaProperties.tv.mediaType ? (
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
                    {mediaType == mediaProperties.tv.mediaType ? (
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
                  <p>{mediaDetailsData?.genres && mediaDetailsData.genres[0]}</p>
                </div>

                <div className=" info max-md:hidden flex flex-col items-center md:items-start justify-center flex-wrap gap-2 text-zinc-400 text-[85%] md:text-[95%] xl:text-[100%]">
                  <CollapsibleElement customClassesForParent={"text-zinc-200 md:text-left md:w-[85%] xl:w-[90%]"} truncatedTextStyle={truncatedTextStyle}>
                    {mediaType == mediaProperties.tv.mediaType ? (
                      episodesArray == null ? (
                        ""
                      ) : episodesArray?.[0]?.episodes ? (
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

            <div className="info md:hidden flex flex-col items-center md:items-start justify-center flex-wrap gap-2 text-zinc-400 text-[85%] md:text-[95%] xl:text-[100%]">
              <CollapsibleElement customClassesForParent={"text-zinc-200 md:text-left md:w-[85%] xl:w-[90%]"} truncatedTextStyle={truncatedTextStyle}>
                {mediaType == mediaProperties.tv.mediaType ? (
                  episodesArray == null ? (
                    ""
                  ) : episodesArray?.[0]?.episodes ? (
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

          {mediaType == mediaProperties.tv.mediaType && (
            <div className=" w-full z-20  py-4">
              <div className="flex gap-6  ">
                <nav className="flex items-center justify-center w-full px-4 ">
                  <ul className="flex text-[75%] self-center bg-zinc-950 rounded-full">
                    <li>
                      <button
                        className={`flex items-center justify-center max-md:px-6 px-8 h-8 ms-0  leading-tight border  border-zinc-500 rounded-s-full ${
                          episode == "1" ? " pointer-events-none text-zinc-600" : "pointer-events-auto text-gray-200   hover:bg-zinc-800 hover:text-white"
                        }`}
                        onClick={() => {
                          if (episode && Number(episode) > 1) {
                            const newEpisode = (Number(episode) - 1).toString();

                            const params = new URLSearchParams(searchParams.toString());
                            params.set("episode", newEpisode);

                            window.location.search = params.toString();
                          }
                        }}
                      >
                        <i className={`bi bi-chevron-left font-bold`}></i>
                        Previous
                      </button>
                    </li>

                    <li>
                      <Link
                        href={`/${currentMediaType}/${currentId}`}
                        onClick={() => {
                          setActiveSeason(Number(season));
                          setSeasonModal(true);
                        }}
                        className={`flex items-center justify-center max-md:px-3 px-6 h-8 leading-tight  border border-zinc-500 `}
                      >
                        <i className="bi bi-list"></i>
                      </Link>
                    </li>

                    <li>
                      <button
                        className={`flex items-center justify-center max-md:px-6 px-8 h-8 ms-0  leading-tight border  border-zinc-500 rounded-e-full ${
                          seasonArray && seasonArray[Number(season) - 1] && Number(episode) == seasonArray[Number(season) - 1].episode_count
                            ? " pointer-events-none text-zinc-600"
                            : "pointer-events-auto text-gray-200   hover:bg-zinc-800 hover:text-white"
                        }`}
                        onClick={() => {
                          if (episode && seasonArray && Number(episode) < seasonArray[Number(season) - 1].episode_count) {
                            const newEpisode = (Number(episode) + 1).toString();

                            const params = new URLSearchParams(searchParams.toString());
                            params.set("episode", newEpisode);

                            window.location.search = params.toString();
                          }
                        }}
                      >
                        Next <i className={`bi bi-chevron-right font-bold`}></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DisplayMedia;
