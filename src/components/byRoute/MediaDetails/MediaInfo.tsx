"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import Modal from "@/components/common/Modal";
import Notification from "@/components/common/Notification";
import useIsMobile from "@/Hooks/useIsMobile";
import MediaInfoRow from "./MediaInfoRow";
import SeasonList from "./SeasonData/SeasonList";
import Overview from "./Overview";
import ListsButtonGroup from "./Buttons/ListsButtonGroup";
import { getApiMediaType } from "@/helpers/getApiMediaType";
import Trailer from "./Trailer";
import { setEpisodesArray, setActiveSeason } from "@/store/slices/mediaDetailsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import PlayOrTrailerButton from "./PlayOrTrailerButton";
import MobileCloseButton from "./Buttons/MobileCloseButton";
import { setSeasonModal } from "@/store/slices/UISlice";

export const MediaInfo = ({ mediaId, loadingFavs, loadingWatchlist, loadingWatched }: { mediaId: number; loadingFavs: boolean; loadingWatchlist: boolean; loadingWatched: boolean }) => {
  const { seasonModal, containerMargin } = useSelector((state: RootState) => state.ui);

  const params = useParams();

  const [message, setMessage] = useState<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>({ message: "", severity: "info", open: false });

  const isMobile = useIsMobile(1024);

  const { mediaDetailsData, currentMediaType } = useSelector((state: RootState) => state.mediaDetails);
  const [backdrop, setBackdrop] = useState(isMobile && mediaDetailsData ? mediaDetailsData.poster : mediaDetailsData && mediaDetailsData.bigHeroBackground ? mediaDetailsData.bigHeroBackground : "");
  const dispatch = useDispatch();

  useEffect(() => {
    setBackdrop(isMobile && mediaDetailsData ? mediaDetailsData.poster : mediaDetailsData && mediaDetailsData.bigHeroBackground ? mediaDetailsData.bigHeroBackground : "");
  }, [params.id, mediaDetailsData]);

  useEffect(() => {
    setBackdrop(isMobile ? mediaDetailsData && mediaDetailsData?.poster : mediaDetailsData && mediaDetailsData?.bigHeroBackground);
  }, [isMobile]);

  useEffect(() => {
    return () => {
      dispatch(setEpisodesArray(null));
      dispatch(setActiveSeason(0));
    };
  }, []);

  if (!mediaDetailsData) return null;

  return (
    <div className=" relative text-center  px-0  bg-cover bg-top bg-no-repeat overflow-hidden">
      <div
        className="some-animation w-full relative object-cover object-center bg-cover bg-top max-lg:min-h-[90vh] lg:aspect-[16/9] lg:h-[90vh] "
        style={{
          backgroundImage: `url(${backdrop})`,
          ...(!isMobile ? { marginTop: containerMargin ? `${containerMargin}px` : undefined } : {}),
        }}
      >
        <MobileCloseButton variant="details" />

        {/* overlay for desk */}
        <div className="max-lg:hidden side-hero-overlay"></div>
        <div className="max-lg:hidden to-top-gradient-bg-desktop bg-gradient-to-b from-[#000005] to-[#0c0e1300] !top-0 !h-[25%]"></div>
        <div className="max-lg:hidden to-top-gradient-bg-desktop bg-gradient-to-t from-[#000005] via-[#0000057a] to-[#0c0e1300] !bottom-0 !h-[25%]"></div>

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

          <div className="flex-col-center gap-2 lg:gap-4 z-[999999] lg:items-start lg:text-left  w-full ">
            <MediaInfoRow data={mediaDetailsData} mediaType={getApiMediaType(currentMediaType)} />
            <Overview data={mediaDetailsData} />

            <div className="flex-row-center gap-9 w-full lg:justify-start">
              <span className="max-lg:hidden">
                <PlayOrTrailerButton mediaId={mediaId} mediaType={getApiMediaType(currentMediaType)} mediaData={mediaDetailsData} />
              </span>
              <div className=" flex-row-center gap-6  p-1">
                <ListsButtonGroup
                  state={mediaDetailsData}
                  mediaId={mediaId}
                  mediaType={getApiMediaType(currentMediaType)}
                  loadingFavs={loadingFavs}
                  loadingWatchlist={loadingWatchlist}
                  loadingWatched={loadingWatched}
                />
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE BUTTONS */}
        <div className="lg:hidden w-full fixed bottom-0 px-6 pb-6 pt-20 left-[50%] translate-x-[-50%] z-[4] pointer-events-none">
          <div className="to-top-gradient-bg h-full z-[2]"></div>
          <PlayOrTrailerButton mediaId={mediaId} mediaType={getApiMediaType(currentMediaType)} mediaData={mediaDetailsData} />
        </div>
      </div>

      <Notification message={message} setMessage={setMessage} />
      <Trailer />

      {currentMediaType == mediaProperties.tv.route && (
        <Modal
          modalActive={seasonModal}
          setModalActive={(value) => {
            dispatch(setSeasonModal(value));
          }}
          customClasses="max-sm:w-[100%] sm:w-[95%] lg:w-[85%] xl:w-[70%] 2xl:w-[65%] 4k:w-[1300px] !px-2 lg:!px-4 lg:!py-8"
        >
          <SeasonList data={mediaDetailsData} mediaType={getApiMediaType(currentMediaType)} mediaId={mediaId} />
        </Modal>
      )}
    </div>
  );
};

export default MediaInfo;
