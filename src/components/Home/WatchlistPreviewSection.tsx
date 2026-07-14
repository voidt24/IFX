"use client";
import dynamic from "next/dynamic";
import { useWatchlistPreview } from "@/Hooks/useWatchlistPreview";
import HomeCarouselSection from "@/components/common/HomeCarouselSection";
import SliderCardSkeleton from "@/components/common/Skeletons/SliderCardSkeleton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/Shadcn/carousel";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";
import Link from "next/link";

const MediaCardContainer = dynamic(() => import("@/components/MediaCard/MediaCardContainer"), {
  loading: () => <SliderCardSkeleton />,
});

function WatchlistPreviewSection() {
  const { items, isLoading } = useWatchlistPreview();

  if (isLoading || items.length === 0) return null;

  return (
    <div className="mt-6 w-[98%] mx-auto  rounded-lg">
      <span className="flex justify-between items-center w-full pb-2">
        <h1 className="text-base lg:text-xl text-[95%] font-medium text-white/70">From your favorites</h1>
        <Link className="hover:underline text-[85%] lg:text-[90%] text-content-secondary" href={`/lists`}>
          See all &gt;
        </Link>
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
          {items.map((item) => (
            <CarouselItem key={item.id} className="basis-[45%] md:basis-[23%] lg:basis-1/5 2xl:basis-[10%]">
              <MediaCardContainer
                key={item.id}
                result={item}
                mediaType={item.media_type}
                showBadge={true} // <-- Pasamos la orden de forzar el badge
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={`left-4 z-50 max-lg:hidden lg:${items.length < 7 ? "hidden" : "absolute"}`} />
        <CarouselNext className={`right-4 z-50 max-lg:hidden lg:${items.length < 7 ? "hidden" : "absolute"}`} />
      </Carousel>{" "}
    </div>
    // <HomeCarouselSection title="From Your Watchlist" link="/lists?selected=watchlist">
    //   {/* {items.map((item) => (
    //     <MediaCardContainer
    //       key={item.id}
    //       result={item}
    //       mediaType={item.media_type}
    //       showBadge={true} // <-- Pasamos la orden de forzar el badge
    //     />
    //   ))} */}
    // </HomeCarouselSection>
  );
}

export default WatchlistPreviewSection;
