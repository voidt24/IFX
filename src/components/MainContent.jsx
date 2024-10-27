"use client";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";

import { Context } from "@/context/Context";
const Slider = dynamic(() => import("@/components/Slider"), {
  loading: () => (
    <div className={`slider-with-cards relative lg:px-4 animate-pulse`}>
      <div className="slider__header">
        <div className="h-4 w-44 bg-gray-700 rounded mb-3"></div>
      </div>

      <div className={`grid slider-with-cards__content`}>
        {[...Array(15)].map((_, index) => (
          <div key={index} className=" card border border-gray-700 rounded-lg p-2">
            <div className=" max-md:h-32 h-48 lg:h-72 bg-gray-700 rounded mb-2 fallback-img"></div>
            <div className=" h-4 bg-gray-700 rounded mb-1"></div>
          </div>
        ))}
      </div>
    </div>
  ),
});

const SliderCard = dynamic(() => import("@/components/SliderCard"), {
  loading: () => (
    <div className="animate-pulse card border border-gray-700 rounded-lg p-2">
      <div className="animate-pulse max-md:h-32 h-48 lg:h-72 bg-gray-700 rounded mb-2 fallback-img"></div>
      <div className="animate-pulse h-4 bg-gray-700 rounded mb-1"></div>
    </div>
  ),
});
const Hero = dynamic(() => import("@/components/Hero"), {
  loading: () => (
    <div className="animate-pulse hero relative h-[800px] lg:h-screen bg-center bg-cover  flex flex-col items-center justify-center text-center p-4">
      <div className="hero-media-selection absolute z-30 top-[30%] text-white text-center flex flex-col items-center">
        <div className="bg-gray-700 rounded-full py-2 px-8 mb-2 w-52 h-6"></div>
        <div className="mt-4 flex gap-2">
          <div className="bg-gray-700 rounded-full py-2 px-8 mb-2 max-md:w-32 w-44 h-6"></div>
          <div className="bg-gray-700 rounded-full py-2 px-8 mb-2 max-md:w-32 w-44 h-6"></div>
        </div>
      </div>

      <div className="hero-media-thumbnails absolute bottom-[270px] w-full flex justify-center  p-4 z-30">
        <div className="movie fallback-isActive w-1/4 max-md:h-32 h-52 2xl:h-96 bg-gray-700 rounded-lg "></div>
        <div className="movie fallback-isActive w-1/4 max-md:h-32 h-52 2xl:h-96 bg-gray-700 rounded-lg"></div>
        <div className="movie fallback-isActive w-1/4 max-md:h-32 h-52 2xl:h-96 bg-gray-700 rounded-lg"></div>
        <div className="movie fallback-isActive w-1/4 max-md:h-32 h-52 2xl:h-96 bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  ),
});

export default function MainContent() {
  const { apiData, setCurrentId, initialDataError, currentMediaType } = useContext(Context);
  const [sliderData, setSliderData] = useState([]);
  const [sliderTitle, setSliderTitle] = useState("");

  useEffect(() => {
    setCurrentId(undefined);
  }, []);

  useEffect(() => {
    if (apiData && apiData.length > 0) {
      const [trendingResults, popularResults] = apiData[0];

      setSliderData(currentMediaType == "movies" ? popularResults : trendingResults.slice(5, 20)); // check fetchData.js (helper) for context on why we save diff. results based on currentMediaType
      setSliderTitle("| POPULAR ");
    }
  }, [apiData, currentMediaType]);

  if (initialDataError) {
    return (
      <div className="error not-found">
        <h1>ERROR</h1>
        <p>Please try again</p>
      </div>
    );
  }

  return (
    <>
      <Hero />
      <Slider
        header={
          <>
            {sliderTitle} <span>{currentMediaType.toUpperCase()}</span>
          </>
        }
        controls
        expectingCards
      >
        {sliderData.map((sliderData) => {
          return <SliderCard result={sliderData} key={sliderData.id} />;
        {sliderData.map((sliderData) => {
          return <SliderCard result={sliderData} key={sliderData.id} />;
        })}
      </Slider>
    </>
  );
}
