"use client";
import { useEffect, useState } from "react";
import { IhistoryMedia } from "@/Types";
import { CircularProgress } from "@mui/material";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { database, usersCollectionName } from "@/firebase/firebase.config";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import useVerifyToken from "@/Hooks/useVerifyToken";
import useHideDrawers from "@/Hooks/useHideDrawers";
import ToTop from "../components/common/ToTop/ToTop";
import Wrapper from "../components/common/Wrapper/Wrapper";
import HistoryCard from "@/components/History/HistoryCard/HistoryCard";

function History() {
  useVerifyToken();
  useHideDrawers();
  const [currentListData, setCurrentListData] = useState<[string, IhistoryMedia[]][] | null>(null);
  const { firebaseActiveUser } = useSelector((state: RootState) => state.auth);
  const [expandedItems, setExpandedItems] = useState<{ [key: number]: boolean }>({});

  const toggleItem = (id: number) => {
    setExpandedItems((element) => ({
      ...element,
      [id]: !element[id],
    }));
  };
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

  if (currentListData === null) {
    return (
      <div className="flex items-start justify-center h-full w-full ">
        <CircularProgress color="inherit" size={100} />
      </div>
    );
  }

  if (currentListData.length === 0) {
    return <div className="w-full h-full mt-4 text-center">You will see your history here...</div>;
  }

  return (
    <Wrapper customClasses="relative mt-[300px] rounded-lg">
      <h1 className="title-style">History</h1>
      <div className="flex-col-center gap-8  min-w-full">
        {currentListData &&
          [...currentListData].reverse().map((result: [string, IhistoryMedia[]], index) => (
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
                {[...result[1]].reverse().map((data, childIndex) => (
                  <HistoryCard key={index} result={result} data={data} index={index} childIndex={childIndex} />
                ))}
              </div>
            </div>
          ))}
      </div>

      {currentListData && currentListData.length > 5 && <ToTop />}
    </Wrapper>
  );
}

export default History;
