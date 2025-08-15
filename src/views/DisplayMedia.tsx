"use client";
import { useContext, useEffect, useState } from "react";
import { Context } from "@/context/Context";
import { image } from "@/helpers/api.config";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { IhistoryMedia } from "@/Types/index";
import { saveToHistory } from "@/firebase/saveToHistory";
import { MediaTypeUrl } from "@/Types/mediaType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import PlayMedia from "@/components/DisplayMedia/PlayMedia";
import DisplayInfo from "@/components/DisplayMedia/DisplayInfo";
import { getApiMediaType } from "@/helpers/getApiMediaType";
import isValidMediatype, { setMedia } from "@/helpers/isvalidMediatype";
import { setCurrentMediaType, setCurrentId, setMediaDetailsData } from "@/store/slices/mediaDetailsSlice";
import paramIsValid from "@/helpers/isParamValid";

function DisplayMedia({ mediaType }: { mediaType: MediaTypeUrl }) {
  const { containerMargin } = useContext(Context);
  const [mediaTypeReady, setMediaTypeReady] = useState(false);
  const [mediaURL, setMediaURL] = useState<string | undefined>("");

  const path = usePathname();
  const { id: idFromUrl } = useParams();

  const router = useRouter();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const season = searchParams.get("season");
  const episode = searchParams.get("episode");
  const option = searchParams.get("option");

  const { firebaseActiveUser } = useSelector((state: RootState) => state.auth);
  const { currentId, mediaDetailsData, currentMediaType, episodesArray } = useSelector((state: RootState) => state.mediaDetails);
  const dispatch = useDispatch();

  params.set("season", "1");
  params.set("episode", "1");

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

  useEffect(() => {
    if (!mediaDetailsData || (mediaTypeReady && currentMediaType === "tvshows" && !episodesArray)) return;

    const dataToSave: IhistoryMedia = {
      id: currentId,
      media_type: currentMediaType === "tvshows" ? "tv" : "movie",
      ...(currentMediaType === "tvshows" &&
        episodesArray &&
        episodesArray[0].episodes?.[Number(episode) - 1] && {
          episodeId: episodesArray[0].episodes?.[Number(episode) - 1].id,
          season: Number(season),
          episode: episodesArray[0].episodes?.[Number(episode) - 1].name,
          episode_number: Number(episode),
          episode_image: `${image}${episodesArray[0].episodes?.[Number(episode) - 1].still_path}`,
        }),
      title: mediaDetailsData?.title,
      vote_average:
        currentMediaType === "tvshows" && episodesArray && episodesArray[0].episodes?.[Number(episode) - 1] ? episodesArray[0].episodes?.[Number(episode) - 1].vote_average : mediaDetailsData.vote,
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
  }, [mediaDetailsData, episodesArray, firebaseActiveUser]);

  return (
    <div
      className=" relative text-center bg-cover bg-top bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url(${mediaDetailsData?.heroBackground})`, marginTop: containerMargin ? `${containerMargin}px` : undefined }}
    >
      <div className="to-top-gradient-bg z-[1]"></div>

      <div className="wrapper relative z-[2]">
        <div className="h-full w-full m-auto flex flex-col items-center justify-center">
          <div className="bg-black/35 backdrop-blur-lg flex flex-col items-center justify-center gap-2 xl:gap-4 h-auto w-full px-2 md:px-4 max-sm:py-12 py-4 rounded-xl xl:px-10">
            {mediaTypeReady && currentId != 0 && (
              <PlayMedia option={option} season={season} episode={episode} mediaType={getApiMediaType(mediaType)} currentId={currentId} mediaURL={mediaURL} setMediaURL={setMediaURL} />
            )}
            <DisplayInfo mediaType={getApiMediaType(mediaType)} mediaTypeReady={mediaTypeReady} season={season} episode={episode} searchParams={searchParams} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisplayMedia;
