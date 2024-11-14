import React from "react";

const HeroSkeleton = () => {
  return (
    <div className=" max-w-full lg:max-w-[95%] 2xl:max-w-[80%] 4K:max-w-[75%] relative px-2 mx-auto w-full overflow-hidden">
      {/* Slider content skeleton */}
      <div className="slider-skeleton flex justify-center items-center gap-4">
        {/* Slide anterior */}
        <div className="slide-previous relative opacity-50 w-1/5">
          <div className="rounded-lg bg-gray-700 h-48 w-full"></div>
          <div className="absolute flex flex-col gap-2 items-center justify-center top-1/2 text-center -translate-x-1/2 -translate-y-1/2 left-1/2 w-full z-20">
            <div className="h-6 bg-gray-800 rounded-md w-1/2 mb-2"></div>
            <div className="h-6 w-1/4 bg-gray-700 rounded-md"></div>
          </div>
        </div>

        {/* Slide central */}
        <div className="slide-current relative w-8/12">
          <div className="rounded-lg bg-gray-700 h-52 w-full"></div>
          <div className="absolute flex flex-col gap-2 items-center justify-center top-1/2 text-center -translate-x-1/2 -translate-y-1/2 left-1/2 w-full z-20">
            <div className="h-6 bg-gray-800 rounded-md w-1/2 mb-2"></div>
            <div className="h-6 w-1/4 bg-gray-700 rounded-md"></div>
          </div>
        </div>

        {/* Slide siguiente */}
        <div className="slide-next relative opacity-50 w-1/5">
          <div className="rounded-lg bg-gray-700 h-48 w-full"></div>
          <div className="absolute flex flex-col gap-2 items-center justify-center top-1/2 text-center -translate-x-1/2 -translate-y-1/2 left-1/2 w-full z-20">
            <div className="h-6 bg-gray-800 rounded-md w-1/2 mb-2"></div>
            <div className="h-6 w-1/4 bg-gray-700 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSkeleton;
