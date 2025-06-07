"use client";
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
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

const Slider = dynamic(() => import("@/components/Slider/Slider"), {
  loading: () => <SliderSkeleton />,
});

const SliderCard = dynamic(() => import("@/components/Slider/SliderCard"), {
  loading: () => <SliderCardSkeleton />,
});
const Hero = dynamic(() => import("@/components/Hero/Hero"), {
  loading: () => <HeroSkeleton />,
});
export default function Home() {
  const { firebaseActiveUser, initialDataIsLoading, setInitialDataIsLoading, setInitialDataError, searchStarted, currentId, setCurrentId, initialDataError, containerMargin } = useContext(Context);
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
    <div className="relative" style={{ marginTop: containerMargin ? `${containerMargin}px` : undefined }}>
      <Hero results={moviesHeroApiData} type="Movies" hasTitle={window.innerWidth < 640} />
      <div className=" mt-6 pb-0">
        <div className=" flex-col-center gap-4 lg:gap-6 ">
          <div className="w-full ">
            <span className="flex-row-between w-full px-3 sm:px-6 pb-2">
              <h1 className="text-lg lg:text-2xl font-medium">Popular Movies</h1>
              <Link className="hover:underline text-[85%] lg:text-[90%] text-content-secondary" href={"/movies"}>
                See all &gt;
              </Link>
            </span>
            <Slider sideControls={true} expectingCards={true} XPosition="5">
              {moviesApiData &&
                moviesApiData.slice(5, 17).map((sliderData: ISliderData) => {
                  return <SliderCard result={sliderData} key={sliderData.id} mediaType={"movies"} />;
                })}
            </Slider>
          </div>

          {!firebaseActiveUser?.uid ? <SignUpBanner /> : null}
        </div>
      </div>

      <div className="mt-6">
        <Hero results={tvApiData} type="TV Shows" hasTitle={true} />
      </div>

      <div className=" mt-6">
        <div className="w-full ">
          <span className="flex justify-between items-center w-full px-3 sm:px-6 pb-2">
            <h1 className="text-lg lg:text-2xl font-medium text-white">Popular TV Shows</h1>
            <Link className="hover:underline text-[85%] lg:text-[90%] text-content-secondary" href={"/tvshows"}>
              See all &gt;
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

      <footer className="max-sm:hidden bg-black/50 shadow-sm text-content-muted py-4 text-center mt-10 relative">
        <span className="text-[70%] ">
          © {new Date().getFullYear().toString()}{" "}
          <a href="/" className="hover:underline">
            IFX
          </a>
        </span>
      </footer>
    </div>
  );
}
