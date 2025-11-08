"use client";
import { IhistoryMedia } from "@/Types";
import Link from "next/link";
import { useContext, useState } from "react";
import { Context } from "@/context/Context";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { setOpenMediaDetailsSheet } from "@/store/slices/UISlice";
import { setMediaIdPWA, setSheetMediaType } from "@/store/slices/mediaDetailsSlice";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import Notification from "@/components/common/Notification";
import { setElementsToDelete } from "@/store/slices/historySlice";
import OptionsMenu from "../OptionsMenu/OptionsMenu";

function HistoryCard({ result, data, index, childIndex }: { result: [string, IhistoryMedia[]]; data: IhistoryMedia; index: number; childIndex: number }) {
  const { isMobilePWA } = useContext(Context);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [message, setMessage] = useState<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>({
    message: "",
    severity: "info",
    open: false,
  });

  const { elementsToDelete, activeHistoryEntry } = useSelector((state: RootState) => state.history);

  const dispatch = useDispatch();

  return (
    <>
      <div
        className={`hover:bg-slate-500/10 transition duration-200 ease-in-out relative flex-col-center lg:flex-row w-[95%] lg:w-[95%] gap-4 rounded-lg border border-white/10 p-4`}
        key={`${result[0]}-${data.id}-${data.season}-${data.episode}`}
      >
        <div className="relative  rounded-md md:w-[80%] lg:w-[140%] xl:w-[55%] 2xl:w-[45%] ">
          <img className="block w-full rounded-md" src={data.media_type === "movie" ? `${data.backdrop_path}` : `${data.episode_image}`} alt="" />
          <span className="absolute left-2 bottom-2 text-[65%] xl:text-[75%] rounded-full px-3 lg:py-1 border bg-surface-modal border-zinc-700 text-zinc-300 ">{data.media_type}</span>
        </div>
        <div className="w-full p-4 text-center sm:w-[75%]  lg:w-[95%] xl:w-[80%] 2xl:w-[50%] 4k:w-[40%] m-auto flex-col-center gap-2">
          {isMobilePWA ? (
            <button
              onClick={() => {
                dispatch(setMediaIdPWA(data.id));
                dispatch(setSheetMediaType(data.media_type == "movie" ? "movies" : "tvshows"));
                dispatch(setOpenMediaDetailsSheet(true));
              }}
            >
              {data.title}
            </button>
          ) : (
            <Link href={`/${data.media_type == "tv" ? "tvshows" : "movies"}/${data.id}/`} className="text-xl font-semibold hover:underline">
              {data.title}
            </Link>
          )}
          {data.media_type === "tv" && (
            <span className="text-[85%] text-content-secondary ">
              <span>Season: {data.season}</span>
              <span> - </span>
              <span>Episode: {data.episode}</span>
            </span>
          )}
        </div>
        <OptionsMenu
          result={result}
          data={data}
          index={index}
          childIndex={childIndex}
          setConfirmDialog={(value: boolean) => {
            setConfirmDialog(value);
          }}
        ></OptionsMenu>
      </div>
      {confirmDialog && (
        <ConfirmDeleteModal
          confirmDialog={confirmDialog}
          setConfirmDialog={setConfirmDialog}
          listName={[`history`, activeHistoryEntry ?? "", "content"]}
          elementsToDelete={elementsToDelete}
          extraActions={() => {
            dispatch(setElementsToDelete([]));
          }}
          displayMessage={"history"}
          setMessage={setMessage}
          isHistory={true}
        />
      )}
      <Notification message={message} setMessage={setMessage} />
    </>
  );
}

export default HistoryCard;
