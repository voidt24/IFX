import React from "react";

const SignUpBannerSkeleton = () => {
  return (
    <div className="mt-10 md:mt-16 w-full md:w-[90%] py-6 md:py-10 mx-auto relative isolate overflow-hidden bg-gray-900 px-6 shadow-2xl rounded-3xl lg:flex lg:px-20 ">
      <div className="mx-auto lg:text-left flex items-center justify-center w-full">
        {/* Text skeleton */}
        <div className="flex flex-col items-start justify-start lg:justify-start w-[60%] space-y-4">
          <div className="h-4 bg-gray-700 rounded-md w-[80%]"></div>
          <div className="h-4 bg-gray-700 rounded-md w-[70%]"></div>

          {/* Button skeleton */}
          <div className="mt-6 h-10 w-24 bg-gray-700 rounded-md"></div>
        </div>

        {/* Placeholder for image or extra elements */}
        <div className="flex flex-col gap-6 lg:flex-row md:gap-2">
          <div className="h-16 w-16 lg:h-32 lg:w-32 bg-gray-700 rounded-md"></div>
          <div className="h-16 w-16 lg:h-32 lg:w-32 bg-gray-700 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default SignUpBannerSkeleton;
