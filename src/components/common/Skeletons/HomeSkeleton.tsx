import HeroSkeleton from "./HeroSkeleton";
import SignUpBannerSkeleton from "./SignUpBannerSkeleton";
import SliderSkeleton from "./SliderSkeleton";

export default function HomeSkeleton() {
  return (
    <div className=" mx-auto w-[95%] px-2 animate-pulse pb-10">
      <div className="flex flex-col gap-10 relative mt-16 z-50">
        {[...Array(2)].map((_, index) => {
          return (
            <div className="flex flex-col gap-2 md:gap-16" key={index}>
              <HeroSkeleton />

              <SliderSkeleton />
            </div>
          );
        })}
      </div>
    </div>
  );
}
