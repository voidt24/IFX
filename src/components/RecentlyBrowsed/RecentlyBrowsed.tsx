import { useSelector } from "react-redux";
import MediaCardContainer from "../MediaCard/MediaCardContainer";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/Shadcn/carousel";
import { RootState } from "@/store";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";
import { IMediaData } from "@/Types";

export default function RecentlyBrowsed() {
  const { recentlyBrowsed } = useSelector((state: RootState) => state.mediaDetails);

  return (
    recentlyBrowsed &&
    recentlyBrowsed.length > 0 && (
      <div className="mt-10 w-[95%] mx-auto bg-neutral-950/50 p-4 rounded-lg">
        <span className="flex justify-between items-center w-full pb-2">
          <h1 className="text-base lg:text-xl text-[95%] font-medium text-white/70">You recently Browsed</h1>
        </span>
        <Carousel
          className=""
          opts={{
            loop: true,
            align: "start",
          }}
          plugins={[WheelGesturesPlugin()]}
        >
          <CarouselContent className=" ">
            {recentlyBrowsed &&
              [...recentlyBrowsed].reverse().map((recentlyBrowsedData: IMediaData) => {
                return (
                  <CarouselItem key={recentlyBrowsedData.id} className="basis-[45%] md:basis-[23%] lg:basis-1/5 2xl:basis-[10%]">
                    <MediaCardContainer key={recentlyBrowsedData.id} result={recentlyBrowsedData} mediaType={recentlyBrowsedData.media_type} canBeEdited={true} />
                  </CarouselItem>
                );
              })}
          </CarouselContent>
          <CarouselPrevious className={`left-4 z-50 max-lg:hidden lg:${recentlyBrowsed.length < 7 ? "hidden" : "absolute"}`} />
          <CarouselNext className={`right-4 z-50 max-lg:hidden lg:${recentlyBrowsed.length < 7 ? "hidden" : "absolute"}`} />
        </Carousel>{" "}
      </div>
    )
  );
}
