"use client";
import { useState, useContext, useEffect } from "react";
import { Context } from "../../context/Context";
import { useParams, useRouter } from "next/navigation";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import Modal from "../common/Modal";
import Notification from "../common/Notification";
import useIsMobile from "@/Hooks/useIsMobile";
import PlayButton from "./Buttons/PlayButton";
import { isReleased } from "@/helpers/isReleased";
import TrailerButton from "./Buttons/TrailerButton";
import MediaInfoRow from "./MediaInfoRow";
import SeasonList from "./SeasonData/SeasonList";
import Overview from "./Overview";
import ListsButtonGroup from "./ListsButtonGroup";
import { getApiMediaType } from "@/helpers/getApiMediaType";

export const MediaInfo = ({ loadingFavs, loadingWatchlist }: { loadingFavs: boolean; loadingWatchlist: boolean }) => {
  const { setCurrentId, currentId, currentMediaType, mediaDetailsData, setEpisodesArray, setActiveSeason, seasonModal, setSeasonModal, containerMargin } = useContext(Context);

  const router = useRouter();

  const params = useParams();

  const [message, setMessage] = useState<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>({ message: "", severity: "info", open: false });

  const isMobile = useIsMobile(1024);

  const [backdrop, setBackdrop] = useState(isMobile && mediaDetailsData ? mediaDetailsData.poster : mediaDetailsData && mediaDetailsData.bigHeroBackground ? mediaDetailsData.bigHeroBackground : "");

  useEffect(() => {
    setBackdrop(isMobile && mediaDetailsData ? mediaDetailsData.poster : mediaDetailsData && mediaDetailsData.bigHeroBackground ? mediaDetailsData.bigHeroBackground : "");
  }, [params.id, mediaDetailsData]);
  useEffect(() => {
    if (String(currentId) != params.id) {
      setCurrentId(Number(params.id));
    }
  }, [params.id]);

  useEffect(() => {
    setBackdrop(isMobile ? mediaDetailsData && mediaDetailsData?.poster : mediaDetailsData && mediaDetailsData?.bigHeroBackground);
  }, [isMobile]);

  useEffect(() => {
    return () => {
      setEpisodesArray(null);
      setActiveSeason(0);
    };
  }, []);

  if (!mediaDetailsData) return null;

  return (
    <div className=" relative text-center  px-0  bg-cover bg-top bg-no-repeat overflow-hidden">
      <div
        className="some-animation w-full relative object-cover object-center bg-cover bg-center max-lg:min-h-[90vh] lg:aspect-[16/9] lg:h-[85vh] "
        style={{
          backgroundImage: `url(${backdrop})`,
          ...(!isMobile ? { marginTop: containerMargin ? `${containerMargin}px` : undefined } : {}),
        }}
      >
        {/* close btn for mobile */}
        <button className="lg:hidden text-content-primary text-2xl font-semibold fixed top-6 right-3 bg-black/50 backdrop-blur-lg rounded-full px-1.5 py-0.5 z-[9999]" title="close-btn">
          <i
            className="bi bi-x"
            onClick={() => {
              if (sessionStorage.getItem("navigatingFromApp") === "1") {
                router.back();
              } else {
                router.push("/");
              }
            }}
          ></i>
        </button>
        {/* --- */}

        {/* overlay for desk */}
        <div className="max-lg:hidden side-hero-overlay"></div>
        {/* --- */}

        {/* main container */}
        <div
          className="flex flex-col items-center justify-center gap-2 z-[3] w-full mx-auto absolute bottom-0 px-4 
          lg:items-start lg:justify-center lg:gap-4 
          lg:top-1/2 lg:left-1/2 
          lg:-translate-x-1/2 lg:-translate-y-1/2 
          lg:max-w-[80%] lg:z-20 
          lg:bottom-auto "
        >
          <div className="lg:hidden h-[25px] w-full">
            <div className="to-top-gradient-bg "></div>
          </div>
          <div className="lg:hidden to-top-gradient-bg"></div>

          <div className="flex-col-center gap-2 z-[999999] lg:items-start lg:text-left  w-full ">
            <MediaInfoRow data={mediaDetailsData} mediaType={getApiMediaType(currentMediaType)} />
            <Overview data={mediaDetailsData} />

            <div className="flex-row-center gap-6 w-full lg:justify-start">
              <span className="max-lg:hidden">
                {isReleased(mediaDetailsData.releaseDate) ? (
                  <PlayButton mediaId={currentId} mediaType={getApiMediaType(currentMediaType)} data={mediaDetailsData} />
                ) : (
                  <TrailerButton id={currentId} mediaType={getApiMediaType(currentMediaType)} />
                )}
              </span>
              <ListsButtonGroup state={mediaDetailsData} mediaType={getApiMediaType(currentMediaType)} loadingFavs={loadingFavs} loadingWatchlist={loadingWatchlist} />
            </div>
          </div>
        </div>

        {/* MOBILE BUTTONS */}
        <div className="lg:hidden w-full fixed bottom-0 px-6 pb-6 pt-20 left-[50%] translate-x-[-50%] z-[4] pointer-events-none">
          <div className="to-top-gradient-bg h-full z-[2]"></div>
          {isReleased(mediaDetailsData.releaseDate) ? (
            <PlayButton mediaId={currentId} mediaType={getApiMediaType(currentMediaType)} data={mediaDetailsData} />
          ) : (
            <TrailerButton id={currentId} mediaType={getApiMediaType(currentMediaType)} />
          )}
        </div>
      </div>

      <Notification message={message} setMessage={setMessage} />

      {currentMediaType == mediaProperties.tv.route && (
        <Modal modalActive={seasonModal} setModalActive={setSeasonModal} customClasses="max-sm:w-[100%] sm:w-[95%] lg:w-[85%] xl:w-[70%] 2xl:w-[65%] 4k:w-[1300px] !px-2 lg:!px-4 lg:!py-8">
          <SeasonList data={mediaDetailsData} mediaType={getApiMediaType(currentMediaType)} mediaId={currentId} />
        </Modal>
      )}
    </div>
  );
};

export default MediaInfo;
