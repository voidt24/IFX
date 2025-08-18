import Link from "next/link";
import { IMediaData, MediaTypeApi } from "@/Types";
import SliderSkeleton from "./Skeletons/SliderSkeleton";
import SliderCardSkeleton from "./Skeletons/SliderCardSkeleton";
import dynamic from "next/dynamic";
import { useEffect } from "react";

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
    <div className="w-full ">
      <span className="flex justify-between items-center w-full px-3 sm:px-6 pb-2">
        <h1 className="text-lg lg:text-2xl font-medium text-white">{title}</h1>
        <Link className="hover:underline text-[85%] lg:text-[90%] text-content-secondary" href={`${link}`}>
          See all &gt;
        </Link>
      </span>
      <Slider sideControls={true} expectingCards={true}>
        {data &&
          data.slice(5, 17).map((sliderData: IMediaData) => {
            return <MediaCardContainer key={sliderData.id} result={sliderData} mediaType={mediaType} />;
          })}
      </Slider>
    </div>
  );
}

export default SectionWithSlider;
