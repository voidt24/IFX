"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MediaTypeUrl } from "@/Types/mediaType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import PlayMedia from "@/components/DisplayMedia/PlayMedia";
import DisplayInfo from "@/components/DisplayMedia/DisplayInfo";
import { getApiMediaType } from "@/helpers/getApiMediaType";
import isValidMediatype, { setMedia } from "@/helpers/isvalidMediatype";
import { setCurrentMediaType, setMediaDetailsData } from "@/store/slices/mediaDetailsSlice";
import paramIsValid from "@/helpers/isParamValid";
import addToHistory from "@/helpers/addToHistory";
import useIsMobile from "@/Hooks/useIsMobile";
import MobileCloseButton from "@/components/MediaDetails/Buttons/MobileCloseButton";

function DisplayMedia({ mediaId, mediaType }: { mediaType: MediaTypeUrl; mediaId: number }) {
  const { containerMargin } = useSelector((state: RootState) => state.ui);

  const [mediaTypeReady, setMediaTypeReady] = useState(false);
  const [mediaURL, setMediaURL] = useState<string | undefined>("");

  const path = usePathname();

  const router = useRouter();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const season = searchParams.get("season");
  const episode = searchParams.get("episode");
  const option = searchParams.get("option");

  const { firebaseActiveUser } = useSelector((state: RootState) => state.auth);
  const { mediaDetailsData, currentMediaType, episodesArray } = useSelector((state: RootState) => state.mediaDetails);
  const dispatch = useDispatch();

  params.set("season", "1");
  params.set("episode", "1");
  const isMobile = useIsMobile(768);

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

  useEffect(() => {
    if (!mediaDetailsData || (mediaTypeReady && currentMediaType === "tvshows" && !episodesArray)) return;

    addToHistory(getApiMediaType(mediaType), mediaDetailsData, firebaseActiveUser, mediaId, episodesArray, season, episode);
  }, [mediaDetailsData, episodesArray, mediaTypeReady, currentMediaType, firebaseActiveUser, mediaType, mediaId, episodesArray, season, episode]);

  return (
    <div
      className=" relative text-center bg-cover bg-top bg-no-repeat overflow-hidden max-lg:z-[999] z-[99]"
      style={{ backgroundImage: `url(${mediaDetailsData?.heroBackground})`, ...(!isMobile ? { marginTop: containerMargin ? `${containerMargin}px` : undefined } : {}) }}
    >
      <MobileCloseButton variant="watch" />
      <div className="to-top-gradient-bg z-[1]"></div>

      <div className="wrapper relative z-[2]">
        <div className="h-full w-full m-auto flex flex-col items-center justify-center">
          <div className="bg-black/35 backdrop-blur-lg flex flex-col items-center justify-center gap-2 xl:gap-4 h-auto w-full px-2 md:px-4 max-sm:py-12 py-4 rounded-xl xl:px-10">
            {mediaTypeReady && mediaId != 0 && (
              <PlayMedia option={option} season={season} episode={episode} mediaType={getApiMediaType(mediaType)} currentId={mediaId} mediaURL={mediaURL} setMediaURL={setMediaURL} />
            )}
            <DisplayInfo mediaId={mediaId} mediaType={getApiMediaType(mediaType)} mediaTypeReady={mediaTypeReady} season={season} episode={episode} searchParams={searchParams} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisplayMedia;
