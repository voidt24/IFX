"use client";
import { useContext } from "react";
import { image } from "../../helpers/api.config";
import { Context } from "@/context/Context";
import formatReleaseDate from "@/helpers/formatReleaseDate";
import { IMediaData, MediaTypeApi } from "@/Types";
import PWADetailsButton from "./PWADetailsButton";
import DetailsButton from "./DetailsButton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/Shadcn/carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

export default function Hero({ results, type, hasTitle, mediaType }: { results: IMediaData[]; type: string; hasTitle?: boolean; mediaType: MediaTypeApi }) {
  const { isMobilePWA } = useContext(Context);

  return (
    <>
      {hasTitle && (
        <span className="flex-row-between w-full px-3 sm:px-6 pb-2">
          <h1 className="text-lg lg:text-2xl font-medium">What's trending in {type}</h1>
        </span>
      )}

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
              return (
                <CarouselItem key={index}>
                  <div
                    className="relative aspect-[16/9] lg:max-h-[87vh] snap-center h-full w-full object-cover object-center bg-cover bg-top"
                    style={{ backgroundImage: `url(${image}${sliderData.backdrop_path})` }}
                    key={index}
                  >
                    <div className="max-lg:hidden side-hero-overlay"></div>
                    <div className="max-lg:hidden to-top-gradient-bg-desktop bg-gradient-to-b from-[#000000] to-[#00000000] !top-0 !h-[20%]"></div>
                    <div className="max-lg:hidden to-top-gradient-bg-desktop bg-gradient-to-t from-[#000000] via-[#0000007a] to-[#00000000] !bottom-0 !h-[20%]"></div>

                    <div className="px-4 max-w-[80%] max-lg:hidden absolute flex flex-col items-start justify-center gap-2 lg:gap-4 top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 w-full z-20 text-4xl">
                      <h1 className="title max-w-[80%] font-semibold text-[125%]">{sliderData.title || sliderData.name}</h1>
                      {(sliderData.release_date && new Date(sliderData.release_date).getTime() > Date.now()) ||
                      (sliderData.first_air_date && new Date(sliderData.first_air_date).getTime() > Date.now()) ? (
                        <span className=" text-content-secondary text-[55%]">Available on {formatReleaseDate(sliderData.release_date || sliderData.first_air_date || "")}</span>
                      ) : null}
                      <p className="text-content-secondary text-[40%] text-left leading-6 max-w-[55%] line-clamp-4 ">{sliderData.overview}</p>

                      <DetailsButton variant="desktop" sliderData={sliderData} type={type} />
                    </div>

                    {/* MOBILE */}
                    <div className="lg:hidden blur absolute bottom-0 w-full h-[30%] sm:h-[15%] z-10 "> </div>
                    <div className="lg:hidden buttons z-30 absolute bottom-0 w-full h-[30%] sm:h-[15%] flex items-center justify-end gap-4 md:gap-8 px-2 sm:text-lg">
                      <div className="flex-col-center h-full">
                        <h1 className="title font-medium text-sm line-clamp-2">{sliderData.title || sliderData.name}</h1>
                        {(sliderData.release_date && new Date(sliderData.release_date).getTime() > Date.now()) ||
                        (sliderData.first_air_date && new Date(sliderData.first_air_date).getTime() > Date.now()) ? (
                          <span className=" text-content-secondary text-[75%]">Available on {formatReleaseDate(sliderData.release_date || sliderData.first_air_date || "")}</span>
                        ) : null}
                      </div>
                      {isMobilePWA ? <PWADetailsButton sliderData={sliderData} mediaType={mediaType} /> : <DetailsButton variant="mobile" sliderData={sliderData} type={type} />}
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
        </CarouselContent>
        <CarouselPrevious className="left-4 z-50 max-lg:hidden" />
        <CarouselNext className="right-4 z-50 max-lg:hidden" />
      </Carousel>
    </>
  );
}
