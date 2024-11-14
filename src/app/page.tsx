"use client";
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import DefaultLayout from "@/components/layout/DefaultLayout";
import dynamic from "next/dynamic";
import { Context } from "@/context/Context";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import { fetchInitialData } from "@/helpers/fetchInitialData";
import Link from "next/link";
// import Slider from "@/components/Slider";
// import SliderCard from "@/components/SliderCard";
import { ISliderMovieData, ISliderTVData } from "@/helpers/api.config";
import HomeSkeleton from "@/components/common/Skeletons/HomeSkeleton";
import SliderSkeleton from "@/components/common/Skeletons/SliderSkeleton";
import SliderCardSkeleton from "@/components/common/Skeletons/SliderCardSkeleton";
import HeroSkeleton from "@/components/common/Skeletons/HeroSkeleton";
// import Hero from "@/components/Hero";
// const DefaultLayout = dynamic(() => import("@/components/layout/DefaultLayout"), {
//   loading: () => (
//     <div className="pb-10 mx-auto md:w-[90%] xl:w-[80%] 4k:w-[60%] max-w-full px-2 animate-pulse">
//       <div className="flex flex-col gap-6 relative mt-24 sm:mt-40 z-50">
//         {/* Search bar skeleton */}
//         <div className="bg-black w-full fixed z-50 py-4 top-0 sm:top-[67px] left-0">
//           <div className="w-[85%] md:w-[55%] 2xl:w-[35%] mx-auto ">
//             <div className="h-10 bg-gray-700 rounded-full"></div>
//           </div>
//         </div>

//         <div className=" max-w-full lg:max-w-[95%] 2xl:max-w-[80%] 4K:max-w-[75%] relative px-2 mx-auto w-full overflow-hidden">
//           {/* Slider content skeleton */}
//           <div className="slider-skeleton flex justify-center items-center gap-4">
//             {/* Slide anterior */}
//             <div className="slide-previous relative opacity-50 w-1/5">
//               <div className="rounded-lg bg-gray-700 h-48 w-full"></div>
//               <div className="absolute flex flex-col gap-2 items-center justify-center top-1/2 text-center -translate-x-1/2 -translate-y-1/2 left-1/2 w-full z-20">
//                 <div className="h-6 bg-gray-800 rounded-md w-1/2 mb-2"></div>
//                 <div className="h-6 w-1/4 bg-gray-700 rounded-md"></div>
//               </div>
//             </div>

//             {/* Slide central */}
//             <div className="slide-current relative w-8/12">
//               <div className="rounded-lg bg-gray-700 h-52 w-full"></div>
//               <div className="absolute flex flex-col gap-2 items-center justify-center top-1/2 text-center -translate-x-1/2 -translate-y-1/2 left-1/2 w-full z-20">
//                 <div className="h-6 bg-gray-800 rounded-md w-1/2 mb-2"></div>
//                 <div className="h-6 w-1/4 bg-gray-700 rounded-md"></div>
//               </div>
//             </div>

//             {/* Slide siguiente */}
//             <div className="slide-next relative opacity-50 w-1/5">
//               <div className="rounded-lg bg-gray-700 h-48 w-full"></div>
//               <div className="absolute flex flex-col gap-2 items-center justify-center top-1/2 text-center -translate-x-1/2 -translate-y-1/2 left-1/2 w-full z-20">
//                 <div className="h-6 bg-gray-800 rounded-md w-1/2 mb-2"></div>
//                 <div className="h-6 w-1/4 bg-gray-700 rounded-md"></div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/*SLIDER CARDS  */}
//         <div className={`slider-with-cards relative lg:px-4 `}>
//           <div className="flex w-full justify-between">
//             <div className="h-2 w-24 bg-gray-700 rounded mb-3"></div>
//             <div className="h-2 w-10 bg-gray-700 rounded mb-3"></div>
//           </div>
//           <div className={`grid slider-with-cards__content`}>
//             {[...Array(10)].map((_, index) => (
//               <div key={index} className=" card border border-gray-700 rounded-lg p-2">
//                 <div className=" max-md:h-32 h-48 lg:h-72 bg-gray-700 rounded mb-2 fallback-img"></div>
//                 <div className=" h-4 bg-gray-700 rounded mb-1"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className=" max-w-full lg:max-w-[95%] 2xl:max-w-[80%] 4K:max-w-[75%] relative px-2 mx-auto w-full overflow-hidden">
//           {/* Slider content skeleton */}
//           <div className="slider-skeleton flex justify-center items-center gap-4">
//             {/* Slide anterior */}
//             <div className="slide-previous relative opacity-50 w-1/5">
//               <div className="rounded-lg bg-gray-700 h-48 w-full"></div>
//               <div className="absolute flex flex-col gap-2 items-center justify-center top-1/2 text-center -translate-x-1/2 -translate-y-1/2 left-1/2 w-full z-20">
//                 <div className="h-6 bg-gray-800 rounded-md w-1/2 mb-2"></div>
//                 <div className="h-6 w-1/4 bg-gray-700 rounded-md"></div>
//               </div>
//             </div>

