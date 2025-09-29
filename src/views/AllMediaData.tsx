"use client";
import { IMediaData, MediaTypeApi } from "@/Types/index";
import { fetchFilteredData } from "@/helpers/fetchInitialData";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import AllMediaDataSkeleton from "../components/common/Skeletons/AllMediaDataSkeleton";
import SignUpBanner from "../components/common/SignUpBanner";
import Pagination from "../components/common/Pagination";
import Wrapper from "../components/common/Wrapper/Wrapper";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import PlatformSelect from "@/features/contentFilter/PlatformSelect";
import { useRouter, useSearchParams } from "next/navigation";
import GenreSelect from "@/features/contentFilter/GenreSelect";
import SliderCardSkeleton from "@/components/common/Skeletons/SliderCardSkeleton";
import useHideDrawers from "@/Hooks/useHideDrawers";
import MediaGrid from "@/components/MediaGrid/MediaGrid";

export default function AllMediaData({
  mediaTypeObj,
  searchCategory,
  title,
}: {
  mediaTypeObj: {
    mediaType: MediaTypeApi;
    searchCategory: string[];
    limit: number[];
    route: string;
  };
  searchCategory: string;
  title: string;
}) {
  const [apiData, setApiData] = useState<IMediaData[]>([]);
  const [elementsToShow, setElementsToShow] = useState<number>(20);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [DataIsLoading, setDataIsLoading] = useState(true);
  const [initialDataError, setInitialDataError] = useState(false);

  const auth = useSelector((state: RootState) => state.auth);
  const { firebaseActiveUser } = auth;

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const platform = searchParams.get("platform");
  const genre = searchParams.get("genre");
  const page = searchParams.get("page");
  const [isFirstRender, setIsFirstRender] = useState(true);

  useHideDrawers();

  const fetchAndSetData = (
    mediaTypeObj: {
      mediaType: MediaTypeApi;
      searchCategory: string[];
      limit: number[];
      route: string;
    },
    pageActive: number,
    provider: string | null = null,
    genre: string | null = null,
    MethodThatSavesInState?: Dispatch<SetStateAction<IMediaData[]>>,
  ) => {
    fetchFilteredData(mediaTypeObj, provider, genre, pageActive)
      .then((data: [IMediaData[], number]) => {
        const [results, total_pages] = data;
        if (MethodThatSavesInState) {
          MethodThatSavesInState(results);
        }
        setElementsToShow(Number(total_pages));
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
    if (!Number(page) || (Number(page) && elementsToShow && Number(page) > elementsToShow)) {
      params.set("page", "1");
      router.replace(`?${params.toString()}`);
    }
  }, [page, elementsToShow]);

  useEffect(() => {
    if (isFirstRender) {
      //to avoid restarting page if it's > 1 on 1st render
      setIsFirstRender(false);
      return;
    }
    if (Number(page) > 1) {
      params.set("page", `1`);
      router.push(`?${params.toString()}`);
    }
  }, [platform, genre]);

  useEffect(() => {
    setDataIsLoading(true);
    fetchAndSetData(mediaTypeObj, Number(page), platform, genre, setApiData);
  }, [page, platform, genre]);

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
    <Wrapper customClasses="relative ">
      <div className="flex-col-center lists w-full gap-8 ">
        <div className=" flex flex-col gap-4 w-full">
          <div className=" w-full z-20 bg-none  ">
            <h1 className="title-style">{title}</h1>
            <div className="flex gap-6  flex-col">
              <div className="flex gap-4">
                <PlatformSelect selected={platform} />
                <GenreSelect selected={genre} />
              </div>
            </div>
          </div>

          {DataIsLoading ? (
            <div className="lists flex flex-col items-center gap-4 text-center animate-pulse w-full">
              <div className="media-lists flex flex-col gap-4 xl:max-w-[1400px] w-full ">
                {Array.from({ length: 20 }).map((_, index) => (
                  <SliderCardSkeleton key={index} />
                ))}
              </div>
            </div>
          ) : (
            <MediaGrid mediaData={apiData} />
          )}
        </div>
        <Pagination queryName="page" pageActive={Number(page) || 1} numberOfPages={elementsToShow} />

        {!firebaseActiveUser?.uid ? <SignUpBanner /> : null}
      </div>
    </Wrapper>
  );
}
