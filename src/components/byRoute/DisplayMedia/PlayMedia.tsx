import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { MEDIA_URL_RESOLVER, srcOptions } from "@/helpers/api.config";
import { usePathname, useRouter } from "next/navigation";
import { MediaTypeApi } from "@/Types";
import { CircularProgress } from "@mui/material";
import { Context } from "@/context/Context";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/Shadcn/carousel";

const optionResolver = (option: string | null) => {
  if (Number(option) <= 0 || Number(option) > srcOptions.length || !option) return 0;

  return Number(option) - 1;
};

function PlayMedia({
  option,
  setOption,
  season,
  episode,
  mediaType,
  currentId,
  mediaURL,
  setMediaURL,
}: {
  option: string | null;
  setOption?: Dispatch<SetStateAction<string | null>>;
  season: string | null;
  episode: string | null;
  mediaType: MediaTypeApi;
  currentId: number;
  mediaURL: string | undefined;
  setMediaURL: Dispatch<SetStateAction<string | undefined>>;
}) {
  const router = useRouter();
  const path = usePathname();

  const { isMobilePWA } = useContext(Context);

  useEffect(() => {
    setMediaURL(
      mediaType == "movie" ? MEDIA_URL_RESOLVER(optionResolver(option), currentId, mediaType) : MEDIA_URL_RESOLVER(optionResolver(option), currentId, mediaType, Number(season), Number(episode)),
    );
  }, [mediaType, option, currentId, season, episode, path]);
  return (
    <>
      <div className="src-options p-0 w-full max-sm:text-[80%] lg:w-[75%] 2xl:w-[55%]">
        <Carousel
          className="w-full flex items-center justify-center"
          opts={{
            loop: true,
            align: "start",
          }}
        >
          <CarouselContent className=" w-full">
            {srcOptions.map((srcOption, index) => {
              return (
                <CarouselItem key={index} className=" basis-[35%] xs:basis-[25%] md:basis-[20%] lg:basis-[30%] 2xl:basis-[25%]">
                  <button
                    key={index}
                    className={` bg-black rounded-full px-6 py-[4px] xl:px-14 ${
                      optionResolver(option) == index ? "bg-brand-primary text-white" : "hover:bg-neutral-900 text-content-secondary hover:text-content-primary bg-none border border-neutral-600"
                    }`}
                    onClick={() => {
                      if (optionResolver(option) != index) {
                        if (!isMobilePWA) {
                          const params = new URLSearchParams();

                          if (mediaType == "tv") {
                            params.set("season", season || "");
                            params.set("episode", episode || "");
                          }
                          params.set("option", String(index + 1) || "");

                          router.replace(`?${params.toString()}`);
                        } else {
                          if (setOption) {
                            setOption((index + 1).toString());
                          }
                        }

                        setMediaURL("");
                        setMediaURL(
                          mediaType == "movie"
                            ? MEDIA_URL_RESOLVER(optionResolver(option), currentId, "movie")
                            : MEDIA_URL_RESOLVER(optionResolver(option), currentId, "tv", Number(season), Number(episode)),
                        );
                      }
                    }}
                  >
                    Option {index + 1}
                  </button>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-1 z-50 max-lg:hidden" />
          <CarouselNext className="right-1 z-50 max-lg:hidden" />
        </Carousel>
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
