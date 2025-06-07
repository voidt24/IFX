import React from "react";

const HeroSkeleton = () => {
  return (
    <div className="relative w-full">
      <div className="pb-0">
        <div className="flex-col-center gap-4 lg:gap-6">
          <div className="w-full">
            <div className="slider-test max-w-full relative px-2 mx-auto w-full h-full overflow-hidden">
              <i className="bi bi-chevron-left slider-arrow left-5 text-zinc-500 pointer-events-none"></i>
              <i className="bi bi-chevron-right slider-arrow right-5 text-zinc-500 pointer-events-none"></i>

              <div className="slider-test__content grid grid-flow-col auto-cols-[92%] md:auto-cols-[85%] lg:auto-cols-[100%] overflow-x-hidden gap-3 xl:gap-6 no-scrollbar">
                  <div  className="w-full h-64 lg:h-[80vh] gap-2  bg-surface-modal rounded-md p-4 animate-pulse flex flex-col lg:justify-center lg:gap-6">
                    <div className="w-full h-40 bg-gray-800 rounded lg:hidden"></div>
                    <div className="h-4 w-3/4 bg-gray-800 rounded max-lg:hidden"></div>
                    <div className="h-3 w-1/2 bg-gray-800 rounded max-lg:hidden"></div>
                    <div className="h-3 w-1/2 bg-gray-800 rounded"></div>
                    <div className="h-6 w-16 lg:h-8 lg:w-20 bg-gray-800 rounded-full"></div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSkeleton;
