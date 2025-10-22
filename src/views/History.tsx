"use client";
import { useEffect, useState } from "react";
import { IhistoryMedia } from "@/Types";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { database, usersCollectionName } from "@/firebase/firebase.config";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import useVerifyToken from "@/Hooks/useVerifyToken";
import useHideDrawers from "@/Hooks/useHideDrawers";
import ToTop from "../components/common/ToTop/ToTop";
import Wrapper from "../components/common/Wrapper/Wrapper";
import { setHistoryMedia } from "@/store/slices/historySlice";
import HistorySkeleton from "@/components/common/Skeletons/HistorySkeleton";
import HistoryGroup from "@/components/History/HistoryGroup";

function History() {
  useVerifyToken();
  useHideDrawers();
  const { historyMedia } = useSelector((state: RootState) => state.history);
  const { firebaseActiveUser } = useSelector((state: RootState) => state.auth);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  async function getData() {
    if (!database || !usersCollectionName || (firebaseActiveUser != null && !firebaseActiveUser.uid)) {
      setError(true);
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

            dispatch(setHistoryMedia([...content].reverse()));
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
    <Wrapper customClasses="relative mt-[300px] rounded-lg min-w-full">
      <h1 className="title-style">History</h1>
      <div className="flex-col-center gap-8 min-w-full ">
        {historyMedia === null ? (
          error ? (
            <p>Error loading history</p>
          ) : (
            <HistorySkeleton />
          )
        ) : historyMedia.length === 0 ? (
          <div className="w-full h-full mt-4 text-center text-content-third">Your history is empty...</div>
        ) : (
          <>
            {historyMedia.map((result: [string, IhistoryMedia[]], index) => (
              <HistoryGroup result={result} index={index} key={`date-${result[0]}`} />
            ))}
            {historyMedia.length > 5 && <ToTop />}{" "}
          </>
        )}
      </div>
    </Wrapper>
  );
}

export default History;
