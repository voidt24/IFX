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

function History() {
  const { firebaseActiveUser, currentId, setCurrentId } = useContext(Context);
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

  useVerifyToken();

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
    <div className="pb-20 mx-auto md:w-[90%] xl:w-[80%] 4k:w-[60%] max-w-full  overflow-auto h-[90vh] sm:mt-20 relative">
      {!currentListData ? (
        <div className="flex items-start justify-center h-full w-full ">
          <CircularProgress color="inherit" size={100} />
        </div>
      ) : currentListData && currentListData.length > 0 ? (
        <>
          <div className="results z-[9] flex flex-col gap-9 xl:gap-14 ">
            <h1 className="text-xl z-[9] xl:text-2xl text-center  sticky left-0 top-0 bg-black py-4">History</h1>
            {currentListData
              .sort((a: [string, IhistoryMedia[]], b: [string, IhistoryMedia[]]) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
              .map((result: [string, IhistoryMedia[]], index) => (
                <div className="flex flex-col items-center justify-center gap-4" key={`date-${result[0]}`}>
                  <header className=" w-full bg-zinc-900/90 m-auto  ">
                    <p className="date text-[95%] lg:text-lg  px-4 mt-1 py-2 text-zinc-200">
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
                      })()}
                    </p>
                  </header>
                  <div className=" flex items-center justify-center gap-6 flex-col rounded-lg sm:w-[85%] lg:w-[80%] m-auto">
                    {result[1].map((data, childIndex) => (
                      <div
                        className=" relative flex flex-col lg:flex-row w-[85%] items-center justify-center lg:w-[95%]  gap-4  rounded-lg border border-zinc-800 bg-zinc-900/30 lg:hover:bg-zinc-900/60  p-4"
                        key={`${result[0]}-${data.id}`}
                      >
                        <div className="relative  rounded-md md:w-[80%] lg:w-[140%] xl:w-[55%] 2xl:w-[45%] ">
                          <img className=" block w-full rounded-md " src={data.media_type === "movie" ? `${data.backdrop_path}` : `${data.episode_image}`} alt="" />

                          <span className="absolute left-2 bottom-2 text-[65%] xl:text-[75%] rounded-full px-3 lg:py-1 border bg-black/70 border-zinc-700 text-zinc-300 ">{data.media_type}</span>
                        </div>

                        <div className="w-full p-4 text-center sm:w-[75%]  lg:w-[95%] xl:w-[80%] 2xl:w-[50%] 4k:w-[40%] m-auto ">
                          <h2 className="text-[105%] lg:text-xl text-white  ">{data.title}</h2>
                          {data.media_type === "tv" && (
                            <span className="text-[85%] font-normal text-zinc-300 ">
                              <span>Season: {data.season}</span>
                              <span> - </span>
                              <span>Episode: {data.episode}</span>
                            </span>
                          )}
                        </div>

                        <footer className="absolute right-2 bottom-2 flex items-center justify-between text-center self-end">
                          <button
                            className=" rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 px-4"
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
                            } absolute right-6 text-[95%] rounded-lg bottom-7 flex-col items-center justify-between gap-2 w-32 bg-zinc-900 border border-zinc-700`}
                          >
                            <Link
                              className="w-full hover:bg-zinc-800 py-2"
                              href={`https://prods.vercel.app/${data.media_type == "tv" ? "tvshows" : "movies"}/${data.id}/watch?name=${encodeURIComponent(data.title ?? "")}${
                                data.media_type == "tv" ? `&season=${data.season}&episode=${data.episode_number}` : ``
                              } `}
                              onClick={() => {
                                setCurrentId(data.id ?? 0);
                              }}
                            >
                              Watch again
                            </Link>
                            <button
                              className="mt-2 w-full hover:bg-zinc-800 py-2 text-red-800 hover:text-red-700 "
                              onClick={() => {
                                if (firebaseActiveUser && firebaseActiveUser.uid) {
                                  setElementsToDelete([data.media_type == "tv" ? data.episodeId?.toString() ?? "" : data.id?.toString() ?? ""]);
                                  setConfirmDialog(true);
                                  setActiveIndex(undefined);
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </footer>
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
              setElementsToDelete={setElementsToDelete}
              displayMessage={"history"}
              setMessage={setMessage}
            />
          )}
        </>
      ) : (
        currentListData && currentListData.length < 1 && <div className="w-full h-full mt-4 text-center">You will see your history here...</div>
      )}
      <Notification message={message} setMessage={setMessage} />
    </div>
  );
}

export default History;