//             {/* Slide central */}
//             <div className="slide-current relative w-8/12">
//               <div className="rounded-lg bg-gray-700 h-52 w-full"></div>
//               <div className="absolute flex flex-col gap-2 items-center justify-center top-1/2 text-center -translate-x-1/2 -translate-y-1/2 left-1/2 w-full z-20">
//                 <div className="h-6 bg-gray-800 rounded-md w-1/2 mb-2"></div>
//                 <div className="h-6 w-1/4 bg-gray-700 rounded-md"></div>
//               </div>
//             </div>

//             {/* Slide siguiente */}
//             <div className="slide-next relative opacity-50 w-1/5">
//               <div className="rounded-lg bg-gray-700 h-48 w-full"></div>
//               <div className="absolute flex flex-col gap-2 items-center justify-center top-1/2 text-center -translate-x-1/2 -translate-y-1/2 left-1/2 w-full z-20">
//                 <div className="h-6 bg-gray-800 rounded-md w-1/2 mb-2"></div>
//                 <div className="h-6 w-1/4 bg-gray-700 rounded-md"></div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/*SLIDER CARDS  */}
//         <div className={`w-full relative lg:px-4 `}>
//           <div className="flex w-full justify-between">
//             <div className="h-2 w-24 bg-gray-700 rounded mb-3"></div>
//             <div className="h-2 w-10 bg-gray-700 rounded mb-3"></div>
//           </div>
//           <div className={`grid slider-with-cards__content`}>
//             {[...Array(10)].map((_, index) => (
//               <div key={index} className=" card border border-gray-700 rounded-lg p-2">
//                 <div className=" max-md:h-32 h-48 lg:h-72 bg-gray-700 rounded mb-2 fallback-img"></div>
//                 <div className=" h-4 bg-gray-700 rounded mb-1"></div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Card skeleton */}
//         <div className="mt-10 md:mt-16 w-full md:w-[90%] py-6 md:py-10 mx-auto relative isolate overflow-hidden bg-gray-900 px-6 shadow-2xl rounded-3xl lg:flex lg:px-20 ">
//           <div className="mx-auto lg:text-left flex items-center justify-center w-full">
//             {/* Text skeleton */}
//             <div className="flex flex-col items-start justify-start lg:justify-start w-[60%] space-y-4">
//               <div className="h-4 bg-gray-700 rounded-md w-[80%]"></div>
//               <div className="h-4 bg-gray-700 rounded-md w-[70%]"></div>

//               {/* Button skeleton */}
//               <div className="mt-6 h-10 w-24 bg-gray-700 rounded-md"></div>
//             </div>

//             {/* Placeholder for image or extra elements */}
//             <div className="flex flex-col gap-6 lg:flex-row md:gap-2">
//               <div className="h-16 w-16 lg:h-32 lg:w-32 bg-gray-700 rounded-md"></div>
//               <div className="h-16 w-16 lg:h-32 lg:w-32 bg-gray-700 rounded-md"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   ),
// });

