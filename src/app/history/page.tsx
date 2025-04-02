"use client";
import { database, ID_TOKEN_COOKIE_NAME, usersCollectionName, VERIFY_TOKEN_ROUTE } from "@/firebase/firebase.config";
import getCookie from "@/helpers/getCookie";
import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Context } from "@/context/Context";
import { collection, onSnapshot } from "firebase/firestore";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import { CircularProgress } from "@mui/material";
import Notification from "@/components/common/Notification";
import Link from "next/link";
import { IhistoryMedia } from "@/Types/index";

function History() {
  const { firebaseActiveUser } = useContext(Context);
  const [currentListData, setCurrentListData] = useState<IhistoryMedia[] | [] | null>(null);
  const [message, setMessage] = useState<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>({
    message: "",
    severity: "info",
    open: false,
  });
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [elementsToDelete, setElementsToDelete] = useState<(number | string)[]>([]);
  const router = useRouter();
  async function getData() {
    if (!database && !usersCollectionName && !firebaseActiveUser?.uid) {
      setCurrentListData([]);
      return
    }
    //subscription to db to get real time changes
    if (database && usersCollectionName && firebaseActiveUser?.uid) {
      const activelistDocuments = collection(database, usersCollectionName, firebaseActiveUser.uid, "history");

      const unsub = onSnapshot(activelistDocuments, (document) => {
        const data: IhistoryMedia[] = [];
        document.forEach((doc) => {
          data.push(doc.data());
        });
        setCurrentListData(data);
      });

      // return 'unsub' on component unmount to avoid being "subscribe" while not on this page
      return () => {
        unsub();
      };
    }
  }

  useEffect(() => {
    async function verifyToken() {
      const authCookie = getCookie(ID_TOKEN_COOKIE_NAME);

      if (!authCookie) {
        router.push("/");
        return;
      }

      const verify = await fetch(VERIFY_TOKEN_ROUTE, {
        method: "POST",
        body: JSON.stringify({ token: authCookie }),
      });

      if (!verify.ok) {
        router.push("/");
      }
    }
    try {
      verifyToken();
    } catch (e) {
      router.push("/");
    }
  }, []);
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
          <div className="results z-[9] flex flex-col gap-9  ">
            <h1 className="text-xl xl:text-2xl text-center  sticky left-0 top-0 bg-black py-4">History</h1>
            {currentListData
              .sort((a: IhistoryMedia, b: IhistoryMedia) => (b.watchedAt ?? 0) - (a.watchedAt ?? 0))
              .map((result: any, index) => (
                <div className=" flex items-center justify-center gap-4 border bg-zinc-900/40  border-zinc-800/90 flex-col rounded-lg  sm:w-[85%] lg:w-[80%] m-auto" key={index}>
                  <header className=" w-full  bg-zinc-900/40 ">
                    <p className="date text-[95%] lg:text-lg   mt-1 text-center py-2 text-zinc-500">
                      {new Date(result.watchedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </header>

                  <div className=" flex flex-col lg:flex-row w-[85%] items-center justify-center lg:w-[95%]  gap-4  rounded-lg lg:hover:bg-zinc-900/20  p-4 ">
                    <img
                      className="w-full md:w-[80%] lg:w-[65%] xl:w-[55%] 2xl:w-[45%] rounded-md"
                      src={result.media_type === "movie" ? `${result.backdrop_path}` : `${result.episode_image}`}
                      alt=""
                    />

                    <Link
                      className="hover:underline w-full text-center sm:w-[75%]  lg:w-[95%] xl:w-[80%] 2xl:w-[50%] 4k:w-[40%] m-auto "
                      href={`https://prods.vercel.app/${result.media_type == "tv" ? "tvshows" : "movies"}/${result.id}/watch?name=${result.title}&season=${result.season}&episode=${
                        result.episode_number
                      }`}
                    >
                      <h2 className="text-[105%] lg:text-xl text-white  ">{result.title}</h2>
                      {result.media_type === "tv" && (
                        <span className="text-[85%] font-normal text-zinc-300 ">
                          <span>Season: {result.season}</span>
                          <span> - </span>
                          <span>Episode: {result.episode}</span>
                        </span>
                      )}
                    </Link>
                  </div>

                  <footer className="text-center pb-4 px-2 text-red-800 self-end ">
                    <button
                      onClick={() => {
                        if (firebaseActiveUser && firebaseActiveUser.uid) {
                          setElementsToDelete([result.media_type == "tv" ? result.episodeId.toString() : result.id.toString()]);
                          setConfirmDialog(true);
                        }
                      }}
                      className=" rounded-xl px-3 hover:bg-zinc-800 "
                    >
                      Delete
                    </button>
                  </footer>
                </div>
              ))}
          </div>
          {confirmDialog && (
            <ConfirmDeleteModal
              confirmDialog={confirmDialog}
              setConfirmDialog={setConfirmDialog}
              listName={"history"}
              elementsToDelete={elementsToDelete}
              setElementsToDelete={setElementsToDelete}
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
