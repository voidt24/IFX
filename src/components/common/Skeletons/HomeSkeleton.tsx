import HeroSkeleton from "./HeroSkeleton";
import SignUpBannerSkeleton from "./SignUpBannerSkeleton";
import SliderSkeleton from "./SliderSkeleton";

export default function HomeSkeleton() {
  return (
    <div className="pb-10 mx-auto md:w-[90%] xl:w-[80%] 4k:w-[60%] max-w-full px-2 animate-pulse">
      <div className="flex flex-col gap-10 relative mt-24 sm:mt-40 z-50">
        {/* Search bar skeleton */}
        <div className="bg-black w-full fixed z-50 py-4 top-0 sm:top-[67px] left-0">
          <div className="w-[85%] md:w-[55%] 2xl:w-[35%] mx-auto ">
            <div className="h-10 bg-gray-700 rounded-full"></div>
          </div>
        </div>
        {[...Array(2)].map((_, index) => {
          return (
            <div className="flex flex-col gap-16" key={index}>
              <HeroSkeleton />

              <SliderSkeleton />
            </div>
          );
        })}

        <SignUpBannerSkeleton />

      </div>
    </div>
  );
}
