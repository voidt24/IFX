import Link from "next/link";
import { setParentActiveIndex, setActiveIndex, setActiveHistoryEntry, setElementsToDelete } from "@/store/slices/historySlice";

import { setMediaIdPWA } from "@/store/slices/mediaDetailsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { IhistoryMedia } from "@/Types";

function OptionsMenu({
  result,
  data,
  index,
  childIndex,
  setConfirmDialog,
}: {
  result: [string, IhistoryMedia[]];
  data: IhistoryMedia;
  index: number;
  childIndex: number;
  setConfirmDialog: (value: boolean) => void;
}) {
  const dispatch = useDispatch();
  const { firebaseActiveUser } = useSelector((state: RootState) => state.auth);
  const { parentActiveIndex, activeIndex } = useSelector((state: RootState) => state.history);

  return (
    <div className="options-menu absolute right-2 bottom-2 flex-row-between text-center self-end">
      <button
        className=" rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-slate-500/20 bg-red px-4"
        onClick={() => {
          if (parentActiveIndex === index && activeIndex === childIndex) {
            dispatch(setParentActiveIndex(undefined));
            dispatch(setActiveIndex(undefined));
            return;
          }
          dispatch(setParentActiveIndex(index));
          dispatch(setActiveIndex(childIndex));
          dispatch(setActiveHistoryEntry(result[0]));
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
              dispatch(setElementsToDelete([data.media_type == "tv" ? (data.episodeId?.toString() ?? "") : (data.id?.toString() ?? "")]));
              setConfirmDialog(true);
              dispatch(setActiveIndex(undefined));
            }
          }}
        >
          <i className="bi bi-trash"></i> Delete
        </button>
      </div>
    </div>
  );
}

export default OptionsMenu;
