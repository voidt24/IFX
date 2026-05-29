import Link from "next/link";
import { IMediaData, MediaTypeApi } from "@/Types";
import SliderSkeleton from "./Skeletons/SliderSkeleton";
import SliderCardSkeleton from "./Skeletons/SliderCardSkeleton";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/Shadcn/carousel";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";

const Slider = dynamic(() => import("@/components/Slider/Slider"), {
  loading: () => <SliderSkeleton />,
});

const MediaCardContainer = dynamic(() => import("@/components/MediaCard/MediaCardContainer"), {
  loading: () => <SliderCardSkeleton />,
});

function SectionWithSlider({ title, link, data, mediaType }: { title: string; link: string; data: IMediaData[]; mediaType: MediaTypeApi }) {
  useEffect(() => {
    if (!data) return;
  }, [data]);

  return (
    <div className="w-full">
      <span className="flex justify-between items-center w-full px-3 sm:px-6 pb-2">
        <h1 className="text-lg lg:text-2xl font-medium text-white">{title}</h1>

        <Link className="hover:underline text-[85%] lg:text-[90%] text-content-secondary" href={`${link}`}>
          See all &gt;
        </Link>
      </span>

      {data && data.length > 0 ? (
        <Carousel
          className="w-full"
          opts={{
            loop: true,
            align: "start",
          }}
          plugins={[WheelGesturesPlugin()]}
        >
          <CarouselContent className="">
            {data &&
              data.slice(5, 17).map((sliderData: IMediaData) => {
                return (
                  <CarouselItem key={sliderData.id} className="basis-[45%] md:basis-[23%] lg:basis-1/5 2xl:basis-[13%] 4k:basis-[10%]">
                    <MediaCardContainer key={sliderData.id} result={sliderData} mediaType={mediaType} />
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
    </div>
  );
}

export default SectionWithSlider;
