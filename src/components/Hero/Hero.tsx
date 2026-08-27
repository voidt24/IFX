"use client";
import { image } from "../../helpers/api.config";
import formatReleaseDate from "@/helpers/formatReleaseDate";
import { IMediaData, MediaTypeApi } from "@/Types";
import DetailsButton from "./DetailsButton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/Shadcn/carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import PlayButton from "./PlayButton";
import OriginalBadge from "@/components/common/OriginalBadge";
import useIsMobile from "@/Hooks/useIsMobile";

export default function Hero({ results, type, hasTitle, mediaType }: { results: IMediaData[]; type: string; hasTitle?: boolean; mediaType: MediaTypeApi }) {
  const isMobile = useIsMobile();

  return (
    <>
      {hasTitle && (
        <span className="flex-row-between w-full px-3 sm:px-6 pb-2">
          <h1 className="text-lg lg:text-2xl font-medium">What's trending in {type}</h1>
        </span>
      )}
      {results && results.length > 0 ? (
        <Carousel
          className="max-w-full h-full"
          opts={{
            loop: true,
          }}
          plugins={[WheelGesturesPlugin()]}
        >
          <CarouselContent>
            {results &&
              results.slice(0, 5).map((sliderData, index) => {
                const released =
                  (sliderData.release_date && new Date(sliderData.release_date).getTime() <= Date.now()) || (sliderData.first_air_date && new Date(sliderData.first_air_date).getTime() <= Date.now());

                return (
                  <CarouselItem key={index} className="max-lg:basis-[95%]">
                    <div
                      className="relative aspect-[16/9] max-lg:h-[70vh] max-h-[87vh] snap-center h-full w-full object-cover object-center bg-cover bg-top"
                      style={{ backgroundImage: `url(${image}${isMobile ? sliderData.noTextPoster_path : sliderData.backdrop_path})` }}
                      key={index}
                    >
                      <div className="max-lg:hidden side-hero-overlay"></div>
                      <div className="max-lg:hidden to-top-gradient-bg-desktop bg-gradient-to-b from-[#000000] to-[#00000000] !top-0 !h-[20%]"></div>
                      <div className="max-lg:hidden to-top-gradient-bg-desktop bg-gradient-to-t from-[#000000] via-[#0000007a] to-[#00000000] !bottom-0 !h-[20%]"></div>
                      <OriginalBadge
                        provider={sliderData.originalProvider}
                        parentClassName="top-3 left-3 z-30 lg:top-8 lg:left-10 lg:text-sm max-sm:text-xs"
                        imgClassName="h-6 w-6 md:h-10 md:w-10 lg:w-11 lg:h-11 "
                      />

                      <div className="info-container  max-lg:h-full px-1 lg:px-4 w-full lg:max-w-[80%] absolute flex flex-col items-center lg:items-start max-lg:justify-end max-lg:pb-6 justify-center gap-2 lg:gap-4 top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 z-20 text-4xl">
                        <div className="py-5 max-lg:flex max-lg:flex-col max-lg:items-center max-lg:gap-4 w-full">
                          <div className="lg:hidden z-1 to-top-gradient-bg-desktop bg-gradient-to-t from-[#000000] via-[#000000dd] to-[#00000000] !bottom-0 !h-[80%]"></div>
                          <div className="z-10 flex flex-col justify-center max-lg:items-center gap-4 lg:gap-5">
                            {sliderData.logoBackdrop == null ? (
                              <h1 className="title w-[95%] max-lg:text-center lg:max-w-[80%] font-semibold max-lg:text-[65%] lg:text-[125%]">{sliderData.title || sliderData.name}</h1>
                            ) : (
                              <img src={`${image}${sliderData.logoBackdrop}`} className="w-[65%] md:w-[55%] lg:w-[40%]" alt="" />
                            )}

                            {!released ? (
                              <span className=" text-content-secondary text-[40%] lg:text-[55%]">Available on {formatReleaseDate(sliderData.release_date || sliderData.first_air_date || "")}</span>
                            ) : null}
                            <p className="max-lg:hidden text-content-secondary text-[40%] text-left leading-6 max-w-[55%] line-clamp-2 ">{sliderData.overview}</p>

                            <div className="flex justify-center items-center lg:justify-start gap-4 ">
                              {mediaType == "movie" && released && <PlayButton sliderData={sliderData} type={type} />}
                              <DetailsButton sliderData={sliderData} type={type} mediaType={mediaType} released={released} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
          </CarouselContent>
          <CarouselPrevious className="left-4 z-50 max-lg:hidden" />
          <CarouselNext className="right-4 z-50 max-lg:hidden" />
        </Carousel>
      ) : (
        <div className="flex items-center justify-center flex-col border border-gray-800  h-[300px] text-gray-500">
          <i className="bi bi-emoji-frown text-[150%]"></i>
          <p>We couldn't load this content</p>
          <p>Try again later.</p>
        </div>
      )}
    </>
  );
}
