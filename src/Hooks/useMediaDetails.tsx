import { API_KEY, apiUrl, image, imageWithSize } from "@/helpers/api.config";
import { fetchDetailsData } from "@/helpers/fetchDetailsData";
import { getRunTime } from "@/helpers/getRunTime";
import { RootState } from "@/store";
import { ISeasonArray, MediaTypeApi } from "@/Types";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMediaDetailsData, setEpisodesArray } from "@/store/slices/mediaDetailsSlice";
import { Context } from "@/context/Context";

interface Props {
  mediaId: number;
  season: string | null;
  episode: string | null;
  mediaTypeReady?: boolean;
  mediaType: MediaTypeApi;
  path?: string;
}
export async function getInfo(mediaType: MediaTypeApi, mediaId: number | undefined) {
  try {
    const data = await fetchDetailsData("byId", mediaType, mediaId);
    return data;
  } catch (error) {
    throw error;
  }
}
function useMediaDetails({ mediaId, season, episode, mediaTypeReady, mediaType, path }: Props) {
  const [seasonArray, setSeasonArray] = useState<ISeasonArray[]>([]);
  const { mediaDetailsData } = useSelector((state: RootState) => state.mediaDetails);
  const dispatch = useDispatch();

  const { isMobilePWA } = useContext(Context);

  useEffect(() => {
    if (isMobilePWA) {
      if (!mediaTypeReady) return;
    }
    if (!mediaId || mediaId == 0) return;

    async function setInitialData() {
      const inf = await getInfo(mediaType, mediaId);
      const { title, name, overview, release_date, first_air_date, genres, vote_average, backdrop_path, poster_path, runtime, number_of_seasons, seasons } = inf;

      dispatch(
        setMediaDetailsData({
          results: [],
          heroBackground: !isMobilePWA ? (window.innerWidth >= 640 ? `${image}${backdrop_path}` : `${image}${poster_path}`) : `${image}${backdrop_path}`,
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
        }),
      );
    }

    setInitialData();
  }, [mediaTypeReady, mediaId, season, episode, path]);

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
        if (mediaId && mediaId != 0) {
          const seasonResponse = await fetch(`${apiUrl}${mediaType}/${mediaId}/season/${Number(season)}?api_key=${API_KEY}`);
          const json = await seasonResponse.json();
          dispatch(setEpisodesArray([json]));
        }
      } catch (error) {
        console.error("Error fetching season data:", error);
      }
    }
    if (mediaType == "tv") {
      getEpisodes();
    }
  }, [mediaDetailsData, mediaId, mediaType, season]);

  return { seasonArray };
}

export default useMediaDetails;
