"use client";
import dynamic from "next/dynamic";
import HomeSkeleton from "@/components/common/Skeletons/HomeSkeleton";
import HeroSkeleton from "@/components/common/Skeletons/HeroSkeleton";
import SignUpBanner from "@/components/common/SignUpBanner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import useInitialMediaData from "@/Hooks/useInitialMediaData";
import useIsMobile from "@/Hooks/useIsMobile";
import SectionWithSlider from "@/components/common/SectionWithSlider";
import Footer from "@/components/common/Footer/Footer";
import useHideDrawers from "@/Hooks/useHideDrawers";
import PageError from "@/components/common/Error/PageError";
import { useEffect } from "react";
import { APP_NAME } from "@/helpers/api.config";
import { setRecentlyBrowsed } from "@/store/slices/mediaDetailsSlice";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/Shadcn/carousel";
import { IMediaData } from "@/Types";
import MediaCardContainer from "@/components/MediaCard/MediaCardContainer";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";

const Hero = dynamic(() => import("@/components/Hero/Hero"), {
  loading: () => <HeroSkeleton />,
});

export default function Home() {
  const { data, isLoading, error } = useInitialMediaData();
  const { moviesHero, tv, movies } = data;

  const { containerMargin } = useSelector((state: RootState) => state.ui);
  const { firebaseActiveUser } = useSelector((state: RootState) => state.auth);
  const { recentlyBrowsed } = useSelector((state: RootState) => state.mediaDetails);

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

    const handleStorage = (e: StorageEvent) => {
      if (e.key === `${APP_NAME}-recent`) {
        syncRecentlyBrowsed();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  if (error) {
    return <PageError containerMargin={containerMargin}></PageError>;
  }
  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="relative" style={{ marginTop: containerMargin ? `${containerMargin}px` : undefined }}>
      <Hero results={moviesHero} type="Movies" hasTitle={isMobile} mediaType="movie" />
      <div className=" mt-6 pb-0">
        <div className=" flex-col-center gap-4 lg:gap-6 ">
          <SectionWithSlider title="Popular Movies" link="/movies" data={movies} mediaType="movie" />

          {!firebaseActiveUser?.uid ? <SignUpBanner /> : null}
        </div>
      </div>

      <div className="mt-6">
        <Hero results={tv} type="TV Shows" hasTitle={true} mediaType="tv" />
      </div>

      <div className=" mt-6">
        <SectionWithSlider title="Popular TV Shows" link="/tvshows" data={tv} mediaType="tv" />
      </div>

      {recentlyBrowsed && recentlyBrowsed.length > 0 && (
        <>
          <div className="mt-10 w-[95%] mx-auto bg-neutral-950/50 p-4 rounded-lg">
            <span className="flex justify-between items-center w-full pb-2">
              <h1 className="text-base lg:text-xl text-[95%] font-medium text-white/70">You recently Browsed</h1>
            </span>
            <Carousel
              className=""
              opts={{
                loop: true,
                align: "start",
              }}
              plugins={[WheelGesturesPlugin()]}
            >
              <CarouselContent className=" ">
                {recentlyBrowsed &&
                  [...recentlyBrowsed].reverse().map((recentlyBrowsedData: IMediaData) => {
                    return (
                      <CarouselItem key={recentlyBrowsedData.id} className="basis-[45%] md:basis-[23%] lg:basis-1/5 2xl:basis-[10%]">
                        <MediaCardContainer key={recentlyBrowsedData.id} result={recentlyBrowsedData} mediaType={recentlyBrowsedData.media_type} canBeEdited={true} />
                      </CarouselItem>
                    );
                  })}
              </CarouselContent>
              <CarouselPrevious className={`left-4 z-50 max-lg:hidden lg:${recentlyBrowsed.length < 7 ? "hidden" : "absolute"}`} />
              <CarouselNext className={`right-4 z-50 max-lg:hidden lg:${recentlyBrowsed.length < 7 ? "hidden" : "absolute"}`} />
            </Carousel>{" "}
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
