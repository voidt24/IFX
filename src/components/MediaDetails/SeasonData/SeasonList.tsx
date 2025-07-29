import { Context, ImediaDetailsData } from "@/context/Context";
import { saveToHistory } from "@/firebase/saveToHistory";
import { API_KEY, apiUrl, image } from "@/helpers/api.config";
import { getRunTime } from "@/helpers/getRunTime";
import { RootState } from "@/store";
import { IhistoryMedia, MediaTypeApi } from "@/Types/index";
import { Season } from "@/Types/season";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

function SeasonList({ data, mediaType, mediaId }: { data: ImediaDetailsData | null; mediaType: MediaTypeApi; mediaId: number }) {
  const router = useRouter();
  const {
    seasonModal,
    episodesArray,
    setEpisodesArray,
    activeSeason,
    setActiveSeason,
    setActiveEpisode,
    setSeasonModal,
    isMobilePWA,
    setSheetMediaType,
    setOpenDisplayMediaSheet,
    setCurrentId,
  } = useContext(Context);
  const seasonBtnRef = useRef<HTMLButtonElement | null>(null);
  const path = usePathname();

  const auth = useSelector((state: RootState) => state.auth);
  const { firebaseActiveUser } = auth;
  
  async function getSeasonData(season: number) {
    try {
      const seasonResponse = await fetch(`${apiUrl}${mediaType}/${mediaId}/season/${season}?api_key=${API_KEY}`);
      const json = await seasonResponse.json();
      setEpisodesArray([json]);

      setTimeout(() => {
        if (seasonBtnRef.current) {
          seasonBtnRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 1);
    } catch (error) {
      console.error("Error fetching season data:", error);
    }
  }
  useEffect(() => {
    if (activeSeason && activeSeason > 0 && seasonModal) {
      getSeasonData(activeSeason);
    }
  }, []);

  if (!data) return null;

  return (
    <div className="w-full max-h-[50vh] lg:max-h-[70vh] overflow-auto flex flex-col gap-8 ">
      <h1 className="title font-semibold text-xl">{data.title}</h1>

      {data.seasonsArray &&
        data.seasonsArray.map((season: Season, index) => {
          const { episode_count, season_number } = season;
          if (season.name !== "Specials" && season.air_date && new Date(season.air_date).getTime() <= Date.now()) {
            return (
              <div className={`flex flex-col gap-2 w-full rounded-xl ${season_number === activeSeason ? " bg-zinc-950" : ""} p-2`} key={index}>
                <button
                  ref={season_number === activeSeason ? seasonBtnRef : null}
                  className={` rounded-lg p-4 w-full bg-surface-hover   border ${
                    activeSeason === season_number ? "text-brand-primary border-brand-primary" : "border-zinc-800 lg:hover:bg-zinc-950"
                  } flex  items-center justify-center `}
                  onClick={async () => {
                    if (activeSeason === season_number) {
                      setActiveSeason(null);
                    } else {
                      setEpisodesArray(null);
                      setActiveSeason(season_number);
                    }
                    await getSeasonData(season_number);
                    if (seasonBtnRef.current) {
                      seasonBtnRef.current.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  <p className="">Season {season_number}</p>
                  <i className={`ml-auto ${activeSeason === season_number ? "bi bi-caret-up-fill" : "bi bi-caret-down-fill"}`}></i>
                </button>
                <div className={`flex items-start justify-center flex-wrap gap-4 ${activeSeason == season_number ? "h-full py-6" : "overflow-hidden h-0"}`}>
                  {Array.from({ length: episode_count ?? 0 }).map(
                    (_, index) =>
                      episodesArray?.[0].episodes?.[index] &&
                      new Date(episodesArray?.[0].episodes?.[index].air_date).getTime() <= Date.now() && (
                        <button
                          key={index}
                          className="bg-zinc-900 px-2 hover:bg-zinc-700 py-2 lg:py-3 rounded-lg w-full"
                          onClick={() => {
                            setActiveEpisode(index + 1);
                            if (isMobilePWA) {
                              setSheetMediaType(mediaType == "movie" ? "movies" : "tvshows");
                              setCurrentId(mediaId);
                              setOpenDisplayMediaSheet(true);
                            } else {
                              setSeasonModal(false);

                              router.push(`${path}/watch?name=${data.title}&season=${season_number}&episode=${index + 1}`);
                            }

                            const dataToSave: IhistoryMedia = {
                              id: mediaId,
                              media_type: mediaType,
                              title: data?.title,
                              vote_average: data?.vote,
                              poster_path: data?.poster,
                              backdrop_path: data?.bigHeroBackground,
                              release_date: data?.releaseDate,
                              watchedAt: Date.now(),
                            };
                            if (firebaseActiveUser && firebaseActiveUser.uid && dataToSave.episodeId) {
                              try {
                                saveToHistory(dataToSave, episodesArray?.[0].episodes?.[index].id || 0, firebaseActiveUser.uid);
                              } catch (error) {
                                console.log(error);
                              }
                            }
                          }}
                        >
                          <div className="flex items-center justify-center gap-2 w-full">
                            <p>{index + 1}.</p>

                            <>
                              <img src={`${image}${episodesArray?.[0].episodes[index].still_path}`} className="rounded-md object-cover w-[40%] md:w-[25%] xl:w-[20%] h-full" alt="" />
                              <div className="flex flex-col gap-2 w-full">
                                <div className="min-md:font-bold max-md:text-sm w-full flex items-center justify-center">
                                  <p className="w-full h-full">{episodesArray?.[0].episodes[index].name}</p>
                                  <p className="text-right text-zinc-500 !text-[75%] h-full">{episodesArray?.[0].episodes[index].runtime && getRunTime(episodesArray?.[0].episodes[index].runtime)}</p>
                                </div>
                                <p className="max-lg:hidden text-zinc-400 xl:w-[75%] m-auto">{episodesArray?.[0].episodes[index].overview}</p>
                              </div>
                            </>
                          </div>
                        </button>
                      )
                  )}
                </div>
              </div>
            );
          }
        })}
    </div>
  );
}

export default SeasonList;
