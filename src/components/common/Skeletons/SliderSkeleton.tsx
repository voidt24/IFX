import React from "react";

const SliderSkeleton = () => {
  return (
    <div className="max-w-full relative  mx-auto w-full overflow-hidden">
      <div className={`slider-with-cards relative lg:px-4 `}>
        <div className={`grid slider-with-cards__content`}>
          {[...Array(10)].map((_, index) => (
            <div key={index} className=" card border border-gray-800 rounded-lg p-2">
              <div className=" max-md:h-36 h-48 lg:h-72 bg-surface-modal rounded  fallback-img"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SliderSkeleton;
