"use client";
import dynamic from "next/dynamic";
import HomeSkeleton from "@/components/common/Skeletons/HomeSkeleton";
import HeroSkeleton from "@/components/common/Skeletons/HeroSkeleton";
import SignUpBanner from "@/components/common/SignUpBanner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import useInitialMediaData from "@/Hooks/useInitialMediaData";
import useIsMobile from "@/Hooks/useIsMobile";
import SectionWithSlider from "@/components/common/SectionWithSlider";
import Footer from "@/components/common/Footer/Footer";
import useHideDrawers from "@/Hooks/useHideDrawers";
import PageError from "@/components/common/Error/PageError";

const Hero = dynamic(() => import("@/components/Hero/Hero"), {
  loading: () => <HeroSkeleton />,
});

export default function Home() {
  const { data, isLoading, error } = useInitialMediaData();
  const { moviesHero, tv, movies } = data;

  const { containerMargin } = useSelector((state: RootState) => state.ui);
  const { firebaseActiveUser } = useSelector((state: RootState) => state.auth);

  const isMobile = useIsMobile(640);

  useHideDrawers();

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

      <Footer />
    </div>
  );
}
