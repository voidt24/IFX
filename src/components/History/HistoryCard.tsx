"use client";
import { IhistoryMedia } from "@/Types";
import Link from "next/link";
import { useContext, useState } from "react";
import { Context } from "@/context/Context";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { setOpenMediaDetailsSheet } from "@/store/slices/UISlice";
import { setMediaIdPWA, setSheetMediaType } from "@/store/slices/mediaDetailsSlice";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import Notification from "../common/Notification";

function HistoryCard({ result, data, index, childIndex }: { result: [string, IhistoryMedia[]]; data: IhistoryMedia; index: number; childIndex: number }) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [activeHistoryEntry, setActiveHistoryEntry] = useState<string | null>(null);

  const [parentActiveIndex, setParentActiveIndex] = useState<number | undefined>(undefined);
  const dispatch = useDispatch();
  const { isMobilePWA } = useContext(Context);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const [elementsToDelete, setElementsToDelete] = useState<(number | string)[]>([]);
  const [message, setMessage] = useState<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>({
    message: "",
    severity: "info",
    open: false,
  });
  const { firebaseActiveUser } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <div
        className={`  hover:scale-105 hover:bg-slate-500/10 transition duration-200 ease-in-out relative flex-col-center lg:flex-row w-[95%] lg:w-[95%] gap-4 rounded-lg border border-white/10 p-4`}
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

        <div className="options-menu absolute right-2 bottom-2 flex-row-between text-center self-end">
          <button
            className=" rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-slate-500/20 bg-red px-4"
            onClick={() => {
              if (parentActiveIndex === index && activeIndex === childIndex) {
                setParentActiveIndex(undefined);
                setActiveIndex(undefined);
                return;
              }
              setParentActiveIndex(index);
              setActiveIndex(childIndex);
              setActiveHistoryEntry(result[0]);
            }}
            title="options"
          >
            <i className="bi bi-three-dots lg:text-[120%]"></i>
          </button>

          <div
            className={`${
              parentActiveIndex === index && activeIndex === childIndex ? `flex` : "hidden"
            } absolute right-6 rounded-lg bottom-7 flex-col items-center justify-between gap-2 w-36 bg-[#0f1118] border border-zinc-700`}
          >
            <Link
              className="w-full hover:bg-slate-500/20 py-3 "
              href={`/${data.media_type == "tv" ? "tvshows" : "movies"}/${data.id}/watch?name=${encodeURIComponent(data.title ?? "")}${
                data.media_type == "tv" ? `&season=${data.season}&episode=${data.episode_number}` : ``
              } `}
              onClick={() => {
                dispatch(setMediaIdPWA(data.id ?? 0));
              }}
            >
              <i className="bi bi-eye"></i> Watch again
            </Link>
            <button
              className=" w-full hover:bg-slate-500/20 py-3 text-red-600 "
              onClick={() => {
                if (firebaseActiveUser && firebaseActiveUser.uid) {
                  setElementsToDelete([data.media_type == "tv" ? (data.episodeId?.toString() ?? "") : (data.id?.toString() ?? "")]);
                  setConfirmDialog(true);
                  setActiveIndex(undefined);
                }
              }}
            >
              <i className="bi bi-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
      {confirmDialog && (
        <ConfirmDeleteModal
          confirmDialog={confirmDialog}
          setConfirmDialog={setConfirmDialog}
          listName={[`history`, activeHistoryEntry ?? "", "content"]}
          elementsToDelete={elementsToDelete}
          extraActions={() => {
            setElementsToDelete([]);
          }}
          displayMessage={"history"}
          setMessage={setMessage}
        />
      )}
      <Notification message={message} setMessage={setMessage} />
    </>
  );
}

export default HistoryCard;
