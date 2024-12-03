import React from "react";

const SliderCardSkeleton = () => {
  return (
    <div className=" card border border-gray-700 rounded-lg p-2 ">
      <div className=" min-h-[195px] sm:min-h-[191px] md:min-h-[228.95px] lg:min-h-[291.13px] bg-gray-700 rounded  fallback-img"></div>
    </div>
  );
};

export default SliderCardSkeleton;
