import React from "react";

const MediaDetailsSkeleton = () => {
  return (
    <>
      <div className="media-details bg-black pt-10  animate-pulse">
        <i className="bi bi-arrow-left text-gray-400 text-2xl absolute top-8 left-4"></i>
        <div className="media-details__initial-content sm:px-10 sm:w-[80%] lg:w-[60%] xl:w-[45%] m-auto">
          <div className="media-details__info-container flex flex-col items-center justify-center gap-6 mt-12 sm:mt-20">
            {/* Skeleton para la imagen */}
            <div className="w-1/3 h-60 bg-gray-700 rounded-md"></div>

            <div className="info-container-text flex justify-center items-center flex-col gap-2">
              {/* Skeleton para el título */}
              <div className="h-4 bg-gray-700 w-28 rounded-md"></div>
              <div className="h-4 bg-gray-700 w-40 rounded-md"></div>
            </div>

            {/* Skeleton para los botones */}
            <div className="main-btns flex flex-col justify-center items-center w-full gap-4 sm:w-[300px] md:flex-row">
              <div className="h-10 w-full bg-gray-700 rounded-full"></div>
              <div className="h-10 w-full bg-gray-700 rounded-full"></div>
            </div>

            {/* Skeleton para la descripción */}
            <div className="flex items-center  flex-col ovrview text-[70%] lg:text-[80%]">
              <div className="h-4 w-60 bg-gray-700 rounded-md"></div>
              <div className="mt-2 h-4 w-40 bg-gray-700 rounded-md"></div>
            </div>

            {/* Skeleton para las opciones adicionales */}
            <div className="main-lists-options flex gap-2 mt-2">
              <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
              <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="extra-data  animate-pulse">
        <div className="similar !h-[300px]">
          {[...Array(6)].map((_, index) => (
            <div key={index} className=" card border border-gray-700 rounded-lg p-2">
              <div className=" max-md:h-32 h-48 lg:h-72 bg-gray-700 rounded mb-2 fallback-img"></div>
              <div className=" h-4 bg-gray-700 rounded mb-1"></div>
            </div>
          ))}
        </div>
        <div className="cast mt-6">
          {[...Array(8)].map((_, index) => (
            <div className="cast__member" key={index}>
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div className=" w-16 h-2 bg-gray-500 mt-2"> </div>
              <div className=" w-10 h-2 bg-gray-500 mt-2"> </div>
            </div>
          ))}
        </div>
        <div className="reviews mt-6">
          {[...Array(2)].map((_, index) => (
            <div className="review-content bg-gray-700 py-4 px-2" key={index}>
              <span className="fixed flex justify-between items-center ">
                <span id="author">
                  <div className=" w-20 h-2 bg-gray-500"> </div>{" "}
                </span>
                <div className=" w-16 h-2 bg-gray-500"> </div>
              </span>

              <div className="review-text w-[90%] h-2 bg-gray-500 mx-6"></div>
              <div className="review-text w-[90%] h-2 bg-gray-500 mx-6"></div>
              <div className="review-text w-[90%] h-2 bg-gray-500 mx-6"></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MediaDetailsSkeleton;
