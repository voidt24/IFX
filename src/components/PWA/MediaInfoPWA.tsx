"use client";
import { useState, useEffect } from "react";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import Modal from "../common/Modal";
import Notification from "../common/Notification";
import Overview from "../byRoute/MediaDetails/Overview";
import SeasonList from "../byRoute/MediaDetails/SeasonData/SeasonList";
import ListsButtonGroup from "../byRoute/MediaDetails/Buttons/ListsButtonGroup";
import { MediaTypeApi } from "@/Types/mediaType";
import MediaInfoRow from "../byRoute/MediaDetails/MediaInfoRow";
import { setEpisodesArray, setActiveSeason } from "@/store/slices/mediaDetailsSlice";
import PlayOrTrailerButton from "../byRoute/MediaDetails/PlayOrTrailerButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setSeasonModal } from "@/store/slices/UISlice";

export const MediaInfoPWA = ({
  mediaType,
  mediaId,
  loadingFavs,
  loadingWatchlist,
  loadingWatched,
}: {
  mediaType: MediaTypeApi;
  mediaId: number;
  loadingFavs: boolean;
  loadingWatchlist: boolean;
  loadingWatched: boolean;
}) => {
  const { seasonModal } = useSelector((state: RootState) => state.ui);

  const [message, setMessage] = useState<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>({ message: "", severity: "info", open: false });

  const dispatch = useDispatch();

  const { mediaDetailsData } = useSelector((state: RootState) => state.mediaDetails);

  useEffect(() => {
    return () => {
      dispatch(setEpisodesArray(null));
      dispatch(setActiveSeason(0));
    };
  }, []);

  return (
    <div className=" relative text-center  px-0  bg-cover bg-top bg-no-repeat overflow-hidden">
      <div
        className="w-full relative object-cover object-center bg-cover bg-center min-h-[90vh]"
        style={{
          backgroundImage: `url(${mediaDetailsData?.poster})`,
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
            <MediaInfoRow data={mediaDetailsData} mediaType={mediaType} />

            <Overview data={mediaDetailsData} />

            <div className="flex-row-center gap-6 w-full">
              <ListsButtonGroup state={mediaDetailsData} mediaId={mediaId} mediaType={mediaType} loadingFavs={loadingFavs} loadingWatchlist={loadingWatchlist} loadingWatched={loadingWatched} />
            </div>
          </div>
        </div>

        <div className=" w-full fixed bottom-0 px-6 pb-6 pt-20 left-[50%] translate-x-[-50%] z-[4] pointer-events-none">
          <div className="to-top-gradient-bg h-full z-[2]"></div>
          {mediaDetailsData && <PlayOrTrailerButton mediaId={mediaId} mediaType={mediaType} mediaData={mediaDetailsData} />}
        </div>
      </div>

      <Notification message={message} setMessage={setMessage} />

      {mediaType == mediaProperties.tv.mediaType && (
        <Modal
          modalActive={seasonModal}
          setModalActive={(value) => {
            dispatch(setSeasonModal(value));
          }}
          customClasses="max-sm:w-[100%] sm:w-[95%] xl:w-[70%] 2xl:w-[65%] 4k:w-[1300px] !px-2 "
        >
          <SeasonList data={mediaDetailsData} mediaType={mediaType} mediaId={mediaId} />
        </Modal>
      )}
    </div>
  );
};

export default MediaInfoPWA;
