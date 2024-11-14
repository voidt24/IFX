import React from "react";

const SliderSkeleton = () => {
  return (
    <div className="max-w-full lg:max-w-[95%] 2xl:max-w-[80%] 4K:max-w-[75%] relative px-2 mx-auto w-full overflow-hidden">
      <div className={`slider-with-cards relative lg:px-4 `}>
        <div className={`grid slider-with-cards__content`}>
          {[...Array(10)].map((_, index) => (
            <div key={index} className=" card border border-gray-700 rounded-lg p-2">
              <div className=" max-md:h-32 h-48 lg:h-72 bg-gray-700 rounded mb-2 fallback-img"></div>
              <div className=" h-4 bg-gray-700 rounded mb-1"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SliderSkeleton;
