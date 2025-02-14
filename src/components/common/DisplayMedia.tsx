"use client";
import { useContext, useEffect, useState } from "react";
import { Context } from "@/context/Context";
import { image, imageWithSize, MOVIES_MEDIA_VIDEO_URL, TV_MEDIA_VIDEO_URL } from "@/helpers/api.config";
import { getRunTime } from "@/helpers/getRunTime";
import { fetchDetailsData } from "@/helpers/fetchDetailsData";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import isValidMediatype, { setMedia } from "@/helpers/isvalidMediatype";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import { useRouter } from "next/navigation";
import Link from "next/link";

function DisplayMedia({ mediaType }: { mediaType: string }) {
  const { currentId, firebaseActiveUser, currentMediaType, setCurrentMediaType, mediaDetailsData, setMediaDetailsData, setCurrentId } = useContext(Context);
  const path = usePathname();

  const { id: idFromUrl } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const season = searchParams.get("season");
  const episode = searchParams.get("episode");
  const [mediaURL, setMediaURL] = useState("");
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
    setMediaURL(mediaType == "movie" ? MOVIES_MEDIA_VIDEO_URL(currentId) : TV_MEDIA_VIDEO_URL(currentId, Number(season), Number(episode)));
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
      const newSeasonA: InewSeasonArray[]
        | null = [];

        let seasonA: InewSeasonArray;
      for ( seasonA of mediaDetailsData?.seasonsArray) {
        if (seasonA.name != "Specials") {
          newSeasonA.push(seasonA);
        }
      }
      setSeasonArray(newSeasonA);
    }
  }, [currentId, firebaseActiveUser, path]);

  return (
    <div className="media-details h-[85vh] md:h-screen pb-0" style={{ backgroundImage: `url(${mediaDetailsData?.heroBackground})` }}>
      <div className="overlay"></div>
      <i
        className="bi bi-arrow-left"
        onClick={() => {
          router.back();
        }}
      ></i>
      <div className="media-details__initial-content  sm:w-[85%] lg:w-[80%] xl:w-[70%] m-auto flex flex-col items-center justify-center ">
        <div className="bg-black/85 flex flex-col items-center justify-center gap-6 mt-6 h-[65%] lg:h-[70%]  w-full p-4 rounded-xl ">
          <div className="flex flex-col gap-4 text-2xl xl:text-4xl">
            <h2 className="">{mediaDetailsData?.title} </h2>
            {mediaType === "tv" && (
              <div className="text-[75%] xl:text-[45%] text-white/70">
                {season && season != "0" && `Season ${season} - `}
                {episode && episode != "0" && `Episode ${episode}`}
              </div>
            )}
          </div>
          <iframe src={mediaURL} className="h-full w-full" frameBorder="0" referrerPolicy="origin" allowFullScreen></iframe>{" "}
        </div>
        {mediaType == mediaProperties.tv.mediaType && (
          <div className=" w-full z-20  py-4">
            <div className="flex gap-6  ">
              <nav className="flex items-center justify-center w-full px-4 ">
                <ul className="flex text-[70%] self-center bg-zinc-800 rounded-full">
                  <li>
                    <button
                      className={`flex items-center justify-center max-md:px-6 px-8 h-8 ms-0  leading-tight border  border-zinc-500 rounded-s-full ${
                        episode == "1" ? " pointer-events-none text-zinc-600" : "pointer-events-auto text-gray-200   hover:bg-zinc-500 hover:text-white"
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
                      Prev
                    </button>
                  </li>

                  <li>
                    <Link href={`/${currentMediaType}/${currentId}`} className={`flex items-center justify-center max-md:px-3 px-6 h-8 leading-tight  border border-zinc-500 `}>
                      <i className="bi bi-list"></i>
                    </Link>
                  </li>

                  <li>
                    <button
                      className={`flex items-center justify-center max-md:px-6 px-8 h-8 ms-0  leading-tight border  border-zinc-500 rounded-e-full ${
                        seasonArray && seasonArray[Number(season) - 1] && Number(episode) == seasonArray[Number(season) - 1].episode_count
                          ? " pointer-events-none text-zinc-600"
                          : "pointer-events-auto text-gray-200   hover:bg-zinc-500 hover:text-white"
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
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DisplayMedia;
