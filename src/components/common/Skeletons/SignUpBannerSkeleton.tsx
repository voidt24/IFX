import React from "react";

const SignUpBannerSkeleton = () => {
  return (
    <div className="mt-10 md:mt-16 w-full md:w-[90%] py-6 md:py-10 mx-auto relative isolate overflow-hidden bg-surface-modal px-6 shadow-2xl rounded-3xl lg:flex lg:px-20 ">
      <div className="mx-auto lg:text-left flex items-center justify-center w-full">
        {/* Text skeleton */}
        <div className="flex flex-col items-start justify-start lg:justify-start w-[60%] space-y-4">
          <div className="h-4 bg-gray-700 rounded-md w-[80%]"></div>
          <div className="h-4 bg-gray-700 rounded-md w-[70%]"></div>

          {/* Button skeleton */}
          <div className="mt-6 h-6 w-24 bg-gray-700 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default SignUpBannerSkeleton;
