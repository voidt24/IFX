"use client";
import DefaultLayout from "@/components/layout/DefaultLayout";
import SliderCard from "@/components/SliderCard";
import { ISliderData } from "@/helpers/api.config";
import { fetchInitialData } from "@/helpers/fetchInitialData";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import AllMediaDataSkeleton from "./Skeletons/AllMediaDataSkeleton";
import SliderCardSkeleton from "./Skeletons/SliderCardSkeleton";
import { Context } from "@/context/Context";
import SignUpBanner from "./SignUpBanner";
import Pagination from "./Pagination";

export default function AllMediaData({
  mediaTypeObj,
  searchCategory,
  title,
}: {
  mediaTypeObj: { mediaType: string; searchCategory: string[]; limit: number[]; route: string };
  searchCategory: string;
  title: string;
}) {
  const { setCurrentId, firebaseActiveUser } = useContext(Context);
  const [apiData, setApiData] = useState<ISliderData[]>([]);
  const [pageActive, setPageActive] = useState<number>(1);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [DataIsLoading, setDataIsLoading] = useState(true);
  const [initialDataError, setInitialDataError] = useState(false);
  const ELEMENTS_TO_SHOW = 8;

  const fetchAndSetData = (
    mediaTypeObj: { mediaType: string; searchCategory: string[]; limit: number[]; route: string },
    pageActive: number,
    MethodThatSavesInState?: Dispatch<SetStateAction<ISliderData[]>>,
    categoryForMovie?: string
  ) => {
    fetchInitialData(mediaTypeObj, categoryForMovie, pageActive)
      .then((data: ISliderData[]) => {
        if (MethodThatSavesInState) {
          MethodThatSavesInState(data);
        }
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
      <div className=" sticky top-[4.85rem] sm:top-[7.90rem] w-full z-20 bg-black py-4">
        <h2 className="text-center mb-6 lg:text-xl">{title}</h2>
        <div className="flex gap-6  ">
          <Pagination pageActive={pageActive} setPageActive={setPageActive} numberOfPages={ELEMENTS_TO_SHOW} />
        </div>
      </div>

      <div className="lists">
        <div className="results-container flex flex-col gap-4 xl:max-w-[1400px] ">
          {DataIsLoading ? (
            <div className="animate-pulse results grid grid-cols-2 gap-0.3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
      {!firebaseActiveUser?.uid ? <SignUpBanner /> : null}
    </DefaultLayout>
  );
}
