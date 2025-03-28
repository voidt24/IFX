"use client";
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import DefaultLayout from "@/components/layout/DefaultLayout";
import dynamic from "next/dynamic";
import { Context } from "@/context/Context";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import { fetchInitialData } from "@/helpers/fetchInitialData";
import Link from "next/link";
import { ISliderData } from "@/helpers/api.config";
import HomeSkeleton from "@/components/common/Skeletons/HomeSkeleton";
import SliderSkeleton from "@/components/common/Skeletons/SliderSkeleton";
import SliderCardSkeleton from "@/components/common/Skeletons/SliderCardSkeleton";
import HeroSkeleton from "@/components/common/Skeletons/HeroSkeleton";
import SignUpBanner from "@/components/common/SignUpBanner";

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
  const { firebaseActiveUser, initialDataIsLoading, setInitialDataIsLoading, setInitialDataError, searchStarted, currentId, setCurrentId, initialDataError } = useContext(Context);
  const [moviesApiData, setMoviesApiData] = useState<ISliderData[]>([]);
  const [tvApiData, setTvApiData] = useState<ISliderData[]>([]);
  const [moviesHeroApiData, setMoviesHeroApiData] = useState<ISliderData[]>([]);

  const fetchAndSetData = (
    mediaTypeObj: { mediaType: string; searchCategory: string[]; limit: number[]; route: string },
    MethodThatSavesInMovies?: Dispatch<SetStateAction<ISliderData[]>>,
    MethodThatSavesInTV?: Dispatch<SetStateAction<ISliderData[]>>,
    categoryForMovie?: string
  ) => {
    fetchInitialData(mediaTypeObj, null, null, categoryForMovie)
      .then((data: [ISliderData[], number]) => {
        mediaTypeObj.route == mediaProperties.movie.route ? MethodThatSavesInMovies && MethodThatSavesInMovies(data[0]) : MethodThatSavesInTV && MethodThatSavesInTV(data[0]);
      })
      .catch((e) => {
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
    fetchAndSetData(mediaProperties.movie, setMoviesApiData, undefined, mediaProperties.movie.searchCategory[0]);
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
              moviesApiData.slice(5, 17).map((sliderData: ISliderData) => {
                return <SliderCard result={sliderData} key={sliderData.id} mediaType={"movies"} />;
              })}
          </Slider>
        </div>

        {!firebaseActiveUser?.uid ? <SignUpBanner /> : null}
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
