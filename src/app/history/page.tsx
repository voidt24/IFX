"use client";
import { database, usersCollectionName } from "@/firebase/firebase.config";
import React, { useEffect, useState, useContext } from "react";
import { Context } from "@/context/Context";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import { CircularProgress } from "@mui/material";
import Notification from "@/components/common/Notification";
import Link from "next/link";
import { IhistoryMedia } from "@/Types/index";
import useVerifyToken from "@/Hooks/useVerifyToken";
import ToTop from "@/components/common/ToTop/ToTop";
import Wrapper from "@/components/common/Wrapper/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setMediaIdPWA, setSheetMediaType } from "@/store/slices/mediaDetailsSlice";
import useHideDrawers from "@/Hooks/useHideDrawers";
import { setOpenMediaDetailsSheet } from "@/store/slices/UISlice";

function History() {
  const { isMobilePWA } = useContext(Context);
  const [currentListData, setCurrentListData] = useState<[string, IhistoryMedia[]][] | null>(null);
  const [message, setMessage] = useState<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>({
    message: "",
    severity: "info",
    open: false,
  });
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [elementsToDelete, setElementsToDelete] = useState<(number | string)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [activeHistoryEntry, setActiveHistoryEntry] = useState<string | null>(null);
  const [parentActiveIndex, setParentActiveIndex] = useState<number | undefined>(undefined);
  const [hideElement, setHideElement] = useState<number | undefined>();
  const [expandedItems, setExpandedItems] = useState<{ [key: number]: boolean }>({});
  const auth = useSelector((state: RootState) => state.auth);
  const { firebaseActiveUser } = auth;
  const toggleItem = (id: number) => {
    setExpandedItems((element) => ({
      ...element,
      [id]: !element[id],
    }));
  };
  useVerifyToken();
  useHideDrawers();

  const dispatch = useDispatch();

  async function getData() {
    if (!database && !usersCollectionName && !firebaseActiveUser?.uid) {
      setCurrentListData([]);
      return;
    }
    //subscription to db to get real time changes
    if (database && usersCollectionName && firebaseActiveUser?.uid) {
      const unsubscribers: (() => void)[] = [];

      const activelistDocuments = collection(database, usersCollectionName, firebaseActiveUser.uid, "history");
      const historyDocResults = await getDocs(activelistDocuments);

      const content: [string, IhistoryMedia[]][] = [];

      historyDocResults.docs.forEach((doc) => {
        const dateId = doc.id;

        if (database && usersCollectionName && firebaseActiveUser?.uid) {
          const contentRef = collection(database, usersCollectionName, firebaseActiveUser && firebaseActiveUser.uid, "history", dateId, "content");
          const contentUnsub = onSnapshot(contentRef, (contentSnapshot) => {
            const mediaItems: IhistoryMedia[] = contentSnapshot.docs.map((contentDoc) => contentDoc.data() as IhistoryMedia);

            // before pushing, we delete any prev entry with that same dateId
            const existingIndex = content.findIndex(([existingDate]) => existingDate === dateId);
            if (existingIndex !== -1) {
              content.splice(existingIndex, 1); // delete prev entry
            }

            if (mediaItems.length > 0) {
              content.push([dateId, mediaItems]);
            }

            setCurrentListData([...content]);
          });

          unsubscribers.push(contentUnsub);
        }
      });

      // return 'unsub' on component unmount to avoid being "subscribe" while not on this page
      return () => {
        unsubscribers.forEach((unsub) => unsub());
      };
    }
  }

  useEffect(() => {
    try {
      getData();
    } catch (error) {}
  }, [firebaseActiveUser?.uid]);
  return (
    <Wrapper customClasses="relative mt-[300px] rounded-lg">
      {!currentListData ? (
        <div className="flex items-start justify-center h-full w-full ">
          <CircularProgress color="inherit" size={100} />
        </div>
      ) : currentListData && currentListData.length > 0 ? (
        <>
          <h1 className="title-style">History</h1>
          <div className="flex-col-center gap-8  min-w-full">
            {currentListData
              .sort((a: [string, IhistoryMedia[]], b: [string, IhistoryMedia[]]) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
              .map((result: [string, IhistoryMedia[]], index) => (
                <div className="flex flex-col items-center justify-center gap-12 p-6 rounded-lg bg-surface-modal w-full" key={`date-${result[0]}`}>
                  <header className="flex-row-between w-full bg-slate-500/20 m-auto rounded-lg px-4 py-2">
                    <p className="date lg:text-lg   text-content-secondary font-semibold ">
                      {(() => {
                        const dateString = result[0];
                        const parts = dateString.split("-");
                        const year = parseInt(parts[0], 10);
                        const month = parseInt(parts[1], 10) - 1;
                        const day = parseInt(parts[2], 10);
                        return new Date(year, month, day).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        });
                      })()}{" "}
                      <span className="count text-[80%] font-normal">
                        ({result[1].length} {result[1].length == 1 ? "item" : "items"})
                      </span>
                    </p>

                    <button onClick={() => toggleItem(index)} className="flex-row-center gap-1 text-[90%] hover:text-content-primary">
                      <p className="text-[90%] text-white">{expandedItems[index] ? "Expand" : "Minimize"}</p>

                      <i className={`bi bi-caret-${expandedItems[index] ? "down" : "up"}  leading-none`}></i>
                    </button>
                  </header>
                  <div
                    className={`${
                      expandedItems[index] ? " max-h-0 opacity-0 p-0" : " opacity-1 p-2"
                    } transition-all duration-200 flex items-center  justify-center gap-6 h-auto flex-col rounded-lg sm:w-[85%] lg:w-[80%] m-auto overflow-auto`}
                  >
                    {result[1].map((data, childIndex) => (
                      <div
                        className={`  hover:scale-105 hover:bg-slate-500/10 transition duration-200 ease-in-out relative flex-col-center lg:flex-row w-[95%] lg:w-[95%] gap-4 rounded-lg border border-white/10 p-4`}
                        key={`${result[0]}-${data.id}-${data.season}-${data.episode}`}
                      >
                        <div className="relative  rounded-md md:w-[80%] lg:w-[140%] xl:w-[55%] 2xl:w-[45%] ">
                          <img className=" block w-full rounded-md " src={data.media_type === "movie" ? `${data.backdrop_path}` : `${data.episode_image}`} alt="" />

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
                                  setElementsToDelete([data.media_type == "tv" ? data.episodeId?.toString() ?? "" : data.id?.toString() ?? ""]);
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
                    ))}
                  </div>
                </div>
              ))}
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

          {currentListData.length > 5 && <ToTop />}
        </>
      ) : (
        currentListData && currentListData.length < 1 && <div className="w-full h-full mt-4 text-center">You will see your history here...</div>
      )}
      <Notification message={message} setMessage={setMessage} />
    </Wrapper>
  );
}

export default History;
