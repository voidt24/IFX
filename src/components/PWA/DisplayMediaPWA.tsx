"use client";
import { useContext, useEffect, useState } from "react";
import { Context } from "@/context/Context";
import { MEDIA_URL_RESOLVER } from "@/helpers/api.config";
import { MediaTypeApi } from "@/Types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import PlayMedia from "../DisplayMedia/PlayMedia";
import DisplayInfo from "../DisplayMedia/DisplayInfo";
import addToHistory from "@/helpers/addToHistory";

function DisplayMediaPWA({ mediaType, mediaId }: { mediaType: MediaTypeApi; mediaId: number }) {
  const [mediaURL, setMediaURL] = useState<string | undefined>("");
  const [selectedSrc, setSelectedSrc] = useState<string | null>(null);

  const { sheetMediaType, activeEpisode, activeSeason, mediaDetailsData, episodesArray } = useSelector((state: RootState) => state.mediaDetails);
  const { firebaseActiveUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setMediaURL(sheetMediaType == "movies" ? MEDIA_URL_RESOLVER(0, mediaId, "movie") : MEDIA_URL_RESOLVER(0, mediaId, "tv", Number(activeSeason), Number(activeEpisode)));
  }, [mediaId]);

  useEffect(() => {
    addToHistory(mediaType, mediaDetailsData, firebaseActiveUser, mediaId, episodesArray, episodesArray?.toString(), activeEpisode?.toString());
  }, [mediaType, mediaDetailsData, firebaseActiveUser, mediaId, episodesArray, episodesArray, activeEpisode]);

  return (
    <div className=" relative text-center bg-cover bg-top bg-no-repeat overflow-hidden" style={{ backgroundImage: `url(${mediaDetailsData?.heroBackground})` }}>
      <div className="to-top-gradient-bg z-[1]"></div>

      <div className="wrapper relative z-[2]">
        <div className="h-full w-full m-auto flex flex-col items-center justify-center">
          <div className="bg-black/35 backdrop-blur-lg flex flex-col items-center justify-center gap-2 xl:gap-4 h-auto w-full px-2 md:px-4 max-sm:py-12 py-4 rounded-xl xl:px-10">
            <PlayMedia
              option={selectedSrc?.toString() || null}
              setOption={setSelectedSrc}
              season={activeSeason?.toString() || null}
              episode={activeEpisode?.toString() || null}
              mediaType={mediaType}
              currentId={mediaId}
              mediaURL={mediaURL}
              setMediaURL={setMediaURL}
            />
            <DisplayInfo mediaId={mediaId} mediaType={mediaType} season={activeSeason?.toString() || null} episode={activeEpisode?.toString() || null} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisplayMediaPWA;
