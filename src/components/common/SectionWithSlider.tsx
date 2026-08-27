import Link from "next/link";
import { IMediaData, MediaTypeApi } from "@/Types";
import SliderSkeleton from "./Skeletons/SliderSkeleton";
import SliderCardSkeleton from "./Skeletons/SliderCardSkeleton";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/Shadcn/carousel";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";
import { selectFilterProviders } from "@/helpers/constants";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import { fetchFilteredData } from "@/helpers/fetchInitialData";
import useProviderLogos from "@/Hooks/useProviderLogos";
import ProviderCarouselSelect from "@/features/contentFilter/ProviderCarouselSelect";

const ALL_PROVIDERS_VALUE = "All";

const Slider = dynamic(() => import("@/components/Slider/Slider"), {
  loading: () => <SliderSkeleton />,
});

const MediaCardContainer = dynamic(() => import("@/components/MediaCard/MediaCardContainer"), {
  loading: () => <SliderCardSkeleton />,
});

function SectionWithSlider({ title, link, data, mediaType }: { title: string; link: string; data: IMediaData[]; mediaType: MediaTypeApi }) {
  const { logos } = useProviderLogos();

  const [selectedProvider, setSelectedProvider] = useState<string>(ALL_PROVIDERS_VALUE);
  const [providerData, setProviderData] = useState<IMediaData[] | null>(null);
  const [isProviderLoading, setIsProviderLoading] = useState(false);

  const mediaTypeObj = mediaType === "movie" ? mediaProperties.movie : mediaProperties.tv;

  useEffect(() => {
    if (!data) return;
  }, [data]);

  const filteredProviders = selectFilterProviders.filter((provider) => {
    if (mediaType === "movie" && (provider === "Paramount+" || provider === "paramount" || provider === "History")) {
      return false;
    }
    return true;
  });

  function handleSelectProvider(provider: string) {
    setSelectedProvider(provider);

    if (provider === ALL_PROVIDERS_VALUE) {
      setProviderData(null);
      return;
    }

    setIsProviderLoading(true);
    fetchFilteredData(mediaTypeObj, provider, null, 1)
      .then(([results]) => {
        setProviderData(results);
      })
      .catch(() => {
        setProviderData([]);
      })
      .finally(() => {
        setIsProviderLoading(false);
      });
  }

  const isFilteredByProvider = selectedProvider !== ALL_PROVIDERS_VALUE;
  const displayData = isFilteredByProvider ? providerData || [] : data;
  const visibleItems = isFilteredByProvider ? displayData.slice(0, 12) : displayData?.slice(5, 17);

  const seeAllHref = isFilteredByProvider ? `${link}?platform=${encodeURIComponent(selectedProvider)}` : link;

  return (
    <div className="w-full">
      <span className="flex justify-between items-center w-full px-3 sm:px-6 pb-2">
        <ProviderCarouselSelect title={title} providers={filteredProviders} logos={logos} selected={selectedProvider} onSelect={handleSelectProvider} />

        <Link className="hover:underline text-[85%] lg:text-[90%] text-content-secondary" href={seeAllHref}>
          See all &gt;
        </Link>
      </span>

      {isProviderLoading ? (
        <SliderSkeleton />
      ) : visibleItems && visibleItems.length > 0 ? (
        <Carousel
          key={selectedProvider}
          className="w-full"
          opts={{
            loop: true,
            align: "start",
          }}
          plugins={[WheelGesturesPlugin()]}
        >
          <CarouselContent className="">
            {visibleItems.map((sliderData: IMediaData) => {
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
