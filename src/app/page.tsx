"use client";
import dynamic from "next/dynamic";
import HomeSkeleton from "@/components/common/Skeletons/HomeSkeleton";
import HeroSkeleton from "@/components/common/Skeletons/HeroSkeleton";
import SignUpBanner from "@/components/common/SignUpBanner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import useIsMobile from "@/Hooks/useIsMobile";
import SectionWithSlider from "@/components/common/SectionWithSlider";
import Footer from "@/components/common/Footer/Footer";
import useHideDrawers from "@/Hooks/useHideDrawers";
import { useEffect, useState } from "react";
import { APP_NAME } from "@/helpers/api.config";
import { setRecentlyBrowsed } from "@/store/slices/mediaDetailsSlice";
import { setTestingInitialized } from "@/store/slices/authSlice";
import RecentlyBrowsed from "@/components/RecentlyBrowsed/RecentlyBrowsed";
import { IMediaData, MediaTypeApi } from "@/Types";
import { fetchGeneralData } from "@/helpers/fetchInitialData";
import { mediaProperties } from "@/helpers/mediaProperties.config";

const Hero = dynamic(() => import("@/components/Hero/Hero"), {
  loading: () => <HeroSkeleton />,
});

export default function Home() {
  const [data, setData] = useState<{ moviesHero: IMediaData[]; tv: IMediaData[]; movies: IMediaData[] }>({
    moviesHero: [],
    tv: [],
    movies: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { containerMargin } = useSelector((state: RootState) => state.ui);
  const { testingInitialized, userLogged } = useSelector((state: RootState) => state.auth);

  const isMobile = useIsMobile(640);

  useHideDrawers();
  const dispatch = useDispatch();

  useEffect(() => {
    function syncRecentlyBrowsed() {
      const recent = localStorage.getItem(`${APP_NAME}-recent` || "[]");
      const recentData = JSON.parse(recent || "[]");

      dispatch(setRecentlyBrowsed(recentData));
    }

    syncRecentlyBrowsed();

    function syncTestingFeature() {
      const testingfeauture = localStorage.getItem(`${APP_NAME}-testing-app`);
      dispatch(setTestingInitialized(testingfeauture === "started"));
    }

    syncTestingFeature();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === `${APP_NAME}-recent`) {
        syncRecentlyBrowsed();
      }
    };

    window.addEventListener("storage", handleStorage);

    async function fetchAll() {
      const [moviesHero, errorMoviesHero] = await fetchAndSetData(mediaProperties.movie, mediaProperties.movie.searchCategory[0]);
      const [movies, errorMovies] = await fetchAndSetData(mediaProperties.movie, mediaProperties.movie.searchCategory[0]);
      const [tv, errortv] = await fetchAndSetData(mediaProperties.tv);
      setData({ moviesHero, movies, tv });
      setIsLoading(false);
    }

    fetchAll();

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);
  const fetchAndSetData = async (mediaTypeObj: { mediaType: MediaTypeApi; searchCategory: string[]; limit: number[]; route: string }, categoryForMovie?: string) => {
    const { mediaType, searchCategory, limit, route } = mediaTypeObj;
    let error = false;
    let results = [];
    try {
      results = await fetchGeneralData({ mediaType: mediaType, searchCategory: searchCategory, limit: limit, route: route }, categoryForMovie);
    } catch (errors) {
      error = true;
    }
    return [results[0], error];
  };

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="relative" style={{ marginTop: containerMargin ? `${containerMargin}px` : undefined }}>
      <Hero results={data.moviesHero} type="Movies" hasTitle={isMobile} mediaType="movie" />
      <div className=" mt-6 pb-0">
        <div className=" flex-col-center gap-4 lg:gap-6 ">
          <SectionWithSlider title="Popular Movies" link="/movies" data={data.movies} mediaType="movie" />
          {!userLogged && !testingInitialized ? <SignUpBanner /> : null}
        </div>
      </div>
      <div className="mt-6">
        <Hero results={data.tv} type="TV Shows" hasTitle={true} mediaType="tv" />
      </div>
      <div className=" mt-6">
        <SectionWithSlider title="Popular TV Shows" link="/tvshows" data={data.tv} mediaType="tv" />
      </div>
      <RecentlyBrowsed />
      <Footer />
    </div>
  );
}
