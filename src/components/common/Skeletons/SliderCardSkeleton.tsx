import React from "react";

const SliderCardSkeleton = () => {
  return (
    <div className=" card border border-gray-700 rounded-lg p-2">
      <div className=" max-md:h-32 h-48 lg:h-72 bg-gray-700 rounded mb-2 fallback-img"></div>
      <div className=" h-4 bg-gray-700 rounded mb-1"></div>
    </div>
  );
};

export default SliderCardSkeleton;
