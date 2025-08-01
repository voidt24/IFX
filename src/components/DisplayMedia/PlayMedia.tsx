import React, { Dispatch, SetStateAction, useEffect } from "react";
import Slider from "../Slider/Slider";
import { MEDIA_URL_RESOLVER, srcOptions } from "@/helpers/api.config";
import { usePathname, useRouter } from "next/navigation";
import { MediaTypeUrl } from "@/Types";
import { CircularProgress } from "@mui/material";

const optionResolver = (option: string | null) => {
  if (Number(option) <= 0 || Number(option) > srcOptions.length || !option) return 0;

  return Number(option) - 1;
};

function PlayMedia({
  option,
  season,
  episode,
  mediaType,
  currentId,
  mediaURL,
  setMediaURL,
}: {
  option: string | null;
  season: string | null;
  episode: string | null;
  mediaType: MediaTypeUrl;
  currentId: number;
  mediaURL: string | undefined;
  setMediaURL: Dispatch<SetStateAction<string | undefined>>;
}) {
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    setMediaURL(mediaType == "movies" ? MEDIA_URL_RESOLVER(optionResolver(option), currentId, "movie") : MEDIA_URL_RESOLVER(optionResolver(option), currentId, "tv", Number(season), Number(episode)));
  }, [mediaType, option, currentId, season, episode, path]);
  return (
    <>
      <div className="src-options p-0 w-full max-sm:text-[80%]">
        <Slider sideControls padding="px-7">
          {srcOptions.map((srcOption, index) => {
            return (
              <button
                key={index}
                className={`border bg-black rounded-full py-[4px]  ${
                  optionResolver(option) == index ? "bg-zinc-300 text-black" : "text-content-secondary hover:text-content-primary hover:bg-zinc-800"
                }`}
                onClick={() => {
                  if (optionResolver(option) != index) {
                    const params = new URLSearchParams();

                    if (mediaType == "tvshows") {
                      params.set("season", season || "");
                      params.set("episode", episode || "");
                    }
                    params.set("option", String(index + 1) || "");
                    
                    router.replace(`?${params.toString()}`);

                    setMediaURL("");
                    setMediaURL(
                      mediaType == "movies"
                        ? MEDIA_URL_RESOLVER(optionResolver(option), currentId, "movie")
                        : MEDIA_URL_RESOLVER(optionResolver(option), currentId, "tv", Number(season), Number(episode))
                    );
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
    </>
  );
}

export default PlayMedia;
