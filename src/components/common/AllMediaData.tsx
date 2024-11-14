"use client";
import DefaultLayout from "@/components/layout/DefaultLayout";
import SliderCard from "@/components/SliderCard";
import { ISliderMovieData, ISliderTVData } from "@/helpers/api.config";
import { fetchInitialData } from "@/helpers/fetchInitialData";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import AllMediaDataSkeleton from "./Skeletons/AllMediaDataSkeleton";
import SliderCardSkeleton from "./Skeletons/SliderCardSkeleton";
import { Context } from "@/context/Context";

export default function AllMediaData({
  mediaTypeObj,
  searchCategory,
  title,
}: {
  mediaTypeObj: { mediaType: string; searchCategory: string[]; limit: number[]; route: string };
  searchCategory: string;
  title: string;
}) {
  const { setCurrentId } = useContext(Context);
  const [apiData, setApiData] = useState<(ISliderMovieData | ISliderTVData)[]>([]);
  const [pageActive, setPageActive] = useState<number>(1);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [DataIsLoading, setDataIsLoading] = useState(true);
  const [initialDataError, setInitialDataError] = useState(false);

  const fetchAndSetData = (
    mediaTypeObj: { mediaType: string; searchCategory: string[]; limit: number[]; route: string },
    pageActive: number,
    MethodThatSavesInState?: Dispatch<SetStateAction<(ISliderMovieData | ISliderTVData)[]>>,
    categoryForMovie?: string
  ) => {
    fetchInitialData(mediaTypeObj, categoryForMovie, pageActive)
      .then((data: (ISliderMovieData | ISliderTVData)[]) => {
        mediaTypeObj.route == mediaProperties.movie.route
          ? MethodThatSavesInState && MethodThatSavesInState(data as ISliderMovieData[])
          : MethodThatSavesInState && MethodThatSavesInState(data as ISliderTVData[]);
      })
      .catch(() => {
        setInitialDataError(true);
      })
      .finally(() => {
        setPageIsLoading(false);
        setTimeout(() => {
          setDataIsLoading(false);
        }, 400);
      });
  };

  useEffect(() => {
    setCurrentId(undefined);
  }, []);

  useEffect(() => {
    setDataIsLoading(true);
    fetchAndSetData(mediaTypeObj, pageActive, setApiData, searchCategory);
  }, [pageActive]);

  if (initialDataError) {
    return (
      <div className="error not-found">
        <h1>ERROR</h1>
        <p>Please try again</p>
      </div>
    );
  }
  if (pageIsLoading) {
    return <AllMediaDataSkeleton />;
  }
  return (
    <DefaultLayout>
      <div className=" sticky top-20 sm:top-36 w-full z-20 bg-black py-4">
        <h2 className="text-center mb-6 lg:text-xl">{title}</h2>
        <div className="flex gap-6  ">
          <nav className="flex items-center justify-center w-full px-4 ">
            <ul className="flex text-[60%] md:text-[70%] self-center bg-zinc-800 rounded-full">
              <li>
                <button
                  className="flex items-center justify-center max-md:px-2 px-4 h-8 ms-0  leading-tight text-gray-200  border  border-zinc-500 rounded-s-full hover:bg-zinc-500 hover:text-white"
                  onClick={() => {
                    if (pageActive > 1) {
                      setPageActive(pageActive - 1);
                    }
                  }}
                >
                  Prev
                </button>
              </li>

              {Array.from({ length: 8 }).map((_, index) => {
                return (
                  <li key={index}>
                    <button
                      className={`flex items-center justify-center max-md:px-2.5 px-4 h-8 leading-tight  border border-zinc-500 ${
                        Number(index + 1) === pageActive ? "bg-[goldenrod]  hover:bg-[goldenrod] text-white" : " hover:bg-zinc-500  text-gray-300"
                      }`}
                      onClick={() => {
                        setPageActive(Number(index + 1));
                      }}
                    >
                      {index + 1}
                    </button>
                  </li>
                );
              })}

              <li>
                <button
                  className="flex items-center justify-center max-md:px-2 px-4 h-8 leading-tight text-gray-200  border border-zinc-500 rounded-e-full hover:bg-zinc-500 hover:text-white"
                  onClick={() => {
                    if (pageActive < 5) {
                      setPageActive(pageActive + 1);
                    }
                  }}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lists">
        <div className="results-container flex flex-col gap-4 xl:max-w-[1400px] ">
          {DataIsLoading ? (
            <div className="results grid grid-cols-2 gap-0.3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 15 }).map((_, index) => (
                <SliderCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="results">
              {apiData.map((sliderData) => {
                return <SliderCard result={sliderData} key={sliderData.id} mediaType={mediaTypeObj.route} />;
              })}
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
