"use client";
import { useState, useContext, useEffect } from "react";
import { Context, ImediaDetailsData } from "../../context/Context";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import Modal from "../common/Modal";
import Notification from "../common/Notification";
import Overview from "../MediaDetails/Overview";
import SeasonList from "../MediaDetails/SeasonData/SeasonList";
import ListsButtonGroup from "../MediaDetails/ListsButtonGroup";
import { MediaTypeApi } from "@/Types/mediaType";
import { isReleased } from "@/helpers/isReleased";
import PlayButton from "../MediaDetails/Buttons/PlayButton";
import TrailerButton from "../MediaDetails/Buttons/TrailerButton";
import MediaInfoRow from "../MediaDetails/MediaInfoRow";

export const MediaInfoPWA = ({
  state,
  mediaType,
  mediaId,
  loadingFavs,
  loadingWatchlist,
}: {
  state: ImediaDetailsData | null;
  mediaType: MediaTypeApi;
  mediaId: number;
  loadingFavs: boolean;
  loadingWatchlist: boolean;
}) => {
  const { setEpisodesArray, setActiveSeason, seasonModal, setSeasonModal } = useContext(Context);

  const [message, setMessage] = useState<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>({ message: "", severity: "info", open: false });

  useEffect(() => {
    return () => {
      setEpisodesArray(null);
      setActiveSeason(0);
    };
  }, []);

  return (
    <div className=" relative text-center  px-0  bg-cover bg-top bg-no-repeat overflow-hidden">
      <div
        className="w-full relative object-cover object-center bg-cover bg-center min-h-[90vh]"
        style={{
          backgroundImage: `url(${state?.poster})`,
        }}
      >
        {/* main container */}
        <div
          className="flex flex-col items-center justify-center gap-2 z-[3] w-full mx-auto absolute bottom-0 px-4 
           "
        >
          <div className="h-[25px] w-full">
            <div className="to-top-gradient-bg "></div>
          </div>
          <div className="to-top-gradient-bg"></div>

          <div className="flex-col-center gap-2 z-[999999] w-full ">
            <MediaInfoRow data={state} mediaType={mediaType} />

            <Overview data={state} />

            <div className="flex-row-center gap-6 w-full">
              <ListsButtonGroup state={state} mediaType={mediaType} loadingFavs={loadingFavs} loadingWatchlist={loadingWatchlist} />
            </div>
          </div>
        </div>

        <div className=" w-full fixed bottom-0 px-6 pb-6 pt-20 left-[50%] translate-x-[-50%] z-[4] pointer-events-none">
          <div className="to-top-gradient-bg h-full z-[2]"></div>
          {state && isReleased(state.releaseDate) ? <PlayButton mediaId={mediaId} mediaType={mediaType} data={state} /> : <TrailerButton id={mediaId} mediaType={mediaType} />}
        </div>
      </div>

      <Notification message={message} setMessage={setMessage} />

      {mediaType == mediaProperties.tv.mediaType && (
        <Modal modalActive={seasonModal} setModalActive={setSeasonModal} customClasses="max-sm:w-[100%] sm:w-[95%] xl:w-[70%] 2xl:w-[65%] 4k:w-[1300px] !px-2 ">
          <SeasonList data={state} mediaType={mediaType} mediaId={mediaId} />
        </Modal>
      )}
    </div>
  );
};

export default MediaInfoPWA;
