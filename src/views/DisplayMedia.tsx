"use client";
import { useContext, useEffect, useState } from "react";
import { Context } from "@/context/Context";
import { image } from "@/helpers/api.config";
import { useSearchParams } from "next/navigation";
import { IhistoryMedia } from "@/Types/index";
import { saveToHistory } from "@/firebase/saveToHistory";
import { MediaTypeUrl } from "@/Types/mediaType";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import PlayMedia from "@/components/DisplayMedia/PlayMedia";
import DisplayInfo from "@/components/DisplayMedia/DisplayInfo";
import { getApiMediaType } from "@/helpers/getApiMediaType";

function DisplayMedia({ mediaType }: { mediaType: MediaTypeUrl }) {
  const { containerMargin } = useContext(Context);

  const searchParams = useSearchParams();
  const season = searchParams.get("season");
  const episode = searchParams.get("episode");
  const option = searchParams.get("option");
  const [mediaURL, setMediaURL] = useState<string | undefined>("");

  const [mediaTypeReady, setMediaTypeReady] = useState(false);

  const auth = useSelector((state: RootState) => state.auth);
  const { firebaseActiveUser } = auth;
  const { currentId, mediaDetailsData, currentMediaType, episodesArray } = useSelector((state: RootState) => state.mediaDetails);

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
            <DisplayInfo mediaType={mediaType} mediaTypeReady={mediaTypeReady} setMediaTypeReady={setMediaTypeReady} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisplayMedia;
