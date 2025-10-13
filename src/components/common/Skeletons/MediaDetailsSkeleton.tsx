import React from "react";
import HeroSkeleton from "./HeroSkeleton";

const MediaDetailsSkeleton = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full p-6 gap-10 animate-pulse">
      <div className="mobile lg:hidden flex flex-col justify-center items-center w-full h-full p-6 gap-10">
        <div className="w-full h-[300px] bg-gray-800 rounded-lg"></div>

        <div className="flex flex-col gap-2 justify-content-center items-center w-full">
          <div className="flex flex-col gap-3 items-center text-center w-full">
            <div className="h-5 w-3/4 bg-gray-800 rounded-full"></div>
            <div className="h-5 w-1/2 bg-gray-800 rounded-full"></div>
            <div className="h-5 w-1/3 bg-gray-800 rounded-full"></div>
          </div>

          <div className="flex flex-row justify-center items-center gap-6 w-full mt-6">
            <div className="h-10 w-10 bg-gray-800 rounded-full"></div>
            <div className="h-10 w-10 bg-gray-800 rounded-full"></div>
            <div className="h-10 w-10 bg-gray-800 rounded-full"></div>
          </div>
          <div className="h-10 w-full sm:w-[50%] bg-gray-800 rounded-full mt-8"></div>
        </div>
      </div>

      <div className="desktop-sk max-lg:hidden flex-col-center gap-6 w-full px-2">
        <div className="w-full h-[80vh]  bg-surface-modal rounded-md p-4 flex flex-col justify-center gap-6">
          <div className="w-full h-40 bg-gray-800 rounded lg:hidden"></div>
          <div className="h-4 w-3/4 bg-gray-800 rounded max-lg:hidden"></div>
          <div className="h-3 w-1/2 bg-gray-800 rounded max-lg:hidden"></div>
          <div className="h-3 w-1/2 bg-gray-800 rounded"></div>
          <div className="flex gap-4">
            <div className="h-10 w-32 bg-gray-800 rounded-full"></div>
            <div className="h-10 w-10 bg-gray-800 rounded-full"></div>
            <div className="h-10 w-10 bg-gray-800 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="tabs-skeleton flex flex-col items-center  gap-4 w-full h-full animate-pulse">
        <div className="flex flex-row items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <div className="h-2 w-16 bg-gray-800 rounded"></div>
            <div className="h-[2px] w-full bg-gray-800 rounded-full"></div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="h-2 w-16 bg-gray-800 rounded"></div>
            <div className="h-[2px] w-0 bg-gray-800 rounded-full"></div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="h-2 w-16 bg-gray-800 rounded"></div>
            <div className="h-[2px] w-0 bg-gray-800 rounded-full"></div>
          </div>
        </div>

        <div className="w-full h-auto lg:max-h-[500px] lg:overflow-auto mt-4 flex flex-col gap-3 items-center">
          <div className="w-full h-[200px] bg-surface-modal rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetailsSkeleton;
