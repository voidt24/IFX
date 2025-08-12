"use client";
import { useContext, useEffect } from "react";
import dynamic from "next/dynamic";
import { Context } from "@/context/Context";
import HomeSkeleton from "@/components/common/Skeletons/HomeSkeleton";
import HeroSkeleton from "@/components/common/Skeletons/HeroSkeleton";
import SignUpBanner from "@/components/common/SignUpBanner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setCurrentId } from "@/store/slices/mediaDetailsSlice";
import useInitialMediaData from "@/Hooks/useInitialMediaData";
import useIsMobile from "@/Hooks/useIsMobile";
import SectionWithSlider from "@/components/common/SectionWithSlider";
import Footer from "@/components/common/Footer/Footer";
import useHideDrawers from "@/Hooks/useHideDrawers";

const Hero = dynamic(() => import("@/components/Hero/Hero"), {
  loading: () => <HeroSkeleton />,
});

export default function Home() {
  const { initialDataIsLoading, initialDataError, containerMargin } = useContext(Context);
  const { moviesHeroApiData, moviesApiData, tvApiData } = useInitialMediaData();

  const auth = useSelector((state: RootState) => state.auth);
  const { firebaseActiveUser } = auth;
  const dispatch = useDispatch();

  const isMobile = useIsMobile(640);

  useEffect(() => {
    dispatch(setCurrentId(0));
  }, []);

  useHideDrawers();

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
      <Hero results={moviesHeroApiData} type="Movies" hasTitle={isMobile} mediaType="movie" />
      <div className=" mt-6 pb-0">
        <div className=" flex-col-center gap-4 lg:gap-6 ">
          <SectionWithSlider title="Popular Movies" link="/movies" data={moviesApiData} mediaType="movie" />

          {!firebaseActiveUser?.uid ? <SignUpBanner /> : null}
        </div>
      </div>

      <div className="mt-6">
        <Hero results={tvApiData} type="TV Shows" hasTitle={true} mediaType="tv" />
      </div>

      <div className=" mt-6">
        <SectionWithSlider title="Popular TV Shows" link="/tvshows" data={tvApiData} mediaType="tv" />
      </div>

      <Footer />
    </div>
  );
}
