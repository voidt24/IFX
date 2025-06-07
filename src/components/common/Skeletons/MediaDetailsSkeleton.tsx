import React from "react";
import HeroSkeleton from "./HeroSkeleton";

const MediaDetailsSkeleton = () => {
  return (
    <>
      <div className="media-details pt-14 max-lg:z-[999] z-[99] max-lg:pb-[155px] pb-4 w-full absolute top-0 ">
        <div className="max-lg:hidden animate-pulse">
          <HeroSkeleton></HeroSkeleton>
        </div>

        <div className="lg:hidden h-[90vh] w-full bg-surface-modal p-10  animate-pulse">
          <div className="lg:hidden h-full w-full bg-gray-800 p-2 flex flex-col items-center justify-center gap-4">
            <div className="h-4 w-[60%] bg-gray-700 rounded-lg "></div>
            <div className="h-2 w-[40%] bg-gray-700 rounded-lg "></div>
            <div className="h-2 w-[24%] bg-gray-700 rounded-lg "></div>
          </div>
        </div>
        <div className="flex-col-start gap-4 w-full h-full animate-pulse mt-10">
          <div className="flex-row-center gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="flex-col-center gap-1 bg-surface-modal" key={index}>
                <div className="h-2 w-20 bg-gray-800 rounded-lg "></div>
              </div>
            ))}
          </div>

          <div className="tab-content w-full h-full max-h-[500px] overflow-auto ">
            <div className="flex flex-col gap-2">
              <div className="w-full h-[350px] bg-surface-modal rounded-md"></div>
            </div>
          </div>
        </div>

        <div className="lg:hidden w-full fixed bottom-0 px-6 pb-6 pt-20 left-[50%] translate-x-[-50%] z-[4]">
          <div className="to-top-gradient-bg h-full z-[2]"></div>
          <div className="h-12 w-full bg-gray-800 rounded-full z-50 relative"></div>
        </div>
      </div>
    </>
  );
};

export default MediaDetailsSkeleton;