const Slider = dynamic(() => import("@/components/Slider"), {
  loading: () => <SliderSkeleton />,
});

const SliderCard = dynamic(() => import("@/components/SliderCard"), {
  loading: () => <SliderCardSkeleton />,
});
const Hero = dynamic(() => import("@/components/Hero"), {
  loading: () => <HeroSkeleton />,
});
export default function Home() {
  const { initialDataIsLoading, setInitialDataIsLoading, setInitialDataError, searchStarted, currentId, setCurrentId, initialDataError } = useContext(Context);
  const [moviesApiData, setMoviesApiData] = useState<ISliderMovieData[]>([]);
  const [tvApiData, setTvApiData] = useState<ISliderTVData[]>([]);
  const [moviesHeroApiData, setMoviesHeroApiData] = useState<ISliderMovieData[]>([]);

  const fetchAndSetData = (
    mediaTypeObj: { mediaType: string; searchCategory: string[]; limit: number[]; route: string },
    MethodThatSavesInMovies?: Dispatch<SetStateAction<ISliderMovieData[]>>,
    MethodThatSavesInTV?: Dispatch<SetStateAction<ISliderTVData[]>>,
    categoryForMovie?: string
  ) => {
    fetchInitialData(mediaTypeObj, categoryForMovie)
      .then((data: (ISliderMovieData | ISliderTVData)[]) => {
        mediaTypeObj.route == mediaProperties.movie.route
          ? MethodThatSavesInMovies && MethodThatSavesInMovies(data as ISliderMovieData[])
          : MethodThatSavesInTV && MethodThatSavesInTV(data as ISliderTVData[]);
      })
      .catch(() => {
        setInitialDataError(true);
      })
      .finally(() => {
        setInitialDataIsLoading(false);
      });
  };

  useEffect(() => {
    setCurrentId(undefined);
  }, []);

  useEffect(() => {
    fetchAndSetData(mediaProperties.movie, setMoviesHeroApiData, undefined, mediaProperties.movie.searchCategory[0]);
    fetchAndSetData(mediaProperties.movie, setMoviesApiData, undefined, mediaProperties.movie.searchCategory[1]);
    fetchAndSetData(mediaProperties.tv, undefined, setTvApiData);
  }, []);

  if (initialDataError) {
    return (
      <div className="error not-found">
        <h1>ERROR</h1>
        <p>Please try again</p>
      </div>
    );
  }
  if (initialDataIsLoading) {
    return <HomeSkeleton />;
  }

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-10 lg:gap-20 items-center justify-center">
        <Hero results={moviesHeroApiData} type="Movies" />

        <div className="w-full max-w-full lg:max-w-[95%] 2xl:max-w-[80%] 4K:max-w-[75%]">
          <span className="flex justify-between items-center w-full px-2 pb-2">
            <h1 className="lg:text-xl text-white/85">Popular Movies</h1>
            <Link className="hover:underline text-[80%] text-white/70" href={"/movies"}>
              See all
            </Link>
          </span>
          <Slider sideControls={true} expectingCards={true}>
            {moviesApiData &&
              moviesApiData.slice(0, 12).map((sliderData: ISliderMovieData | ISliderTVData) => {
                return <SliderCard result={sliderData} key={sliderData.id} mediaType={"movies"} />;
              })}
          </Slider>
        </div>

        <Hero results={tvApiData} type="TV Shows" />

        <div className="w-full max-w-full lg:max-w-[95%] 2xl:max-w-[80%] 4K:max-w-[75%]">
          <span className="flex justify-between items-center w-full px-2 pb-2">
            <h1 className="lg:text-xl text-white/85">Popular TV Shows</h1>
            <Link className="hover:underline text-[80%] text-white/70" href={"/tvshows"}>
              See all
            </Link>
          </span>
          <Slider sideControls={true} expectingCards={true}>
            {tvApiData &&
              tvApiData.slice(5, 17).map((sliderData) => {
                return <SliderCard result={sliderData} key={sliderData.id} mediaType={"tvshows"} />;
              })}
          </Slider>
        </div>
      </div>
    </DefaultLayout>
  );
}
